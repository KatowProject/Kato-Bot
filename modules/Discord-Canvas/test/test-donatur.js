const DiscordCanvas = require('../index');
const fs = require('fs');
const donaturNotification = new DiscordCanvas().loadDonaturNotification();

(async () => {
    donaturNotification.setUsername('Rizky');
    donaturNotification.setSupportMessage('Support message');
    donaturNotification.setDonation('Donation');
    donaturNotification.setDate('Date');
    donaturNotification.setNominal('Nominal');

    await donaturNotification.setAvatar('https://cdn.discordapp.com/avatars/458342161474387999/22926c692b8669497cee8836d8ba530d.png?size=4096');

    const buffer = await donaturNotification.generate();
    fs.writeFileSync('test.png', buffer);
})();
