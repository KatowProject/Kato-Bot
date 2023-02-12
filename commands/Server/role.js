const { ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

exports.run = async (client, message, args) => {
    try {
        const embed = new EmbedBuilder()
            .setColor('#ff8d07')
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ forceStatic: true, size: 4096 }) })
            .setDescription(`
                **Selamat datang di server kami, Perkumpulan Orang Santai!**\n\nBerdiri sejak 2018, Perkumpulan Orang Santai (POS) hadir memberikan kalian tempat yang santai dan nyaman untuk berbincang dengan sesama member lainnya. Selain itu, POS menyediakan ruang dengan topik utama yang berbeda-beda (anime, tech, game, meme, dll.) sesuai dengan hobi kalian. Sebagai satu keluarga, kita berharap kalian semua bisa saling respect satu sama lain, serta taat pada aturan yang berlaku.\n\nUntuk mengakses server ini, kalian pahami dahulu dengan rules server <#932997959388385392>. Setelah itu, silahkan pencet emot (<:santai:1061950814316417054>) dibawah pesan ini untuk mendapatkan role <@&1074184657693851688> agar bisa mengakses channel lainnya.\n\n> *"Saya sudah klik tapi kenapa tetap tidak bisa masuk?"*
                > Ada tiga kemungkinan masalah yang terjadi:
                > \`1.\` Harap ditunggu sekitar 5 menit terlebih dahulu, karena terkadang tidak secara instan diberikan.
                > \`2.\` Kamu belum verifikasi handphone, solusinya adalah verifikasi terlebih dahulu;
                > \`3.\` Discord kamu sedang mengalami bug, solusinya adalah restart aplikasinya.\nApabila sudah dilakukan seperti diatas tetapi masih belum bisa, silahkan hubungi <@&932997958834733082>, <@&932997958834733079>, <@&932997958834733078> yang sedang aktif.
                \nSelamat bergabung dan seperti biasa, tetaplah santai~
            `)
            .setImage('https://cdn.discordapp.com/attachments/1013977865756356658/1074231131278430268/POS_Role_Akses.png')
        const button = new ActionRowBuilder()
            .addComponents([
                new ButtonBuilder().setEmoji('<:santai:1061950814316417054>').setStyle(ButtonStyle.Primary).setCustomId(`santai`)
            ]);

        message.channel.send({ embeds: [embed], components: [button] });
    } catch (err) {
        message.channel.send(err.message);
    }
};

exports.conf = {
    aliases: [],
    cooldown: 5,
    location: __filename
}

exports.help = {
    name: 'role',
    description: 'Menampilkan daftar role yang tersedia',
    usage: 'role',
    example: 'role'
}