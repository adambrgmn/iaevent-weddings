import * as env from './utils/env';
import * as menu from './components/mobile-menu';
import * as onEnter from './components/on-enter';
import { watchElement } from './utils/watch-element';

const API_BASE = env.API_BASE;
console.log(`${API_BASE}/hello`);

(async () => {
  menu.init();
  onEnter.init();

  try {
    const igFeedParent = document.getElementById('ig-feed');
    if (igFeedParent) {
      const watcher = watchElement(igFeedParent, { rootMargin: '100px' }, true);
      const callback = async () => {
        const feed = await import('./components/instagram-feed');
        feed.init(igFeedParent);
        watcher.off('enter', callback);
      };
      watcher.on('enter', callback);
    }
  } catch (error) {}
})();
