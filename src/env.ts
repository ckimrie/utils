import { userInfo } from 'node:os'
import { currentBranchName } from './git.js'
import { shortButUnique } from './string.js'

// Types for dependency injection
type UserInfoProvider = () => { username: string }
type BranchNameProvider = () => string

/**
 * Convert environment variable key to uppercase with underscores
 */
export function envKeyName (key: string): string {
  return key.replace(/[-]/g, '_').toUpperCase()
}

/**
 * Get Environment Variable
 *
 * By default throws error if env variable has not been set, but can optionally take a default
 * value instead
 */
export function getEnv (
  name: string,
  defaultIfNotFound?: string | ErrorConstructor
): string {
  defaultIfNotFound ??= Error
  if (defaultIfNotFound === Error && process.env[name] === undefined) {
    throw new Error(`Environment variable ${name} has not been set`)
  } else if (
    typeof defaultIfNotFound === 'string' &&
    process.env[name] === undefined
  ) {
    return defaultIfNotFound
  }

  return process.env[name] ?? ''
}

/**
 * Scope the name to the local user if running locally
 * @param name
 * @param maxLength
 * @param getUserInfo - Optional dependency injection for userInfo function
 * @param getBranchName - Optional dependency injection for currentBranchName function
 */
export function envAwareName (
  name: string,
  maxLength = 30,
  getUserInfo: UserInfoProvider = userInfo,
  getBranchName: BranchNameProvider = currentBranchName
): string {
  const currentlyInCI = isCI()

  // If in CI, use the NODE_ENV property
  if (currentlyInCI) {
    return `${name}-${getEnvName()}`
  }

  // If not in CI, we assume we are running locally, so scope this name to the local user and branch
  const { username } = getUserInfo()
  const gitBranch = getBranchName()

  return shortButUnique(`${name}-${username}-${gitBranch}`, maxLength)
}

/**
 * Currently running in production?
 */
export function isProduction (): boolean {
  return getEnvName() === 'production'
}

/**
 * Get the name of the current env
 */
export function getEnvName (): string {
  return getEnv('NODE_ENV', 'development')
}

/**
 * Get the name of the current env
 */
export function isCI (): boolean {
  return !!getEnv('CI', '')
}
