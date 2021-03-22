import { createAppAuth } from '@octokit/auth-app'
import { Octokit } from '@octokit/rest'
const ignoredUsers = process.env.IGNORED_USERS.toLowerCase().split(',')

const octokit = getAuthenticatedOctokit()

export function getAuthenticatedOctokit () {
  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.GITHUB_APP_ID,
      privateKey: Buffer.from(
        process.env.GITHUB_PRIVATE_KEY,
        'base64'
      ).toString('utf-8'),
      installationId: process.env.GITHUB_INSTALLATION_ID
    }
  })
}

export async function getGithubUsersFromGithub () {
  const members = await octokit.paginate(octokit.orgs.listMembers, {
    org: process.env.GITHUB_ORG
  })

  const pendingInvites = await octokit.paginate(
    octokit.orgs.listPendingInvitations,
    {
      org: process.env.GITHUB_ORG
    }
  )
  const pendingGithubAccounts = formatUserList(pendingInvites)

  const githubAccounts = formatUserList(members)

  if (pendingGithubAccounts.size > 0)
    console.log(
      `Outstanding GitHub invites for ${Array.from(pendingGithubAccounts).join(
        ', '
      )}`
    )

  return new Set([...githubAccounts, ...pendingGithubAccounts])
}

export function formatUserList (users): Set<string> {
  return new Set(users.map(user => user.login.toLowerCase()))
}

export async function getUserIdFromUsername (username: string) {
  console.log(`Looking up user ${username}`)
  let user
  try {
    user = await octokit.users.getByUsername({ username })
  } catch (error) {
    throw `Unable to find user id for ${username}`
  }
  console.log(`User ${username} userid: ${user.data.id}`)
  return user.data.id
}

export async function addUsersToGitHubOrg (users: Set<string>) {
  for (const user of users) {
    await addUserToGitHubOrg(user)
  }
}

export async function addUserToGitHubOrg (user: string) {
  if (ignoredUsers.includes(user.toLowerCase())) {
    console.log(`Ignoring add for ${user}`)
    return false
  }
  const userId = await getUserIdFromUsername(user)
  console.log(`Inviting ${user} (${userId} to ${process.env.GITHUB_ORG})`)
  await octokit.orgs.createInvitation({
    org: process.env.GITHUB_ORG,
    invitee_id: userId
  })
  console.log(
    `Invitation sent to ${user} (${userId} to ${process.env.GITHUB_ORG})`
  )
}

export async function removeUsersToGitHubOrg (users: Set<string>) {
  for (const user of users) {
    await removeUserToGitHubOrg(user)
  }
}

export async function removeUserToGitHubOrg (user: string) {
  if (ignoredUsers.includes(user.toLowerCase())) {
    console.log(`Ignoring remove for ${user}`)
    return false
  }
  console.log(`Removing user/invitation ${user} from ${process.env.GITHUB_ORG}`)
  return octokit.orgs.removeMembershipForUser({
    org: process.env.GITHUB_ORG,
    username: user
  })
}
