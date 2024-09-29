const DiscordCanvas = require('../');
const fs = require('fs');
const boosterNotification = new DiscordCanvas().loadBoosterNotification();

(async () => {
    try {
        boosterNotification.setUsername('anotherwestminster');
        boosterNotification.setDate(new Date());

        console.log(boosterNotification.username);

        await boosterNotification.setAvatar('https://cdn.discordapp.com/avatars/336374843324760070/a1900fd2588ad922acd8162551ea15a6.png?size=4096');

        const buffer = await boosterNotification.generate();
        fs.writeFileSync('test2.png', buffer);
    } catch (error) {
        console.log(error);
    }
})();