import axios, { AxiosInstance, AxiosResponse } from "axios";

class AxiosRequest {
    public request: AxiosInstance;
    public self = axios;
    private BASE_URL: string = "https://trakteer.id/";

    constructor(auth: { XSRF_TOKEN: String, TRAKTEER_SESSION: String }) {
        this.request = axios.create({
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

    get(endpoint: string, params: Object = {}): Promise<AxiosResponse | undefined> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.request.get(endpoint, { params: params });
                return resolve(response);
            } catch (err) {
                return reject(err);
            }
        });
    }
}

export default AxiosRequest;