// Small reads for the pages in one function. vercel.json rewrites /api/city, /api/gallery, /api/stars, /api/live
// and /api/pulse here as ?op=<name>.
import { dispatch } from '../lib/http.js';
import * as city from '../lib/routes/city.js';
import * as gallery from '../lib/routes/gallery.js';
import * as live from '../lib/routes/live.js';
import * as pulse from '../lib/routes/pulse.js';
import * as stars from '../lib/routes/stars.js';

const routes = { city, gallery, stars, live, pulse };
export const GET = dispatch(routes, 'GET');
