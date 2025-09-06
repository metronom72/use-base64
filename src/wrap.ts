/**
 * Wraps text at the specified width with newlines
 */
export function wrapAt(input: string, width: number): string {
  if (!width || width <= 0) return input
  let out = ""
  for (let i = 0; i < input.length; i += width) {
    out += input.slice(i, i + width)
    if (i + width < input.length) out += "\n"
  }
  return out
}