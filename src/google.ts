const { google } = require('googleapis')

const privatekey = JSON.parse(
  Buffer.from(process.env.GOOGLE_CREDENTIALS, 'base64').toString('utf-8')
)

export const googleAuth = async () => {
  const jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/admin.directory.user.readonly'],
    process.env.GOOGLE_EMAIL_ADDRESS
  )
  await jwtClient.authorize()
  return jwtClient
}

export async function getAdminService () {
  return google.admin({
    version: 'directory_v1',
    auth: await googleAuth()
  })
}

export async function getGithubUsersFromGoogle () {
  const service = await getAdminService()

  const userList: {
    data: { users: Array<userResponseEntry> }
  } = await service.users.list({
    customer: 'my_customer',
    maxResults: 250,
    projection: 'custom',
    fields: 'users(customSchemas/Accounts/github(value))',
    customFieldMask: 'Accounts'
  })

  const githubAccounts = formatUserList(userList.data.users)
  return githubAccounts
}

interface userResponseEntry {
  customSchemas: { Accounts: { github: Array<{ value: string }> } }
}

export function formatUserList (users: Array<userResponseEntry>): Set<string> {
  return new Set(
    users
      .map(user =>
        user?.customSchemas?.Accounts?.github.map(account =>
          account.value.toLowerCase()
        )
      )
      .flat()
      .filter(Boolean)
  )
}
