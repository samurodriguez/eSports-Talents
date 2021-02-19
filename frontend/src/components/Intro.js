import Logo from '../images/esports_talents.png';

const Intro = (props) => {
  return (
    <section className="intro">
      <div className="logoWrapper">
        <img src={Logo} alt="Logo de eSports Talents" />
      </div>
      <video src={'assets/videos/intro.mp4'} loop autoPlay muted></video>
    </section>
  );
};

export default Intro;
