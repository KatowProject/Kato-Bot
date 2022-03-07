module.exports = (client, queue, connection) => {
    console.log(`[${queue.guild.name}] Connection created with ${connection.channel.name}`);
}