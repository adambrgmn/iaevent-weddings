import Mitt, { Emitter, Handler } from 'mitt';
import { addClass, removeClass } from './dom';
import { isArray } from '.';

export interface WatchElementEvent {
  entry: IntersectionObserverEntry;
}

export interface WatchElementHandler extends Handler {
  (event: WatchElementEvent): void;
}

export interface WathElementEmitter extends Emitter {
  on(type: 'enter', handler: WatchElementHandler): void;
  on(type: 'leave', handler: WatchElementHandler): void;

  off(type: 'enter', handler: WatchElementHandler): void;
  off(type: 'leave', handler: WatchElementHandler): void;

  emit(type: 'enter', event: WatchElementEvent): void;
  emit(type: 'leave', event: WatchElementEvent): void;
}

const watchElement = (
  el: Element | Element[],
  opts: IntersectionObserverInit = {},
  once: boolean = false,
): WathElementEmitter => {
  const emitter: WathElementEmitter = new Mitt();

  const options: IntersectionObserverInit = {
    rootMargin: opts.rootMargin || '0px',
    threshold: opts.threshold || 1.0,
    ...opts,
  };

  const callback: IntersectionObserverCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        emitter.emit('enter', { entry });
        removeClass(entry.target, 'leave');
        addClass(entry.target, 'enter');
        if (once) observer.unobserve(entry.target);
      }

      if (!entry.isIntersecting) {
        removeClass(entry.target, 'enter');
        addClass(entry.target, 'leave');
        emitter.emit('leave', { entry });
      }
    });
  };

  const observer = new IntersectionObserver(callback, options);

  if (isArray(el)) {
    el.forEach(e => observer.observe(e));
  } else {
    observer.observe(el);
  }

  return emitter;
};

export { watchElement };
