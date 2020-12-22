import React from 'react';
import {PrimaryButton} from './common/Buttons';
import {Title} from '../core/interfaces/title';
import {FaPlay} from 'react-icons/fa';
import {useTranslation} from 'react-i18next';

export default ({title}: {title: Title}) => {
  const {t} = useTranslation();
  return (
    <PrimaryButton
      className="md:mr-8"
      to={title?.type === 'm' ? `/movie/${title?.id}/play` : `/series/${title?.id}/auto/auto/play`}>
      <FaPlay className="mr-3" size="1.5em" />
      {t('play')}
    </PrimaryButton>
  );
};
