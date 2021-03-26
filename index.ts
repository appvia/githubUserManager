import { getGithubUsersFromGoogle } from './src/google'
import { getGithubUsersFromGithub, addUsersToGitHubOrg, removeUsersToGitHubOrg } from './src/github'

export async function run(): Promise<void> {
  const googleUsers = await getGithubUsersFromGoogle()
  console.log(`Users from google: ${Array.from(googleUsers).join(', ')}`)

  const gitHubUsers = await getGithubUsersFromGithub()
  console.log(`Users from github: ${Array.from(gitHubUsers).join(', ')}`)

  const usersNotInGithub = new Set(Array.from(googleUsers).filter((x) => !gitHubUsers.has(x)))

  const usersNotInGoogle = new Set(Array.from(gitHubUsers).filter((x) => !googleUsers.has(x)))
  if (usersNotInGithub.size > 0) {
    console.log(`Users not in github: ${Array.from(usersNotInGithub).join(', ')}`)
    if (process.env.ADD_USERS?.toLowerCase() === 'true') await addUsersToGitHubOrg(usersNotInGithub)
  }

  if (usersNotInGoogle.size > 0) {
    console.log(`Users not in google: ${Array.from(usersNotInGoogle).join(', ')}`)
    if (process.env.REMOVE_USERS?.toLowerCase() === 'true') await removeUsersToGitHubOrg(usersNotInGoogle)
  }

  let exitCode
  if (usersNotInGoogle.size > 0 || usersNotInGithub.size > 0)
    exitCode = parseInt(process.env.EXIT_CODE_ON_MISMATCH ?? '0')

  process.exit(exitCode ?? 0)
}

// istanbul ignore next
if (require.main === module) run()
