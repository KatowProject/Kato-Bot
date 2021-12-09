module.exports = (client, queue) => {
    queue.metadata.send("Bot telah keluar dari Voice Channel, membersihkan queue...");
}