import { Panel, PanelContent } from "../panel"

type Credential = {
  pre?: string
  mention: string
  href: string
  post?: string
}

const CREDENTIALS: Credential[] = [
  { pre: "AI Engineer", mention: "@Simbian", href: "https://simbian.ai" },
  { pre: "Ex-", mention: "@CRED Money", href: "https://cred.club/money" },
  {
    pre: "Ex-Founding Engineer",
    mention: "@WootzApp",
    href: "https://www.wootzapp.com",
  },
  { mention: "@Solana", href: "https://solana.com", post: "grantee" },
  {
    pre: "Member",
    mention: "@SuperteamDAO",
    href: "https://superteam.fun",
  },
  { pre: "GSoC'23", mention: "@Chromium", href: "https://www.chromium.org" },
  { mention: "NIT Rkl'25", href: "https://www.nitrkl.ac.in" },
]

export function Overview() {
  return (
    <Panel className="screen-line-bottom-none">
      <h2 className="sr-only">Overview</h2>

      <PanelContent>
        <ul className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm/relaxed">
          {CREDENTIALS.map((c, index) => (
            <li key={index} className="flex items-center gap-2.5">
              {index > 0 && (
                <span
                  className="font-mono text-line select-none"
                  aria-hidden
                >
                  /
                </span>
              )}
              <span className="text-muted-foreground">
                {c.pre && <>{c.pre} </>}
                <a
                  className="font-medium text-foreground link-underline"
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
