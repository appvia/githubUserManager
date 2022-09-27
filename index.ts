import * as dotenv from 'dotenv'
dotenv.config()
import { getGithubUsersFromGoogle } from './src/google'
import { getGithubUsersFromGithub, addUsersToGitHubOrg, removeUsersFromGitHubOrg } from './src/github'
import { config } from './src/config'

export async function run(): Promise<void> {
  const googleUsers = await getGithubUsersFromGoogle()
  console.log(`Users from google: ${Array.from(googleUsers).join(', ')}`)

  const gitHubUsers = await getGithubUsersFromGithub()
  console.log(`Users from github: ${Array.from(gitHubUsers).join(', ')}`)

  const usersNotInGithub = new Set(Array.from(googleUsers).filter((x) => !gitHubUsers.has(x)))

  const usersNotInGoogle = new Set(Array.from(gitHubUsers).filter((x) => !googleUsers.has(x)))
  if (usersNotInGithub.size > 0) {
    console.log(`Users not in github: ${Array.from(usersNotInGithub).join(', ')}`)
    if (config.addUsers) await addUsersToGitHubOrg(usersNotInGithub)
  }

  if (usersNotInGoogle.size > 0) {
    console.log(`Users not in google: ${Array.from(usersNotInGoogle).join(', ')}`)
    if (config.removeUsers) await removeUsersFromGitHubOrg(usersNotInGoogle)
  }

  const exitCode = usersNotInGoogle.size > 0 || usersNotInGithub.size > 0 ? config.exitCodeOnMissmatch : 0

  process.exit(exitCode)
}

// istanbul ignore next
if (require.main === module) run()
