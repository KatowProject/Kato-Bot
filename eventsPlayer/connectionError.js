module.exports = (client, queue, error) => {
    console.log(error);
    console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
}