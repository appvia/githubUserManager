import { createAppAuth } from '@octokit/auth-app'
import { Octokit } from '@octokit/rest'
import * as mod from './github'

export function getIgnoredUsers(): string[] {
  return process.env.IGNORED_USERS?.toLowerCase().split(',') ?? []
}

export function getAuthenticatedOctokit(): Octokit {
  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.GITHUB_APP_ID,
      privateKey: Buffer.from(process.env.GITHUB_PRIVATE_KEY, 'base64').toString('utf-8'),
      installationId: process.env.GITHUB_INSTALLATION_ID,
    },
  })
}

export async function getGithubUsersFromGithub(): Promise<Set<string>> {
  const octokit = mod.getAuthenticatedOctokit()
  const members = await octokit.paginate(octokit.orgs.listMembers, {
    org: process.env.GITHUB_ORG,
  })

  const pendingInvites = await octokit.paginate(octokit.orgs.listPendingInvitations, {
    org: process.env.GITHUB_ORG,
  })
  const pendingGithubAccounts = formatUserList(pendingInvites)

  const githubAccounts = formatUserList(members)

  if (pendingGithubAccounts.size > 0)
    console.log(`Outstanding GitHub invites for ${Array.from(pendingGithubAccounts).join(', ')}`)

  return new Set([...githubAccounts, ...pendingGithubAccounts])
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function formatUserList(users): Set<string> {
  return new Set(users.map((user) => user?.login?.toLowerCase()))
}

export async function getUserIdFromUsername(username: string): Promise<number> {
  const octokit = mod.getAuthenticatedOctokit()
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

export async function addUsersToGitHubOrg(users: Set<string>): Promise<void> {
  for (const user of users) {
    await mod.addUserToGitHubOrg(user)
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function addUserToGitHubOrg(user: string) {
  const octokit = mod.getAuthenticatedOctokit()
  console.log(user, mod.getIgnoredUsers(), mod.getIgnoredUsers().includes(user.toLowerCase()))
  if (mod.getIgnoredUsers().includes(user.toLowerCase())) {
    console.log(`Ignoring add for ${user}`)
    return false
  }
  const userId = await mod.getUserIdFromUsername(user)
  console.log(`Inviting ${user} (${userId} to ${process.env.GITHUB_ORG})`)
  return await octokit.orgs.createInvitation({
    org: process.env.GITHUB_ORG,
    invitee_id: userId,
  })
}

export async function removeUsersToGitHubOrg(users: Set<string>): Promise<void> {
  for (const user of users) {
    await mod.removeUserToGitHubOrg(user)
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function removeUserToGitHubOrg(user: string) {
  const octokit = mod.getAuthenticatedOctokit()
  if (mod.getIgnoredUsers().includes(user.toLowerCase())) {
    console.log(`Ignoring remove for ${user}`)
    return false
  }
  console.log(`Removing user/invitation ${user} from ${process.env.GITHUB_ORG}`)
  return octokit.orgs.removeMembershipForUser({
    org: process.env.GITHUB_ORG,
    username: user,
  })
}
