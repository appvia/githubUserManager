import * as mod from '../src/google'

describe('google integration', () => {
  it.todo('googleAuth')
  it.skip('getAdminService', () => {
    const result = mod.getAdminService()
    return expect(result).resolves.toBe({})
  })

  it.todo('getGithubUsersFromGoogle')

  it('formatUserList', () => {
    const response = [
      { customSchemas: { Accounts: { github: [{ value: 'chrisns' }] } } },
      {
        customSchemas: {
          Accounts: { github: [{ value: 'Foo' }, , { value: 'tar' }] }
        }
      },
      {
        customSchemas: {
          Accounts: { github: [{ value: 'foo' }, { value: 'bar' }] }
        }
      }
    ]
    return expect(mod.formatUserList(response)).toEqual(
      new Set(['chrisns', 'foo', 'bar', 'tar'])
    )
  })
})
