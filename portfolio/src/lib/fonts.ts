import { IBM_Plex_Serif, Literata } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

import { cn } from "@/lib/utils"

const fontSans = GeistSans
const fontMono = GeistMono

const fontSerif = IBM_Plex_Serif({
  weight: ["400"],
  display: "swap",
  fallback: ["serif"],
  variable: "--font-serif",
})

/**
 * Long-form reading face, used for blog article body copy only. Geist is a UI
 * face and flattens out past a few hundred words; Literata was drawn for
 * on-screen book reading. Site chrome stays on Geist.
 */
const fontReading = Literata({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
  fallback: ["Georgia", "serif"],
  variable: "--font-reading",
})

// const fontPixel = localFont({
//   src: "../assets/fonts/DepartureMono-Regular.woff2",
//   weight: "400",
//   fallback: ["monospace"],
//   variable: "--font-pixel",
// })

// const pixelatedMSSansSerif = localFont({
//   src: [
//     {
//       path: "../assets/fonts/ms_sans_serif.woff2",
//       weight: "400",
//     },
//     {
//       path: "../assets/fonts/ms_sans_serif_bold.woff2",
//       weight: "700",
//     },
//   ],
//   fallback: ["Arial"],
//   variable: "--font-98cn",
// })

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontSerif.variable,
  fontReading.variable,
  "[--font-sans:var(--font-geist-sans)]",
  "[--font-mono:var(--font-geist-mono)]"
)
