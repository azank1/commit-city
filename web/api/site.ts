// Small reads for the pages in one function. vercel.json rewrites /api/city, /api/gallery and /api/stars here
// as ?op=<name>.
import { dispatch } from '../lib/http.js';
import * as city from '../lib/routes/city.js';
import * as gallery from '../lib/routes/gallery.js';
import * as stars from '../lib/routes/stars.js';

const routes = { city, gallery, stars };
export const GET = dispatch(routes, 'GET');
