const Discord = require('./index');
const client = new Discord(['token1', 'token2']);

(async () => {
    await client.init(true);

    const request = client.request;

    const sendMessage = await request.sendMessage('932997960923480099', 'Hello World!', true);
    console.log(sendMessage);
})()
