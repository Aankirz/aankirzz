import { readFileSync } from "node:fs"
import { join } from "node:path"
import { ImageResponse } from "next/og"

const geistSemiBold = readFileSync(
  join(process.cwd(), "src/assets/fonts/Geist-SemiBold.ttf")
)

const geistMonoRegular = readFileSync(
  join(process.cwd(), "src/assets/fonts/GeistMono-Regular.ttf")
)

/**
 * Social card. Carries the site's hairline-frame motif so a shared link reads as
 * the same surface it opens into.
 */
export function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const title = searchParams.get("title")
  const description = searchParams.get("description")

  return new ImageResponse(
    <div tw="flex h-full w-full bg-black text-zinc-50">
      <div tw="absolute inset-y-0 left-12 flex w-px border border-zinc-800" />
      <div tw="absolute inset-y-0 right-12 flex w-px border border-zinc-800" />
      <div tw="absolute inset-x-0 top-12 flex h-px border border-zinc-800" />
      <div tw="absolute inset-x-0 bottom-12 flex h-px border border-zinc-800" />

      <div
        tw="absolute top-16 left-18 flex"
        style={{
          fontFamily: "GeistMono",
          fontSize: 44,
          letterSpacing: "-0.04em",
        }}
      >
        AK
      </div>

      <div tw="absolute top-42 right-18 left-18 bottom-24 flex flex-col justify-end">
        <div
          tw="border-t-2 border-b-2 border-zinc-800 py-8"
          style={{
            fontFamily: "GeistSans",
            fontWeight: 600,
            fontSize: 64,
            lineHeight: 1.05,
            textWrap: "balance",
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </div>

        {description && (
          <div
            tw="border-b-2 border-zinc-800 py-6 text-zinc-400"
            style={{
              fontFamily: "GeistMono",
              fontSize: 28,
              lineHeight: 1.3,
              textWrap: "balance",
            }}
          >
            {description}
          </div>
        )}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "GeistSans",
          data: geistSemiBold,
          weight: 600,
          style: "normal",
        },
        {
          name: "GeistMono",
          data: geistMonoRegular,
          weight: 400,
          style: "normal",
        },
      ],
    }
  )
}
