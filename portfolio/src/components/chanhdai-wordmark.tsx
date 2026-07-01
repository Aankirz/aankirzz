export function ChanhDaiWordmark(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 1024 256"
      {...props}
    >
      <text
        x="0"
        y="200"
        fill="currentColor"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="200"
        fontWeight="700"
        letterSpacing="-6"
      >
        Ankit Kiran
      </text>
    </svg>
  )
}

export function getWordmarkSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 1024 256"><text x="0" y="200" fill="currentColor" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="200" font-weight="700" letter-spacing="-6">Ankit Kiran</text></svg>`
}
