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
const axios_1 = __importDefault(require("axios"));
class AxiosRequest {
    constructor(auth) {
        this.self = axios_1.default;
        this.BASE_URL = "https://trakteer.id/";
        this.request = axios_1.default.create({
            baseURL: this.BASE_URL,
            timeout: 10000,
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; Redmi Note 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36",
                "Accept": "application/json, text/plain, */*",
                "Referer": "https://trakteer.id/",
                "cookie": `XSRF-TOKEN=${auth.XSRF_TOKEN}; trakteer-sess=${auth.TRAKTEER_SESSION}`
            }
        });
    }
    get(endpoint, params = {}) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.request.get(endpoint, { params: params });
                return resolve(response);
            }
            catch (err) {
                // if 403 bypass the cloudflare
                if (err.response.status === 403) {
                    const response = yield this.__bypass(endpoint, "GET", this.request.defaults.headers, {}, params);
                    return resolve(response);
                }
                return reject(err);
            }
        }));
    }
    __bypass(endpoint, method, headers = {}, data = {}, params = {}) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const bs64 = Buffer.from(endpoint).toString("base64");
                const response = yield this.self({
                    url: `https://bypass.katowproject.my.id/trakteer.php?q=${bs64}`,
                    method: method,
                    headers: headers,
                    data: data
                });
                return resolve(response);
            }
            catch (err) {
                return reject(err);
            }
        }));
    }
}
exports.default = AxiosRequest;
