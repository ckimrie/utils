import { test, describe } from 'node:test'
import assert from 'node:assert'
import { currentBranchName } from '../src/git.ts'

describe('git utils', () => {
  describe('currentBranchName', () => {
    test('returns current branch name', () => {
      const mockExecutor = (command: string) => {
        assert.strictEqual(command, 'git rev-parse --abbrev-ref HEAD')
        return Buffer.from('main\n')
      }

      const result = currentBranchName(mockExecutor)
      assert.strictEqual(result, 'main')
    })

    test('handles feature branch names', () => {
      const mockExecutor = () => Buffer.from('feature/user-authentication  \r\n')

      const result = currentBranchName(mockExecutor)
      assert.strictEqual(result, 'feature/user-authentication')
    })

    test('handles detached HEAD state', () => {
      const mockExecutor = () => Buffer.from('HEAD\n')

      const result = currentBranchName(mockExecutor)
      assert.strictEqual(result, 'HEAD')
    })

    test('uses default executor when none provided', () => {
      // This test verifies the default behavior works
      assert.doesNotThrow(() => {
        const result = currentBranchName()
        assert.ok(typeof result === 'string')
        assert.ok(result.length > 0)
      })
    })
  })
})
