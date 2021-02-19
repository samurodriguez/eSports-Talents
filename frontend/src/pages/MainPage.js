import { useContext, useEffect } from 'react';
import { AuthContext } from '../components/providers/AuthProvider';
import Menu from '../components/Menu';
import FixedBar from '../components/FixedBar';
import Intro from '../components/Intro';
import ContentSection from '../components/ContentSection';
import Footer from '../components/Footer';

const sectionContents = {
  playerContent:
    'Hazte un hueco en el mundo de los eSports publicando tus mejores jugadas e informando a tus seguidores de tus próximos streams o partidos',
  scoutContent:
    'Descube nuevos talentos para tu equipo, analiza sus jugadas y decide si cumplen con el perfil que buscas ',
  amateurContent:
    '¡No te pierdas ni una jugada de tus jugadores favoritos, sigue su trayectoria y anímalos a conseguir sus objetivos!',
  teamContent: '¡Registra tu equipo y aministra tu plantilla!',
};

const MainPage = (props) => {
  const [, setToken] = useContext(AuthContext);

  useEffect(() => {
    setToken('');
  });

  return (
    <>
      <FixedBar />
      <main>
        <Intro />
        <div id={'registerSections'}>
          <ContentSection title={'jugador'} content={sectionContents.playerContent} role={'player'} />
          <ContentSection title={'ojeador'} content={sectionContents.scoutContent} role={'scout'} />
          <ContentSection title={'aficionado'} content={sectionContents.amateurContent} role={'amateur'} />
          <ContentSection title={'equipo'} content={sectionContents.teamContent} role={'team'} />
        </div>
      </main>
      <Menu />
      <Footer />
    </>
  );
};

export default MainPage;
