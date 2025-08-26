import { test, describe } from 'node:test'
import assert from 'node:assert'
import { executeGitCommand, currentBranchName } from '../src/git.ts'

describe('git utils', () => {
  describe('executeGitCommand', () => {
    test('executes command and returns trimmed output', () => {
      const mockExecutor = (command: string) => {
        assert.strictEqual(command, 'git status')
        return Buffer.from('  output with whitespace  \n\r')
      }

      const result = executeGitCommand('git status', mockExecutor)
      assert.strictEqual(result, '  output with whitespace')
    })

    test('handles commands with no trailing whitespace', () => {
      const mockExecutor = () => Buffer.from('clean-output')

      const result = executeGitCommand('git rev-parse HEAD', mockExecutor)
      assert.strictEqual(result, 'clean-output')
    })

    test('handles empty output', () => {
      const mockExecutor = () => Buffer.from('')

      const result = executeGitCommand('git diff --name-only', mockExecutor)
      assert.strictEqual(result, '')
    })

    test('converts buffer to UTF-8 string', () => {
      const mockExecutor = () => Buffer.from('utf8-content', 'utf8')

      const result = executeGitCommand('git log --oneline -1', mockExecutor)
      assert.strictEqual(result, 'utf8-content')
    })

    test('uses default execSync when no executor provided', () => {
      // This test verifies the default parameter works
      // We can't easily test the actual execSync call without mocking,
      // but we can test that the function accepts no second parameter
      assert.doesNotThrow(() => {
        // This would normally execute real git command, but since we're in a git repo
        // and this is a valid git command, it should work
        const result = executeGitCommand('git --version')
        assert.ok(typeof result === 'string')
        assert.ok(result.length > 0)
      })
    })
  })

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
