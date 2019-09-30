import * as env from './utils/env';
import * as menu from './components/mobile-menu';
import { watchElement } from './utils/watch-element';

const API_BASE = env.API_BASE;
console.log(`${API_BASE}/hello`);

(async () => {
  menu.init();

  try {
    const carousels = document.querySelectorAll<HTMLElement>('.carousel');
    if (carousels.length > 0) {
      const carousel = await import('./components/carousel');
      carousel.init(carousels);
    }
  } catch (err) {}

  try {
    const igFeedParent = document.getElementById('ig-feed');
    if (igFeedParent) {
      const watcher = watchElement(igFeedParent, { rootMargin: '500px' }, true);
      const callback = async () => {
        const feed = await import('./components/instagram-feed');
        feed.init(igFeedParent);
        watcher.off('enter', callback);
      };
      watcher.on('enter', callback);
    }
  } catch (error) {}

  try {
    const testimonials = document.querySelector<HTMLDivElement>(
      '.testimonials',
    );
    if (testimonials) {
      const { init } = await import('./components/testimonial-slide');
      init(testimonials);
    }
  } catch (error) {}

  try {
    const formEl = document.querySelectorAll('form');
    if (formEl.length > 0) {
      const forms = await import('./components/form');
      formEl.forEach(forms.init);
    }
  } catch (error) {}
})();
