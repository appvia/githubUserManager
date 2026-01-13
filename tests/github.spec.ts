jest.mock('@octokit/rest')
import { Octokit } from '@octokit/rest'
import { config } from '../src/config'
import * as mod from '../src/github'

describe('github integration', () => {
  beforeEach(() => {
    jest.spyOn(config, 'githubPrivateKey', 'get').mockReturnValue('helloworld')
    jest.spyOn(config, 'githubAppID', 'get').mockReturnValue(123)
    jest.spyOn(config, 'githubInstallationID', 'get').mockReturnValue(123)
    jest.spyOn(global.console, 'log').mockImplementation()
    jest.spyOn(global.console, 'error').mockImplementation()
  })

  it('getAuthenticatedOctokit', () => {
    mod.getAuthenticatedOctokit()
    return expect(Octokit).toMatchSnapshot()
  })
  it('getGithubUsersFromGithub', () => {
    const fakeOctokit = {
      paginate: jest
        .fn()
        .mockResolvedValueOnce([{ login: 'chrisns' }, { login: 'bar' }, { login: 'foo' }])
        .mockResolvedValueOnce([{ login: 'pending' }, { login: 'chrisns' }, { login: 'anotherpending' }]),
      orgs: { listMembers: jest.fn(), listPendingInvitations: jest.fn() },
    }
    // @ts-expect-error mock service isn't a complete implementation, so being lazy and just doing the bare minimum
    jest.spyOn(mod, 'getAuthenticatedOctokit').mockReturnValue(fakeOctokit)
    expect(mod.getGithubUsersFromGithub()).resolves.toMatchSnapshot()
  })
  it('getUserIdFromUsername found', () => {
    const fakeOctokit = {
      users: {
        getByUsername: jest.fn().mockResolvedValue({ data: { id: 123 } }),
      },
    }
    // @ts-expect-error mock service isn't a complete implementation, so being lazy and just doing the bare minimum
    jest.spyOn(mod, 'getAuthenticatedOctokit').mockReturnValue(fakeOctokit)
    return expect(mod.getUserIdFromUsername('foo')).resolves.toMatchSnapshot()
  })

  it('getUserIdFromUsername notfound', () => {
    const fakeOctokit = {
      users: {
        getByUsername: jest.fn().mockRejectedValue(new Error('not found')),
      },
    }
    // @ts-expect-error mock service isn't a complete implementation, so being lazy and just doing the bare minimum
    jest.spyOn(mod, 'getAuthenticatedOctokit').mockReturnValue(fakeOctokit)
    return expect(mod.getUserIdFromUsername('foo')).rejects.toMatchSnapshot()
  })

  it('addUsersToGitHubOrg collects successes', async () => {
    const users = new Set(['foo', 'bar'])
    jest.spyOn(mod, 'addUserToGitHubOrg').mockResolvedValue(true)
    const result = await mod.addUsersToGitHubOrg(users)
    expect(result.success).toEqual(['foo', 'bar'])
    expect(result.errors).toEqual([])
  })

  it('addUsersToGitHubOrg collects errors', async () => {
    const users = new Set(['foo', 'bar'])
    jest.spyOn(mod, 'addUserToGitHubOrg').mockResolvedValue({
      error: { user: 'foo', operation: 'add', message: 'test error', status: 422 },
    })
    const result = await mod.addUsersToGitHubOrg(users)
    expect(result.success).toEqual([])
    expect(result.errors.length).toBe(2)
  })

  it('removeUsersFromGitHubOrg collects successes', async () => {
    const users = new Set(['foo', 'bar'])
    jest.spyOn(mod, 'removeUserFromGitHubOrg').mockResolvedValue(true)
    const result = await mod.removeUsersFromGitHubOrg(users)
    expect(result.success).toEqual(['foo', 'bar'])
    expect(result.errors).toEqual([])
  })

  it('removeUsersFromGitHubOrg collects errors', async () => {
    const users = new Set(['foo', 'bar'])
    jest.spyOn(mod, 'removeUserFromGitHubOrg').mockResolvedValue({
      error: { user: 'foo', operation: 'remove', message: 'test error', status: 404 },
    })
    const result = await mod.removeUsersFromGitHubOrg(users)
    expect(result.success).toEqual([])
    expect(result.errors.length).toBe(2)
  })

  it('removeUserFromGitHubOrg skip ignore', () => {
    jest.spyOn(config, 'ignoredUsers', 'get').mockReturnValue(['foo'])
    expect(mod.removeUserFromGitHubOrg('foo')).resolves.toBe(false)
  })

  it('addUserToGitHubOrg skip ignore', () => {
    jest.spyOn(config, 'ignoredUsers', 'get').mockReturnValue(['foo'])
    expect(mod.addUserToGitHubOrg('foo')).resolves.toBe(false)
  })

  it('addUserToGitHubOrg success', async () => {
    const fakeOctokit = {
      orgs: {
        createInvitation: jest.fn().mockResolvedValue(true),
      },
    }
    jest.spyOn(config, 'githubOrg', 'get').mockReturnValue('myorg')
    jest.spyOn(mod, 'getUserIdFromUsername').mockResolvedValue(123)
    // @ts-expect-error mock service isn't a complete implementation, so being lazy and just doing the bare minimum
    jest.spyOn(mod, 'getAuthenticatedOctokit').mockReturnValue(fakeOctokit)
    const result = await mod.addUserToGitHubOrg('foo')
    expect(result).toBe(true)
    expect(fakeOctokit.orgs.createInvitation).toMatchSnapshot()
  })

  it('addUserToGitHubOrg handles 422 error (org full)', async () => {
    const fakeOctokit = {
      orgs: {
        createInvitation: jest.fn().mockRejectedValue({ status: 422, message: 'Validation Failed' }),
      },
    }
    jest.spyOn(config, 'githubOrg', 'get').mockReturnValue('myorg')
    jest.spyOn(mod, 'getUserIdFromUsername').mockResolvedValue(123)
    // @ts-expect-error mock service isn't a complete implementation, so being lazy and just doing the bare minimum
    jest.spyOn(mod, 'getAuthenticatedOctokit').mockReturnValue(fakeOctokit)
    const result = await mod.addUserToGitHubOrg('foo')
    expect(result).toHaveProperty('error')
    // @ts-expect-error we know it has error
    expect(result.error.status).toBe(422)
    // @ts-expect-error we know it has error
    expect(result.error.message).toContain('org is at max capacity')
  })

  it('addUserToGitHubOrg handles 403 error (rate limit)', async () => {
    const fakeOctokit = {
      orgs: {
        createInvitation: jest.fn().mockRejectedValue({ status: 403, message: 'Forbidden' }),
      },
    }
    jest.spyOn(config, 'githubOrg', 'get').mockReturnValue('myorg')
    jest.spyOn(mod, 'getUserIdFromUsername').mockResolvedValue(123)
    // @ts-expect-error mock service isn't a complete implementation, so being lazy and just doing the bare minimum
    jest.spyOn(mod, 'getAuthenticatedOctokit').mockReturnValue(fakeOctokit)
    const result = await mod.addUserToGitHubOrg('foo')
    expect(result).toHaveProperty('error')
    // @ts-expect-error we know it has error
    expect(result.error.status).toBe(403)
    // @ts-expect-error we know it has error
    expect(result.error.message).toContain('rate limited')
  })

  it('removeUserFromGitHubOrg success', async () => {
    const fakeOctokit = {
      orgs: {
        removeMembershipForUser: jest.fn().mockResolvedValue(true),
      },
    }
    jest.spyOn(config, 'githubOrg', 'get').mockReturnValue('myorg')
    // @ts-expect-error mock service isn't a complete implementation, so being lazy and just doing the bare minimum
    jest.spyOn(mod, 'getAuthenticatedOctokit').mockReturnValue(fakeOctokit)
    const result = await mod.removeUserFromGitHubOrg('foo')
    expect(result).toBe(true)
    expect(fakeOctokit.orgs.removeMembershipForUser).toMatchSnapshot()
  })

  it('removeUserFromGitHubOrg handles 404 error', async () => {
    const fakeOctokit = {
      orgs: {
        removeMembershipForUser: jest.fn().mockRejectedValue({ status: 404, message: 'Not Found' }),
      },
    }
    jest.spyOn(config, 'githubOrg', 'get').mockReturnValue('myorg')
    // @ts-expect-error mock service isn't a complete implementation, so being lazy and just doing the bare minimum
    jest.spyOn(mod, 'getAuthenticatedOctokit').mockReturnValue(fakeOctokit)
    const result = await mod.removeUserFromGitHubOrg('foo')
    expect(result).toHaveProperty('error')
    // @ts-expect-error we know it has error
    expect(result.error.status).toBe(404)
    // @ts-expect-error we know it has error
    expect(result.error.message).toContain('not a member')
  })

  it('formatUserList', () => {
    const response = [{ login: 'chrisns' }, { login: 'chrisns' }, { login: 'foo' }, {}]
    return expect(mod.formatUserList(response)).toEqual(new Set(['chrisns', 'foo']))
  })
})
