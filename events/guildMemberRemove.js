module.exports = (client, member) => {
    if (member.guild.id === "510846217945743380") {
        client.channels.cache.get('636553126362742784').send(
            `${member.user}, Telah keluar dari Server ${member.guild.name}`
        )
    }






}