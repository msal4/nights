import React, {FunctionComponent} from 'react';
import {Image} from 'react-native-elements';

import {Title as ITitle} from '../core/interfaces/title';
import {getImageUrl} from '../utils/common';
import {CARD_HEIGHT, CARD_WIDTH} from '../constants/style';
import {TouchableOpacity} from 'react-native-gesture-handler';

export interface TitleProps {
  title: ITitle;
}

const Title: FunctionComponent<TitleProps> = ({title}) => {
  const uri = getImageUrl(title.images[0]?.url);

  return (
    <TouchableOpacity style={{marginRight: 15}}>
      <Image style={{height: CARD_HEIGHT, width: CARD_WIDTH}} source={{uri}} />
    </TouchableOpacity>
  );
};

export default Title;
