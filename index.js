require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");

const botToken = process.env.TOKEN;

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

var commands = [];
fs.readdirSync("./commands").forEach((file) => {
    commands.push(file.split(".")[0]);
});

client.on("message", (msg) => {
    if (msg.content.startsWith(process.env.COMMAND_PREFIX)) {
        const command = msg.content
            .split(process.env.COMMAND_PREFIX)[1]
            .split(" ");
        if (command.indexOf(command[0]) > -1) {
            require(`./commands/${command[0]}`)(client, msg, command.slice(1));
        }
    }
});

client.login(botToken);
