declare namespace NodeJS {
  export interface ProcessEnv {
    GOOGLE_EMAIL_ADDRESS: string
    GOOGLE_CREDENTIALS: string
    ADD_USERS: string
    EXIT_CODE_ON_MISMATCH: string
    GITHUB_ORG: string
    GITHUB_INSTALLATION_ID: string
    GITHUB_APP_ID: string
    GITHUB_PRIVATE_KEY: string
    IGNORED_USERS: string
  }
}
