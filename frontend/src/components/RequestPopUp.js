import { useState, useContext } from 'react';
import { AuthContext } from './providers/AuthProvider';

const RequestPopUp = ({ playerId }) => {
  const [token] = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const request = async (e) => {
    console.log('content', content);
    await fetch(`http://localhost:8080/user/${playerId}/request`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `${token}`,
      },
      body: JSON.stringify({ title, content }),
    });
  };

  const closePopUp = (e) => {
    e.preventDefault();
    const rootDiv = document.getElementById('root');
    const requestPopUp = document.getElementById('requestPopUp');
    const body = document.querySelector('body');

    rootDiv.classList.toggle('blurred');
    requestPopUp.classList.toggle('hidden');
    body.classList.toggle('scrollDisabled');
  };

  return (
    <form id={'requestPopUp'} className={'hidden'} onSubmit={request}>
      <button type={'button'} onClick={closePopUp} />
      <input
        id={'reqTitle'}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        type={'text'}
        placeholder={'Título...'}
      />
      <textarea
        name="reqContent"
        id="reqContent"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={'Escribe aquí...'}
      />
      <button>Enviar</button>
    </form>
  );
};

export default RequestPopUp;
