const express = require('express')
const app = express()
var cors = require('cors')
const bodyParser = require('body-parser')
const Discord = require('discord.js')
const client = new Discord.Client()
const axios = require('axios')

const IP = '35.192.87.46:4000'

app.use(cors())
app.use(bodyParser.json())

require('dotenv').config()
const token = process.env.DISCORD_TOKEN

client.on('ready', () => {
  console.log('Discord bot up and running!')
})

client.on('message', message => {
  const tokens = message.content.split(' ')

  if (
    tokens[0] === '!setup' &&
    tokens[1] !== null &&
    message.member.hasPermission('ADMINISTRATOR')
  ) {
    message.guild.roles.find(role => {
      if (role.name === '2. Instructors') {
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

    message.guild.channels.forEach(channel => {
      if (channel.name === 'command-book') {
        client.channels
          .get(channel.id)
          .send(
            '**Command List**\n```!openoffice - Allows students to access office channels```\n```!closeoffice - Closes the office from students```\n```!next - Automatically moves the next person in line in the waiting room channel```\nYou can also run these commands from our web portal! (http://academe.space)'
          )
      }
    })

    const verification = tokens[1]
    const serverID = message.guild.id
    const ownerID = message.author.id
    axios
      .get(
        'http://' +
          IP +
          '/graphql?query=mutation+_{createserverd(token:"' +
          verification +
          '", professordcordid: "' +
          ownerID +
          '", dcordserverid: "' +
          serverID +
          '"){success errors token}}'
      )
      .then(res => {
        const success = res.data.data.createserverd.token

        if (success) {
          message.reply(
            'Your server is now connected to our platform. **Please go back to the website and click "Create Server" to complete the process!**'
          )
        } else {
          message.reply(
            'Server setup has failed! Code may be expired. Please try again.'
          )
        }
      })
  }

  if (
    message.content == '!openoffice' &&
    message.member.hasPermission('ADMINISTRATOR')
  ) {
    message.guild.roles.forEach(role => {
      if (role.name === '1. Students') {
        message.guild.channels.forEach(channel => {
          if (channel.name === "Professor's Office") {
            channel.overwritePermissions(role, {
              VIEW_CHANNEL: true,
              SEND_MESSAGES: true
            })
            message.reply('Office Hours are now in Session!')
          }
        })
      }
    })
  }

  if (
    message.content == '!closeoffice' &&
    message.member.hasPermission('ADMINISTRATOR')
  ) {
    message.guild.roles.forEach(role => {
      if (role.name === '1. Students') {
        message.guild.channels.forEach(channel => {
          if (channel.name === "Instructor's Office") {
            channel.overwritePermissions(role, {
              VIEW_CHANNEL: false,
              SEND_MESSAGES: false
            })
            message.reply('Office Hours are now closed!')
          }
        })
      }
    })
  }

  if (
    message.content == '!next' &&
    message.member.hasPermission('ADMINISTRATOR')
  ) {
    message.guild.channels.forEach(channel => {
      if (channel.name === 'instructor-voice') {
        let officeLine = []
        message.guild.members.forEach(member => {
          if (member.voiceChannel != null || member.voiceChannel === '') {
            if (!member.hasPermission('ADMINISTRATOR')) {
              officeLine.push(member)
            }
          }
        })

        if (officeLine == 0) {
          message.reply('The line is empty!')
        } else {
          const student =
            officeLine[Math.floor(Math.random() * officeLine.length)]

          student.setVoiceChannel(channel)
          message.reply('@' + student.displayName + ', you are up!')
        }
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

app.get('/next/:server', (req, res) => {
  let server = client.guilds.find(s => s.id === req.params.server)

  server.channels.forEach(channel => {
    if (channel.name === 'instructor-voice') {
      let officeLine = []
      server.members.forEach(member => {
        if (member.voiceChannel != null || member.voiceChannel === '') {
          if (!member.hasPermission('ADMINISTRATOR')) {
            officeLine.push(member)
          }
        }
      })

      if (officeLine == 0) {
        server.channels.forEach(channel => {
          if (channel.name === 'bot-spam') {
            client.channels.get(channel.id).send('The line is empty!')
          }
        })
      } else {
        const student =
          officeLine[Math.floor(Math.random() * officeLine.length)]

        student.setVoiceChannel(channel)
        server.channels.forEach(channel => {
          if (channel.name === 'bot-spam') {
            client.channels
              .get(channel.id)
              .send("@' + student.displayName + ', you are up!")
          }
        })
        message.reply()
      }
    }
  })

  res.send('Success')
})

app.listen(8000, () => {
  console.log('Server is up on port ' + 8000)
})

client.login(token)
