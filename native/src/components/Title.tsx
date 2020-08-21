import React, {FunctionComponent} from 'react';
import {Image} from 'react-native-elements';

import {Title as ITitle} from '../core/interfaces/title';
import {getImageUrl} from '../utils/common';
import {CARD_WIDTH} from '../constants/style';
import {TouchableOpacity} from 'react-native-gesture-handler';

export interface TitleProps {
  title: ITitle;
  width?: number;
}

const Title: FunctionComponent<TitleProps> = ({title, width}) => {
  const uri = getImageUrl(title.images[0]?.url);
  const cardWidth = width ?? CARD_WIDTH;
  const cardHeight = cardWidth * 1.6;
  return (
    <TouchableOpacity style={{marginRight: 15, marginBottom: 15}}>
      <Image style={{height: cardHeight, width: cardWidth}} source={{uri}} />
    </TouchableOpacity>
  );
};

export default Title;
