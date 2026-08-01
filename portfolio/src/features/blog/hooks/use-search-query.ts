import { useQueryState } from "nuqs"

export function useSearchQuery() {
  const [query, setQuery] = useQueryState("q", {
    defaultValue: "",
  })

  return { query, setQuery }
}

/** Active topic filter. Lives in the URL so a filtered archive is shareable. */
export function useTagQuery() {
  const [tag, setTag] = useQueryState("tag", {
    defaultValue: "",
  })

  return { tag, setTag }
}
