import { useState, useRef, useContext } from 'react';
import { AuthContext } from '../components/providers/AuthProvider';
import { useHistory } from 'react-router-dom';

const EditableAvatar = ({ avatar, name }) => {
  const history = useHistory();
  const imageInput = useRef();
  const [avatarImage, setAvatarImage] = useState(avatar);
  const [token] = useContext(AuthContext);

  const onInputChange = async (e) => {
    const file = imageInput.current.files[0];
    const payload = new FormData();
    payload.append('avatar', file);

    const response = await fetch('http://localhost:8080/upload-photos', {
      method: 'POST',
      headers: {
        Authorization: `${token}`,
      },
      body: payload,
    });

    if (response.ok) {
      const data = await response.json();
      setAvatarImage(data.data.avatar);
      history.go(0);
    }
  };

  return (
    <>
      <form>
        <label htmlFor="avatar">
          <img
            className={'avatar'}
            src={`http://localhost:8080/${avatarImage || 'defaultAvatar.png'}`}
            alt={`Avatar de ${name}`}
          />
        </label>
        <input
          ref={imageInput}
          type="file"
          id="avatar"
          style={{ display: 'none' }}
          accept="image/*"
          onChange={onInputChange}
        />
      </form>
    </>
  );
};

export default EditableAvatar;
