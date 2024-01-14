"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const tools_1 = __importDefault(require("./tools"));
const cheerio_1 = require("cheerio");
class Trakteer {
    constructor() {
        this.notificationEnabled = false;
        this.notificationWebhookUrl = undefined;
        this.ready = false;
    }
    getSaldo() {
        if (!this.ready)
            throw new Error('Trakteer is not initialized yet, please call init() method first');
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const res = yield ((_a = this.axios) === null || _a === void 0 ? void 0 : _a.get('manage/dashboard'));
                const data = res === null || res === void 0 ? void 0 : res.data;
                const $ = (0, cheerio_1.load)(data);
                const saldo = $('.col-xs-12').eq(0).find('.head').text().trim();
                const currentSaldo = $('.col-xs-12').eq(1).find('.head').text().trim();
                const donationLength = $('.col-xs-12').eq(2).find('.head').text().trim();
                const withdrawAmount = $('.col-xs-12').eq(3).find('.head').text().trim();
                const supporterActive = $('.col-xs-12').eq(4).find('.head').text().trim();
                const saldoRegex = saldo.match(/\d+/g);
                const currentSaldoRegex = currentSaldo.match(/\d+/g);
                const donationLengthRegex = donationLength.match(/\d+/g);
                const withdrawAmountRegex = withdrawAmount.match(/\d+/g);
                const supporterActiveRegex = supporterActive.match(/\d+/g);
                return resolve({
                    saldo: saldoRegex ? parseInt(saldoRegex.join('')) : parseInt(saldo),
                    current_donation: currentSaldoRegex ? parseInt(currentSaldoRegex.join('')) : parseInt(currentSaldo),
                    donation_length: donationLengthRegex ? parseInt(donationLengthRegex.join('')) : parseInt(donationLength),
                    withdraw_amount: withdrawAmountRegex ? parseInt(withdrawAmountRegex.join('')) : parseInt(withdrawAmount),
                    supporter_active: supporterActiveRegex ? parseInt(supporterActiveRegex.join('')) : parseInt(supporterActive)
                });
            }
            catch (err) {
                return reject(err);
            }
        }));
    }
    getHistory(page = 1, length = 25) {
        if (!this.ready)
            throw new Error('Trakteer is not initialized yet, please call init() method first');
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const res = yield ((_a = this.axios) === null || _a === void 0 ? void 0 : _a.get('manage/balance/fetch', {
                    type: 'all',
                    'columns[0][data]': 'created_at',
                    'order[0][dir]': 'desc',
                    start: page === 1 ? 0 : (page * length) - length,
                    length
                }));
                const data = res === null || res === void 0 ? void 0 : res.data;
                for (const [index, value] of data.data.entries()) {
                    const $ = (0, cheerio_1.load)(value.jumlah);
                    const jumlah = $('span').text().replace(/(\r\n|\n|\r|\?)/gm, "").trim();
                    const description = value.description.replace(/(\r\n|\n|\r)/gm, "").replace(/&#039;/g, "'");
                    value.description = description;
                    value.jumlah = jumlah;
                    data.data[index] = value;
                }
                return resolve(data);
            }
            catch (err) {
                return reject(err);
            }
        }));
    }
    getDonaturData(page = 1, length = 25) {
        if (!this.ready)
            throw new Error('Trakteer is not initialized yet, please call init() method first');
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const res = yield ((_a = this.axios) === null || _a === void 0 ? void 0 : _a.get('manage/tip-received/support-message/fetch', {
                    'columns[0][data]': 'created_at',
                    'order[0][column]': 0,
                    'order[0][dir]': 'desc',
                    start: page === 1 ? 0 : (page * length) - length,
                    length
                }));
                const data = res === null || res === void 0 ? void 0 : res.data;
                return resolve(data);
            }
            catch (err) {
                return reject(err);
            }
        }));
    }
    getSupporter(page = 1, length = 25) {
        if (!this.ready)
            throw new Error('Trakteer is not initialized yet, please call init() method first');
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const res = yield ((_a = this.axios) === null || _a === void 0 ? void 0 : _a.get('manage/my-supporters/users/fetch', {
                    'columns[4][data]': 'last_supported_at',
                    'order[0][column]': 4,
                    'order[0][dir]': 'desc',
                    start: page === 1 ? 0 : (page * length) - length,
                    length
                }));
                const data = res === null || res === void 0 ? void 0 : res.data;
                const arr = [];
                for (const [index, value] of data.data.entries()) {
                    const _ava = (0, cheerio_1.load)(value.ava);
                    const ava = _ava('img').attr('src');
                    const arr_alias = [];
                    const _alias = (0, cheerio_1.load)(value.alias);
                    _alias('li').each((i, el) => {
                        const name = _alias(el).text().trim().replace(/(\r\n|\n|\r)/gm, "");
                        arr_alias.push(name);
                    });
                    const _isActive = (0, cheerio_1.load)(value.is_active);
                    const lastIsActived = _isActive('small').text().trim().replace(/(\r\n|\n|\r)/gm, "");
                    _isActive('small').remove();
                    const isActive = _isActive('div').text().trim().replace(/(\r\n|\n|\r)/gm, "");
                    arr.push({
                        reference_id: value.reference_id,
                        supporter_name: value.supporter_name.split('_!!!_'),
                        sum: value.sum,
                        last_supported_at: value.last_supported_at,
                        ava,
                        alias: arr_alias,
                        is_active: isActive ? true : false,
                        last_is_actived: lastIsActived ? lastIsActived : null
                    });
                }
                return resolve(arr);
            }
            catch (err) {
                return reject(err);
            }
        }));
    }
    getOrderDetail(orderId) {
        if (!this.ready)
            throw new Error('Trakteer is not initialized yet, please call init() method first');
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const res = yield ((_a = this.axios) === null || _a === void 0 ? void 0 : _a.get(`manage/tip-received/${orderId}`));
                const data = res === null || res === void 0 ? void 0 : res.data;
                const $ = (0, cheerio_1.load)(data);
                const orderID = orderId;
                const tanggal = $('tbody').find('tr:contains("Tanggal")').find('td').text().trim();
                const nama = $('tbody').find('tr:contains("Nama")').find('td').text().replace(/\s+|&nbsp;/g, '');
                const unit = {
                    length: $('tbody').find('tr:contains("Unit")').find('td').text().trim(),
                    image: $('tbody').find('tr:contains("Unit")').find('td').find('img').attr('src')
                };
                const nominal = $('tbody').find('tr:contains("Nominal")').find('td').text().trim();
                const message = $('.block').text().trim();
                return resolve({
                    orderId: orderID,
                    tanggal,
                    nama,
                    unit,
                    nominal,
                    message
                });
            }
            catch (err) {
                return reject(err);
            }
        }));
    }
    getLeaderboard() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const res = yield ((_a = this.axios) === null || _a === void 0 ? void 0 : _a.get('manage/my-supporters'));
                const data = res === null || res === void 0 ? void 0 : res.data;
                const $ = (0, cheerio_1.load)(data);
                const arr = [];
                const main = $('#my-top-supporters').find('.row');
                main.find('.mb-20').each((i, el) => {
                    const title = $(el).find('.title').text().trim();
                    const arr_supporter = [];
                    $(el).find('.supporter').each((j, ele) => {
                        $('.prevname').remove();
                        const name = $(ele).find('.name').find('span').text().trim().replace(/\s+|&nbsp;/g, '');
                        const unit = $(ele).find('.unit').text().trim();
                        arr_supporter.push({
                            name,
                            unit
                        });
                    });
                    arr.push({
                        title,
                        supporter: arr_supporter
                    });
                });
                return resolve(arr);
            }
            catch (err) {
                return reject(err);
            }
        }));
    }
    webhookNotification(enable, webhookUrl, timeout) {
        if (!this.ready)
            throw new Error('Trakteer is not initialized yet, please call init() method first');
        if (!enable) {
            this.notificationEnabled = false;
            this.notificationWebhookUrl = null;
            if (this.notificationInterval)
                clearInterval(this.notificationInterval);
            console.log('Trakteer webhook notification disabled');
            return;
        }
        if (!timeout)
            throw new Error('Timeout is required');
        if (!webhookUrl)
            throw new Error('Webhook URL is required');
        if (this.notificationInterval)
            clearInterval(this.notificationInterval);
        this.notificationInterval = setInterval(this.fetchNotification.bind(this), timeout);
        this.notificationEnabled = true;
        this.notificationWebhookUrl = webhookUrl;
    }
    fetchNotification() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.ready)
                throw new Error('Trakteer is not initialized yet, please call init() method first');
            if (!this.notificationEnabled)
                return;
            const path = './data/last-donatur.json';
            const fileisExits = (0, fs_1.existsSync)((0, path_1.join)(__dirname, path));
            if (!fileisExits) {
                (0, fs_1.mkdirSync)((0, path_1.join)(__dirname, './data'), { recursive: true });
                (0, fs_1.writeFileSync)((0, path_1.join)(__dirname, path), JSON.stringify({ id: null }));
            }
            const lastDonatur = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, path), 'utf-8');
            const lastDonaturJson = JSON.parse(lastDonatur);
            const donaturs = yield this.getDonaturData(1, 2);
            const donatur = donaturs.data ? donaturs.data[0] : null;
            if (!donatur)
                return;
            if (lastDonaturJson.id === donatur.id)
                return;
            lastDonaturJson.id = donatur.id;
            try {
                const res = yield ((_a = this.axios) === null || _a === void 0 ? void 0 : _a.self.post(this.notificationWebhookUrl, { content: JSON.stringify(donatur) }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }));
                (0, fs_1.writeFileSync)((0, path_1.join)(__dirname, path), JSON.stringify(lastDonaturJson));
                console.log('Trakteer webhook notification sent');
            }
            catch (err) {
                console.log(`Trakteer webhook notification failed: ${err.message}`);
            }
        });
    }
    init(xsrfToken, trakteerSession, proxy) {
        if (!xsrfToken)
            throw new Error('xsrfToken is required');
        if (!trakteerSession)
            throw new Error('trakteerSession is required');
        this.XSRF_TOKEN = xsrfToken;
        this.TRAKTEER_SESSION = trakteerSession;
        this.axios = new tools_1.default({ XSRF_TOKEN: this.XSRF_TOKEN, TRAKTEER_SESSION: this.TRAKTEER_SESSION }, proxy);
        this.ready = true;
    }
}
exports.default = Trakteer;
