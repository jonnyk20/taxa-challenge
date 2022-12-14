import React, { SyntheticEvent, useState, MouseEvent } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

import { FormattedObservationPhoto } from '../../services/InaturalistService';
import { getRandomIndex } from '../../utils/utils';

import './TaxaChoice.scss';

const BASE_CLASS = 'taxa-choice';
const labelBaseClass = `${BASE_CLASS}__label`;

type PropTypes = {
  i: number;
  id: number;
  image_url: string;
  answerQuestion: (i: number) => void;
  isAnswered: boolean;
  isCorrect: boolean;
  name: string;
  details?: string;
  setImageFetched: (i: number) => void;
  photos: FormattedObservationPhoto[];
};

const TaxaChoice: React.FC<PropTypes> = ({
  i,
  id,
  image_url,
  answerQuestion,
  isAnswered,
  isCorrect,
  name,
  details,
  setImageFetched,
  photos
}) => {
  const className = classNames(labelBaseClass, {
    [`${labelBaseClass}--${isCorrect ? 'correct' : 'incorrect'}`]: isAnswered
  });
  const [imageIndex, setImageIndex] = useState<number>(
    getRandomIndex(photos.length)
  );
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  const cycleImage = (event: MouseEvent) => {
    event.stopPropagation();

    const nextIndex = imageIndex < photos.length - 2 ? imageIndex + 1 : 0;
    setImageIndex(nextIndex);
  };

  const onImageFetched = () => {
    setImageFetched(i);
    if (!hasLoaded) {
      setHasLoaded(true);
    }
  };


  const onLoadImage = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    onImageFetched();
  };

  const onImageError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    onImageFetched();
  };

  const photo = photos[imageIndex] || { url: image_url, user: '' };


  return (
    <div className={BASE_CLASS} onClick={() => answerQuestion(id)}>
      <img
        key={image_url}
        alt="question-choice"
        onLoad={onLoadImage}
        onError={onImageError}
        src={photo.url}
      />
      <div className={className}>
        <div>{isAnswered && name}</div>
        <div className="text-small">{isAnswered && details}</div>
      </div>
      <div className={`${BASE_CLASS}__photo-details`}>
        <a
          href={`https://www.inaturalist.org/people/${photo.user}`}
          className="text-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={`${BASE_CLASS}__photo-details__user-info text-small`}>
            <FontAwesomeIcon icon={faCamera} size="xs" />
            <span>&nbsp;{photo.user || 'inaturalist'}</span>
          </div>
        </a>
        <div
          className={`${BASE_CLASS}__photo-details__change-photo-button`}
          onClick={cycleImage}
        >
          <FontAwesomeIcon icon={faSyncAlt} size="lg" />
        </div>
      </div>
    </div>
  );
};

export default TaxaChoice;
