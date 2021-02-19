import { useState, useRef, useContext } from 'react';
import { AuthContext } from '../components/providers/AuthProvider';
import { useHistory } from 'react-router-dom';

const EditableHeader = ({ header, name }) => {
  const history = useHistory();
  const imageInput = useRef();
  const [headerImage, setHeaderImage] = useState(header);
  const [token] = useContext(AuthContext);

  const onInputChange = async (e) => {
    const file = imageInput.current.files[0];
    const payload = new FormData();
    payload.append('header', file);

    const response = await fetch('http://localhost:8080/upload-header', {
      method: 'POST',
      headers: {
        Authorization: `${token}`,
      },
      body: payload,
    });

    if (response.ok) {
      const data = await response.json();
      setHeaderImage(data.data.header);
      history.go(0);
    }
  };

  return (
    <>
      <form>
        <label htmlFor="header">
          <img
            className={'header'}
            src={`http://localhost:8080/${headerImage || 'defaultHeader.jpg'}`}
            alt={`Header de ${name}`}
          />
        </label>
        <input
          ref={imageInput}
          type="file"
          id="header"
          style={{ display: 'none' }}
          accept="image/*"
          onChange={onInputChange}
        />
      </form>
    </>
  );
};

export default EditableHeader;
