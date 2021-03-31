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

  const userList = await service.users.list({
    customer: 'my_customer',
    maxResults: 250,
    projection: 'custom',
    fields: 'users(customSchemas/Accounts/github(value))',
    customFieldMask: 'Accounts',
  })

  const githubAccounts = mod.formatUserList(userList.data.users)
  return githubAccounts
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function formatUserList(users): Set<string> {
  return new Set(
    users
      .map((user) => user.customSchemas?.Accounts?.github?.map((account) => account.value?.toLowerCase()))
      .flat()
      .filter(Boolean),
  )
}
