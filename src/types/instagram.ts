export interface InstagramPost {
  link: string;
}

export type InstagramImage = InstagramPost & {
  type: 'image';
  images: {
    low_resolution: {
      url: string;
      width: number;
      height: number;
    };
    thumbnail: {
      url: string;
      width: number;
      height: number;
    };
    standard_resolution: {
      url: string;
      width: number;
      height: number;
    };
  };
};

export type InstagramVideo = InstagramPost & {
  type: 'video';
  videos: {
    low_resolution: {
      url: string;
      width: number;
      height: number;
    };
    standard_resolution: {
      url: string;
      width: number;
      height: number;
    };
  };
  images: {
    low_resolution: {
      url: string;
      width: number;
      height: number;
    };
    thumbnail: {
      url: string;
      width: number;
      height: number;
    };
    standard_resolution: {
      url: string;
      width: number;
      height: number;
    };
  };
};

export interface InstagramFeedResponse {
  data: (InstagramImage | InstagramVideo)[];
}
