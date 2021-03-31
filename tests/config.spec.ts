import * as mod from '../src/config'

describe('addUsers', () => {
  beforeEach(() => {
    delete process.env.ADD_USERS
  })
  it('no value', () => {
    expect(mod.config.addUsers).toStrictEqual(false)
  })
  it('invalid value', () => {
    process.env.ADD_USERS = 'foobar'
    expect(mod.config.addUsers).toStrictEqual(false)
  })
  it('false value', () => {
    process.env.ADD_USERS = 'false'
    expect(mod.config.addUsers).toStrictEqual(false)
  })
  it('true value', () => {
    process.env.ADD_USERS = 'true'
    expect(mod.config.addUsers).toStrictEqual(true)
  })
  it('true value mixed case', () => {
    process.env.ADD_USERS = 'tRuE'
    expect(mod.config.addUsers).toStrictEqual(true)
  })
})

describe('removeUsers', () => {
  beforeEach(() => {
    delete process.env.REMOVE_USERS
  })
  it('no value', () => {
    expect(mod.config.removeUsers).toStrictEqual(false)
  })
  it('invalid value', () => {
    process.env.REMOVE_USERS = 'foobar'
    expect(mod.config.removeUsers).toStrictEqual(false)
  })
  it('false value', () => {
    process.env.REMOVE_USERS = 'false'
    expect(mod.config.removeUsers).toStrictEqual(false)
  })
  it('true value', () => {
    process.env.REMOVE_USERS = 'true'
    expect(mod.config.removeUsers).toStrictEqual(true)
  })
  it('true value mixed case', () => {
    process.env.REMOVE_USERS = 'tRuE'
    expect(mod.config.removeUsers).toStrictEqual(true)
  })
})

describe('ignoredUsers', () => {
  it('getIgnoredUsers empty', () => {
    delete process.env.IGNORED_USERS
    expect(mod.config.ignoredUsers).toMatchSnapshot()
  })

  it('getIgnoredUsers single', () => {
    process.env.IGNORED_USERS = 'user1'
    expect(mod.config.ignoredUsers).toMatchSnapshot()
  })
  it('getIgnoredUsers many', () => {
    process.env.IGNORED_USERS = 'user1,user2,user3,USER4'
    expect(mod.config.ignoredUsers).toMatchSnapshot()
  })
})

describe('githubPrivateKey', () => {
  it('should base 64 decode', () => {
    process.env.GITHUB_PRIVATE_KEY = Buffer.from('helloworld').toString('base64')
    expect(mod.config.githubPrivateKey).toStrictEqual('helloworld')
  })
})

describe('googleCredentials', () => {
  it('should base 64 decode and json parse', () => {
    process.env.GOOGLE_CREDENTIALS = Buffer.from(JSON.stringify({ hello: 'world' })).toString('base64')
    expect(mod.config.googleCredentials).toStrictEqual({ hello: 'world' })
  })
})

describe('exitCodeOnMissmatch', () => {
  beforeEach(() => {
    delete process.env.EXIT_CODE_ON_MISMATCH
  })
  it('no value', () => {
    expect(mod.config.exitCodeOnMissmatch).toStrictEqual(0)
  })
  it('invalid value', () => {
    process.env.EXIT_CODE_ON_MISMATCH = 'hello'
    expect(mod.config.exitCodeOnMissmatch).toStrictEqual(0)
  })
  it('valid value', () => {
    process.env.EXIT_CODE_ON_MISMATCH = '123'
    expect(mod.config.exitCodeOnMissmatch).toStrictEqual(123)
  })
})

describe('githubAppID', () => {
  beforeEach(() => {
    delete process.env.GITHUB_APP_ID
  })
  it('no value', () => {
    expect(mod.config.githubAppID).toStrictEqual(NaN)
  })
  it('invalid value', () => {
    process.env.GITHUB_APP_ID = 'hello'
    expect(mod.config.githubAppID).toStrictEqual(NaN)
  })
  it('valid value', () => {
    process.env.GITHUB_APP_ID = '123'
    expect(mod.config.githubAppID).toStrictEqual(123)
  })
})

describe('githubInstallationID', () => {
  beforeEach(() => {
    delete process.env.GITHUB_INSTALLATION_ID
  })
  it('no value', () => {
    expect(mod.config.githubInstallationID).toStrictEqual(NaN)
  })
  it('invalid value', () => {
    process.env.GITHUB_INSTALLATION_ID = 'hello'
    expect(mod.config.githubInstallationID).toStrictEqual(NaN)
  })
  it('valid value', () => {
    process.env.GITHUB_INSTALLATION_ID = '123'
    expect(mod.config.githubInstallationID).toStrictEqual(123)
  })
})

describe('githubOrg', () => {
  beforeEach(() => {
    delete process.env.GITHUB_ORG
  })
  it('no value', () => {
    expect(mod.config.githubOrg).toStrictEqual('')
  })
  it('valid value', () => {
    process.env.GITHUB_ORG = 'hello'
    expect(mod.config.githubOrg).toStrictEqual('hello')
  })
})

describe('googleEmailAddress', () => {
  beforeEach(() => {
    delete process.env.GOOGLE_EMAIL_ADDRESS
  })
  it('no value', () => {
    expect(mod.config.googleEmailAddress).toStrictEqual('')
  })
  it('valid value', () => {
    process.env.GOOGLE_EMAIL_ADDRESS = 'hello'
    expect(mod.config.googleEmailAddress).toStrictEqual('hello')
  })
})
