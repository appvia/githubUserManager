## Deployment

1.  [Add a custom attribute on the users](https://support.google.com/a/answer/6208725?hl=en#zippy=%2Cadd-a-new-custom-attribute)

    1. Go to https://admin.google.com/ac/customschema
    1. Enter
       - Category: `Accounts`
       - Description: `Accounts held elsewhere to link in`
       - Custom fields:
         - name: `github`
         - info type: `text`
         - visibility: `Visible to the organisation`
         - no. of values: `multi-value`

1.  [Add values to custom attributes for the users](https://support.google.com/a/answer/6208725?hl=en#add_value)

    1.  go to https://admin.google.com/ac/users
    1.  click a user to edit them
    1.  click 'user information'
    1.  under Accounts, click `github`
    1.  add all the github accounts for that user
    1.  click Save

1.  [Make a gcp project](https://console.cloud.google.com/projectcreate)

    1. enable the [Admin SDK API](https://console.cloud.google.com/apis/library/admin.googleapis.com?q=workspace%20admin&id=d0a160dd-c410-4fd0-a951-c47e05309cb9)
    1. [create credentials](https://console.cloud.google.com/apis/credentials/wizard?project=githubusermanager)

    - Which API are you using?: `Admin SDK API`
    - Are you planning to use this API with App Engine or Compute Engine: `no`
    - Service account name: `githubusermanager`
    - Role: `[none]`
    - Key type: `JSON`
    - Click `Continue`, then confirm `CREATE WITHOUT ROLE`
    - edit the user, Click `Enable G Suite domain-wide delegation`
    - product name for the consent screen: `githubusermanager`

    1. [Delegate domain-wide authority to your service account](https://developers.google.com/admin-sdk/directory/v1/guides/delegation)

    - https://admin.google.com/ac/owl/domainwidedelegation
    - client ID: `client id from user`
    - OAuth scopes:
      - `https://www.googleapis.com/auth/admin.directory.user.readonly`

1.  Register new GitHub App
    1. https://github.com/settings/organizations
    - click `Settings` on your organization
    - click `Developer settings`
    - click `GitHub Apps`
    - click `New GitHub App`
    1. Enter:
    - GitHub App name: `Google workspace github users`
    - Homepage URL: github.com
    - Webhook
      - Active `uncheck`
    - Organization permissions
      - Members: `Read-only`
    - Where can this GitHub App be installed? `Only on this account`
    1. Click `Generate a private key` (should download a .pem)
    1. Click `Install App`
    1. Click `Install`
    1. Click `Install`
    - take node of the url, it'll look something like: `github.com/organizations/myorg/settings/installations/15627551`, the installationId is the last number `15627551`

## RUN

### Setup environment variables

| Environment Variable     | Description                                                                                                                     | Example           | Default |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------- |
| `GOOGLE_EMAIL_ADDRESS`   | Email address to assume to, needs to be an workspace admin                                                                      | `foo@example.com` | `null`  |
| `GOOGLE_CREDENTIALS`     | Base64'd json as downloaded from the google service account creation step                                                       | `Zm9vCg==`        | `null`  |
| `ADD_USERS`              | Set to TRUE to add users to the github organisation                                                                             | `TRUE`            | `false` |
| `REMOVE_USERS`           | Set to TRUE to remove users from the github organisation                                                                        | `TRUE`            | `false` |
| `EXIT_CODE_ON_MISMATCH`  | Exit code to use when there's a mismatch, useful when combined with `ADD_USERS` and `REMOVE_USERS` to be used in a dry-run mode | `1`               | `0`     |
| `GITHUB_ORG`             | GitHub Organization                                                                                                             | `chrisnstest`     | `null`  |
| `GITHUB_APP_ID`          | GitHub App ID                                                                                                                   | `106341`          | `null`  |
| `GITHUB_INSTALLATION_ID` | Github App Installation ID                                                                                                      | `15627551`        | `null`  |
| `GITHUB_PRIVATE_KEY`     | Base64'd private key as downloaded from github application registration step                                                    | `Zm9vCg==`        | `null`  |
| `IGNORED_USERS`          | Comma separated list of user ids to totally ignore always, useful for owners of an org you don't accidentally removed           | `owner1,owner2`   | `null`  |
