const db = require("better-sqlite3")("./events.db");
const { MessageEmbed } = require("discord.js");
const complexError = require("../errors/complexError");
const config = require("../config.json");

exports.settings = {
    name: "list",
    usage: "list",
    examples: ["list"],
    description: "Zobrazí dostupné hlasovania.",
};

exports.execute = async (client, message, args) => {
    if (message.channel.type === "dm") {
        complexError(message.author, "Hlasovania sa nedajú zobraziť cez DM");
        return;
    }
    if (!message.member.hasPermission("ADMINISTRATOR")) {
        complexError(
            message.author,
            "Zobraziť hlasovania môže iba administrátor."
        );
        message.delete();
        return;
    }

    var data = db.prepare("SELECT * FROM events").all();
    if (data.length === 0) {
        complexError(message.author, "Neexistujú žiadne hlasovania.");
        if (message.channel.type !== "dm") {
            message.delete();
        }
        return;
    }

    const embed = await new MessageEmbed().setTitle("Hlasovania");
    const events = [];

    data.forEach((event) => {
        events.push(
            `Identifier: ${event.id}\nOwner ID: ${event.owner}\nMessage ID: ${event.message_id}\nMessage: ${event.message}`
        );
    });

    embed.setDescription(events.join("\n\n")).setColor(config.colors.success);

    message.author.send(embed);

    if (message.channel.type !== "dm") {
        message.delete();
    }
};
