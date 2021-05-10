const Discord = require('discord.js');

module.exports = async (client, message) => {

    if (!message && message.author?.bot) return;

    const dataAttachment = client.dataAttachment;

    if (message.mentions.members.size > 0 || message.mentions.roles.size > 0) require('../plugin/ghostTag.js')(client, message);
    if (message.attachments.size > 0) {

        const lastMessageID = message.author.lastMessageID;
        const data = dataAttachment.get(lastMessageID);
        if (!data.buffer && !data.filename) return;
        const attachment = new Discord.MessageAttachment(data.buffer)
            .setName(data.filename)
        console.log(attachment);
        await client.channels.cache.get('795778462018830336').send(`**======Message Delete | ${message.author.tag}======**\n**User**: ${message.author}\n**Content**:\n${message.content ? message.content : 'Tidak ada Pesan'}\n**Location**: <#${message.channel.id}>\n**Attachment**:`, { files: [attachment] });
        dataAttachment.delete(lastMessageID);

    }

}