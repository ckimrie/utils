import { test, describe, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert'
import {
  envKeyName,
  getEnv,
  getEnvName,
  isProduction,
  isCI,
  envAwareName,
} from '../src/env.ts'

describe('environment utils', () => {
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    // Store original environment
    originalEnv = process.env
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv
  })

  describe('envKeyName', () => {
    test('converts kebab-case to uppercase with underscores', () => {
      assert.strictEqual(envKeyName('my-env-var'), 'MY_ENV_VAR')
      assert.strictEqual(envKeyName('single'), 'SINGLE')
      assert.strictEqual(envKeyName('multiple-dashes-here'), 'MULTIPLE_DASHES_HERE')
    })

    test('handles already uppercase strings', () => {
      assert.strictEqual(envKeyName('ALREADY_UPPER'), 'ALREADY_UPPER')
    })

    test('handles mixed case with dashes', () => {
      assert.strictEqual(envKeyName('Mixed-Case-String'), 'MIXED_CASE_STRING')
    })
  })

  describe('getEnv', () => {
    test('returns environment variable value when it exists', () => {
      process.env.TEST_VAR = 'test-value'
      assert.strictEqual(getEnv('TEST_VAR'), 'test-value')
    })

    test('throws error when environment variable does not exist and no default provided', () => {
      delete process.env.MISSING_VAR
      assert.throws(() => getEnv('MISSING_VAR'), {
        message: 'Environment variable MISSING_VAR has not been set'
      })
    })

    test('returns string default when environment variable does not exist', () => {
      delete process.env.MISSING_VAR
      assert.strictEqual(getEnv('MISSING_VAR', 'default-value'), 'default-value')
    })

    test('returns env value even when default is provided', () => {
      process.env.EXISTING_VAR = 'existing-value'
      assert.strictEqual(getEnv('EXISTING_VAR', 'default-value'), 'existing-value')
    })

    test('handles empty string environment variables', () => {
      process.env.EMPTY_VAR = ''
      assert.strictEqual(getEnv('EMPTY_VAR'), '')
    })

    test('throws error when Error constructor is explicitly passed as default', () => {
      delete process.env.MISSING_VAR
      assert.throws(() => getEnv('MISSING_VAR', Error), {
        message: 'Environment variable MISSING_VAR has not been set'
      })
    })
  })

  describe('getEnvName', () => {
    test('returns NODE_ENV when set', () => {
      process.env.NODE_ENV = 'production'
      assert.strictEqual(getEnvName(), 'production')
    })

    test('returns development as default when NODE_ENV is not set', () => {
      delete process.env.NODE_ENV
      assert.strictEqual(getEnvName(), 'development')
    })
  })

  describe('isProduction', () => {
    test('returns true when NODE_ENV is production', () => {
      process.env.NODE_ENV = 'production'
      assert.strictEqual(isProduction(), true)
    })

    test('returns false when NODE_ENV is not production', () => {
      process.env.NODE_ENV = 'development'
      assert.strictEqual(isProduction(), false)
    })

    test('returns false when NODE_ENV is not set (defaults to development)', () => {
      delete process.env.NODE_ENV
      assert.strictEqual(isProduction(), false)
    })
  })

  describe('isCurrentEnvCi', () => {
    test('returns true when CI environment variable is set to truthy value', () => {
      process.env.CI = 'true'
      assert.strictEqual(isCI(), true)
    })

    test('returns true when CI environment variable is set to any non-empty string', () => {
      process.env.CI = '1'
      assert.strictEqual(isCI(), true)
    })

    test('returns false when CI environment variable is not set', () => {
      delete process.env.CI
      assert.strictEqual(isCI(), false)
    })

    test('returns false when CI environment variable is empty string', () => {
      process.env.CI = ''
      assert.strictEqual(isCI(), false)
    })
  })

  describe('envAwareName', () => {
    test('returns CI-scoped name when in CI environment', () => {
      process.env.CI = 'true'
      process.env.NODE_ENV = 'staging'

      const result = envAwareName('myapp')
      assert.strictEqual(result, 'myapp-staging')
    })

    test('returns user and branch scoped name when not in CI', () => {
      delete process.env.CI
      const mockUserInfo = () => ({ username: 'testuser' })
      const mockBranchName = () => 'feature-branch'

      const result = envAwareName('myapp', 50, mockUserInfo, mockBranchName)
      assert.match(result, /^myapp-testuser-feature-branch/)
    })

    test('truncates local names when they exceed maxLength', () => {
      delete process.env.CI
      const mockUserInfo = () => ({ username: 'verylongusername' })
      const mockBranchName = () => 'very-long-feature-branch-name'

      const result = envAwareName('myverylongappname', 15, mockUserInfo, mockBranchName)
      assert.strictEqual(result.length, 20) // 15 + 1 + 4 (hash)
    })

    test('uses default maxLength of 30', () => {
      delete process.env.CI
      const longName = 'a'.repeat(50)
      const mockUserInfo = () => ({ username: 'user' })
      const mockBranchName = () => 'branch'

      const result = envAwareName(longName, undefined, mockUserInfo, mockBranchName)
      assert.ok(result.length <= 35) // 30 + separator + hash
    })

    test('uses default dependencies when none provided', () => {
      delete process.env.CI
      // This test verifies the default parameters work
      assert.doesNotThrow(() => {
        const result = envAwareName('testapp')
        assert.ok(typeof result === 'string')
        assert.ok(result.length > 0)
        assert.ok(result.includes('testapp'))
      })
    })
  })
})
