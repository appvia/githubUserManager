import { getGithubUsersFromGoogle } from './src/google'
import { getGithubUsersFromGithub, addUsersToGitHubOrg, removeUsersFromGitHubOrg, OperationError } from './src/github'
import { config } from './src/config'

export async function run(): Promise<void> {
  const googleUsers = await getGithubUsersFromGoogle()
  console.log(`Users from google: ${Array.from(googleUsers).join(', ')}`)

  const gitHubUsers = await getGithubUsersFromGithub()
  console.log(`Users from github: ${Array.from(gitHubUsers).join(', ')}`)

  const usersNotInGithub = new Set(Array.from(googleUsers).filter((x) => !gitHubUsers.has(x)))

  const usersNotInGoogle = new Set(Array.from(gitHubUsers).filter((x) => !googleUsers.has(x)))
  let unfixedMismatch = false
  const allErrors: OperationError[] = []

  if (usersNotInGithub.size > 0) {
    console.log(`Users not in github: ${Array.from(usersNotInGithub).join(', ')}`)
    if (config.addUsers) {
      const result = await addUsersToGitHubOrg(usersNotInGithub)
      if (result.errors.length > 0) {
        allErrors.push(...result.errors)
      }
    } else {
      unfixedMismatch = true
    }
  }

  if (usersNotInGoogle.size > 0) {
    console.log(`Users not in google: ${Array.from(usersNotInGoogle).join(', ')}`)
    if (config.removeUsers) {
      const result = await removeUsersFromGitHubOrg(usersNotInGoogle)
      if (result.errors.length > 0) {
        allErrors.push(...result.errors)
      }
    } else {
      unfixedMismatch = true
    }
  }

  if (allErrors.length > 0) {
    console.error(`\n--- ERRORS SUMMARY ---`)
    for (const err of allErrors) {
      console.error(`[${err.operation.toUpperCase()}] ${err.user}: ${err.message}`)
    }
    console.error(`Total errors: ${allErrors.length}`)
  }

  const hasErrors = allErrors.length > 0
  const exitCode = unfixedMismatch || hasErrors ? config.exitCodeOnMissmatch : 0

  process.exit(exitCode)
}

// istanbul ignore next
if (require.main === module) run()
