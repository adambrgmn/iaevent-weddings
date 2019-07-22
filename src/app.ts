import * as env from './utils/env';
import * as menu from './components/mobile-menu';

const API_BASE = env.API_BASE;
console.log(`${API_BASE}/hello`);

(() => {
  menu.init();
})();
