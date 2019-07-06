/**
 * From Chrome ~v75 native lazyloading of images and iframes will be enabled and
 * other vendors will probably follow.
 *
 * Below we make a feature check to see if lazyloading is natively supported or
 * not.
 */
function enableLazyLoadings() {
  const elements = document.querySelectorAll<HTMLImageElement>('img.lazyload');

  if ('loading' in HTMLImageElement.prototype) {
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
  } else {
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
function lazysizeFallback(elements: NodeListOf<HTMLImageElement>) {
  elements.forEach(el => {
    if (el.dataset.src) el.src = el.dataset.src;
  });
}

window.addEventListener('DOMContentLoaded', enableLazyLoadings);
