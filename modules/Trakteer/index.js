const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const tools = require('./tools');

class Trakteer {
    constructor(options = {}) {
        this.options = options;
        this.notification = null;
    }

    getSaldo() {
        return new Promise(async (resolve, reject) => {
            try {
                const endpoint = 'manage/dashboard';
                const res = await tools.get(endpoint, this.options);
                const response = res.data;

                const $ = cheerio.load(response);
                const saldo = $('.col-xs-12').eq(0).find('h3').text().trim();
                const current_donation = $('.col-xs-12').eq(1).find('h3').text().trim();

                return resolve({ saldo, current_donation });
            } catch (e) {
                return reject(e);
            }
        });
    }

    getData() {
        return new Promise(async (resolve, reject) => {
            try {
                const point = fs.readFileSync(path.join(__dirname, '/endpoint/getData.txt'), 'utf8');
                const res = await tools.get(point, this.options);
                const donet = res.data.data || [];

                return resolve(donet);
            } catch (e) {
                return reject(e);
            }
        });
    }

    getOrderDetail(orderId) {
        return new Promise(async (resolve, reject) => {
            try {
                const endpoint = `manage/tip-received/${orderId}`;
                const res = await tools.get(endpoint, this.options);
                const $ = cheerio.load(res.data);

                const data = {};

                data.orderId = orderId;
                data.tanggal = $('tbody').find('tr:contains("Tanggal") td').text();
                data.nama = $('tbody').find('tr:contains("Nama") td').text().replace(/\s+|&nbsp;/g, "");
                data.unit = {
                    length: $('tbody').find('tr:contains("Unit") td').text().trim(),
                    image: $('tbody').find('tr:contains("Unit") td').find('img').attr('src')
                };
                data.nominal = $('tbody').find('tr:contains("Nominal") td').text().trim();
                data.message = $('.block').text().trim();

                return resolve(data);
            } catch (e) {
                return reject(e);
            }
        });
    }

    getHistory() {
        return new Promise(async (resolve, reject) => {
            try {
                const endpoint = fs.readFileSync(path.join(__dirname, '/endpoint/getHistory.txt'), 'utf8');
                const res = await tools.get(endpoint, this.options);
                const data = res.data;

                const list = [];
                for (const history of data.data) {
                    const amount = cheerio.load(history.jumlah);
                    const balance = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(history.current_balance);
                    list.push({
                        tanggal: history.created_at,
                        balance,
                        description: history.description.replace('\n\n', ''),
                        amount: amount.text().trim().split('\n').shift()
                    });
                }

                return resolve(list);
            } catch (e) {
                return reject(e);
            }
        });
    }

    getSupporter() {
        return new Promise(async (resolve, reject) => {
            try {
                const endpoint = fs.readFileSync('./endpoint/getSupporter.txt', 'utf8');
                const req = await tools.get(endpoint, this.options);

                const supporter = req.data.data;
                const list = [];
                for (const a of supporter) {
                    const $ = cheerio.load(a);
                    const avatar = $(a.ava).find('img').attr('src') ? $(a.ava).find('img').attr('src') : $(a.ava).attr('src');
                    const data = {
                        referenceID: a.reference_id,
                        supporter: a.supporter_name.split('_!!!_'),
                        lastSupportedAt: a.last_supported_at,
                        avatar,
                        totalDonasi: a.sum,
                        isActive: a.is_active === 'Tidak Aktif' ? 'Tidak Aktif' : $(a.is_active).find('div small').text()

                    };
                    list.push(data);
                };

                return resolve(list);
            } catch (e) {
                return reject(e);
            }
        })
    }

    getTipReceived() {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await tools.get('manage/tip-received', this.options);
                const $ = cheerio.load(res.data);
                const response = $('.overview-total').find('.fs-150:nth-of-type(4)').text().trim();
                return resolve(response);
            } catch (e) {
                return reject(e);
            }
        });
    }

    getNotification(boolean, time) {
        const notify = async () => {
            try {
                const donaturData = await this.getData();

                const order = await this.getOrderDetail(donaturData[0].id);
                order.date = donaturData[0].created_at;
                const json = {
                    "content": JSON.stringify(order)
                };

                const isAvailable = fs.existsSync(path.join(__dirname, './latestDonatur.txt'));
                if (isAvailable) {
                    const readDonatur = fs.readFileSync(path.join(__dirname, './latestDonatur.txt'), 'utf8');
                    const donatur = JSON.parse(readDonatur.toString());

                    if (donaturData[0].id === donatur.id) return;
                    fs.writeFileSync(path.join(__dirname, './latestDonatur.txt'), JSON.stringify(donaturData[0]));
                    await tools.post(json, this.options['webhook']);
                } else {
                    fs.writeFileSync(path.join(__dirname, './latestDonatur.txt'), JSON.stringify(donaturData[0]));
                    await tools.post(json, this.options['webhook']);
                }
            } catch (err) {
                console.log(err);
            }
        }

        if (boolean) {
            const interval = setInterval(notify, time);
            this.notification = interval;
            console.log('Notifikasi diaktifkan!');
        } else {
            if (!this.notification) return console.log('Notifikasi tidak aktif!');
            clearInterval(this.notification);
            console.log('Notifikasi dinonaktifkan!');
        }
    }

    disableNotification() {
        if (!this.notification) return console.log('Notifikasi tidak aktif!');
        clearInterval(this.notification);
        console.log('Notifikasi dinonaktifkan!');
    }
}





module.exports = Trakteer;