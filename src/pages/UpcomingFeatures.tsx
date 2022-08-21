
import './UpcomingFeatures.scss';
import ProjectInfo from '../components/ProjectInfo';
import { Link } from 'react-router-dom';


const UpcomingFeatures = () => (
  <div className="upcoming-features container">
    <div className="mt-50">
      <Link to="/">Home</Link>
    </div>
    <div className="mt-50">
      <ProjectInfo />
    </div>
  </div>
);

export default UpcomingFeatures;
