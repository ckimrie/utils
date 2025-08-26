# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is @ckimrie/utils - a personal utility library with frequently used helper functions for environment handling, string manipulation, and git operations. The library is built with TypeScript and targets ES2022 with Node.js >=22.0.0.

## Development Commands

### Build and Test

- `npm run build` - Build the project using TypeScript and tsup
- `npm test` - Run tests using Node's built-in test runner with c8 coverage
- `npm run test:watch` - Run tests in watch mode
- `npm run coverage:view` - Open coverage report in browser

### Code Quality

- `npm run lint` - Run ESLint, lockfile lint, and markdown lint
- `npm run lint:fix` - Auto-fix linting issues
- `npm run lint:markdown` - Lint markdown files with markdownlint

### Publishing

- `npm run version` - Use changesets to version
- `npm run release` - Publish with changesets

## Architecture

### Source Structure

- `src/index.ts` - Main export barrel file
- `src/env.ts` - Environment variable utilities and CI/local environment detection
- `src/git.ts` - Git command execution utilities
- `src/string.ts` - String manipulation utilities (shortButUnique function)
- `src/cmd.ts` - Command execution utilities (currently not exported in index)

### Key Patterns

- Uses dependency injection pattern for testability (see UserInfoProvider, BranchNameProvider types)
- All git operations use executeGitCommand wrapper for consistent error handling
- Environment-aware naming system that scopes resources based on CI vs local environment
- Dual build output: both CommonJS (.cjs) and ES modules (.mjs)

### Testing

- Tests use Node.js built-in test runner (not Jest or Mocha)
- Coverage with c8
- Tests located in `test/` directory with `.test.ts` extension
- Import tsx for TypeScript execution in tests

### Build System

- TypeScript compilation + tsup bundling
- Outputs to `dist/` with both CJS/ESM formats
- Type declarations generated (.d.ts, .d.cts)
- Configured for Node.js dual package exports

### Linting

- ESLint with neostandard configuration
- Security plugin for detecting unsafe patterns
- Markdown linting with specific configuration
- Lockfile validation

The library focuses on environment-aware utilities, with functions that behave differently in CI vs local development environments.
