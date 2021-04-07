const { MessageEmbed } = require("discord.js");
const config = require("../config.json");

module.exports = async (dest, msg) => {
    const embed = await new MessageEmbed()
        .setTitle("Error")
        .setDescription(msg)
        .setColor(config.colors.error);
    dest.send(embed);
};
