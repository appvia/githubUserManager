jest.mock('googleapis')
import { google } from 'googleapis'
import * as mod from '../src/google'

const fakeUsersResponse = [
  { customSchemas: { Accounts: { github: [{ value: 'chrisns' }] } } },
  {
    customSchemas: {
      Accounts: { github: [{ value: 'Foo' }, , { value: 'tar' }] },
    },
  },
  {
    customSchemas: {
      Accounts: { github: [{ value: 'foo' }, { value: 'bar' }] },
    },
  },
]

describe('google integration', () => {
  beforeEach(() => {
    process.env.GOOGLE_EMAIL_ADDRESS = 'hello@example.com'
    process.env.GOOGLE_CREDENTIALS = Buffer.from(JSON.stringify({ client_email: 'foo', private_key: 'bar' })).toString(
      'base64',
    )
    jest.resetAllMocks()
  })
  it('googleAuth', () => {
    mod.googleAuth()
    // @ts-expect-error .mocks isn't on the original object so will fail
    return expect(google.auth.JWT.mock.calls).toMatchSnapshot()
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

  it('formatUserList', () =>
    expect(mod.formatUserList(fakeUsersResponse)).toEqual(new Set(['chrisns', 'foo', 'bar', 'tar'])))
})
