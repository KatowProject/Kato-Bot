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
                const saldo = $('.available-balance').find('h3').text();

                return resolve(saldo);

            } catch (e) {
                return reject(e);
            }
        })
    }

    getData() {
        return new Promise(async (resolve, reject) => {
            try {

                const point = fs.readFileSync(path.join(__dirname, '/endpoint/getData.txt'), 'utf8');
                const res = await tools.get(point, this.options);
                const donet = res.data.data;

                const list = [];
                donet.forEach((a, i) => {

                    const $ = cheerio.load(a);
                    const donatur = {
                        createdAt: a.created_at,
                        supporter: a.supporter.split('<')[0],
                        support_message: a.support_message === '-' ? '-' : $(a.support_message).text().trim().split('\n')[0],
                        unit: [
                            a.quantity,
                            $(a.unit).attr('src')
                        ],
                        nominal: [
                            $(a.nominal).find('tr:nth-of-type(1) td:nth-of-type(3)').text(),
                            $(a.nominal).find('tr:nth-of-type(2) td:nth-of-type(3)').text(),
                            $(a.nominal).find('tr:nth-of-type(3) td:nth-of-type(3)').text(),
                            $(a.nominal).find('tr:nth-of-type(4) th.text-left:nth-of-type(3)').text()
                        ]
                    }
                    list.push(donatur);
                })

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
                const response = $('span.text-primary').text();

                return resolve(response);

            } catch (e) {

                return reject(e);

            }

        });
    }




    getNotification(boolean, time) {

        const notify = async () => {

            const donaturData = await this.getData();

            try {

                const readDonatur = fs.readFileSync(path.join(__dirname, './latestDonatur.json'), 'utf8');
                const donatur = JSON.parse(readDonatur.toString());

                if (donaturData[0].createdAt === donatur.createdAt) return;

                const json = {
                    'content': '<a:bell:840021626473152513> tengtong ada donatur masuk! <a:bell:840021626473152513>',
                    'embeds': [
                        {
                            "title": "Donasi Trakteer",
                            "color": 0,
                            "footer": {
                                "icon_url": "https://cdn.discordapp.com/emojis/827038555896938498.png",
                                "text": "1 Koin = Rp 10.000,00.-"
                            },
                            "fields": [
                                {
                                    "name": "Donatur",
                                    "value": donaturData[0].supporter
                                },
                                {
                                    "name": "Unit Donasi",
                                    "value": `<:santai:827038555896938498> ${donaturData[0].unit[0]} Koin`
                                },
                                {
                                    "name": "Tanggal Donasi",
                                    "value": donaturData[0].createdAt
                                },
                                {
                                    "name": "Pesan Dukungan",
                                    "value": donaturData[0].support_message
                                },
                                {
                                    "name": "Durasi Role",
                                    "value": `${parseInt(donaturData[0].unit[0]) * 28} hari`
                                }
                            ]
                        }
                    ]
                };

                const parse = JSON.stringify(json);

                fs.writeFileSync(path.join(__dirname, './latestDonatur.json'), JSON.stringify(donaturData[0]));
                await tools.post(parse, this.options['webhook']);

            } catch (err) {

                fs.writeFileSync(path.join(__dirname, './latestDonatur.json'), JSON.stringify(donaturData[0]));
                console.log(err);

            }
        }

        const notification = setInterval(notify, time);

        if (boolean === false) {
            cleanInterval(notification);
            console.log('Notifikasi Dinonaktifkan!');
        }
        console.log('Notifikasi diaktifkan!');

    }

}





module.exports = Trakteer;