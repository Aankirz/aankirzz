import { Panel, PanelContent } from "../panel"

type Credential = {
  icons: string[]
  pre?: string
  mention: string
  href: string
  post?: string
}

const CREDENTIALS: Credential[] = [
  {
    icons: ["/companies/simbian.png"],
    pre: "Software Engineer",
    mention: "@Simbian",
    href: "https://simbian.ai",
  },
  {
    icons: ["/companies/cred.png"],
    pre: "Ex-",
    mention: "@CRED Money",
    href: "https://cred.club/",
  },
  {
    icons: ["/companies/wootzapp.png"],
    pre: "Ex-Founding Engineer",
    mention: "@WootzApp",
    href: "https://x.com/wootzapp",
  },
  {
    icons: ["/companies/solana.png"],
    mention: "@Solana",
    href: "https://solana.com",
    post: "grantee",
  },
  {
    icons: ["/companies/superteam.png"],
    pre: "Member",
    mention: "@SuperteamDAO",
    href: "https://superteam.fun",
  },
  {
    icons: ["/companies/gsoc.png", "/companies/chromium.png"],
    pre: "GSoC'23",
    mention: "@Chromium",
    href: "https://www.chromium.org",
  },
  {
    icons: ["/companies/nitrkl.png"],
    mention: "NIT Rkl'25",
    href: "https://www.nitrkl.ac.in",
  },
]

export function Overview() {
  return (
    <Panel className="screen-line-bottom-none">
      <h2 className="sr-only">Overview</h2>

      <PanelContent>
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-2.5 text-sm">
          {CREDENTIALS.map((c, index) => (
            <li key={index} className="flex items-center gap-1.5">
              <span className="flex shrink-0 items-center gap-1">
                {c.icons.map((icon) => (
                  <img
                    key={icon}
                    src={icon}
                    alt=""
                    width={18}
                    height={18}
                    className="size-4.5 rounded-[5px] object-contain select-none"
                    aria-hidden
                  />
                ))}
              </span>
              <span className="text-muted-foreground">
                {c.pre && <>{c.pre} </>}
                <a
                  className="link-underline font-medium text-foreground"
                  href={c.href}
                  target="_blank"
                  rel="noopener"
                >
                  {c.mention}
                </a>
                {c.post && <> {c.post}</>}
              </span>
            </li>
          ))}
        </ul>
      </PanelContent>
    </Panel>
  )
}
