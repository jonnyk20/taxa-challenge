import { FormattedQuestion } from './formatQuiz';
import { ChoiceWithPhotos } from '../components/TaxaQuestion/TaxaQuestion';
import { getRandomIndex, shuffle } from './utils';

export interface QuestionWithAdditionalPhotos extends FormattedQuestion {
  choices: ChoiceWithPhotos[];
}

export const formatTaxaQuestion = (
  question: QuestionWithAdditionalPhotos
): QuestionWithAdditionalPhotos => {
  const shuffledChoices = shuffle(question.choices) as ChoiceWithPhotos[];

  return {
    ...question,
    correctAnswerId: question.choices[getRandomIndex(question.choices.length)].id || 0,
    choices: shuffledChoices.map(c => ({ ...c, photos: shuffle(c.photos) }))
  };
};
