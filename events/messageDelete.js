module.exports = async (client, message) => {
    if (!message && message.author?.bot) return;
    const files = client.cacheAttachments;

    if (message.mentions.members.size > 0 || message.mentions.roles.size > 0) require('../plugin/ghostTag.js')(client, message);
    if (message.attachments.size > 0) {
        const file = files.get(message.id);
        const target = client.config.channel["message-delete"];
        await client.channels.cache.get(target).send({ content: `**======Message Delete | ${message.author.tag}======**\n**User**: <@${message.author.id}>\n**Content**:\n${message.content ? message.content : 'Tidak ada Pesan'}\n**Location**: <#${message.channel.id}>\n**Attachment**:`, files: [file] });

        files.delete(message.id);
    }

}