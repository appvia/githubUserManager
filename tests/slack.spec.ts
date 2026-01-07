jest.mock('https')
import * as https from 'https'
import { config } from '../src/config'
import * as mod from '../src/slack'
import { EventEmitter } from 'events'

describe('slack integration', () => {
  let consoleSpy: jest.SpyInstance
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    consoleSpy = jest.spyOn(global.console, 'log').mockImplementation()
    consoleErrorSpy = jest.spyOn(global.console, 'error').mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('sendSlackNotification', () => {
    it('returns false when no webhook URL configured', async () => {
      jest.spyOn(config, 'slackWebhookUrl', 'get').mockReturnValue(undefined)
      const result = await mod.sendSlackNotification({ text: 'test' })
      expect(result).toBe(false)
    })

    it('sends notification when webhook URL is configured', async () => {
      jest.spyOn(config, 'slackWebhookUrl', 'get').mockReturnValue('https://hooks.slack.com/services/test')
      const mockReq = new EventEmitter() as any
      mockReq.write = jest.fn()
      mockReq.end = jest.fn()
      const mockRes = new EventEmitter() as any
      mockRes.statusCode = 200
      ;(https.request as jest.Mock).mockImplementation((options, callback) => {
        setTimeout(() => callback(mockRes), 0)
        return mockReq
      })
      const result = await mod.sendSlackNotification({ text: 'test' })
      expect(result).toBe(true)
    })

    it('returns false when request fails with non-200', async () => {
      jest.spyOn(config, 'slackWebhookUrl', 'get').mockReturnValue('https://hooks.slack.com/services/test')
      const mockReq = new EventEmitter() as any
      mockReq.write = jest.fn()
      mockReq.end = jest.fn()
      const mockRes = new EventEmitter() as any
      mockRes.statusCode = 500
      ;(https.request as jest.Mock).mockImplementation((options, callback) => {
        setTimeout(() => callback(mockRes), 0)
        return mockReq
      })
      const result = await mod.sendSlackNotification({ text: 'test' })
      expect(result).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    it('returns false when request errors', async () => {
      jest.spyOn(config, 'slackWebhookUrl', 'get').mockReturnValue('https://hooks.slack.com/services/test')
      const mockReq = new EventEmitter() as any
      mockReq.write = jest.fn()
      mockReq.end = jest.fn()
      ;(https.request as jest.Mock).mockImplementation(() => {
        setTimeout(() => mockReq.emit('error', new Error('Network error')), 0)
        return mockReq
      })
      const result = await mod.sendSlackNotification({ text: 'test' })
      expect(result).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })

  describe('formatMembershipUpdate', () => {
    it('formats message with added users', () => {
      const message = mod.formatMembershipUpdate(['user1', 'user2'], [], [], 'myorg')
      expect(message.text).toContain('2 added')
      expect(message.blocks).toBeDefined()
      expect(JSON.stringify(message.blocks)).toContain('user1, user2')
    })

    it('formats message with removed users', () => {
      const message = mod.formatMembershipUpdate([], ['user1'], [], 'myorg')
      expect(message.text).toContain('1 removed')
      expect(JSON.stringify(message.blocks)).toContain('user1')
    })

    it('formats message with errors', () => {
      const errors = [{ user: 'baduser', operation: 'add' as const, message: 'failed', status: 422 }]
      const message = mod.formatMembershipUpdate([], [], errors, 'myorg')
      expect(message.text).toContain('1 errors')
      expect(JSON.stringify(message.blocks)).toContain('baduser')
    })

    it('formats message when no changes', () => {
      const message = mod.formatMembershipUpdate([], [], [], 'myorg')
      expect(JSON.stringify(message.blocks)).toContain('No changes required')
    })
  })

  describe('notifySlack', () => {
    let mockReq: any

    beforeEach(() => {
      jest.spyOn(config, 'slackWebhookUrl', 'get').mockReturnValue('https://hooks.slack.com/services/test')
      jest.spyOn(config, 'githubOrg', 'get').mockReturnValue('myorg')
      mockReq = new EventEmitter() as any
      mockReq.write = jest.fn()
      mockReq.end = jest.fn()
      const mockRes = new EventEmitter() as any
      mockRes.statusCode = 200
      ;(https.request as jest.Mock).mockImplementation((options, callback) => {
        setTimeout(() => callback(mockRes), 0)
        return mockReq
      })
    })

    it('does not send when no changes and slackNotifyAlways is false', async () => {
      jest.spyOn(config, 'slackNotifyOnError', 'get').mockReturnValue(true)
      jest.spyOn(config, 'slackNotifyOnChange', 'get').mockReturnValue(false)
      jest.spyOn(config, 'slackNotifyAlways', 'get').mockReturnValue(false)
      await mod.notifySlack([], [], [], 'myorg')
      expect(https.request).not.toHaveBeenCalled()
    })

    it('sends when slackNotifyAlways is true', async () => {
      jest.spyOn(config, 'slackNotifyOnError', 'get').mockReturnValue(false)
      jest.spyOn(config, 'slackNotifyOnChange', 'get').mockReturnValue(false)
      jest.spyOn(config, 'slackNotifyAlways', 'get').mockReturnValue(true)
      await mod.notifySlack([], [], [], 'myorg')
      expect(https.request).toHaveBeenCalled()
    })

    it('sends when errors occur and slackNotifyOnError is true', async () => {
      jest.spyOn(config, 'slackNotifyOnError', 'get').mockReturnValue(true)
      jest.spyOn(config, 'slackNotifyOnChange', 'get').mockReturnValue(false)
      jest.spyOn(config, 'slackNotifyAlways', 'get').mockReturnValue(false)
      const errors = [{ user: 'baduser', operation: 'add' as const, message: 'failed', status: 422 }]
      await mod.notifySlack([], [], errors, 'myorg')
      expect(https.request).toHaveBeenCalled()
    })

    it('sends when changes occur and slackNotifyOnChange is true', async () => {
      jest.spyOn(config, 'slackNotifyOnError', 'get').mockReturnValue(false)
      jest.spyOn(config, 'slackNotifyOnChange', 'get').mockReturnValue(true)
      jest.spyOn(config, 'slackNotifyAlways', 'get').mockReturnValue(false)
      await mod.notifySlack(['newuser'], [], [], 'myorg')
      expect(https.request).toHaveBeenCalled()
    })
  })
})
