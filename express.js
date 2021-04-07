const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const path = require("path");
const PORT = 3000;

module.exports = async (client) => {
    app.set("view engine", "ejs");

    const token =
        "$2b$10$QeZyB0cQnbYUKk1nqtJkPe0PxOfcE.bHloqQvJupXnUQSyJfClCle";

    app.get("/", (req, res) => {
        res.send(
            "<title>Vote Counter C&C Server</title>C&C Server for Discord Vote Counter Bot"
        );
    });

    app.get("/message", (req, res) => {
        if (
            req.query.channel === null ||
            req.query.channel === undefined ||
            req.query.channel === "" ||
            req.query.message === null ||
            req.query.message === undefined ||
            req.query.message === ""
        ) {
            res.send("Missing arguments.");
            return;
        }
        if (
            req.query.token === null ||
            req.query.token === undefined ||
            req.query.token === "" ||
            !bcrypt.compareSync(req.query.token, token)
        ) {
            res.send("Unauthorized.");
            return;
        }
        const channelId = client.channels.cache.get(req.query.channel);
        if (channelId === null || channelId === undefined || channelId === "") {
            res.send("Invalid channel ID.");
            return;
        }

        channelId.send(req.query.message);
        res.send("Message sent.");
    });

    app.get("/audit_log", async (req, res) => {
        if (
            req.query.server === null ||
            req.query.server === undefined ||
            req.query.server === ""
        ) {
            res.send("Missing arguments.");
            return;
        }
        if (
            req.query.token === null ||
            req.query.token === undefined ||
            req.query.token === "" ||
            !bcrypt.compareSync(req.query.token, token)
        ) {
            res.send("Unauthorized.");
            return;
        }

        const id = req.query.server;
        const server = client.guilds.cache.get(id);
        const log = [];
        const auditLog = (await server.fetchAuditLogs()).entries;
        auditLog.forEach((e) => {
            log.push(e);
        });

        res.render("index", { entries: log, server: server });
    });

    app.listen(PORT, () => {
        console.log(`Web interface listening on port ${PORT}.`);
    });
};
