export type Education = {
  id: string
  school: string
  /** School logo (path under /public); falls back to a graduation-cap icon. */
  logo?: string
  degree?: string
  fieldOfStudy?: string
  period: {
    start: string
    end?: string
  }
  description?: string
  skills?: string[]
  isExpanded?: boolean
}
