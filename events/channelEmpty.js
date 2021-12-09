module.exports = (client, queue) => {
    queue.metadata.send(`Tidak ada satupun yang bergabung dengan channel ini, keluar dari channel...`);
}