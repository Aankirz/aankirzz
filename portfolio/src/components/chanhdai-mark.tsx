export function ChanhDaiMark(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 320 256"
      aria-hidden
      {...props}
    >
      <text
        x="50%"
        y="200"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="220"
        fontWeight="700"
        letterSpacing="-8"
      >
        AK
      </text>
    </svg>
  )
}

export function getMarkSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 320 256"><text x="50%" y="200" text-anchor="middle" fill="currentColor" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="220" font-weight="700" letter-spacing="-8">AK</text></svg>`
}
