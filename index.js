require('dotenv').config()
const {
  App,
  LogLevel
} = require('@slack/bolt')
const _ = require('lodash')
const fromUnixTime = require('date-fns/fromUnixTime')
const format = require('date-fns/format')

const app = new App({
  token: process.env.OAUTHTOKEN,
  signingSecret: process.env.SIGNINGSECRET,
  logLevel: LogLevel.ERROR
})
let conversationHistory = []

async function fetchUser (id) {
  try {
    const result = await app.client.users.profile.get({
      token: process.env.OAUTHTOKEN,
      user: id
    })

    return result.profile.real_name
  } catch (error) {
    console.error(error)
    return {}
  }
}

async function fetchHistory (id, oldest) {
  try {
    const result = await app.client.conversations.history({
      token: process.env.OAUTHTOKEN,
      channel: id,
      oldest,
      limit: 1000
    })

    conversationHistory = [...conversationHistory, ...result.messages]

    if (result.has_more === true) {
      await fetchHistory(id, conversationHistory[conversationHistory.length - 1].ts)
    }
  } catch (error) {
    console.error(error)
  }
}

async function getAllData () {
  await fetchHistory(process.env.CHANNELID, process.env.OLDEST_DATE)

  // reactions
  const filteredConversations = _.filter(conversationHistory, function (message) {
    if (message.reactions) {
      return _.find(message.reactions, function (reaction) {
        return reaction.name === process.env.REACTION
      })
    } else {
      return false
    }
  })

  // Get the month for each message.
  const conversations = _.map(filteredConversations, function (message) {
    const dateTime = fromUnixTime(message.ts)
    const month = format(dateTime, 'MM')
    return {
      user: message.user,
      month
    }
  })

  // Get unique months
  const uniqueMonths = _.uniq(_.map(conversations, 'month'))

  for (const uniqueMonth of uniqueMonths) {
    console.log(`MONTH RESULTS: ${uniqueMonth}`)
    const monthsConversations = _.filter(conversations, function (message) {
      return message.month === uniqueMonth
    })

    const countByusers = _.countBy(monthsConversations, 'user')

    const final = []
    for (const user of Object.entries(countByusers)) {
      const name = await fetchUser(user[0])
      const points = user[1]

      final.push({
        name,
        points
      })
    }

    const sorted = _.sortBy(final, function (e) {
      return e.name
    })

    console.log(sorted)
  }
}

getAllData()
