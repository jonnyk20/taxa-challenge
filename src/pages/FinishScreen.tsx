import React, { useState } from 'react';

import MoreFeaturesCTA from '../components/MoreFeaturesCTA';
import { FormattedQuiz } from '../utils/formatQuiz';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { isNotNilOrEmpty } from '../utils/utils';
import { QUIZ_TAGS, QUIZ_TYPES } from '../constants/quizProperties';
import Body from '../components/Medoosa/Body/Body';

import './FinishScreen.scss';
import Button from '../components/Button';
import ColorSelector from '../components/ColorSelector';
import ProgressBar from '../components/ProgressBar';
import ProjectInfo from '../components/ProjectInfo';
import SubmissionConfirmation from '../components/SubmissionConfirmation';

const submitScore = async (scoreRecord: any) => {
  const response = await fetch(
    `${window.location.origin}/api/taxa-challenge-scores`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(scoreRecord)
    }
  );
  const json = await response.json();

  return json;
};

interface State {
  quiz: FormattedQuiz;
  user: string;
  modSelections: any;
  correctAnswerCount: number;
  maxCorrectAnswers: number;
  score: number;
  usedRedemption: boolean;
}

type Location = {
  state: State;
};

enum ScoreSubmissionstate {
  INITIAL,
  SUBMITTING,
  SUBMITTED
}

const FinishScreen: React.FC = () => {
  const location = useLocation();

  const [state, setState] = useState<ScoreSubmissionstate>(
    ScoreSubmissionstate.INITIAL
  );

  const {
    quiz,
    user,
    modSelections: initialModSelections,
    correctAnswerCount,
    score,
    maxCorrectAnswers,
    usedRedemption
  } = location?.state || {} as any;

  const [inputValue, setInputValue] = useState<string>('');
  const [modSelections, setModSelectons] = useState(initialModSelections);

  if (!quiz) return <Navigate to="/" />;

  const hasNotSubmitted = state === ScoreSubmissionstate.INITIAL;
  const isSubmitting = state === ScoreSubmissionstate.SUBMITTING;
  const isSubmitted = state === ScoreSubmissionstate.SUBMITTED;

  const isTaxaChallengeQuiz = quiz.tags.includes(QUIZ_TAGS.TAXA_CHALLENGE);
  const isMyObservationQuiz = quiz.tags.includes(QUIZ_TAGS.MY_OBSERVATIONS);
  const isMarineLifeQuiz = quiz.tags.includes(QUIZ_TAGS.MARINE_LIFE);
  const isProjectQuiz = quiz.tags.includes(QUIZ_TAGS.PROJECT);
  const isINaturalistQuiz =
    isTaxaChallengeQuiz ||
    isMyObservationQuiz ||
    isMarineLifeQuiz ||
    isProjectQuiz;
  const isSentenceQuiz = quiz.quizType === QUIZ_TYPES.SENTENCE_QUIZ;

  const iNaturalizeQuizPath = isMarineLifeQuiz
    ? '/marine-life'
    : '/nature-quiz';

  const selectColor = (value: number) => {
    const newColorMod = { name: 'color', value };

    const newModSelections = [newColorMod, ...modSelections.slice(1)];

    setModSelectons(newModSelections);
  };

  const handleChange = (event: React.FormEvent<HTMLInputElement>): void => {
    const element = event.currentTarget as HTMLInputElement;
    setInputValue(element.value);
  };

  const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const scoreRecord = {
      modSelections,
      correctAnswerCount,
      questionCount: maxCorrectAnswers,
      name: inputValue,
      quizName: quiz.name,
      score,
      usedRedemption
    };

    if (isNotNilOrEmpty(inputValue.trim())) {
      setState(ScoreSubmissionstate.SUBMITTING);
      await submitScore(scoreRecord);
      setState(ScoreSubmissionstate.SUBMITTED);
    }
  };

  const stage = (correctAnswerCount / maxCorrectAnswers) * 5;

  const medoosaStage = Math.floor(stage);

  const renderScoreSubmissionContent = () => (
    <>
      <div className="text-x-large text-light-color mb-10 mt-20">Well Done</div>
      <div className="mv-10">{quiz.name}</div>
      <div>
        Correct:&nbsp;
        <span className="text-light-color">{`${correctAnswerCount}/${maxCorrectAnswers}`}</span>
        <span>&nbsp;-&nbsp;Score:&nbsp;</span>
        <span className="text-light-color">{score}</span>
      </div>


    </>
  );

  return (
    <div className="finish-screen container">

      {hasNotSubmitted && renderScoreSubmissionContent()}

      {isSubmitted && (
        <SubmissionConfirmation
          isMyObservationQuiz={isMyObservationQuiz}
          user={user}
          isTaxaChallengeQuiz={isTaxaChallengeQuiz}
        />
      )}

      {isINaturalistQuiz && (
        <div className="mt-20">
          <Link to={iNaturalizeQuizPath} className="text-link">
            <Button onClick={() => {}}>Try Again</Button>
          </Link>
        </div>
      )}


      {!isMarineLifeQuiz && (
        <>
          <div className="mt-20 text-medium">
            <Link to="/">Home</Link>
          </div>
        </>
      )}

      {isSubmitted && (
        <div className="mt-50">
          <ProjectInfo />
        </div>
      )}
    </div>
  );
};

export default FinishScreen;
