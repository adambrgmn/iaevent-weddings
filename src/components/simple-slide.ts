import rafSchd from 'raf-schd';
import { from } from '../utils';
import { addClass, removeClass } from '../utils/dom';

const enterClass = 'fadeInRight';
const leaveClass = 'fadeOutLeft';

const init = (parents: NodeListOf<HTMLElement>) => {
  for (let container of from(parents)) {
    const slideInterval = Number.parseInt(container.dataset.interval || '5000');
    const images = from(container.querySelectorAll('img'));

    if (images.length > 1) {
      const onLoad = rafSchd(() => {
        const rect = container.getBoundingClientRect();
        const padding = Number.parseInt(
          getComputedStyle(container).padding || '0px',
        );

        addClass(container, 'relative', 'overflow-hidden');
        container.style.width = `${rect.width}px`;
        container.style.height = `${rect.height}px`;

        for (let image of images) {
          addClass(image, 'absolute', 'animated');
          removeClass(image, 'hidden', 'w-full');
          image.style.width = `${rect.width - padding * 2}px`;
          image.style.height = `${rect.height - padding * 2}px`;
          image.style.top = `${padding}px`;
          image.style.left = `${padding}px`;
          image.style.bottom = `${padding}px`;
          image.style.right = `${padding}px`;

          if (image !== images[0]) {
            addClass(image, 'opacity-0');
          } else {
            addClass(image, enterClass);
          }
        }

        let idx = 0;
        setInterval(
          rafSchd(() => {
            const currentImage = images[idx];
            const nextImage = images[idx + 1] ? images[idx + 1] : images[0];

            removeClass(currentImage, enterClass);
            addClass(currentImage, leaveClass);

            removeClass(nextImage, leaveClass);
            addClass(nextImage, enterClass);

            idx = idx >= images.length - 1 ? 0 : idx + 1;
          }),
          slideInterval,
        );
      });

      images[0].addEventListener('load', onLoad);
    }
  }
};

export { init };
