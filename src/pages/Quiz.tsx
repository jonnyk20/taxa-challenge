import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { isEmpty } from 'ramda';
import ImageQuestion from '../components/ImageQuestion/ImageQuestion';
import formatQuiz, { FormattedQuiz } from '../utils/formatQuiz';
import { isNilOrEmpty, isNotNilOrEmpty } from '../utils/utils';
import { sampleImageQuiz } from '../utils/sampleQuiz';
import { QUIZ_TYPES } from '../constants/quizProperties';
import initializeModSelections from '../utils/initializeModSelections';

import './Quiz.scss';
import { fetchQuiz } from '../services/OneClickQuizService';

interface State {
  quiz: FormattedQuiz;
  user: string;
}

type Location = {
  state: State;
};

const Quiz = () => {
  const { slug = '' } = useParams();
  const [quiz, setQuiz] = useState<FormattedQuiz>({
    name: '',
    quizType: QUIZ_TYPES.IMAGE_QUIZ,
    questions: [],
    tags: []
  });
  const [correctAnswerCount, setCorrectAnswerrs] = useState<number>(0);
  const [maxCorrectAnswers, setmaxCorrectAnswers] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [modSelections, setModSelections] = useState<any>(
    initializeModSelections()
  );
  const location = useLocation() as any;
  const navigate = useNavigate();

  const isTesting = slug === 'testing';

  useEffect(() => {
    const prepareQuiz = async () => {
      const data = await fetchQuiz(slug);
      if (data?.quiz?.id) {
        const formattedQuiz = formatQuiz(data.quiz);
        setQuiz(formattedQuiz);
        setmaxCorrectAnswers(formattedQuiz.questions.length);
      } else {
        navigate('/');
      }
    };

    if (!isNilOrEmpty(location?.state?.quiz)) {
      const { quiz } = location.state as any;
      setQuiz(quiz);
      setmaxCorrectAnswers(quiz.questions.length);
      return;
    }

    if (isTesting) {
      setQuiz(sampleImageQuiz);
      setmaxCorrectAnswers(sampleImageQuiz.questions.length);
      return;
    }

    if (!isEmpty(slug)) {
      prepareQuiz();
    }
  }, [navigate, isTesting, location, slug]);

  useEffect(() => {
    if (isFinished) {
      navigate('/finish', {
        state: {
          quiz,
          modSelections,
          score,
          correctAnswerCount,
          maxCorrectAnswers
        }
      });
    }
  }, [
    correctAnswerCount,
    navigate,
    isFinished,
    maxCorrectAnswers,
    modSelections,
    quiz,
    score
  ]);

  const updateModsSelection = () => {
    const newHeadMod = {
      name: 'head',
      value: 5
    };
    const newModSelections = [...modSelections.slice(0, 4), newHeadMod];

    setModSelections(newModSelections);
  };

  const incrementCorrectAnswers = () => {
    const newCorrectAnswersCount = correctAnswerCount + 1;
    setCorrectAnswerrs(newCorrectAnswersCount);

    if (newCorrectAnswersCount === maxCorrectAnswers) {
      updateModsSelection();
    }
  };
  const incrementScore = (addedScore: number) => setScore(score + addedScore);

  const incrementQuestion = () => {
    if (currentQuestionIndex < quiz!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      return;
    }
    setIsFinished(true);
  };

  const isEmptyQuiz = isNotNilOrEmpty(quiz) && isNilOrEmpty(quiz.questions);

  const currentQuestion = quiz?.questions[currentQuestionIndex];

  const QuestionComponent = ImageQuestion;

  return (
    <div className="quiz container">
      {isEmptyQuiz && (
        <h4 className="text-large">Looks like there are no questions</h4>
      )}

      {!isNilOrEmpty(quiz.questions) && !isFinished && (
        <QuestionComponent
          correctAnswerCount={correctAnswerCount}
          maxCorrectAnswers={maxCorrectAnswers}
          score={score}
          question={currentQuestion}
          incrementCorrectAnswers={incrementCorrectAnswers}
          incrementScore={incrementScore}
          incrementQuestion={incrementQuestion}
          modSelections={modSelections}
        />
      )}
    </div>
  );
};

export default Quiz;
