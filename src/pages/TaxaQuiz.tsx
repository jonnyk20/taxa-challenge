import  { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import TaxaQuestion, { ChoiceWithPhotos } from '../components/TaxaQuestion/TaxaQuestion';
import { FormattedQuiz, FormattedQuestion } from '../utils/formatQuiz';
import { isNilOrEmpty, isNotNilOrEmpty, pluralize } from '../utils/utils';
import { sampleImageQuiz } from '../utils/sampleQuiz';
import { QUIZ_TYPES } from '../constants/quizProperties';
import initializeModSelections from '../utils/initializeModSelections';
import { getObservationPhotosForTaxa } from '../services/InaturalistService';
import {
  QuestionWithAdditionalPhotos,
  formatTaxaQuestion
} from '../utils/formatTaxaQuestion';

import './Quiz.scss';
import Button from '../components/Button';


enum QUIZ_STATE {
  FIRST_RUN = 'FIRST_RUN',
  REDEMPTION_PROMPT = 'REDEMPTION_PROMPT',
  REDEMPTION_RUN = 'REDEMPTION_RUN',
  FINISHED = 'FINISHED'
}

const TaxaQuiz = () => {
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
  const [
    currentRedemptionQuestionIndex,
    setCurrentRedemptionQuestionIndex
  ] = useState<number>(0);
  const [quizState, setQuizState] = useState<QUIZ_STATE>(QUIZ_STATE.FIRST_RUN);
  const [usedRedemption, setUsedRedemption] = useState<boolean>(false);
  const [modSelections, setModSelections] = useState<any>(
    initializeModSelections()
  );
  const [
    questionsWithAdditionalPhotos,
    setQuestionsWithAdditionalPhotos
  ] = useState<QuestionWithAdditionalPhotos[]>([]);
  const [redemptionQuestions, setRedemptionQuestions] = useState<
    QuestionWithAdditionalPhotos[]
  >([]);

  const location = useLocation() as any;
  const navigate = useNavigate();

  const isTesting = slug === 'testing';

  const isEmptyQuiz = isNotNilOrEmpty(quiz) && isNilOrEmpty(quiz.questions);

  const isFirstRun = quizState === QUIZ_STATE.FIRST_RUN;
  const isRedemptionPrompt = quizState === QUIZ_STATE.REDEMPTION_PROMPT;
  const isRedemptionRun = quizState === QUIZ_STATE.REDEMPTION_RUN;
  const isFinished = quizState === QUIZ_STATE.FINISHED;

  const currentQuestion = isRedemptionRun
    ? redemptionQuestions[currentRedemptionQuestionIndex]
    : quiz.questions[currentQuestionIndex];
  const currentQuestionWithAdditionalPhotos = isRedemptionRun
    ? redemptionQuestions[currentRedemptionQuestionIndex]
    : questionsWithAdditionalPhotos[currentQuestionIndex];
  const areAdditionalImagesFetched = isNotNilOrEmpty(
    currentQuestionWithAdditionalPhotos
  );

  useEffect(() => {
    const addPhotosToChoices = async (question: FormattedQuestion) => {
      const taxonIds = question.choices.map(({ id }) => id || 0);
      const observationPhotos = await getObservationPhotosForTaxa(taxonIds);
      const taxaWithObservationPhotos: ChoiceWithPhotos[] = [];
      
      
      Object.keys(observationPhotos).forEach(taxonId => {
        const choice = question.choices.find(c => c.id === Number(taxonId));
        if (!choice) return;
        
        const choiceWithPhotos: ChoiceWithPhotos = {
          ...choice,
          photos: observationPhotos[taxonId],
        }

        taxaWithObservationPhotos.push(choiceWithPhotos)
      })

      const questionWithAdditionalPhotos: QuestionWithAdditionalPhotos = {
        ...question,
        choices: taxaWithObservationPhotos
      };
      setQuestionsWithAdditionalPhotos(prev => [
        ...prev,
        questionWithAdditionalPhotos
      ]);
    };

    const addPhotosToQuestions = async () => {
      const { questions } = quiz;

      for (let i = 0; i < questions.length; i ++) {
        const question = questions[i];
          await addPhotosToChoices(question);
      }
    };


    if (!isEmptyQuiz) {
      addPhotosToQuestions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmptyQuiz]);

  useEffect(() => {
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
  }, [navigate, isTesting, location, slug]);

  useEffect(() => {
    if (isFinished) {
      navigate( '/finish', {
        state: {
          quiz,
          modSelections,
          score,
          correctAnswerCount,
          maxCorrectAnswers,
          usedRedemption
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
    score,
    usedRedemption
  ]);


  const incrementCorrectAnswers = () => {
    const newCorrectAnswersCount = correctAnswerCount + 1;
    setCorrectAnswerrs(newCorrectAnswersCount);
  };

  const incrementScore = (addedScore: number) => {
    setScore(score + addedScore);
  };

  const finish = () => setQuizState(QUIZ_STATE.FINISHED);
  const startRedemtpionRun = () => {
    setUsedRedemption(true);
    setQuizState(QUIZ_STATE.REDEMPTION_RUN);
  };

  const incrementQuestion = () => {
    if (currentQuestionIndex < quiz!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      return;
    }

    if (isNilOrEmpty(redemptionQuestions)) {
      setQuizState(QUIZ_STATE.FINISHED);
      return;
    }

    // When there are redemption questins

    if (isFirstRun) {
      setQuizState(QUIZ_STATE.REDEMPTION_PROMPT);
      return;
    }

    if (
      isRedemptionRun &&
      currentRedemptionQuestionIndex < redemptionQuestions.length - 1
    ) {
      setCurrentRedemptionQuestionIndex(currentRedemptionQuestionIndex + 1);
      return;
    }

    setQuizState(QUIZ_STATE.FINISHED);
  };

  const addCurrentQuestionToRedemption = () => {
    const redemptionQuestion = formatTaxaQuestion(
      currentQuestionWithAdditionalPhotos
    );
    if (isFirstRun) {
      setRedemptionQuestions([...redemptionQuestions, redemptionQuestion]);
    }
  };

  return (
    <div className="quiz container">
      {isEmptyQuiz && (
        <div>
          <div className="mb-20">
            We couldn't find any taxa to build this quiz with
          </div>
          <div className="mv-20">
            <Link to="/nature-quiz" className="text-light-color">
              Try a different location or project!
            </Link>
          </div>
        </div>
      )}
      {isRedemptionPrompt && (
        <div>
          <div className="mv-20 text-large text-light-color">
            <b>Redemption?</b>
          </div>
          <div>{`You got ${redemptionQuestions.length} ${pluralize(
            redemptionQuestions.length,
            'answer',
            'answers'
          )} incorrect`}</div>
          <div className="mv-20">{`You can go back to ${pluralize(
            redemptionQuestions.length,
            'it',
            'them'
          )} for a better score`}</div>
          <div className="mv-20 text-small">
            (The choices will be the same but the answer may change)
          </div>
          <div className="mv-20">
            <Button onClick={startRedemtpionRun}>{`Go back and finish (${
              redemptionQuestions.length
            } ${pluralize(
              redemptionQuestions.length,
              'question',
              'questions'
            )})`}</Button>
          </div>
          <div className="mv-20">
            <Button onClick={finish}>Finish Now</Button>
          </div>
        </div>
      )}
      {!isEmptyQuiz && (isFirstRun || isRedemptionRun) && (
        <TaxaQuestion
          correctAnswerCount={correctAnswerCount}
          maxCorrectAnswers={maxCorrectAnswers}
          score={score}
          incrementCorrectAnswers={incrementCorrectAnswers}
          incrementScore={incrementScore}
          incrementQuestion={incrementQuestion}
          modSelections={modSelections}
          areAdditionalImagesFetched={areAdditionalImagesFetched}
          correctAnswerId={currentQuestion.correctAnswerId}
          choicesWithPhotos={currentQuestionWithAdditionalPhotos?.choices || []}
          addCurrentQuestionToRedemption={addCurrentQuestionToRedemption}
          isRedemptionRun={isRedemptionRun}
        />
      )}
    </div>
  );
};

export default TaxaQuiz;
