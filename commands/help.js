const { MessageEmbed } = require("discord.js");
const fs = require("fs");

module.exports = async (client, message, args) => {
    var commands = [];
    fs.readdirSync("./commands").forEach((file) => {
        commands.push(file.split(".")[0]);
    });

    const embed = await new MessageEmbed()
        .setTitle("Help")
        .setDescription(`Available commands:\n${commands.join("\n")}`)
        .setColor(0x66cccc);
    message.author.send(embed);
    message.delete();
};
