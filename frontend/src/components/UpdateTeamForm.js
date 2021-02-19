import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Input from './Input';

const UpdateTeamForm = ({
  token,
  teamId,
  oldName,
  oldEmail,
  oldFoundationDate,
  oldProvince,
  oldTel,
  oldAbout,
  setIsProfileEditable,
}) => {
  const history = useHistory();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [foundationDate, setFoundationDate] = useState('');
  const [province, setProvince] = useState('');
  const [tel, setTel] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [bio, setBio] = useState('');

  const update = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:8080/team/${teamId}/update`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        name,
        email,
        password,
        repeatPassword,
        foundationDate,
        province,
        tel,
        bio,
      }),
    });
    if (res.ok) {
      history.go(0);
    }
  };

  const handleChange = (event) => {
    setBio(event.target.value);
  };

  return (
    <form id="teamUpdate" className="update" onSubmit={update}>
      <Input
        id={'name'}
        value={name}
        setValue={setName}
        type={'text'}
        children={'Nombre del equipo'}
        placeholder={oldName}
      />
      <Input id={'email'} value={email} setValue={setEmail} type={'email'} children={'Email'} placeholder={oldEmail} />
      <Input
        id={'foundationDate'}
        value={foundationDate}
        setValue={setFoundationDate}
        type={'date'}
        children={'Fecha de fundación'}
        placeholder={oldFoundationDate}
      />
      <Input
        id={'province'}
        value={province}
        setValue={setProvince}
        type={'text'}
        children={'Provincia'}
        placeholder={oldProvince || 'Nueva provincia...'}
      />
      <Input
        id={'tel'}
        value={tel}
        setValue={setTel}
        type={'tel'}
        children={'Teléfono'}
        placeholder={oldTel || 'Nuevo teléfono...'}
      />
      <Input
        id={'password'}
        value={password}
        setValue={setPassword}
        type={'password'}
        children={'Contraseña'}
        placeholder={'Nueva contraseña...'}
      />
      <Input
        id={'repeatPassword'}
        value={repeatPassword}
        setValue={setRepeatPassword}
        type={'password'}
        children={'Repetir contraseña'}
        placeholder={'Repetir nueva contraseña...'}
      />
      <div className={'textareaWrapper'}>
        <label htmlFor="about">Sobre el equipo...</label>
        <textarea
          name="about"
          id="about"
          value={bio}
          onChange={handleChange}
          placeholder={oldAbout || 'Nueva biografía...'}
        />
      </div>

      <button className={'updateProfile'}>Actualizar</button>
      <button type="button" className={'updateProfile'} onClick={() => setIsProfileEditable(false)}>
        Deshacer
      </button>
    </form>
  );
};

export default UpdateTeamForm;
