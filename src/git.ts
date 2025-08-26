import { execSync } from 'node:child_process'

// Type for the executor function to enable dependency injection
type CommandExecutor = (command: string) => Buffer

function executeGitCommand (command: string, executor: CommandExecutor = execSync): string {
  return executor(command)
    .toString('utf8')
    .replace(/[\n\r\s]+$/, '')
}

export function currentBranchName (executor?: CommandExecutor): string {
  return executeGitCommand('git rev-parse --abbrev-ref HEAD', executor)
}
