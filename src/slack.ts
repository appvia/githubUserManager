import * as https from 'https'
import { URL } from 'url'
import { config } from './config'
import { OperationError } from './github'

export interface SlackMessage {
  text: string
  blocks?: SlackBlock[]
}

export interface SlackBlock {
  type: string
  text?: { type: string; text: string }
  elements?: { type: string; text: string }[]
}

export async function sendSlackNotification(message: SlackMessage): Promise<boolean> {
  const webhookUrl = config.slackWebhookUrl
  if (!webhookUrl) {
    return false
  }

  return new Promise((resolve) => {
    try {
      const url = new URL(webhookUrl)
      const postData = JSON.stringify(message)

      const options = {
        hostname: url.hostname,
        port: 443,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      }

      const req = https.request(options, (res) => {
        if (res.statusCode === 200) {
          resolve(true)
        } else {
          console.error(`Slack notification failed: ${res.statusCode}`)
          resolve(false)
        }
      })

      req.on('error', (error) => {
        console.error(`Slack notification error: ${error}`)
        resolve(false)
      })

      req.write(postData)
      req.end()
    } catch (error) {
      console.error(`Slack notification error: ${error}`)
      resolve(false)
    }
  })
}

export function formatMembershipUpdate(
  added: string[],
  removed: string[],
  errors: OperationError[],
  org: string,
): SlackMessage {
  const hasChanges = added.length > 0 || removed.length > 0
  const hasErrors = errors.length > 0

  let emoji = ':white_check_mark:'
  if (hasErrors && !hasChanges) {
    emoji = ':x:'
  } else if (hasErrors) {
    emoji = ':warning:'
  }

  const blocks: SlackBlock[] = [
    {
      type: 'header',
      text: { type: 'plain_text', text: `${emoji} GitHub Org Sync: ${org}` },
    },
  ]

  if (added.length > 0) {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `*Users Added:* ${added.join(', ')}` },
    })
  }

  if (removed.length > 0) {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `*Users Removed:* ${removed.join(', ')}` },
    })
  }

  if (errors.length > 0) {
    const errorText = errors.map((e) => `• [${e.operation}] ${e.user}: ${e.message}`).join('\n')
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: `*Errors:*\n${errorText}` },
    })
  }

  if (!hasChanges && !hasErrors) {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: 'No changes required - all users in sync.' },
    })
  }

  return {
    text: `GitHub Org Sync: ${added.length} added, ${removed.length} removed, ${errors.length} errors`,
    blocks,
  }
}

export async function notifySlack(
  added: string[],
  removed: string[],
  errors: OperationError[],
  org: string,
): Promise<void> {
  const hasChanges = added.length > 0 || removed.length > 0
  const hasErrors = errors.length > 0

  const shouldNotify =
    (hasErrors && config.slackNotifyOnError) || (hasChanges && config.slackNotifyOnChange) || config.slackNotifyAlways

  if (!shouldNotify) {
    return
  }

  const message = formatMembershipUpdate(added, removed, errors, org)
  const sent = await sendSlackNotification(message)
  if (sent) {
    console.log('Slack notification sent')
  }
}
