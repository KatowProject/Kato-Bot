let discord = require('discord.js')

let kato = {
    pagi: 'https://cdn.discordapp.com/attachments/519859252966457369/735116914824839260/110140615_150280596646304_2112518845859829677_o.jpg',
    siang: 'https://cdn.discordapp.com/attachments/519859252966457369/735131890456985600/109459511_150278073313223_9220051722149059691_o.png',
    sore: 'https://cdn.discordapp.com/attachments/519859252966457369/735117020898525184/109509537_148938896780474_5364768492484447741_o.jpg',
    petang: 'https://www.kaorinusantara.or.id/wp-content/uploads/2017/06/saekano-flat-11-0004.jpg',
    malam: 'https://cdn.discordapp.com/attachments/447408276628307969/735125909031616522/horriblesubs-saekano-s2-08-720p-mkv_snapshot_20-44_2017-06-03_23-11-36.png',
    tengah: 'https://nijipoi.com/wp-content/uploads/2017/06/02/45-1024x576.jpg',
    dini: 'https://magnavalon.files.wordpress.com/2017/06/horriblesubs-saekano-s2-08-720p-mkv_snapshot_21-14_2017-06-04_00-57-34.jpg?w=648'

}

module.exports = (client, message) => {

    let embed = new discord.MessageEmbed().setColor(client.warna.kato)
    let jam = new Date().getHours()
    let menit = new Date().getMinutes()
    let channel = '753219182967128154'

    if (jam == 6 && menit == 0) {
        embed.setImage(kato.pagi)
        client.channels.cache.get(channel)
            .send('Hai, Selamat Pagi! \nSemoga Harimu Menyenangkan! ( •̀ ω •́ )y', embed)
    }
    if (jam == 10 && menit == 0) {
        embed.setImage(kato.siang)
        client.channels.cache.get(channel)
            .send('Hai, Selamat Siang!\nJangan lupa makan dulu ya, jangan sampai lemes! O(∩_∩)O', embed)
    }
    if (jam == 15 && menit == 0) {
        embed.setImage(kato.sore)
        client.channels.cache.get(channel)
            .send('Hai, Selamat Sore!\nSemoga bisa menikmati harimu! (≧∇≦)ﾉ', embed)
    }
    if (jam == 18 && menit == 0) {
        embed.setImage(kato.petang)
        client.channels.cache.get(channel)
            .send('Hai, Selamat Petang!\nIstirahatlah jika kamu lelah! o(*^▽^*)┛', embed)
    }
    if (jam == 20 && menit == 00) {
        embed.setImage(kato.malam)
        client.channels.cache.get(channel)
            .send('Hai, Selamat Malam\nJangan bergadang jika tidak penting ya!\nSelalu Jaga Kesehatan ya! ( •̀ ω •́ )✧', embed)
    }
    if (jam == 0 && menit == 0) {
        embed.setImage(kato.tengah)
        client.channels.cache.get(channel)
            .send('Hai, sudah masuk pergantian hari nih.\nSemoga sehat selalu ya! (*^▽^*)', embed)
    }
    if (jam == 3 && menit == 0) {
        embed.setImage(kato.dini)
        client.channels.cache.get(channel)
            .send('Hai, sudah masuk Dini Hari nih.\nJika kamu terbangun, jangan lupa Sholat Tahajud dulu ya! ヾ(≧▽≦*)o', embed)
    }
}