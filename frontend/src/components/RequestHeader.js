import { useContext } from 'react';
import { AuthContext } from '../components/providers/AuthProvider';
import { useHistory } from 'react-router-dom';
import Avatar from './Avatar';

const RequestHeader = ({ scoutId, playerId, avatar, name, lastname, title, setSelectedRequest }) => {
  const [token] = useContext(AuthContext);
  const history = useHistory();

  const fetchRequestContent = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:8080/requests/${scoutId}/${playerId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `${token}`,
      },
    });
    const selectedRequest = await res.json();
    setSelectedRequest(selectedRequest);
  };

  const deleteRequest = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:8080/requests/${scoutId}/${playerId}/delete`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: `${token}`,
      },
    });

    setSelectedRequest('');
    history.go(0);
  };

  return (
    <li>
      <article>
        <header className={'requestHeader'} onClick={fetchRequestContent}>
          <Avatar avatar={avatar} name={name} />
          <h2>
            {name} {lastname}
          </h2>
          <h3>{title}</h3>
          <button onClick={deleteRequest} />
        </header>
      </article>
    </li>
  );
};

export default RequestHeader;
