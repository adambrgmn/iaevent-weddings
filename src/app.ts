import './app.css';

const API_BASE = process.env.API_BASE;

(async () => {
  const res = await fetch(`${API_BASE}/hello`);
  const json = await res.json();
  console.log(json);
})();

/**
 * From Chrome ~v75 native lazyloading of images and iframes will be enabled and
 * other vendors will probably follow.
 *
 * Inside `../../controllers/class-misc.php` we transform every image and iframe
 * inside a posts content and create a `data-src` attribute, remove the `src`
 * attribute, add a `lazyload` class and add `loading="lazy"`.
 *
 * Below we make a feature check to see if lazyloading is natively supported or
 * not.
 */
const enableLazyLoading = () => {
  const elements = document.querySelectorAll<HTMLImageElement>('img.lazyload');

  if ('loading' in HTMLImageElement.prototype && elements.length > 0) {
    /**
     * If native lazy loading is enabled we loop thru every element and remove
     * reset the `src` attribute from the `data-src` attribute and remove the
     * lazyload class.
     */
    elements.forEach(el => {
      if (el.dataset.src) {
        el.onload = () => {
          el.classList.remove('lazyload');
          el.classList.add('lazyloaded');
        };

        el.setAttribute('loading', 'lazy');
        el.src = el.dataset.src;
      }
    });
  } else if (elements.length > 0) {
    /**
     * If native lazyload isn't supported we rely on the
     * [lazysizes](https://github.com/aFarkas/lazysizes) package to handle
     * lazyloaded images.
     */
    import('lazysizes').then(lazy => lazy.init());
  }
};

window.addEventListener('DOMContentLoaded', enableLazyLoading);
