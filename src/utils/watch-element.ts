import Mitt from 'mitt';

const watchElement = (
  el: HTMLElement,
  opts: IntersectionObserverInit = {},
  once: boolean = false,
) => {
  console.log(el);
  const emitter = new Mitt();

  const options: IntersectionObserverInit = {
    rootMargin: opts.rootMargin || '0px',
    threshold: opts.threshold || 1.0,
    ...opts,
  };
  console.log(options);

  let hasIntersected = false;

  const callback: IntersectionObserverCallback = (entries, observer) => {
    const entry = entries.find(e => e.target === el);
    if (entry) {
      console.log(entry);
      if (entry.target === el && entry.isIntersecting) {
        emitter.emit('enter', { entry });
        hasIntersected = true;
        if (once) observer.unobserve(entry.target);
      }

      if (entry.target === el && !entry.isIntersecting && hasIntersected) {
        emitter.emit('leave', { entry });
        hasIntersected = false;
      }
    }
  };

  const observer = new IntersectionObserver(callback, options);
  observer.observe(el);

  return emitter;
};

export { watchElement };
