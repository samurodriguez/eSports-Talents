import Menu from '../components/Menu';
import FixedBar from '../components/FixedBar';
import Footer from '../components/Footer';
import { LoginForm } from '../components/LoginForm';
import { AuthContext } from '../components/providers/AuthProvider';
import { useContext } from 'react';
import { Redirect } from 'react-router';
import decodeTokenData from '../utils/decodeTokenData';

const LoginPage = (props) => {
  const [token] = useContext(AuthContext);
  if (token !== '') {
    const decodedToken = decodeTokenData(token);
    if (decodedToken.userRole !== 'team') {
      return <Redirect to={'/home'} />;
    } else {
      return <Redirect to={'/profile'} />;
    }
  }

  return (
    <>
      <FixedBar />
      <main>
        <LoginForm />
      </main>
      <Menu />
      <Footer />
    </>
  );
};

export default LoginPage;
