import { useParams } from 'react-router-dom';
import Menu from '../components/Menu';
import FixedBar from '../components/FixedBar';
import Footer from '../components/Footer';
import AmateurRegisterForm from '../components/AmateurRegisterForm';
import TeamRegisterForm from '../components/TeamRegisterForm';
import ScoutRegisterForm from '../components/ScoutRegisterForm';
import PlayerRegisterForm from '../components/PlayerRegisterForm';

const RegisterPage = (props) => {
  const { role } = useParams();

  return (
    <>
      <FixedBar />
      <main>
        {role === 'amateur' ? (
          <AmateurRegisterForm />
        ) : role === 'team' ? (
          <TeamRegisterForm />
        ) : role === 'scout' ? (
          <ScoutRegisterForm />
        ) : role === 'player' ? (
          <PlayerRegisterForm />
        ) : null}
      </main>
      <Menu />
      <Footer />
    </>
  );
};

export default RegisterPage;
