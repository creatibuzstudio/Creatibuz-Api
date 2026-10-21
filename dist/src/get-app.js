"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApp = getApp;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
let cachedApp;
async function getApp() {
    if (!cachedApp) {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.set('etag', false);
        app.enableCors({
            origin: true,
            credentials: true,
        });
        app.use((_req, res, next) => {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            next();
        });
        await app.init();
        cachedApp = app;
    }
    return cachedApp;
}
//# sourceMappingURL=get-app.js.map