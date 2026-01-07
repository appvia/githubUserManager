jest.mock('../src/google')
jest.mock('../src/github')
jest.mock('../src/slack')
import * as google from '../src/google'
import * as github from '../src/github'
import * as slack from '../src/slack'
import * as mod from '../index'

let processExitSpy
let consoleSpy
let consoleErrorSpy

beforeEach(() => {
  processExitSpy = jest.spyOn(global.process, 'exit').mockImplementation(() => {
    return undefined as never
  })
  consoleSpy = jest.spyOn(global.console, 'log').mockImplementation()
  consoleErrorSpy = jest.spyOn(global.console, 'error').mockImplementation()
  // @ts-expect-error mockResolved unexpected
  github.addUsersToGitHubOrg.mockResolvedValue({ success: [], errors: [] })
  // @ts-expect-error mockResolved unexpected
  github.removeUsersFromGitHubOrg.mockResolvedValue({ success: [], errors: [] })
})

describe('missmatch', () => {
  beforeEach(() => {
    // @ts-expect-error mockResolved unexpected
    google.getGithubUsersFromGoogle.mockResolvedValue(new Set(['a', 'd']))
    // @ts-expect-error mockResolved unexpected
    github.getGithubUsersFromGithub.mockResolvedValue(new Set(['b', 'c', 'a']))
  })
  it('should have consistent console output', async () => {
    await mod.run()
    return expect(consoleSpy).toMatchSnapshot()
  })

  it('should exit with 0 by default as there is a missmatch', async () => {
    await mod.run()
    return expect(processExitSpy).toBeCalledWith(0)
  })
  it('should exit with 122 if defined when there is an unfixed missmatch', async () => {
    process.env.EXIT_CODE_ON_MISMATCH = '122'
    delete process.env.ADD_USERS
    delete process.env.REMOVE_USERS
    await mod.run()
    return expect(processExitSpy).toBeCalledWith(122)
  })
  it('should exit with 0 when mismatch is fixed by adding users', async () => {
    process.env.EXIT_CODE_ON_MISMATCH = '122'
    process.env.ADD_USERS = 'true'
    process.env.REMOVE_USERS = 'true'
    await mod.run()
    return expect(processExitSpy).toBeCalledWith(0)
  })
  it('should exit with 122 when only add is enabled but remove mismatch exists', async () => {
    process.env.EXIT_CODE_ON_MISMATCH = '122'
    process.env.ADD_USERS = 'true'
    delete process.env.REMOVE_USERS
    await mod.run()
    return expect(processExitSpy).toBeCalledWith(122)
  })
  it('should not add users if not set to', async () => {
    delete process.env.ADD_USERS
    await mod.run()
    return expect(github.addUsersToGitHubOrg).not.toBeCalled()
  })
  it('should not remove users if not set to', async () => {
    delete process.env.REMOVE_USERS
    await mod.run()
    return expect(github.removeUsersFromGitHubOrg).not.toBeCalled()
  })
  it('should add users if set to', async () => {
    process.env.ADD_USERS = 'true'
    await mod.run()
    return expect(github.addUsersToGitHubOrg).toMatchSnapshot()
  })
  it('should remove users if set to', async () => {
    process.env.REMOVE_USERS = 'true'
    await mod.run()
    return expect(github.removeUsersFromGitHubOrg).toMatchSnapshot()
  })
  it('should have consistent console output with full destructive mode on', async () => {
    process.env.REMOVE_USERS = 'true'
    process.env.ADD_USERS = 'true'
    await mod.run()
    return expect(consoleSpy).toMatchSnapshot()
  })
})

describe('match', () => {
  beforeEach(() => {
    // @ts-expect-error mockResolved unexpected
    google.getGithubUsersFromGoogle.mockResolvedValue(new Set(['a', 'b', 'c', 'd']))
    // @ts-expect-error mockResolved unexpected
    github.getGithubUsersFromGithub.mockResolvedValue(new Set(['a', 'b', 'c', 'd']))
  })
  it('should have consistent console output', async () => {
    await mod.run()
    return expect(consoleSpy).toMatchSnapshot()
  })
  it('should exit with 0 by default', async () => {
    await mod.run()
    return expect(processExitSpy).toBeCalledWith(0)
  })
  it('should not exit with 122 if defined', async () => {
    process.env.EXIT_CODE_ON_MISMATCH = '122'
    await mod.run()
    return expect(processExitSpy).not.toBeCalledWith(122)
  })
  it('should not add users', async () => {
    process.env.ADD_USERS = 'true'
    await mod.run()
    return expect(github.addUsersToGitHubOrg).not.toBeCalled()
  })
  it('should not remove users', async () => {
    process.env.REMOVE_USERS = 'true'
    await mod.run()
    return expect(github.removeUsersFromGitHubOrg).not.toBeCalled()
  })
})

describe('error handling', () => {
  beforeEach(() => {
    // @ts-expect-error mockResolved unexpected
    google.getGithubUsersFromGoogle.mockResolvedValue(new Set(['a', 'd']))
    // @ts-expect-error mockResolved unexpected
    github.getGithubUsersFromGithub.mockResolvedValue(new Set(['b', 'c', 'a']))
  })

  it('should exit with non-zero when errors occur', async () => {
    process.env.EXIT_CODE_ON_MISMATCH = '1'
    process.env.ADD_USERS = 'true'
    process.env.REMOVE_USERS = 'true'
    // @ts-expect-error mockResolved unexpected
    github.addUsersToGitHubOrg.mockResolvedValue({
      success: [],
      errors: [{ user: 'd', operation: 'add', message: 'org full', status: 422 }],
    })
    await mod.run()
    expect(processExitSpy).toBeCalledWith(1)
  })

  it('should output error summary when errors occur', async () => {
    process.env.ADD_USERS = 'true'
    process.env.REMOVE_USERS = 'true'
    // @ts-expect-error mockResolved unexpected
    github.addUsersToGitHubOrg.mockResolvedValue({
      success: [],
      errors: [{ user: 'd', operation: 'add', message: 'org full', status: 422 }],
    })
    await mod.run()
    expect(consoleErrorSpy).toHaveBeenCalledWith('\n--- ERRORS SUMMARY ---')
    expect(consoleErrorSpy).toHaveBeenCalledWith('[ADD] d: org full')
  })
})
