const Trakteer = require('../dist').default;
const xsrfToken = 'token';
const trakteerSession = 'token';

const trakteer = new Trakteer();
trakteer.init(xsrfToken, trakteerSession);

(async () => {
    const saldo = await trakteer.getSaldo();
    console.log(saldo);

    const history = await trakteer.getHistory();
    console.log(history);
})();

const WEBHOOK_URL = 'webhook url';
const TIME_INTERVAL = 10_000; // 1 minute

trakteer.webhookNotification(true, WEBHOOK_URL, TIME_INTERVAL);

