require('dotenv').config();
import Trakteer from '../src';
const trakteer = new Trakteer();

trakteer.init(process.env.XSRF_TOKEN!, process.env.TRAKTEER_SESSION!, process.env.PROXY_URL!);

trakteer.getSaldo().then((res) => console.log(res)).catch((err) => console.log(err));
// trakteer.getHistory(1, 10).then((res) => console.log(res)).catch((err) => console.log(err));
// trakteer.getDonaturData(1, 10).then((res) => console.log(res)).catch((err) => console.log(err));
// trakteer.getOrderDetail('l0865ygnx6j5bgme').then((res) => console.log(res)).catch((err) => console.log(err));
// trakteer.getSupporter(1, 25).then((res) => console.log(res)).catch((err) => console.log(err));
// trakteer.getLeaderboard().then((res) => console.log(res)).catch((err) => console.log(err));

