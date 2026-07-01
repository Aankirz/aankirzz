import "server-only"

import { unstable_cache } from "next/cache"

import { GITHUB_USERNAME } from "@/config/site"

export type GitHubProfile = {
  followers: number
  following: number
  publicRepos: number
}

export const getGitHubProfile = unstable_cache(
  async (): Promise<GitHubProfile | null> => {
    try {
      const res = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            ...(process.env.GITHUB_API_TOKEN
              ? { Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}` }
              : {}),
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      )
      if (!res.ok) return null

      const json = (await res.json()) as {
        followers?: number
        following?: number
        public_repos?: number
      }
      return {
        followers: Number(json.followers) || 0,
        following: Number(json.following) || 0,
        publicRepos: Number(json.public_repos) || 0,
      }
    } catch {
      return null
    }
  },
  ["github-profile"],
  { revalidate: 86400 } // Cache for 1 day
)
