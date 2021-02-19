import { useContext, useState } from 'react';
import { AuthContext } from '../components/providers/AuthProvider';
import decodeTokenData from '../utils/decodeTokenData';

const RequestContent = ({ scoutId, playerId, title, content, status }) => {
  const [token] = useContext(AuthContext);
  const decodedToken = decodeTokenData(token);
  const [requestStatus, setRequestStatus] = useState(status);

  const acceptRequest = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:8080/requests/${scoutId}/${playerId}/accept`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `${token}`,
      },
    });
    setRequestStatus(1);
  };

  const rejectRequest = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:8080/requests/${scoutId}/${playerId}/reject`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `${token}`,
      },
    });
    setRequestStatus(0);
  };

  return (
    <section className={'requestContent'}>
      <h2>{title}</h2>
      <p>{content}</p>
      {requestStatus === null && decodedToken.userRole === 'player' && (
        <>
          <button onClick={acceptRequest}>Aceptar</button>
          <button onClick={rejectRequest}>Rechazar</button>
        </>
      )}
      <p>
        {'Estado: '}
        {requestStatus === 1 ? (
          <span>Aceptada</span>
        ) : requestStatus === 0 ? (
          <span>Rechazada</span>
        ) : (
          <span>Pendiente</span>
        )}
      </p>
    </section>
  );
};

export default RequestContent;
