const DiscordCanvas = require('../index');
const fs = require('fs');
const donaturNotification = new DiscordCanvas().loadDonaturNotification();

(async () => {
    donaturNotification.setUsername('anotherwestminster');
    donaturNotification.setSupportMessage('Thank you for supporting me!');
    donaturNotification.setDonation(100);
    donaturNotification.setDate(new Date());
    donaturNotification.setNominal(donaturNotification.donation * 10000);

    await donaturNotification.setAvatar('https://cdn.discordapp.com/avatars/336374843324760070/a1900fd2588ad922acd8162551ea15a6.png?size=4096');

    const buffer = await donaturNotification.generate();
    fs.writeFileSync('test.png', buffer);
})();
