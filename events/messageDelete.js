const Discord = require('discord.js');

module.exports = async (client, message) => {

    const dataAttachment = client.dataAttachment;

    if (message.author?.bot) return;
    if (message.attachments.size > 0) {

        const lastMessageID = message.author.lastMessageID;
        const data = dataAttachment.get(lastMessageID);
        if (!data) return;

        const attachment = new Discord.MessageAttachment(data.buffer).setName(data.filename);
        await client.channels.cache.get('795778462018830336').send(`**======Message Delete | ${message.author.tag}======**\n**User**: ${message.author}\n**Content**:\n${message.content ? message.content : 'Tidak ada Pesan'}\n**Location**: <#${message.channel.id}>\n**Attachment**:`, { files: [attachment] });
        dataAttachment.delete(lastMessageID);

    }

}