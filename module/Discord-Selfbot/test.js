const Discord = require('./index.js');
const client = new Discord({ api: 'https://discord.com/api/v9', token: 'NzUwMjM0MTAxMTIxODEwNDM1.YjJ3NA.VFH5_5p-Er7vfvhdrN-kKAWF82Y' });


// Test 1: getMessages
const channel = '932997960923480101';
const limit = 10;
const messageid = '953699252012462090';
const token = ['NzUwMjM0MTAxMTIxODEwNDM1.YjJ3NA.VFH5_5p-Er7vfvhdrN-kKAWF82Y', 'MzUzNDE5NzIyOTQ1MDY5MDY3.YjKI3g.aczZnyrPsXj_Ct06epuXb96TDzc'];
const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

(async () => {
    try {
        // client.sendMessage(channel, 'Hello World!');
        // client.getMessages(channel, limit);
        const msg = await client.getMessages(channel, limit);
        const message = msg.find(m => m.id === messageid);

        const embed = message.embeds[0];
        const description = embed.description;

        const content = description.split('\n');
        const xps = content.map(c => {
            const userID = c.split('[')[1].split(']')[0];
            let xp = c.split('`')[1];
            if (xp === 'NaN') xp = 0;
            return `<@${userID}> ${parseInt(xp)}`;
        })

        for (xp of xps) {
            client.sendMessage('932997960923480099', xp);

            //delay 3s
            client.changeToken(random(token));
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    } catch (err) {
        console.log(err);
    }
})()