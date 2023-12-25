# Trakeer Scraper 

## Description
Trakteer scraper for [Trakteer](https://trakteer.id) website to get information account with cookies.
this lib usefull if you have a community and want to get information about your donatur, and notificate them if they donate to you.

## Features
- [x] Get Donate Balance
- [x] Get Donatur Data
- [x] Get Donate History
- [x] Get Supporters Data
- [x] Discord Webhook Notification
- [x] Get Leaderboard Data

## Installation
1. Clone this repository
2. type `npm install` in your terminal
3. type `npm run build` in your terminal
4. import this lib to your project in `dist/index.js`

## Usage
```js
const Trakteer = require('../dist').default;
const xsrfToken = 'insert xsrf token here';
const trakteerSession = 'insert trakteer session here';

const trakteer = new Trakteer();
trakteer.init(xsrfToken, trakteerSession);

(async () => {
    const saldo = await trakteer.getSaldo();
    console.log(saldo);

    const history = await trakteer.getHistory();
    console.log(history);

    const data = await trakteer.getDonaturData();
    console.log(data);

    const donaturDetail = await trakteer.getOrderDetail('insert order id here');
    console.log(donaturDetail);

    const leaderboard = await trakteer.getLeaderboard();
    console.log(leaderboard);

    const supporters = await trakteer.getSupporter();
    console.log(supporters);

    const WEBHOOK_URL = 'insert webhook url here';
    const TIME_INTERVAL = 60_000; // 1 minute

    trakteer.webhookNotification(true, WEBHOOK_URL, TIME_INTERVAL);
})();
```
