import { google } from 'googleapis'
import * as mod from './google'
import { config } from './config'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function googleAuth() {
  const privatekey = config.googleCredentials
  const jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/admin.directory.user.readonly'],
    config.googleEmailAddress,
  )
  await jwtClient.authorize()
  return jwtClient
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function getAdminService() {
  return google.admin({
    version: 'directory_v1',
    auth: await googleAuth(),
  })
}

export async function getGithubUsersFromGoogle(): Promise<Set<string>> {
  const service = await mod.getAdminService()
  let githubAccounts = new Set<string>()
  let pageToken = null

  do {
    const userList = await service.users.list({
      customer: 'my_customer',
      maxResults: 250,
      projection: 'custom',
      fields: 'users(customSchemas/Accounts/github(value)),nextPageToken',
      customFieldMask: 'Accounts',
      pageToken: pageToken,
    })
    pageToken = userList.data.nextPageToken
    githubAccounts = new Set([...githubAccounts, ...formatUserList(userList.data.users)])
  } while (pageToken != null)
  return githubAccounts
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function formatUserList(users: any[]): Set<string> {
  return new Set(
    users
      .map((user) =>
        user.customSchemas?.Accounts?.github?.map((account: { value: string }) => account.value?.toLowerCase()),
      )
      .flat()
      .filter(Boolean),
  )
}
