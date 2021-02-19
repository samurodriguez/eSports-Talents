import { useContext } from 'react';
import { AuthContext } from '../components/providers/AuthProvider';
import { Redirect } from 'react-router';

const RedirectIfNotLoggedIn = () => {
  const [token] = useContext(AuthContext);
  return token === '' && <Redirect to={'/login'} />;
};

export default RedirectIfNotLoggedIn;
