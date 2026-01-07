jest.mock('googleapis')
import { google } from 'googleapis'
import * as mod from '../src/google'

const fakeUsersResponse = [
  { customSchemas: { Accounts: { github: [{ value: 'chrisns' }] } }, suspended: false, archived: false },
  {
    customSchemas: {
      Accounts: { github: [{ value: 'Foo' }, , { value: 'tar' }] },
    },
    suspended: false,
    archived: false,
  },
  {
    customSchemas: {
      Accounts: { github: [{ value: 'foo' }, { value: 'bar' }] },
    },
    suspended: false,
    archived: false,
  },
]

const fakeUsersResponseWithSuspended = [
  { customSchemas: { Accounts: { github: [{ value: 'activeuser' }] } }, suspended: false, archived: false },
  { customSchemas: { Accounts: { github: [{ value: 'suspendeduser' }] } }, suspended: true, archived: false },
  { customSchemas: { Accounts: { github: [{ value: 'archiveduser' }] } }, suspended: false, archived: true },
  { customSchemas: { Accounts: { github: [{ value: 'botharchivedandsuspended' }] } }, suspended: true, archived: true },
]

describe('google integration', () => {
  beforeEach(() => {
    process.env.GOOGLE_EMAIL_ADDRESS = 'hello@example.com'
    process.env.GOOGLE_CREDENTIALS = Buffer.from(JSON.stringify({ client_email: 'foo', private_key: 'bar' })).toString(
      'base64',
    )
    jest.spyOn(global.console, 'log').mockImplementation()
  })
  it('googleAuth', () => {
    mod.googleAuth()
    return expect(google.auth.JWT).toMatchSnapshot()
  })
  it('getAdminService', () => {
    // @ts-expect-error mock service isn't a complete implementation, so being lazy and just doing the bare minimum
    google.admin.mockReturnValue('adminservice')
    const result = mod.getAdminService()
    return expect(result).resolves.toBe('adminservice')
  })

  it('getGithubUsersFromGoogle', () => {
    const service = { users: { list: jest.fn().mockResolvedValue({ data: { users: fakeUsersResponse } }) } }
    // @ts-expect-error mock service isn't a complete implementation, so being lazy and just doing the bare minimum
    jest.spyOn(mod, 'getAdminService').mockResolvedValue(service)

    const result = mod.getGithubUsersFromGoogle()
    expect(result).resolves.toMatchSnapshot()
  })

  it('formatUserList', () => expect(mod.formatUserList(fakeUsersResponse)).toMatchSnapshot())

  it('formatUserList bad', () =>
    expect(
      mod.formatUserList([
        { suspended: false, archived: false },
        { customSchemas: {}, suspended: false, archived: false },
        { customSchemas: { Accounts: {} }, suspended: false, archived: false },
        { customSchemas: { Accounts: { github: [] } }, suspended: false, archived: false },
        { customSchemas: { Accounts: { github: [{}] } }, suspended: false, archived: false },
        { customSchemas: { Accounts: { github: [{ value: 'chrisns' }] } }, suspended: false, archived: false },
      ]),
    ).toMatchSnapshot())

  it('formatUserList filters out suspended users', () => {
    const result = mod.formatUserList(fakeUsersResponseWithSuspended)
    expect(result).toEqual(new Set(['activeuser']))
  })

  it('formatUserList filters out archived users', () => {
    const users = [
      { customSchemas: { Accounts: { github: [{ value: 'active' }] } }, suspended: false, archived: false },
      { customSchemas: { Accounts: { github: [{ value: 'archived' }] } }, suspended: false, archived: true },
    ]
    const result = mod.formatUserList(users)
    expect(result).toEqual(new Set(['active']))
  })
})
