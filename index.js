const Discord = require('discord.js')
const client = new Discord.Client()

require('dotenv').config()
const token = process.env.DISCORD_TOKEN

client.on('ready', () => {
  console.log('Discord bot up and running!')
})

client.on('message', message => {
  if (
    message.content === '!setup' &&
    message.member.hasPermission('ADMINISTRATOR')
  ) {
    if (message.guild.roles.find(role => role.name === 'Bots') == null) {
      message.channel.sendMessage('Phase 1: Server Building Bots Role')
      message.guild
        .createRole({ name: 'Bots', hoist: true, color: '#faff00' })
        .then(botRole => {
          // The bots ID
          let botId = client.user.id

          // Setting the Bots role
          message.guild.members
            .find(member => member.id === botId)
            .addRole(botRole.id)

          // Building Professor role
          message.channel.sendMessage('Phase 2: Server Building Professor Role')

          // Setting up Professor Role
          message.guild
            .createRole({ name: 'Professors', hoist: true, color: '#c21c1c' })
            .then(professorRole => {
              // Getting up professor id
              let professorId = message.member.id

              // Setting up Professors role
              message.guild.members
                .find(member => member.id === professorId)
                .addRole(professorRole.id)
            })

          // End of Setup
          message.channel.sendMessage('Server building is complete!')
        })
        .catch(console.error)

      //   message.guild
      //     .createRole({ name: 'Teaching Assistants', hoist: true })
      //     .then(role => {
      //       console.log(`Created role ${role}`)
      //     })

      //   message.guild.createRole({ name: 'Students', hoist: true }).then(role => {
      //     console.log(`Created role ${role}`)
      //   })
    } else {
      message.channel.sendMessage('Exit: Server already built')
    }
  } else if (
    message.content == '!destroy' &&
    message.member.hasPermission('ADMINISTRATOR')
  ) {
    message.guild.roles
      .find(role => role.name === 'Bots')
      .delete()
      .then(r => {
        message.channel.sendMessage('Phase 1: Destroying Bots Role')

        message.guild.roles
          .find(role => role.name === 'Professors')
          .delete()
          .then(r => {
            message.channel.sendMessage('Phase 2: Destroying Professors Role')
            message.channel.sendMessage('Exit: Server Destroyed')
          })
      })
  }
})

client.login(token)
