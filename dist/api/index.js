"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
require("pg");
const get_app_1 = require("../src/get-app");
async function handler(req, res) {
    const origin = req.headers.origin;
    if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    else {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS,HEAD');
    const reqHeaders = req.headers['access-control-request-headers'];
    res.setHeader('Access-Control-Allow-Headers', reqHeaders ||
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Cache-Control, Pragma');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }
    const app = await (0, get_app_1.getApp)();
    const server = app.getHttpAdapter().getInstance();
    return server(req, res);
}
//# sourceMappingURL=index.js.map