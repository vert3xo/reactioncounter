const { MessageEmbed } = require("discord.js");
const complexError = require("../errors/complexError");
const config = require("../config.json");
const { v4: uuid } = require("uuid");
const db = require("better-sqlite3")("./events.db");

exports.settings = {
    name: "addevent",
    usage: "addevent [message]",
    examples: ["addevent Among Us o 20:00", "addevent Valorant o 17:00"],
    description: "Vytvorí oznámenie.",
};

exports.execute = async (client, message, args) => {
    if (args[0] === null || args[0] === "" || args[0] === undefined) {
        complexError(
            message.author,
            `Chýbajúce argumenty, použi \`${process.env.COMMAND_PREFIX}help ${this.settings.name}\` pre pomoc.`
        );
        if (message.channel.type !== "dm") {
            message.delete();
        }
        return;
    }

    if (args.join(" ").length > 255) {
        complexError(
            message.author,
            `Maximálny počet znakov je 255, tvoja správa má ${
                args.join(" ").length
            } znakov.`
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
        .setTitle("Hlasovanie")
        .setDescription(`**@everyone ${args.join(" ")}**`)
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
        await m.react("🤷");
    });

    if (message.channel.type !== "dm") {
        message.delete();
    }

    const id = await new MessageEmbed()
        .setTitle("Event Identifier")
        .setDescription(`Identifier: \`${eventId}\``)
        .setColor(config.colors.success);
    message.author.send(id);
};
