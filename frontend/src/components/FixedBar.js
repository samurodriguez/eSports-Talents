import { useContext } from 'react';
import { AuthContext } from '../components/providers/AuthProvider';
import { Link } from 'react-router-dom';
import decodeTokenData from '../utils/decodeTokenData';

const FixedBar = (props) => {
  const [token] = useContext(AuthContext);
  const decodedTokenData = decodeTokenData(token) || {};

  const toggleMenu = (e) => {
    e.preventDefault();
    const menu = document.getElementById('menu');
    menu.classList.toggle('hidden');
  };

  return (
    <header>
      <button onClick={toggleMenu} />
      {token === '' ? (
        <Link to="/" />
      ) : decodedTokenData.userRole !== 'team' ? (
        <Link to="/home" />
      ) : (
        <Link to="/profile" />
      )}
      {token === '' ? <Link to="/login">Sign in</Link> : <Link to="/">Sign out</Link>}
    </header>
  );
};

export default FixedBar;
