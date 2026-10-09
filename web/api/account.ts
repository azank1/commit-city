// Sign in with GitHub and owner settings in one function. vercel.json rewrites /api/auth/{login,callback,logout},
// /api/me and /api/settings here as ?op=<name>.
import { dispatch } from '../lib/http.js';
import * as callback from '../lib/routes/callback.js';
import * as login from '../lib/routes/login.js';
import * as logout from '../lib/routes/logout.js';
import * as me from '../lib/routes/me.js';
import * as settings from '../lib/routes/settings.js';

const routes = { login, callback, logout, me, settings };
export const GET = dispatch(routes, 'GET');
export const POST = dispatch(routes, 'POST');
