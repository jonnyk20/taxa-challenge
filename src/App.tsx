import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactGA from 'react-ga';
import Quiz from './pages/Quiz';
import TaxaChallenge from './pages/TaxaChallenge';
import INatProjects from './pages/INatProjects';
import MyObservations from './pages/MyObservations';
import ThankYou from './pages/ThankYou';
import UpcomingFeatures from './pages/UpcomingFeatures';
import MarineLifeQuiz from './pages/MarineLifeQuiz';
import MedoosaTest from './pages/MedoosaTest';
import FinishScreen from './pages/FinishScreen';
import TaxaQuiz from './pages/TaxaQuiz';
import NatureQuizHome from './pages/NatureQuizHome';
import ErrorBoundary from './components/ErrorBoundary';

ReactGA.initialize('UA-33174971-5');
ReactGA.pageview(window.location.pathname + window.location.search);

export const TEST_ID = 'app';

const App = () => (
  <div className="app" data-testid={TEST_ID}>
      <ErrorBoundary>
        <div className="appp__bg-overlay">
          <Router>
            <Routes>
              <Route path="/quiz/:slug" element={<Quiz />} />
              <Route path="/medoosa" element={<MedoosaTest />} />
              <Route path="/taxa-challenge" element={<TaxaChallenge />} />
              <Route path="/nature-quiz" element={<NatureQuizHome />} />
              <Route path="/inat-projects" element={<INatProjects />} />
              <Route path="/taxa-quiz" element={<TaxaQuiz />} />
              <Route path="/finish" element={<FinishScreen />} />
              <Route path="/marine-life" element={<MarineLifeQuiz />} />
              <Route path="/my-observations" element={<MyObservations />} />
              <Route path="/upcoming-features" element={<UpcomingFeatures />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/" element={<NatureQuizHome />} />
            </Routes>
          </Router>
        </div>
      </ErrorBoundary>
  </div>
);

export default App;
