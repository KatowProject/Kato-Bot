# Trakteer Scraper

Trakteer.id Scraper untuk melihat Data Saldo, Supporter, dan Notifikasi (Webhook Send)

# Usage

```js
const client = require('./index');

const Trakteer = new client({
    //silahkan cek CREDENTIALS.md
    'XSRF-TOKEN': 'XSRF-TOKEN',
    'trakteer-id-session': 'trakteer-id-session',
    'webhook': 'webhook'
});


(async () => {

    /* Mengambil Data Donatur secara detail */
    console.log(await Trakteer.getData());
    /* Mengambil Data Supporter [Aktif/Tidak Aktif] */
    console.log(await Trakteer.getSupporter());
    /* Melihat History Donasi dengan ID*/
    console.log(await Trakteer.getOrderDetail('i451idcc1eDe'));
    /* Cek Saldo */
    console.log(await Trakteer.getSaldo());
    /* Cek Tip yang telah diterima */
    console.log(await Trakteer.getTipReceived());
    /* Mengaktifkan Notifikasi Donasi kemudian dikirim ke Webhook */
    await Trakteer.getNotification(true, 60000);

})();
```
<p align="center"> Selamat Mencoba!</p>
<p align="center"><img src="https://cdn.discordapp.com/attachments/795771950076133438/840061306048741406/1531054099_tumblr_omwwfgESJW1tw58h4o1_500.gif" /></p>
