const { MessageEmbed } = require("discord.js");
const config = require("../config.json");
const complexError = require("../errors/complexError");
const db = require("better-sqlite3")("./events.db");

exports.settings = {
    name: "endevent",
    usage: "endevent [uuid]",
    examples: ["endevent 69adb819-e160-4e1a-a918-6d36706c153e"],
    description: "Ukončí hlasovanie, spočíta a vypíše hlasy.",
};

exports.execute = async (client, message, args) => {
    if (message.channel.type === "dm") {
        complexError(message.author, "Hlasovania sa nedá ukončiť cez DM");
        return;
    }
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
    var stmt = db.prepare("SELECT * FROM events WHERE id=?").bind(args[0]);

    if (stmt.get() === undefined) {
        complexError(message.channel, "Nesprávny identifikátor.");
        return;
    }

    if (
        stmt.get().owner !== message.author.id &&
        !message.member.hasPermission("ADMINISTRATOR")
    ) {
        complexError(
            message.channel,
            "Toto hlasovanie nemôžeš ukončiť, ukončit hlasovania môže iba admin alebo ten, čo ich vytvoril."
        );
        return;
    }

    const eventMessage = await message.channel.messages.fetch(
        stmt.get().message_id
    );

    var usersReactedYes = [];
    var usersReactedNo = [];

    await eventMessage.reactions.cache.get("👍").users.cache.forEach((user) => {
        if (user.id !== client.user.id)
            usersReactedYes.push(client.users.cache.get(user.id));
    });

    await eventMessage.reactions.cache.get("👎").users.cache.forEach((user) => {
        if (user.id !== client.user.id)
            usersReactedNo.push(client.users.cache.get(user.id).username);
    });

    const embed = new MessageEmbed()
        .setTitle("Hlasovanie ukončené")
        .setDescription(
            `👍:\n${
                usersReactedYes.length === 0
                    ? "Nikto"
                    : usersReactedYes.join(", ")
            }\n\n👎:\n${
                usersReactedNo.length === 0
                    ? "Nikto"
                    : usersReactedNo.join(", ")
            }`
        )
        .setColor(config.colors.normal);
    message.channel.send(embed);

    stmt = db.prepare("DELETE FROM events WHERE id=?").run(stmt.get().id);
};
