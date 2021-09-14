const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const tools = require('./tools');

class Trakteer {

    constructor(options = {}) {
        this.options = options;
    }

    getSaldo() {
        return new Promise(async (resolve, reject) => {
            try {
                const endpoint = 'manage/balance';
                const res = await tools.get(endpoint, this.options);
                const response = res.data;

                const $ = cheerio.load(response);
                const saldo = $('.available-balance').find('h2').text();

                return resolve(saldo);
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
                const donet = res.data.data;

                const list = [];
                donet.forEach((a, i) => {
                    const $nominal = cheerio.load(a.nominal);
                    const $aksi = cheerio.load(a.aksi);

                    const donatur = {
                        createdAt: a.created_at,
                        supporter: a.supporter.split('<')[0],
                        unit: a.quantity,
                        nominal: $nominal('.d-iflex').text().split('\n')[0],
                        orderId: $aksi('a').attr('href').split('/').pop()
                    }
                    list.push(donatur);
                })

                return resolve(list);

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

    getSupporter() {
        return new Promise(async (resolve, reject) => {
            try {


                const endpoint = fs.readFileSync('./endpoint/getSupporter.txt', 'utf8');
                const req = await tools.get(endpoint, this.options);
                const supporter = req.data.data;

                const list = [];
                supporter.forEach(a => {

                    const $ = cheerio.load(a);

                    const avatar = $(a.ava).find('img').attr('src') ? $(a.ava).find('img').attr('src') : $(a.ava).attr('src');
                    const isActive = $(a.is_active)
                    const data = {
                        referenceID: a.reference_id,
                        supporter: a.supporter_name.split('_!!!_'),
                        lastSupportedAt: a.last_supported_at,
                        avatar,
                        totalDonasi: a.sum,
                        isActive: a.is_active === 'Tidak Aktif' ? 'Tidak Aktif' : $(a.is_active).find('div small').text()

                    };

                    list.push(data);
                })

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

                const order = await this.getOrderDetail(donaturData[0].orderId);
                const json = {
                    'content': '<a:bell:840021626473152513> tengtong ada donatur masuk! <a:bell:840021626473152513>',
                    'embeds': [
                        {
                            "title": "Donasi Trakteer",
                            "color": 16777215,
                            "author": {
                                "name": "Perkumpulan Orang Santai",
                                "url": "https://trakteer.id/santai",
                                "icon_url": "https://cdn.discordapp.com/icons/336336077755252738/c3940657b6d2bf8bf973e1b5e4499728.png?size=4096"
                            },
                            "description": `
                                **Nama:** ${donaturData[0].supporter}
                                **Unit:** <:santai:827038555896938498> ${order.unit.length}
                                **Nominal:** ${order.nominal}
                            `,
                            "fields": [
                                {
                                    name: 'Pesan Dukungan',
                                    value: order.message,
                                }
                            ],
                            "footer": {
                                "text": `Tanggal • ${order.tanggal}`
                            }
                        }
                    ]
                };

                const isAvailable = fs.existsSync(path.join(__dirname, './latestDonatur.json'));
                if (isAvailable) {
                    const readDonatur = fs.readFileSync(path.join(__dirname, './latestDonatur.json'), 'utf8');
                    const donatur = JSON.parse(readDonatur.toString());

                    if (donaturData[0].orderId === donatur.orderId) return;
                    fs.writeFileSync(path.join(__dirname, './latestDonatur.json'), JSON.stringify(donaturData[0]));
                    await tools.post(donatur, this.options['webhook']);


                } else {
                    fs.writeFileSync(path.join(__dirname, './latestDonatur.json'), JSON.stringify(donaturData[0]));
                    await tools.post(json, this.options['webhook']);
                }
            } catch (err) {
                console.log(err);
            }
        }

        const notification = setInterval(notify, time);

        if (boolean === false) {
            clearInterval(notification);
            console.log('Notifikasi Dinonaktifkan!');
        }
        console.log('Notifikasi diaktifkan!');

    }
}





module.exports = Trakteer;