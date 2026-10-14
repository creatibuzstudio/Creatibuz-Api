"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
require("pg");
const get_app_1 = require("../src/get-app");
async function handler(req, res) {
    const origin = req.headers.origin || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }
    const app = await (0, get_app_1.getApp)();
    const server = app.getHttpAdapter().getInstance();
    return server(req, res);
}
//# sourceMappingURL=index.js.map