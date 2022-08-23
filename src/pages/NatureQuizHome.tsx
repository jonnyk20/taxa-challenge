import React from 'react';
import './NatureQuizHome.scss';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const NatrueQuizHome = () => (
  <div className="nature-quiz-home container">
    <div className="mv-50">
      <h2>Taxa Challenge</h2>
      <h4>How well do you know your local plants and animals?</h4>
      <Link
        to="/taxa-challenge"
        className="text-medium text-link text-light-color mv-20 flex"
      >
        <Button onClick={() => {}}>Try a taxa Quiz</Button>
      </Link>
      <div className="mb-20 mt-50 text-medium text-large">
        <div>
          Are you an{' '}
          <a href="https://www.inaturalist.org/" className="text-white">
            iNaturalist
          </a>
          &nbsp;user?
        </div>
      </div>
      Quiz yourself on
      <div className="mv-20">
        <Link
          to="/my-observations"
          className="text-medium text-light-color flex"
        >
          taxa you've observed
        </Link>
      </div>
      &nbsp;or&nbsp;
      <div className="mv-20">
        <Link
          to="/inat-projects"
          className="text-medium text-light-color flex mt-20"
        >
          taxa from a specific project
        </Link>
      </div>
    </div>
  </div>
);

export default NatrueQuizHome;
