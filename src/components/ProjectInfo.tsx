
const EMAIL_SUBJECT = encodeURI('Taxa Challenge');

const ProjectInfo = () => (
  <div className="project-info text-small">
    <p>
      Built by <a href="https://twitter.com/jonnykalambay">Jonny Kalambay</a>
    </p>
    <p>
      This site uses data
      from&nbsp;
      <a href="https://www.inaturalist.org/">iNaturalist</a>
    </p>
    <p>
      Thank you&nbsp;
      <a href="https://twitter.com/natbat">Natalie Downe</a> and&nbsp;
      <a href="https://twitter.com/simonw">Simon Willison</a> for building&nbsp;
      <a href="https://www.owlsnearme.com/">owlsnearme.com</a>, from which
      the&nbsp;project was inspired
    </p>
    <p>
      You can find my code &nbsp;
      <a href="https://github.com/jonnyk20/taxa-challenge">here</a>
    </p>
    <p>
     And if you have questions or notice something broken please reach out to me &nbsp;
     <a
        className="text-light-color"
        href={`mailto:jonnyk_78@hotmail.com?subject=${EMAIL_SUBJECT}`}
        target="_blank"
        rel="noopener noreferrer"
      >here</a>
    </p>
  </div>
);

export default ProjectInfo;
