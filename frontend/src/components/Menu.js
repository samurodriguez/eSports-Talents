import { useEffect, useContext } from 'react';
import { AuthContext } from '../components/providers/AuthProvider';
import { Link } from 'react-router-dom';
import Logo from '../images/esports_talents.png';
import checkMenu from '../utils/checkMenu';
import decodeTokenData from '../utils/decodeTokenData';

const Menu = () => {
  const [token] = useContext(AuthContext);
  const decodedToken = decodeTokenData(token) || {};
  const userRole = decodedToken.userRole;
  const currentPage = window.location.pathname;

  useEffect(() => {
    checkMenu();
  }, []);

  const toggleMenu = (e) => {
    e.preventDefault();
    const menu = document.getElementById('menu');
    menu.classList.toggle('hidden');
  };

  return (
    <aside id="menu" className="hidden">
      <button onClick={toggleMenu}></button>
      <img src={Logo} alt="Logo de eSports Talents" />

      {token === '' ? (
        <ul>
          {currentPage !== '/explore' && (
            <li>
              <Link to="/explore">Explorar</Link>
            </li>
          )}
          {currentPage !== '/login' && (
            <li>
              <Link to="/login">Iniciar sesión</Link>
            </li>
          )}
        </ul>
      ) : decodedToken.userRole !== 'team' ? (
        <ul>
          {currentPage !== '/home' && (
            <li>
              <Link to="/home">Inicio</Link>
            </li>
          )}

          {currentPage !== '/notifications' && (
            <li>
              <Link to="/notifications">Notificationes</Link>
            </li>
          )}

          {currentPage !== '/explore' && (
            <li>
              <Link to="/explore">Explorar</Link>
            </li>
          )}

          {userRole === 'scout' || userRole === 'player'
            ? currentPage !== '/requests' && (
                <li>
                  <Link to="/requests">Solicitudes</Link>
                </li>
              )
            : null}

          {currentPage !== '/profile' && (
            <li>
              <Link to="/profile">Mi perfil</Link>
            </li>
          )}

          {currentPage !== '/' && (
            <li>
              <Link to="/">Cerrar sesión</Link>
            </li>
          )}
        </ul>
      ) : (
        <ul>
          {currentPage !== '/explore' && (
            <li>
              <Link to="/explore">Explorar</Link>
            </li>
          )}

          {currentPage !== '/profile' && (
            <li>
              <Link to="/profile">Mi perfil</Link>
            </li>
          )}

          {currentPage !== '/' && (
            <li>
              <Link to="/">Cerrar sesión</Link>
            </li>
          )}
        </ul>
      )}
    </aside>
  );
};

export default Menu;
