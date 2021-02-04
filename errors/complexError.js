const { MessageEmbed } = require("discord.js");
const config = require("../config.json");

module.exports = async (user, msg) => {
    const embed = await new MessageEmbed()
        .setTitle("Error")
        .setDescription(msg)
        .setColor(config.colors.error);
    user.send(embed);
};
