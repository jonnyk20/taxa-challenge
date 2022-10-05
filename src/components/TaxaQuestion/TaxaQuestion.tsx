import React, { useState } from 'react';

import TaxaChoice from '../TaxaChoice/TaxaChoice';
import { FormattedChoice } from '../../utils/formatQuiz';
import Button from '../Button';
import { isNotNilOrEmpty } from '../../utils/utils';
import ProgressBar from '../ProgressBar';
import { FormattedObservationPhoto } from '../../services/InaturalistService';

import './TaxaQuestion.scss';

enum states {
  UNANSWERED,
  CORRECT,
  INCORRECT
}

type PropTypes = {
  incrementCorrectAnswers: () => void;
  incrementQuestion: () => void;
  incrementScore: (addedScore: number) => void;
  score: number;
  correctAnswerCount: number;
  maxCorrectAnswers: number;
  modSelections: any;
  choicesWithPhotos: ChoiceWithPhotos[];
  correctAnswerId: number;
  areAdditionalImagesFetched: boolean;
  addCurrentQuestionToRedemption: () => void;
  isRedemptionRun: boolean;
};

const MULTIPLIER_START = 50;
const MIN_ADDED_SCORE = 10;

const BASE_CLASS = 'taxa-question';

export interface ChoiceWithPhotos extends FormattedChoice {
  photos: FormattedObservationPhoto[];
}

const TaxaQuestion: React.FC<PropTypes> = ({
  choicesWithPhotos,
  incrementCorrectAnswers,
  incrementQuestion,
  correctAnswerCount,
  maxCorrectAnswers,
  score,
  incrementScore,
  modSelections,
  areAdditionalImagesFetched,
  correctAnswerId,
  addCurrentQuestionToRedemption,
  isRedemptionRun
}) => {
  const [state, setState] = useState<states>(states.UNANSWERED);
  const [multiplier, setMultiplier] = useState<number>(MULTIPLIER_START);
  const [addedScore, setAddedScore] = useState<number>(0);
  const [loadedImages, setLoadedImages] = useState<Object>({});

  const choiceCount = choicesWithPhotos.length;
  const correctChoice = choicesWithPhotos.find(choice => choice.id === correctAnswerId);
  const loadedImagesCount = Object.keys(loadedImages).length;
  const isReady =
    areAdditionalImagesFetched &&
    loadedImagesCount === choicesWithPhotos.length;

  const answerQuestion = (id: number) => {
    if (isAnswered) return;
    if (id === correctAnswerId) {
      setState(states.CORRECT);
      incrementCorrectAnswers();
      let addedScore = Math.trunc(MIN_ADDED_SCORE * multiplier);
      if (isRedemptionRun) addedScore = Math.floor(addedScore / 2);

      setAddedScore(addedScore);
      incrementScore(addedScore);
    } else {
      setState(states.INCORRECT);
      addCurrentQuestionToRedemption();
    }

    setMultiplier(MULTIPLIER_START);
  };

  const moveToNexQuestion = () => {
    incrementQuestion();
    setAddedScore(0);
    setState(states.UNANSWERED);
    setLoadedImages({});
  };

  const setImageFetched = (i: number) => {
    setLoadedImages(prev => ({
      ...prev,
      [i]: true
    }));
  };

  const isAnswered = state !== states.UNANSWERED;
  const isAnsweredCorrectly = state === states.CORRECT;

  const answerFeedback = isAnsweredCorrectly ? 'Correct!' : 'So Close!';

  if (!correctChoice) {
    return <div className={BASE_CLASS}>Please wait...</div>
  }


  return (
    <div className={BASE_CLASS}>
      <div className={`${BASE_CLASS}__hud mb-20`}>

        <div className={`${BASE_CLASS}__hud__scores`}>
          <div>
            questions:&nbsp;
            <span className="text-light-color">{maxCorrectAnswers}</span>
          </div>
          <div>
            correct:&nbsp;
            <span className="text-light-color">{correctAnswerCount}</span>
          </div>
          <div>
            score:&nbsp;<span className="text-light-color">{score}</span>
          </div>
        </div>
      </div>

      <div className={`${BASE_CLASS}__prompt mb-20`}>
        {!isAnswered && isReady && (
          <div className={`${BASE_CLASS}__instructions`}>
            <div>Find the...&nbsp;</div>

            <div className={`${BASE_CLASS}__prompt__correct-choice-info`}>
              <span>
                <b className="text-light-color text-large">
                  {correctChoice.name}
                </b>
              </span>
              {isNotNilOrEmpty(correctChoice.details) && (
                <span>
                  <b className="text-light-color">
                    &nbsp;({correctChoice.details})
                  </b>
                </span>
              )}
            </div>
          </div>
        )}

        {isAnswered && (
          <>
            <div className={`${BASE_CLASS}__prompt__feedback`}>
              <div className="mr-10">{answerFeedback}</div>
              {isAnsweredCorrectly && (
                <div className={`${BASE_CLASS}__scoreboard__added-score mr-10`}>
                  <b>&nbsp;+{addedScore}</b>
                </div>
              )}
            </div>
            <div className="mv-20">
              <Button onClick={moveToNexQuestion}>Next</Button>
            </div>
          </>
        )}
      </div>
      {!isReady && (
        <div className={`${BASE_CLASS}__loading`}>
          <div className="mb-20">
            Loading Images... {`${loadedImagesCount}/${choiceCount}`}
          </div>
          <ProgressBar progress={loadedImagesCount / choiceCount} />
        </div>
      )}

      {
        <div
          className={`${BASE_CLASS}__choices ${
            !isReady ? `${BASE_CLASS}__choices--hide` : ''
          }`}
        >
          {choicesWithPhotos.map(({ image_url, name, details, photos, id }, i) => (
            <TaxaChoice
              key={name}
              answerQuestion={answerQuestion}
              i={i}
              id={id}
              image_url={image_url || ''}
              name={name}
              isCorrect={id === correctAnswerId}
              isAnswered={isAnswered}
              details={details}
              setImageFetched={setImageFetched}
              photos={photos}
            />
          ))}
        </div>
      }
    </div>
  );
};

export default TaxaQuestion;
