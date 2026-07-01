const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

/**
 * Turns a stored period token into a human label.
 * "03.2024" -> "March 2024" · "2024" -> "2024".
 */
export function formatPeriodLabel(value: string): string {
  if (value.includes(".")) {
    const [month, year] = value.split(".")
    const name = MONTHS[parseInt(month, 10) - 1]
    return name ? `${name} ${year}` : value
  }
  return value
}

/** Just the year from a period token. "03.2024" -> "2024" · "2024" -> "2024". */
export function periodYear(value: string): string {
  return value.includes(".") ? value.split(".")[1] : value
}
