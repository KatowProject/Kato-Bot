const client = require('./index');

const Trakteer = new client({
    'XSRF-TOKEN': 'XSRF-TOKEN',
    'trakteer-id-session': 'trakteer-id-session',
    'webhook': 'webhook'
});


(async () => {

    console.log(await Trakteer.getData());
    console.log(await Trakteer.getSupporter());
    console.log(await Trakteer.getSaldo());
    console.log(await Trakteer.getTipReceived());
    console.log(await Trakteer.getNotification(true, 60000));

})()