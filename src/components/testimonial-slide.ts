import rafSchd from 'raf-schd';
import { from } from '../utils';
import { addClass, removeClass } from '../utils/dom';
import { watchElement } from '../utils/watch-element';

const init = rafSchd((parent: HTMLElement) => {
  const blockquotes = from(parent.querySelectorAll('blockquote'));
  for (let i = 0; i < blockquotes.length; i++) {
    const block = blockquotes[i];
    if (i === 0) addClass(block, 'block');
    else addClass(block, 'hidden');

    addClass(block, 'animated');
  }

  const parentDimensions = parent.getBoundingClientRect();
  parent.style.willChange = 'height';
  parent.style.transition = 'height 0.3s ease-in-out';
  parent.style.height = `${parentDimensions.height}px`;

  const show = (block: HTMLElement) => {
    const { height } = block.getBoundingClientRect();
    parent.style.height = `${height}px`;

    addClass(block, 'fadeInLeft');
    removeClass(block, 'fadeOutRight');
  };

  const hide = (block: HTMLElement) => {
    removeClass(block, 'fadeInLeft');
    addClass(block, 'fadeOutRight');
  };

  for (let i = 0; i < blockquotes.length; i++) {
    const block = blockquotes[i];
    block.style.width = `${parentDimensions.width}px`;
    removeClass(block, 'block', 'hidden');
    addClass(block, 'absolute');
    if (i === 0) show(block);
    else hide(block);
  }

  let current = 0;
  const handler = rafSchd(() => {
    const el = blockquotes[current];
    for (let block of blockquotes) {
      if (block === el) show(block);
      else hide(block);
    }
    current = current >= blockquotes.length - 1 ? 0 : current + 1;
  });

  const emitter = watchElement(parent);
  let intervalId: NodeJS.Timeout | undefined;
  emitter.on('enter', () => {
    intervalId = setInterval(handler, 7500);
  });

  emitter.on('leave', () => {
    if (intervalId) clearInterval(intervalId);
  });
});

export { init };
