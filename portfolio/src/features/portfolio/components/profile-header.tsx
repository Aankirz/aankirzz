import { USER } from "@/features/portfolio/data/user"

import { FlipSentences } from "./flip-sentences"
import { VerifiedIcon } from "./verified-icon"

export function ProfileHeader() {
  return (
    <div className="screen-line-bottom border-x border-line">
      {/* Cinematic video banner, feathered into the page background */}
      <div className="relative aspect-[16/7] w-full overflow-hidden sm:aspect-[16/5]">
        <video
          className="absolute inset-0 size-full object-cover"
          src="/portfolio-bg.mp4"
          poster="/portfolio-bg-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        />
        {/* feather all four edges so the clip looks submerged in the surface */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ boxShadow: "inset 0 0 70px 28px var(--background)" }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/0 via-background/15 to-background" />
        <p className="absolute inset-0 flex items-center justify-center px-4 text-center font-serif text-2xl tracking-wide text-white/95 italic [text-shadow:0_2px_14px_rgb(0_0_0/0.65)] sm:text-4xl">
          Build · Ship · Repeat
        </p>
      </div>

      {/* Identity row — photo overlaps the banner (z-10 keeps it above the
          relatively-positioned banner, which otherwise paints over it) */}
      <div className="relative z-10 flex items-end gap-4 px-4 pt-4 pb-5">
        <img
          src={USER.avatar}
          alt={USER.displayName}
          width={112}
          height={112}
          className="-mt-16 size-24 shrink-0 rounded-full object-cover shadow-xl ring-4 ring-background sm:-mt-20 sm:size-28"
        />

        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-[1.75rem]/none font-semibold tracking-tight sm:text-[2rem]/none">
              {USER.displayName}
            </h1>
            <VerifiedIcon className="size-4.5 shrink-0 select-none" aria-hidden />
          </div>

          <FlipSentences className="mt-2.5 h-5 text-sm text-muted-foreground">
            {USER.flipSentences}
          </FlipSentences>
        </div>
      </div>
    </div>
  )
}
