import React from 'react';
import {requireNativeComponent} from 'react-native';

interface TheoPlayerProps {
  autoplay?: boolean;
  fullscreenOrientationCoupling?: boolean;
  source: {
    sources: {type: 'video/mp4' | 'application/x-mpegurl'; src: string}[];
    poster?: string;
    textTracks?: {
      default: boolean; //optional
      kind: 'subtitles'; //optional - find other values at https://support.theoplayer.com/hc/en-us/articles/214350425#TextTrackDescription
      label: string; //optional - this will appear in your UI
      src: string;
      srclang: string;
    }[];
  };
  style?: any;
}

const THEOplayerViewNative = requireNativeComponent<any>('THEOplayerView');

export const TheoPlayer: React.FC<TheoPlayerProps> = ({
  autoplay = false,
  fullscreenOrientationCoupling = true,
  source,
  ...props
}) => {
  return (
    <THEOplayerViewNative
      autoplay={autoplay}
      fullscreenOrientationCoupling={fullscreenOrientationCoupling}
      source={source}
      {...props}
    />
  );
};
