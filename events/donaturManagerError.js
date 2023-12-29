module.exports = async (client, donatur) => {
    switch (donatur.type) {
        case 'donaturNotification':
            client.channels.cache.get('1013977865756356658').send(`Telah terjadi kesalahan pada sistem donatur, error: \`${donatur.error}\``);
            break;

        case 'donaturLeaderboardAnnouncement':
            client.channels.cache.get('1013977865756356658').send(`Telah terjadi kesalahan pada sistem donatur, error: \`${donatur.error}\``);
            break;
    }
}