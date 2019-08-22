import { addClass, removeClass } from './utils/dom';
import { includes } from './utils';

/**
 * From Chrome ~v75 native lazyloading of images and iframes will be enabled and
 * other vendors will probably follow.
 *
 * Below we make a feature check to see if lazyloading is natively supported or
 * not.
 */
function enableLazyLoadings() {
  const elements = document.querySelectorAll<
    HTMLImageElement | HTMLIFrameElement
  >('img.lazyload,iframe.lazyload');

  if ('loading' in HTMLImageElement.prototype) {
    /**
     * If native lazy loading is enabled we loop thru every element and remove
     * reset the `src` attribute from the `data-src` attribute and remove the
     * lazyload class.
     */
    elements.forEach(el => {
      if (el.dataset.src) {
        el.setAttribute('loading', 'lazy');
        el.src = el.dataset.src;
        if (el instanceof HTMLImageElement && el.dataset.srcset) {
          el.srcset = el.dataset.srcset;
        }
      }

      if (el.parentElement instanceof HTMLPictureElement) {
        const sources = el.parentElement.querySelectorAll('source');
        sources.forEach(el => {
          if (el.dataset.srcset) {
            el.srcset = el.dataset.srcset;
          }
        });
      }

      el.onload = () => {
        removeClass(el, 'lazyload');
        addClass(el, 'lazyloaded');
      };
    });
  } else if (elements.length > 0) {
    /**
     * If native lazyload isn't supported we rely on the
     * [lazysizes](https://github.com/aFarkas/lazysizes) package to handle
     * lazyloaded images.
     */
    import('lazysizes')
      .then(lazy => lazy.init())
      .catch(() => lazysizeFallback(elements));
  }
}

/**
 * In case of an error loading `lazysizes` we fallback to simply load the images
 * as normal
 *
 * @param {NodeListOf<HTMLImageElement>} elements
 */
function lazysizeFallback(
  elements: NodeListOf<HTMLImageElement | HTMLIFrameElement>,
) {
  elements.forEach(el => {
    if (el.dataset.src) el.src = el.dataset.src;
  });
}

/**
 * Since we cannot be sure wether all content is loaded or not once this script
 * loads we need to check for the `readyState` on the document.
 *
 * If the document is `"interactive"` or `"complete"` we can be enable lazy
 * loading straight await. Otherwise (if `readyState` is `"loading"`) we will
 * wait for the `DOMContentLoaded` event to happen before enabling lazyloading.
 */
if (includes(['interactive', 'complete'], document.readyState)) {
  enableLazyLoadings();
} else {
  window.addEventListener('DOMContentLoaded', enableLazyLoadings);
}
