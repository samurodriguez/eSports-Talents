import { useContext } from 'react';
import { AuthContext } from '../components/providers/AuthProvider';

const CommentPopUp = ({ postId }) => {
  const [token] = useContext(AuthContext);

  const comment = async (e) => {
    const content = e.target[1].value;
    await fetch(`http://localhost:8080/post/${postId}/comment`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `${token}`,
      },
      body: JSON.stringify({ content }),
    });
  };

  const closePopUp = (e) => {
    e.preventDefault();
    const rootDiv = document.getElementById('root');
    const commentPopUp = document.getElementById('commentPopUp');
    const body = document.querySelector('body');

    rootDiv.classList.toggle('blurred');
    commentPopUp.classList.toggle('hidden');
    body.classList.toggle('scrollDisabled');
  };

  return (
    <form id={'commentPopUp'} className={'hidden'} onSubmit={comment}>
      <button type={'button'} onClick={closePopUp} />
      <textarea placeholder={'Escribe aquí...'} />
      <button>Enviar</button>
    </form>
  );
};

export default CommentPopUp;
