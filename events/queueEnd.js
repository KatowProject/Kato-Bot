module.exports = (client, queue) => {
    queue.metadata.send(`Queue ended.`);
}