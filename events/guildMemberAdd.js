module.exports = (client, member) => {
    if (member.guild.id === "510846217945743380") {
        client.channels.cache.get('636553126362742784').send(
            `Hai ${member.user}, Selamat Datang di Server ${member.guild.name}`
        )
        member.roles.add('511177887739543552')
    }


}