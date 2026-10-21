import 'pg';
import type { VercelRequest, VercelResponse } from '../src/vercel-types';
import { getApp } from '../src/get-app';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 🔥 DYNAMIC CORS HEADERS WITH CREDENTIALS SUPPORT
  const origin = req.headers.origin as string;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS,HEAD');
  const reqHeaders = req.headers['access-control-request-headers'] as string;
  res.setHeader(
    'Access-Control-Allow-Headers',
    reqHeaders ||
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Cache-Control, Pragma',
  );

  // 🔥 PREVENT 304 NOT MODIFIED (which strips CORS headers on Vercel Edge)
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Preflight
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const app = await getApp();
  const server = app.getHttpAdapter().getInstance();
  return server(req, res);
}
