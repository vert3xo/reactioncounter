const { MessageEmbed } = require("discord.js");
const complexError = require("../errors/complexError");
const config = require("../config.json");
const { v4: uuid } = require("uuid");
const db = require("better-sqlite3")("./events.db");

exports.settings = {
    name: "addevent",
    usage: "addevent [message]",
    examples: ["addevent Among Us o 20:00", "addevent Valorant o 17:00"],
    description: "Creates an event",
};

exports.execute = async (client, message, args) => {
    if (args[0] === null || args[0] === "" || args[0] === undefined) {
        complexError(
            message.author,
            `Missing arguments, use \`${process.env.COMMAND_PREFIX}help ${this.settings.name}\`.`
        );
        if (message.channel.type !== "dm") {
            message.delete();
        }
        return;
    }

    if (args.join(" ").length > 255) {
        complexError(
            message.author,
            `Maximum number of characters allowed is 255, your message if ${
                args.join(" ").length
            } characters long.`
        );
        if (message.channel.type !== "dm") {
            message.delete();
        }
        return;
    }

    const eventId = uuid();
    const insert = db.prepare(
        "INSERT INTO events(id, owner, message_id, message) VALUES(?, ?, ?, ?)"
    );

    const embed = await new MessageEmbed()
        .setTitle("Event")
        .setDescription(`**${args.join(" ")}**`)
        .setColor(config.colors.normal);
    message.channel.send(embed).then(async (m) => {
        insert.run(
            eventId.toString(),
            message.author.id.toString(),
            m.id,
            args.join(" ")
        );
        await m.react("👍");
        await m.react("👎");
    });

    const id = await new MessageEmbed()
        .setTitle("Event Identified")
        .setDescription(`Identifier: ${eventId}`)
        .setColor(config.colors.success);
    message.author.send(id);
};
