/**
 * The site will show an instagram feed near the footer of every page.
 * This feed is dynamically loaded depending on when the user scrolls close to
 * the parent element.
 *
 * The component uses the api endpoint `/instagram-feed` which is a proxy of the
 * original instagram
 * [feed api](https://www.instagram.com/developer/endpoints/users/).
 */
import axios from 'axios';
import rafSchd from 'raf-schd';
import * as env from '../utils/env';
import { InstagramFeedResponse } from '../types/instagram';
import { addClass } from '../utils/dom';
import { clamp } from '../utils';

const API_BASE = env.API_BASE;

/**
 * Fetch array of the latest images from api endpoint
 *
 * @returns array of images with links and dimensions
 */
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

/**
 * Initialize the instagram feed by giving it a HTML element as a parent
 * which the children can be attached.
 *
 * @param {HTMLElement} parentEl
 */
const init = async (parentEl: HTMLElement) => {
  const entries = await getImages();
  const firstEntry = entries[0];
  const profileLinkEl = parentEl.querySelector('li');
  const expectedWidth = firstEntry.image.width;

  /**
   * Initially the parent will contain a list item which displays a link to
   * the Instagram profile page. This element will be accounted for as part of
   * the grid.
   */
  if (profileLinkEl) {
    profileLinkEl.style.width = `${expectedWidth}px`;
  }

  const createElements = rafSchd(() => {
    const { width } = parentEl.getBoundingClientRect();
    const profileLinkInt = profileLinkEl ? 1 : 0;
    parentEl
      .querySelectorAll('.feed-list-item')
      .forEach(n => parentEl.removeChild(n));

    /**
     * We use the total amount of images from the server (probably 20) plus the
     * profile link and the optimal width of each image to determine the number
     * of items per row, and how many rows. The rows will not extend more than
     * five to prevent it from taking up too much space.
     */
    const itemsPerRow = Math.floor(width / expectedWidth);
    const totalRows = clamp(
      1,
      5,
      Math.floor((entries.length + profileLinkInt) / itemsPerRow),
    );
    const totalItems = itemsPerRow * totalRows;

    for (let i = 0; i < totalItems - profileLinkInt; i++) {
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
};

export { init };
