jest.mock('googleapis')
import { google } from 'googleapis'
import * as mod from '../src/google'

const fakeUsersResponse = [
  { customSchemas: { Tech: { github: [{ value: 'chrisns' }] } } },
  {
    customSchemas: {
      Tech: { github: [{ value: 'Foo' }, , { value: 'tar' }] },
    },
  },
  {
    customSchemas: {
      Tech: { github: [{ value: 'foo' }, { value: 'bar' }] },
    },
  },
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
        {},
        { customSchemas: {} },
        { customSchemas: { Tech: {} } },
        { customSchemas: { Tech: { github: [] } } },
        { customSchemas: { Tech: { github: [{}] } } },
        { customSchemas: { Tech: { github: [{ value: 'chrisns' }] } } },
      ]),
    ).toMatchSnapshot())
})
