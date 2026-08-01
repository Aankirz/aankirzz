#!/usr/bin/env node
/**
 * Hard-gate validator for blog post frontmatter, modelled on the validator in
 * the Simbian marketing site. Publishing is manual and agent-assisted, so the
 * gate is a script rather than a convention: an agent can guess at a field, but
 * it cannot argue with exit code 1.
 *
 * Usage:
 *   node src/scripts/validate-blog-frontmatter.mjs                 # every post
 *   node src/scripts/validate-blog-frontmatter.mjs <file.mdx>      # one post
 *   node src/scripts/validate-blog-frontmatter.mjs --list-tags     # canonical tags
 *
 * Exit codes:
 *   0  pass
 *   1  validation failure (structured errors on stderr)
 *   2  bad arguments or missing file
 */

import { readdirSync, readFileSync, statSync } from "node:fs"
import { basename, extname, join, resolve } from "node:path"

const BLOG_DIR = resolve(process.cwd(), "src/features/doc/content/blog")

/**
 * Tags are a closed set on purpose. The blog index renders every distinct tag
 * as a filter chip, so free-form tagging degrades into a sprawling strip of
 * near-duplicates ("agents", "agent", "ai-agents").
 */
const CANONICAL_TAGS = [
  "agents",
  "ai",
  "browsers",
  "chromium",
  "systems",
  "backend",
  "performance",
  "career",
  "meta",
]

const REQUIRED_FIELDS = ["title", "description", "createdAt", "updatedAt"]

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*$/

const MAX_TITLE_LENGTH = 80
const MAX_DESCRIPTION_LENGTH = 200

/**
 * Minimal frontmatter reader. Only top-level scalars and inline arrays are
 * validated, which is all the schema uses, so this avoids pulling YAML into a
 * script that has to run before install-time deps are guaranteed.
 */
function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) {
    throw new Error(
      "No frontmatter found. The file must open with --- and close with ---."
    )
  }

  const data = {}

  for (const rawLine of match[1].split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith("#")) continue

    const kv = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)$/)
    if (!kv) continue

    const [, key, rawValue] = kv
    const value = rawValue.trim()

    if (value === "") {
      data[key] = null
    } else if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((entry) => stripQuotes(entry.trim()))
        .filter(Boolean)
    } else if (value === "true" || value === "false") {
      data[key] = value === "true"
    } else {
      data[key] = stripQuotes(value)
    }
  }

  return data
}

function stripQuotes(value) {
  const isQuoted =
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))

  return isQuoted ? value.slice(1, -1) : value
}

function validatePost(filePath, allSlugs) {
  const errors = []
  const fileName = basename(filePath)
  const slug = basename(fileName, extname(fileName))

  let data
  try {
    data = parseFrontmatter(readFileSync(filePath, "utf8"))
  } catch (error) {
    return [error.message]
  }

  for (const field of REQUIRED_FIELDS) {
    if (!data[field]) errors.push(`Missing required field: ${field}`)
  }

  if (!SLUG_PATTERN.test(slug)) {
    errors.push(
      `Filename "${fileName}" is not a valid slug. Use lowercase letters, digits, and hyphens.`
    )
  }

  if (allSlugs.filter((s) => s === slug).length > 1) {
    errors.push(`Duplicate slug: "${slug}" is used by more than one file.`)
  }

  if (data.title && data.title.length > MAX_TITLE_LENGTH) {
    errors.push(
      `title is ${data.title.length} chars; keep it under ${MAX_TITLE_LENGTH} so it does not wrap past three lines.`
    )
  }

  if (data.description && data.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.push(
      `description is ${data.description.length} chars; keep it under ${MAX_DESCRIPTION_LENGTH} for search results and cards.`
    )
  }

  for (const field of ["createdAt", "updatedAt"]) {
    const value = data[field]
    if (!value) continue

    if (!DATE_PATTERN.test(value)) {
      errors.push(`${field} must be YYYY-MM-DD, got "${value}".`)
    } else if (Number.isNaN(new Date(value).getTime())) {
      errors.push(`${field} is not a real date: "${value}".`)
    }
  }

  if (
    DATE_PATTERN.test(data.createdAt ?? "") &&
    DATE_PATTERN.test(data.updatedAt ?? "") &&
    new Date(data.updatedAt) < new Date(data.createdAt)
  ) {
    errors.push("updatedAt is before createdAt.")
  }

  if (data.tags) {
    if (!Array.isArray(data.tags)) {
      errors.push('tags must be an inline array, e.g. tags: ["agents", "ai"]')
    } else {
      for (const tag of data.tags) {
        if (!CANONICAL_TAGS.includes(tag)) {
          errors.push(
            `Unknown tag "${tag}". Canonical tags: ${CANONICAL_TAGS.join(", ")}. Add a new one to CANONICAL_TAGS only on purpose.`
          )
        }
      }
    }
  }

  if (data.image && !/^(https?:\/\/|\/)/.test(data.image)) {
    errors.push(
      `image must be an absolute URL or a path under /public, got "${data.image}".`
    )
  }

  return errors
}

function main() {
  const args = process.argv.slice(2)

  if (args.includes("--list-tags")) {
    process.stdout.write(`${CANONICAL_TAGS.join("\n")}\n`)
    return 0
  }

  let files
  if (args.length > 0) {
    const target = resolve(args[0])
    try {
      statSync(target)
    } catch {
      process.stderr.write(`File not found: ${target}\n`)
      return 2
    }
    files = [target]
  } else {
    files = readdirSync(BLOG_DIR)
      .filter((file) => extname(file) === ".mdx")
      .map((file) => join(BLOG_DIR, file))
  }

  if (files.length === 0) {
    process.stdout.write("No blog posts to validate.\n")
    return 0
  }

  const allSlugs = readdirSync(BLOG_DIR)
    .filter((file) => extname(file) === ".mdx")
    .map((file) => basename(file, ".mdx"))

  let failed = 0

  for (const file of files) {
    const errors = validatePost(file, allSlugs)

    if (errors.length > 0) {
      failed += 1
      process.stderr.write(`\n✗ ${basename(file)}\n`)
      for (const error of errors) {
        process.stderr.write(`  - ${error}\n`)
      }
    }
  }

  if (failed > 0) {
    process.stderr.write(
      `\n${failed} of ${files.length} post(s) failed validation.\n`
    )
    return 1
  }

  process.stdout.write(`✓ ${files.length} post(s) passed validation.\n`)
  return 0
}

process.exit(main())
