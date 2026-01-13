import { createAppAuth } from '@octokit/auth-app'
import { Octokit } from '@octokit/rest'
import * as mod from './github'
import { config } from './config'

export interface OperationError {
  user: string
  operation: 'add' | 'remove'
  message: string
  status?: number
}

export interface OperationResult {
  success: string[]
  errors: OperationError[]
}

export function getAuthenticatedOctokit(): Octokit {
  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: config.githubAppID,
      privateKey: config.githubPrivateKey,
      installationId: config.githubInstallationID,
    },
  })
}

export async function getGithubUsersFromGithub(): Promise<Set<string>> {
  const octokit = mod.getAuthenticatedOctokit()
  const members = await octokit.paginate(octokit.orgs.listMembers, {
    org: config.githubOrg,
  })

  const pendingInvites = await octokit.paginate(octokit.orgs.listPendingInvitations, {
    org: config.githubOrg,
  })
  const pendingGithubAccounts = formatUserList(pendingInvites)

  const githubAccounts = formatUserList(members)

  if (pendingGithubAccounts.size > 0)
    console.log(`Outstanding GitHub invites for ${Array.from(pendingGithubAccounts).join(', ')}`)

  return new Set([...githubAccounts, ...pendingGithubAccounts])
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function formatUserList(users): Set<string> {
  return new Set(
    users
      .map((user) => user.login?.toLowerCase())
      .flat()
      .filter(Boolean),
  )
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

export async function addUsersToGitHubOrg(users: Set<string>): Promise<OperationResult> {
  const result: OperationResult = { success: [], errors: [] }
  for (const user of users) {
    const outcome = await mod.addUserToGitHubOrg(user)
    if (outcome === true) {
      result.success.push(user)
    } else if (outcome !== false && 'error' in outcome) {
      result.errors.push(outcome.error)
    }
  }
  return result
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function addUserToGitHubOrg(user: string): Promise<{ error: OperationError } | boolean> {
  const octokit = mod.getAuthenticatedOctokit()
  if (config.ignoredUsers.includes(user.toLowerCase())) {
    console.log(`Ignoring add for ${user}`)
    return false
  }
  try {
    const userId = await mod.getUserIdFromUsername(user)
    console.log(`Inviting ${user} (${userId}) to ${config.githubOrg}`)
    await octokit.orgs.createInvitation({
      org: config.githubOrg,
      invitee_id: userId,
    })
    return true
  } catch (error) {
    const status = error?.status || error?.response?.status
    let message = error?.message || String(error)
    if (status === 422) {
      message = `Validation failed: ${message} (user may already be invited, or org is at max capacity)`
    } else if (status === 404) {
      message = `User not found: ${user}`
    } else if (status === 403) {
      message = `Permission denied or rate limited`
    }
    console.error(`Error adding ${user}: ${message}`)
    return { error: { user, operation: 'add', message, status } }
  }
}

export async function removeUsersFromGitHubOrg(users: Set<string>): Promise<OperationResult> {
  const result: OperationResult = { success: [], errors: [] }
  for (const user of users) {
    const outcome = await mod.removeUserFromGitHubOrg(user)
    if (outcome === true) {
      result.success.push(user)
    } else if (outcome !== false && 'error' in outcome) {
      result.errors.push(outcome.error)
    }
  }
  return result
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function removeUserFromGitHubOrg(user: string): Promise<{ error: OperationError } | boolean> {
  const octokit = mod.getAuthenticatedOctokit()
  if (config.ignoredUsers.includes(user.toLowerCase())) {
    console.log(`Ignoring remove for ${user}`)
    return false
  }
  try {
    console.log(`Removing user/invitation ${user} from ${config.githubOrg}`)
    await octokit.orgs.removeMembershipForUser({
      org: config.githubOrg,
      username: user,
    })
    return true
  } catch (error) {
    const status = error?.status || error?.response?.status
    let message = error?.message || String(error)
    if (status === 404) {
      message = `User not found or not a member: ${user}`
    } else if (status === 403) {
      message = `Permission denied or rate limited`
    }
    console.error(`Error removing ${user}: ${message}`)
    return { error: { user, operation: 'remove', message, status } }
  }
}
