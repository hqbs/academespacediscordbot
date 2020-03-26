const Discord = require("discord.js");
const client = new Discord.Client();

require("dotenv").config();
const token = process.env.DISCORD_TOKEN;

client.on("ready", () => {
  console.log("Discord bot up and running!");
});

client.on("message", message => {
  if (
    message.content === "!setup" &&
    message.member.hasPermission("ADMINISTRATOR")
  ) {
    if (message.guild.roles.find(role => role.name === "Bots") == null) {
      message.channel.sendMessage("Status: Building Server");
      message.guild
        .createRole({ name: "Bots", hoist: true, color: "#faff00" })
        .then(botRole => {
          // The bots ID
          let botId = client.user.id;

          // Setting the Bots role
          message.guild.members
            .find(member => member.id === botId)
            .addRole(botRole.id);

          // Setting up Professor Role
          message.guild
            .createRole({ name: "Professors", hoist: true, color: "#c21c1c" })
            .then(professorRole => {
              // Getting up professor id
              let professorId = message.member.id;

              // Setting up Professors role
              message.guild.members
                .find(member => member.id === professorId)
                .addRole(professorRole.id);
            });

          message.guild
            .createRole({ name: "Students", hoist: true, color: "#30ac02" })
            .then(role => {
              // Add student role to all students
              message.guild.members
                .find(member => !member.hasPermission("ADMINISTRATOR"))
                .addRole(role.id);

              message.guild
                .createChannel("Classroom", "category")
                .then(category => {
                  message.guild
                    .createChannel("announcements", "text")
                    .then(channel => channel.setParent(category.id));
                  message.guild
                    .createChannel("general", "text")
                    .then(channel => channel.setParent(category.id));
                });

              message.guild
                .createChannel("Professor's Office", "category")
                .then(category => {
                  message.guild
                    .createChannel("professor-text", "text")
                    .then(channel => channel.setParent(category.id));
                  message.guild
                    .createChannel("professor-voice", "voice")
                    .then(channel => channel.setParent(category.id));
                });

              // End of Setup
              message.channel.sendMessage("Status: Server built successfully");
            });
        })
        .catch(console.error);
    } else {
      message.channel.sendMessage("Status: Server Build Failed");
    }
  }

  if (
    message.content == "!nuke" &&
    message.member.hasPermission("ADMINISTRATOR")
  ) {
    message.guild.roles
      .find(role => role.name === "Bots")
      .delete()
      .then(r => {
        message.channel.sendMessage("Status: Nuking the Server");

        message.guild.roles
          .find(role => role.name === "Professors")
          .delete()
          .then(r => {
            message.guild.roles
              .find(role => role.name === "Students")
              .delete()
              .then(r => {
                message.guild.channels.forEach(channel => {
                  if (channel.name !== "test") {
                    channel.delete();
                  }
                });
              });
          });
      });
  }
  if (
    message.content == "!taopen" &&
    message.member.hasPermission("ADMINISTRATOR")
  ) {
    message.guild
      .createChannel(
        "TA Office (" + message.member.user.username + ")",
        "category"
      )
      .then(category => {
        message.guild
          .createChannel("ta-text", "text")
          .then(channel => channel.setParent(category.id));
        message.guild
          .createChannel("ta-voice", "voice")
          .then(channel => channel.setParent(category.id));
      });
  }

  if (
    message.content == "!taclose" &&
    message.member.hasPermission("ADMINISTRATOR")
  ) {
    message.guild.channels.forEach(channel => {
      if (
        channel.name === "TA Office (" + message.member.user.username + ")" ||
        channel.name === "ta-text" ||
        channel.name === "ta-voice"
      ) {
        channel.delete();
      }
    });
  }

  if (
    message.content === "!channels" &&
    message.member.hasPermission("ADMINISTRATOR")
  ) {
    message.channel.sendMessage("______________________\n");
    message.guild.channels.forEach(channel => {
      message.channel.sendMessage(
        "**Channel Name:** \t" +
          channel.name +
          " \n**Channel Type:**   \t" +
          channel.type +
          "\n______________________\n"
      );
    });
  }

  if (
    message.content === "!roles" &&
    message.member.hasPermission("ADMINISTRATOR")
  ) {
    message.channel.sendMessage("______________________\n");
    message.guild.roles.forEach(role => {
      if (role.name !== "@everyone") {
        message.channel.sendMessage(
          "**Role Name** \t" + role.name + "\n______________________\n"
        );
      }
    });
  }
});

client.login(token);
