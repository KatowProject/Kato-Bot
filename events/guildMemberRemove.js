const Discord = require('discord.js');
const ELM = require('../database/schema/ELMs');

module.exports = async (client, member) => {

    if (member.guild.id === "510846217945743380") {
        client.channels.cache.get('636553126362742784').send(
            `${member.user}, Telah keluar dari Server ${member.guild.name}`
        )
    }

    if (member.guild.id === '336336077755252738') {

        const elm = await ELM.findOne({ userID: member.user.id });
        if (!user) return;

        client.channels.cache.get('336877836680036352').send(`Mods ada orang yang punya role ELM kabur, ini orangnya <@${elm.userID}`)

    }




}