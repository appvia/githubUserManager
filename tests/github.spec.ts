import * as mod from '../src/github'
describe('github integration', () => {
  it.todo('getAuthenticatedOctokit')
  it.todo('getGithubUsersFromGithub')
  it.todo('getUserIdFromUsername')
  it.todo('addUsersToGitHubOrg')
  it.todo('addUserToGitHubOrg')
  it.todo('removeUsersToGitHubOrg')
  it.todo('removeUserToGitHubOrg')

  it('formatUserList', () => {
    const response = [{ login: 'chrisns' }, { login: 'chrisns' }, { login: 'foo' }]

    return expect(mod.formatUserList(response)).toEqual(new Set(['chrisns', 'foo']))
  })
})
