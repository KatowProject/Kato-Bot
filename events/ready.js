const { Collection } = require("discord.js");

module.exports = client => {
    console.log(`${client.user.username} Ready!`);

    /* Collection Attachment */
    setInterval(() => client.cache = new Collection(), 300_000);
}