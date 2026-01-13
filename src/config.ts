export const config = {
  get addUsers(): boolean {
    return process.env.ADD_USERS?.toLowerCase() === 'true'
  },
  get removeUsers(): boolean {
    return process.env.REMOVE_USERS?.toLowerCase() === 'true'
  },
  get exitCodeOnMissmatch(): number {
    return parseInt(process.env.EXIT_CODE_ON_MISMATCH ?? '0') || 0
  },
  get ignoredUsers(): string[] {
    return process.env.IGNORED_USERS?.toLowerCase().split(',') ?? []
  },
  get githubPrivateKey(): string {
    return Buffer.from(process.env.GITHUB_PRIVATE_KEY, 'base64').toString('utf-8')
  },
  get githubAppID(): number {
    return parseInt(process.env.GITHUB_APP_ID)
  },
  get githubInstallationID(): number {
    return parseInt(process.env.GITHUB_INSTALLATION_ID)
  },
  get githubOrg(): string {
    return process.env.GITHUB_ORG ?? ''
  },
  get googleCredentials(): googleCredentials {
    return JSON.parse(Buffer.from(process.env.GOOGLE_CREDENTIALS, 'base64').toString('utf-8'))
  },
  get googleEmailAddress(): string {
    return process.env.GOOGLE_EMAIL_ADDRESS ?? ''
  },
  get slackWebhookUrl(): string | undefined {
    return process.env.SLACK_WEBHOOK_URL
  },
  get slackNotifyOnError(): boolean {
    return process.env.SLACK_NOTIFY_ON_ERROR?.toLowerCase() !== 'false'
  },
  get slackNotifyOnChange(): boolean {
    return process.env.SLACK_NOTIFY_ON_CHANGE?.toLowerCase() === 'true'
  },
  get slackNotifyAlways(): boolean {
    return process.env.SLACK_NOTIFY_ALWAYS?.toLowerCase() === 'true'
  },
}

export interface googleCredentials {
  type: string
  project_id: string
  private_key_id: string
  private_key: string
  client_email: string
  client_id: string
  auth_uri: string
  token_uri: string
  auth_provider_x509_cert_url: string
  client_x509_cert_url: string
}
