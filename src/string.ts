import { createHash } from 'node:crypto'

/**
 *
 * @param str
 * @param maxLength
 * @param separator
 */
export function shortButUnique (
  str: string,
  maxLength: number = 8,
  separator = '-'
): string {
  // If string shorter than max length, nothing to do
  if (str.length <= maxLength) {
    return str
  }

  const stub = str.substring(0, maxLength)
  const remainder = str.substring(maxLength, str.length)
  return `${stub}${separator}${createHash('shake256', { outputLength: 2 }).update(remainder).digest('hex')}`
}
