import $ from 'jquery';
import 'slick-carousel';
import 'slick-carousel/slick/slick.css';
import { from } from '../utils';

export function init(parents: NodeListOf<HTMLElement>) {
  for (const el of from(parents)) {
    const dots = JSON.parse(el.dataset.dots || 'false');
    const slidesToShow = JSON.parse(el.dataset.show || '1');

    const carousel = $(el).slick({
      autoplay: false,
      autoplaySpeed: 4000,
      lazyLoad: 'ondemand',
      slidesToShow,
      dots,
      responsive: [
        { breakpoint: 769, settings: { slidesToShow: slidesToShow - 1 || 1 } },
        { breakpoint: 640, settings: { slidesToShow: 1 } },
      ],
    });

    el.addEventListener('click', (evt: MouseEvent) => {
      const { currentTarget, clientX } = evt;
      if (currentTarget instanceof HTMLElement) {
        const { width } = currentTarget.getBoundingClientRect() as DOMRect;
        const isNextClick = width - clientX < width / 2;

        if (isNextClick) {
          carousel.slick('slickNext');
        } else {
          carousel.slick('slickPrev');
        }
      }
    });
  }
}
