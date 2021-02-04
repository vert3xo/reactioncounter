const { MessageEmbed } = require("discord.js");
const complexError = require("../errors/complexError");
const config = require("../config.json");
const fs = require("fs");

exports.settings = {
    name: "help",
    usage: "help [command]",
    examples: ["help help"],
    description: "Help with commands.",
};

exports.execute = async (client, message, args) => {
    var commands = [];
    fs.readdirSync("./commands").forEach((file) => {
        commands.push(file.split(".")[0]);
    });

    if (args[0] === null || args[0] === "" || args[0] === undefined) {
        const embed = await new MessageEmbed()
            .setTitle("Help")
            .setDescription(`Available commands:\n\`${commands.join("\n")}\``)
            .setColor(config.colors.normal);
        message.author.send(embed);
    } else {
        if (commands.indexOf(args[0]) <= -1) {
            complexError(message.author, "No help available for this command.");
            if (message.channel.type !== "dm") {
                message.delete();
            }
            return;
        }
        const command = require(`./${args[0]}`);
        const embed = await new MessageEmbed()
            .setTitle(`Help ${args[0]}`)
            .setDescription(
                `${command.settings.description}\n
                Usage: \n\`${
                    command.settings.usage
                }\`\n\nExample: \n\`${command.settings.examples.join("\n")}\``
            )
            .setColor(config.colors.normal);
        message.author.send(embed);
    }
    if (message.channel.type !== "dm") {
        message.delete();
    }
};
