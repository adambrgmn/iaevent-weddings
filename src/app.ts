import './app.css';

const API_BASE = process.env.API_BASE;

(async () => {
  const res = await fetch(`${API_BASE}/hello`);
  const json = await res.json();
  console.log(json);
})();
