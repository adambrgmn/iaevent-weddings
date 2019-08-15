import { from } from '../utils';
import { watchElement, WatchElementEvent } from '../utils/watch-element';
import { addClass } from '../utils/dom';

const init = () => {
  const els = from(document.querySelectorAll('[data-once-enter]'));

  const emitter = watchElement(els, { rootMargin: '500px' }, true);
  emitter.on('enter', (evt: WatchElementEvent) => {
    const { target } = evt.entry;
    if (target instanceof HTMLElement && target.dataset.onceEnter) {
      const classes = target.dataset.onceEnter;
      addClass(target, ...classes.split(' '));
    }
  });
};

export { init };
