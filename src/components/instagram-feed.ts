import axios from 'axios';
import rafSchd from 'raf-schd';
import * as env from '../utils/env';
import { InstagramFeedResponse } from '../types/instagram';
import { addClass } from '../utils/dom';
import { clamp } from '../utils';

const API_BASE = env.API_BASE;

const getImages = async () => {
  try {
    const response = await axios.get<InstagramFeedResponse>(
      `${API_BASE}/instagram-feed`,
    );

    const images = response.data.data.map(post => ({
      link: post.link,
      image: post.images.thumbnail,
    }));
    return images;
  } catch (error) {
    return [];
  }
};

const init = async (parentEl: HTMLElement) => {
  const entries = await getImages();
  const firstEntry = entries[0];
  const profileLinkEl = parentEl.querySelector('li');
  const expectedWidth = firstEntry.image.width;

  if (profileLinkEl) {
    profileLinkEl.style.width = `${expectedWidth}px`;
  }

  const createElements = rafSchd(() => {
    const { width } = parentEl.getBoundingClientRect();
    parentEl
      .querySelectorAll('.feed-list-item')
      .forEach(n => parentEl.removeChild(n));

    const itemsPerRow = Math.floor(width / expectedWidth);
    const totalRows = clamp(
      1,
      5,
      Math.floor((entries.length + 1) / itemsPerRow),
    );
    const totalItems = itemsPerRow * totalRows;

    for (let i = 0; i < totalItems - 1; i++) {
      const entry = entries[i];
      const listItemElement = document.createElement('li');
      const linkElement = document.createElement('a');
      const imageElement = document.createElement('img');

      addClass(
        listItemElement,
        'feed-list-item',
        'p-1',
        'animated',
        'fadeInRight',
      );
      listItemElement.style.maxWidth = `${expectedWidth}px`;
      listItemElement.style.animationDelay = `${50 * i}ms`;

      linkElement.href = entry.link;
      addClass(linkElement, 'feed-link');

      imageElement.src = entry.image.url;
      imageElement.width = entry.image.width;
      imageElement.height = entry.image.height;
      imageElement.setAttribute('loading', 'lazy');
      addClass(imageElement, 'feed-thumbnail', 'w-full');

      linkElement.appendChild(imageElement);
      listItemElement.appendChild(linkElement);
      parentEl.appendChild(listItemElement);
    }
  });

  createElements();
  window.addEventListener('resize', createElements);
};

export { init };
