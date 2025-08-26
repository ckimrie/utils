import { test, describe } from 'node:test'
import assert from 'node:assert'
import { shortButUnique } from '../src/string.ts'

describe('string utils', () => {
  describe('shortButUnique', () => {
    test('returns original string when shorter than maxLength', () => {
      assert.strictEqual(shortButUnique('short', 10), 'short')
      assert.strictEqual(shortButUnique('exactly8', 8), 'exactly8')
    })

    test('truncates and adds hash when longer than maxLength', () => {
      const result = shortButUnique(
        'this-is-a-very-long-string-that-needs-truncation',
        8
      )
      assert.match(result, /^this-is--[0-9a-f]{4}$/)
      assert.strictEqual(result.length, 13) // 8 + 1 (separator) + 4 (hash)
    })

    test('uses custom separator', () => {
      const result = shortButUnique('verylongstring', 5, '_')
      assert.match(result, /^veryl_[0-9a-f]{4}$/)
    })

    test('handles different maxLength values', () => {
      const result = shortButUnique('verylongstring', 3)
      assert.match(result, /^ver-[0-9a-f]{4}$/)
      assert.strictEqual(result.length, 8) // 3 + 1 + 4
    })

    test('produces consistent hashes for same input', () => {
      const result1 = shortButUnique('consistent-test-string', 5)
      const result2 = shortButUnique('consistent-test-string', 5)
      assert.strictEqual(result1, result2)
    })

    test('produces different hashes for different remainders', () => {
      const result1 = shortButUnique('prefix-different1', 6)
      const result2 = shortButUnique('prefix-different2', 6)
      assert.notStrictEqual(result1, result2)
    })
  })
})
