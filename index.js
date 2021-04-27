require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const complexError = require("./errors/complexError");
const fs = require("fs");
require("./express")(client);

const botToken = process.env.TOKEN;

client.on("ready", () => {
    client.user.setPresence({
        activity: {
            name: `this server, use ${process.env.COMMAND_PREFIX}help`,
            type: "WATCHING",
        },
    });
    console.log(`Logged in as ${client.user.tag}`);
});

var commands = [];
fs.readdirSync("./commands").forEach((file) => {
    commands.push(file.split(".")[0]);
});

client.on("guildMemberAdd", (member) => {
    var guild = member.guild.members.guild;
    guild.roles.cache.forEach((role) => {
        if (role.name === "Members") {
            member.roles.add(role);
            return;
        }
    });
});

client.on("message", (msg) => {
    if (msg.content.startsWith(process.env.COMMAND_PREFIX)) {
        const command = msg.content
            .split(process.env.COMMAND_PREFIX)[1]
            .split(" ");
        if (commands.indexOf(command[0]) > -1) {
            require(`./commands/${command[0]}`).execute(
                client,
                msg,
                command.slice(1)
            );
        } else {
            complexError(
                msg.author,
                `Neznámy príkaz, použi \`${process.env.COMMAND_PREFIX}help\` pre zobrazenie dostupných príkazov.`
            );
            if (msg.channel.type !== "dm") {
                msg.delete();
            }
        }
    }
});

client.login(botToken);
