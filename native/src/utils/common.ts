import {Topic} from '../core/interfaces/topic';
import {ImageQuality} from '../core/interfaces/title';
import {Episode} from '../core/interfaces/episode';
import {SimpleSeason} from '../core/interfaces/season';
import {NativeScrollEvent} from 'react-native';
import UrlBase from './url-base';

export const capitalizeFirst = (str: string) => str?.charAt(0).toUpperCase() + str.slice(1);

export const joinTopics = (topics?: Topic[], sep = ' • ') =>
  topics?.map((g) => capitalizeFirst(g.name)).join(sep);

export const getImageUrl = (url?: string, quality = ImageQuality.v250) => {
  if (!url) {
    return url;
  }

  const imageUrl = url
    .replace('static.1001nights.fun', 'static.1001nights.fun:1001')
    .replace('{q}v', quality)
    .replace('{f}', 'jpg');

  if (!UrlBase.private) {
    console.log(`${UrlBase.publicBase}/api/forward_images/?image_url=${imageUrl}`);
    return `${UrlBase.publicBase}/api/forward_images/?image_url=${imageUrl}`;
  }

  return imageUrl;
};

export const swapEpisodeUrlId = (url: string) => {
  if (!url) {
    return null;
  }

  const arr = url.split('/');

  const fourth = arr[4];
  const fifth = arr[5];
  const sixth = arr[6];

  if (fifth.length < 4 && sixth.length < 4) {
    return url;
  }

  arr[4] = sixth;
  arr[5] = fourth;
  arr[6] = fifth;
  return arr.join('/');
};

export const sortTopics = (topics: Episode[] | SimpleSeason[]): Episode[] | SimpleSeason[] =>
  topics.sort((a, b) => (a.index < b.index ? -1 : a.index === b.index ? 0 : 1));

export const cleanObjectProperties = (obj: any): any => {
  const newObj: any = {};
  const props = Object.getOwnPropertyNames(obj);
  for (const prop of props) {
    if (obj[prop] !== '' && obj[prop] !== undefined && obj[prop] !== null) {
      newObj[prop] = obj[prop];
    }
  }

  return newObj;
};

export const isCloseToBottom = (
  {layoutMeasurement, contentOffset, contentSize}: NativeScrollEvent,
  paddingToBottom = 20,
) => layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
