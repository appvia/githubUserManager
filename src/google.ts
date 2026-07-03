import { google } from 'googleapis'
import * as mod from './google'
import { config } from './config'

export async function googleAuth() {
  const privatekey = config.googleCredentials
  const jwtClient = new google.auth.JWT({
    email: privatekey.client_email,
    key: privatekey.private_key,
    scopes: ['https://www.googleapis.com/auth/admin.directory.user.readonly'],
    subject: config.googleEmailAddress,
  })
  await jwtClient.authorize()
  return jwtClient
}

export async function getAdminService() {
  return google.admin({
    version: 'directory_v1',
    auth: await googleAuth(),
  })
}

export async function getGithubUsersFromGoogle(): Promise<Set<string>> {
  const service = await mod.getAdminService()

  const userList = await service.users.list({
    customer: 'my_customer',
    maxResults: 250,
    projection: 'custom',
    query: 'isSuspended=false',
    fields: 'users(customSchemas/Accounts/github(value),suspended,archived)',
    customFieldMask: 'Accounts',
  })

  const githubAccounts = mod.formatUserList(userList.data.users ?? [])
  return githubAccounts
}

interface GoogleDirectoryUser {
  suspended?: boolean | null
  archived?: boolean | null
  customSchemas?: {
    Accounts?: {
      github?: { value?: string | null }[]
    }
  } | null
}

export function formatUserList(users: GoogleDirectoryUser[]): Set<string> {
  return new Set(
    users
      .filter((user) => !user.suspended && !user.archived)
      .map((user) => user.customSchemas?.Accounts?.github?.map((account) => account.value?.trim().toLowerCase()))
      .flat()
      .filter((login): login is string => Boolean(login)),
  )
}
