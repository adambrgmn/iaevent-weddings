import axios from 'axios';
import * as env from '../utils/env';
import { InstagramFeedResponse } from '../types/instagram';

const API_BASE = env.API_BASE;

const getImages = async () => {
  try {
    const response = await axios.get<InstagramFeedResponse>(
      `${API_BASE}/instagram-feed`,
    );
    console.log(response.data);
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
  const list = document.createElement('ul');

  for (let entry of entries) {
    const listItemElement = document.createElement('li');
    const linkElement = document.createElement('a');
    const imageElement = document.createElement('img');

    linkElement.href = entry.link;

    imageElement.src = entry.image.url;
    imageElement.width = entry.image.width;
    imageElement.height = entry.image.height;

    linkElement.appendChild(imageElement);
    listItemElement.appendChild(linkElement);
    list.appendChild(listItemElement);
  }

  parentEl.appendChild(list);
};

export { init };
