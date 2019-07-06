import * as env from './utils/env';

const API_BASE = env.API_BASE;
console.log(API_BASE);

(async () => {
  try {
    const res = await fetch(`${API_BASE}/hello`);
    const json = await res.json();
    console.log(json);
  } catch (err) {
    console.error(err);
  }
})();
