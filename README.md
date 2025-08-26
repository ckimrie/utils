<!-- markdownlint-disable -->

<p align="center"><h1 align="center">
  @ckimrie/utils
</h1>

<p align="center">
  Personal utility library with frequently used helper functions
</p>

<p align="center">
  <a href="https://www.npmjs.org/package/@ckimrie/utils"><img src="https://badgen.net/npm/v/@ckimrie/utils" alt="npm version"/></a>
  <a href="https://www.npmjs.org/package/@ckimrie/utils"><img src="https://badgen.net/npm/license/@ckimrie/utils" alt="license"/></a>
  <a href="https://www.npmjs.org/package/@ckimrie/utils"><img src="https://badgen.net/npm/dt/@ckimrie/utils" alt="downloads"/></a>
  <a href="https://github.com/ckimrie/@ckimrie/utils/actions?workflow=CI"><img src="https://github.com/ckimrie/@ckimrie/utils/workflows/CI/badge.svg" alt="build"/></a>
  <a href="https://codecov.io/gh/ckimrie/@ckimrie/utils"><img src="https://badgen.net/codecov/c/github/ckimrie/@ckimrie/utils" alt="codecov"/></a>
  <a href="https://snyk.io/test/github/ckimrie/@ckimrie/utils"><img src="https://snyk.io/test/github/ckimrie/@ckimrie/utils/badge.svg" alt="Known Vulnerabilities"/></a>
  <a href="./SECURITY.md"><img src="https://img.shields.io/badge/Security-Responsible%20Disclosure-yellow.svg" alt="Responsible Disclosure Policy" /></a>
</p>

## Install

```sh
npm add @ckimrie/utils
# or
yarn add @ckimrie/utils
```

## Usage

### Import

```typescript
// ES Modules
import { getEnv, shortButUnique, currentBranchName } from '@ckimrie/utils'

// CommonJS
const { getEnv, shortButUnique, currentBranchName } = require('@ckimrie/utils')
```

## API Documentation

### Environment Utilities

#### `envKeyName(key: string): string`

Convert a key to uppercase environment variable format by replacing hyphens with underscores.

```typescript
import { envKeyName } from '@ckimrie/utils'

envKeyName('my-app-key') // 'MY_APP_KEY'
envKeyName('database-url') // 'DATABASE_URL'
```

#### `getEnv(name: string, defaultIfNotFound?: string | ErrorConstructor): string`

Get an environment variable with optional default value. Throws an error by default if the variable is not set.

**Parameters:**
- `name`: Environment variable name
- `defaultIfNotFound`: Default value (string) or Error constructor to throw error (default: Error)

```typescript
import { getEnv } from '@ckimrie/utils'

// Throws error if NODE_ENV is not set
const env = getEnv('NODE_ENV')

// Returns 'development' if NODE_ENV is not set
const env = getEnv('NODE_ENV', 'development')

// Returns empty string if API_KEY is not set
const apiKey = getEnv('API_KEY', '')
```

#### `envAwareName(name: string, maxLength?: number): string`

Generate environment-aware resource names. In CI environments, appends the environment name. In local development, appends username and git branch name, truncated for uniqueness.

**Parameters:**
- `name`: Base name for the resource
- `maxLength`: Maximum length of the generated name (default: 30)

```typescript
import { envAwareName } from '@ckimrie/utils'

// In CI with NODE_ENV=production
envAwareName('my-app') // 'my-app-production'

// In local development
envAwareName('my-app') // 'my-app-john-feature-branch-a1b2'

// With custom max length
envAwareName('my-really-long-app-name', 20) // 'my-really-long-app-n-c3d4'
```

#### `isProduction(): boolean`

Check if the current environment is production.

```typescript
import { isProduction } from '@ckimrie/utils'

if (isProduction()) {
  console.log('Running in production mode')
}
```

#### `getEnvName(): string`

Get the current environment name from NODE_ENV, defaulting to 'development'.

```typescript
import { getEnvName } from '@ckimrie/utils'

const environment = getEnvName() // 'development', 'production', 'staging', etc.
```

#### `isCI(): boolean`

Check if the code is running in a CI environment by checking for the CI environment variable.

```typescript
import { isCI } from '@ckimrie/utils'

if (isCI()) {
  console.log('Running in CI environment')
}
```

### String Utilities

#### `shortButUnique(str: string, maxLength?: number, separator?: string): string`

Truncate a string to a maximum length while maintaining uniqueness by appending a hash of the truncated portion.

**Parameters:**
- `str`: The string to truncate
- `maxLength`: Maximum length of the result (default: 8)
- `separator`: Separator between truncated string and hash (default: '-')

```typescript
import { shortButUnique } from '@ckimrie/utils'

shortButUnique('hello') // 'hello' (no truncation needed)
shortButUnique('this-is-a-very-long-string') // 'this-is--a1b2' (truncated with hash)
shortButUnique('long-string', 15, '_') // 'long-string_c3d4' (custom separator)
```

### Git Utilities

#### `executeGitCommand(command: string, executor?: CommandExecutor): string`

Execute a git command and return the output as a clean string with trailing whitespace removed.

**Parameters:**
- `command`: Git command to execute
- `executor`: Optional command executor for dependency injection (default: execSync)

```typescript
import { executeGitCommand } from '@ckimrie/utils'

const commitHash = executeGitCommand('git rev-parse HEAD')
const status = executeGitCommand('git status --porcelain')
```

#### `currentBranchName(executor?: CommandExecutor): string`

Get the current git branch name.

**Parameters:**
- `executor`: Optional command executor for dependency injection

```typescript
import { currentBranchName } from '@ckimrie/utils'

const branch = currentBranchName() // 'main', 'feature/new-feature', etc.
```

## Usage Patterns

### Environment-Aware Resource Naming

Perfect for creating unique resource names in different environments:

```typescript
import { envAwareName, isCI } from '@ckimrie/utils'

// Database name that's unique per developer and environment
const dbName = envAwareName('myapp-db')

// S3 bucket with environment scoping
const bucketName = envAwareName('data-bucket', 50)
```

### Configuration Management

```typescript
import { getEnv, getEnvName, isProduction } from '@ckimrie/utils'

const config = {
  environment: getEnvName(),
  apiUrl: getEnv('API_URL', 'http://localhost:3000'),
  logLevel: isProduction() ? 'error' : 'debug',
  database: {
    host: getEnv('DB_HOST'),
    name: getEnv('DB_NAME', 'myapp_dev')
  }
}
```

### Git-Based Workflows

```typescript
import { currentBranchName, executeGitCommand } from '@ckimrie/utils'

const branch = currentBranchName()
const isMainBranch = branch === 'main'
const hasChanges = executeGitCommand('git status --porcelain').length > 0

if (!isMainBranch && hasChanges) {
  console.log(`Working on ${branch} with uncommitted changes`)
}
```

## Contributing

Please consult [CONTRIBUTING](./.github/CONTRIBUTING.md) for guidelines on contributing to this project.

## Author

**@ckimrie/utils** © [Christopher Imrie](https://github.com/ckimrie), Released under the [Apache-2.0](./LICENSE) License.