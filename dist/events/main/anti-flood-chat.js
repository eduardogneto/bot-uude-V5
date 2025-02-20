"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Event_1 = require("../../structs/types/Event");
const __1 = require("../..");
const members = new discord_js_1.Collection();
exports.default = new Event_1.Event({
    name: "messageCreate",
    async run(message) {
        if (!message.inGuild())
            return;
        if (message.author.bot)
            return;
        if (message.author.id === message.guild.ownerId)
            return;
        if (message.member?.permissions.has('Administrator'))
            return;
        const { author, channel, member } = message;
        const cout = members.get(author.id);
        if (!cout) {
            members.set(author.id, 1);
            return;
        }
        const newCount = cout + 1;
        members.set(author.id, newCount);
        if (newCount > 5) {
            members.delete(author.id);
            member?.timeout(60_000, "Flood de messagens ");
            const embed = new discord_js_1.EmbedBuilder({
                description: `${author} evite o flood de messagens por favor! 
                > leia as regras do servido para evitar punições severas
                ${(0, discord_js_1.italic)("Voce porderá enviar messagens em breve...")}`
            }).setColor(__1.config.colors.red);
            const message = await channel.send({ content: `||${author}||`, embeds: [embed] });
            setTimeout(() => message.delete().catch(() => { }), 60_000);
            return;
        }
        setTimeout(() => {
            const currCout = members.get(author.id);
            if (!currCout)
                return;
            members.set(author.id, currCout - 1);
        }, 6000);
    }
});
