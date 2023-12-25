const { Client, Message, EmbedBuilder } = require('discord.js');
const ms = require('ms');
/**
 * @param {Client} client
 * @param {Message} donatur
*/

module.exports = async (client, donatur) => {
    switch (donatur.status) {
        case 'expired':
            donatur.member.send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: donatur.guild.name, iconURL: donatur.guild.iconURL({ dynamic: true }) })
                        .setTitle('Donatur Expired')
                        .setDescription(`Donatur kamu di server **${donatur.guild.name}** telah habis, terima kasih telah berdonasi!`)
                        .setColor('Random')
                        .setTimestamp()
                        .setFooter({ text: `Donatur Expired | ${donatur.member.user.tag}`, iconURL: donatur.member.user.displayAvatarURL({ dynamic: true }) }),
                ]
            });
            break;

        case 'no role':
            donatur.member.send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: donatur.guild.name, iconURL: donatur.guild.iconURL({ dynamic: true }) })
                        .setTitle('Donatur out server / no role')
                        .setDescription(`Donatur kamu di server **${donatur.guild.name}** telah dicabut karna keluar dari server atau tidak memiliki role, terima kasih telah berdonasi!`)
                        .setColor('Random')
                        .setTimestamp()
                        .setFooter({ text: `Donatur Expired | ${donatur.member.user.tag}`, iconURL: donatur.member.user.displayAvatarURL({ dynamic: true }) }),
                ]
            });
            break;

        case 'success':
            if (donatur.type === 'addDonaturBooster') {
                donatur.member.send({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: donatur.guild.name, iconURL: donatur.guild.iconURL({ dynamic: true }) })
                            .setTitle('New Donatur Booster')
                            .setDescription(`Terima kasih telah berdonasi di server **${donatur.guild.name}**!`)
                            .setColor('Random')
                            .setTimestamp()
                            .setFooter({ text: `Donatur Booster | ${donatur.member.user.tag}`, iconURL: donatur.member.user.displayAvatarURL({ dynamic: true }) }),
                    ]
                });

                client.channels.cache.get('1013977865756356658').send(`\`${donatur.member.user.tag}\` terdaftar sebagai booster baru.`);
            } else if (donatur.type === 'addDonatur') {
                donatur.member.send({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: donatur.guild.name, iconURL: donatur.guild.iconURL({ dynamic: true }) })
                            .setTitle('New Donatur')
                            .setDescription(`Terima kasih telah berdonasi di server **${donatur.guild.name}**!\nDurasi donasi kamu adalah **${ms(donatur.data.duration, { long: true })}**`)
                            .setColor('Random')
                            .setTimestamp()
                            .setFooter({ text: `Donatur | ${donatur.member.user.tag}`, iconURL: donatur.member.user.displayAvatarURL({ dynamic: true }) }),
                    ]
                });
            }
            break;

        case 'extend':
            donatur.member.send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: donatur.member.user.tag, iconURL: donatur.member.user.displayAvatarURL({ size: 4096, forceStatic: true }) })
                        .setTitle('Donatur Extended')
                        .setDescription(`Donatur kamu di server **${donatur.guild.name}** telah diperpanjang selama **${ms(donatur.data.duration, { long: true })}**, terima kasih atas donasi kamu!`)
                        .setColor('Random')
                        .setTimestamp()
                        .setFooter({ text: donatur.guild.name, iconURL: donatur.guild.iconURL({ size: 4096, forceStatic: true }) }),
                ]
            });
            break;
        default:
            break;
    }
}