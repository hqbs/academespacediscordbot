const express = require('express')
const app = express()
var cors = require('cors')
const bodyParser = require('body-parser')
const Discord = require('discord.js')
const client = new Discord.Client()

app.use(cors())
app.use(bodyParser.json())

require('dotenv').config()
const token = process.env.DISCORD_TOKEN

client.on('ready', () => {
  console.log('Discord bot up and running!')
})

client.on('message', message => {
  const tokens = message.content.split(' ')

  if (tokens[0] === '!setup' && message.member.hasPermission('ADMINISTRATOR')) {
    message.guild.roles.find(role => {
      if (role.name === '2. Professors') {
        message.guild.members
          .find(member => member.id === message.author.id)
          .addRole(role.id)
      }
      if (role.name === '3. Bots') {
        message.guild.members
          .find(member => member.id === client.user.id)
          .addRole(role.id)
      }
      if (role.name === '1. Students') {
        message.guild.members
          .find(
            member =>
              member.id !== client.user.id || member.id !== message.author.id
          )
          .addRole(role.id)
      }
    })
  }

  if (
    message.content == '!taopen' &&
    message.member.hasPermission('ADMINISTRATOR')
  ) {
    message.guild
      .createChannel(
        'TA Office (' + message.member.user.username + ')',
        'category'
      )
      .then(category => {
        message.guild
          .createChannel('ta-text', 'text')
          .then(channel => channel.setParent(category.id))
        message.guild
          .createChannel('ta-voice', 'voice')
          .then(channel => channel.setParent(category.id))
      })
  }

  if (
    message.content == '!taclose' &&
    message.member.hasPermission('ADMINISTRATOR')
  ) {
    message.guild.channels.forEach(channel => {
      if (
        channel.name === 'TA Office (' + message.member.user.username + ')' ||
        channel.name === 'ta-text' ||
        channel.name === 'ta-voice'
      ) {
        channel.delete()
      }
    })
  }

  if (
    message.content === '!channels' &&
    message.member.hasPermission('ADMINISTRATOR')
  ) {
    message.channel.sendMessage('______________________\n')
    message.guild.channels.forEach(channel => {
      message.channel.sendMessage(
        '**Channel Name:** \t' +
          channel.name +
          ' \n**Channel Type:**   \t' +
          channel.type +
          '\n______________________\n'
      )
    })
  }

  if (
    message.content === '!roles' &&
    message.member.hasPermission('ADMINISTRATOR')
  ) {
    message.channel.sendMessage('______________________\n')
    message.guild.roles.forEach(role => {
      if (role.name !== '@everyone') {
        message.channel.sendMessage(
          '**Role Name** \t' + role.name + '\n______________________\n'
        )
      }
    })
  }
})

app.get('/status', (req, res) => {
  res.json({
    status: client.status
  })
})

app.get('/guilds', (req, res) => {
  let servers = []

  client.guilds.map(server => {
    servers.push({ name: server.toString(), id: server.id })
  })

  res.json({
    servers: servers
  })
})

app.get('/officehours/open/:server', (req, res) => {
  let server = client.guilds.find(s => s.id === req.params.server)

  res.send('Success')
})

app.get('/officehours/close/:server', (req, res) => {
  let server = client.guilds.find(s => s.id === req.params.server)

  res.send('Success')
})

app.listen(8000, () => {
  console.log('Server is up on port ' + 8000)
})

client.login(token)
