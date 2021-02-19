import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Input from './Input';

const TeamRegisterForm = (props) => {
  const history = useHistory();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [foundationDate, setFoundationDate] = useState('');
  const [province, setProvince] = useState('');
  const [tel, setTel] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [bio, setBio] = useState('');

  const register = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8080/teamSignup', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        repeatPassword,
        foundationDate: foundationDate || null,
        tel: tel || null,
        province: province || null,
        bio: bio || null,
      }),
    });
    if (res.ok) {
      history.push('/login');
    }
  };

  const handleChange = (event) => {
    setBio(event.target.value);
  };

  return (
    <form id="teamRegister" className="register" onSubmit={register}>
      <img src={'/assets/roles/team.png'} alt={'Icono de equipo'} />
      <h2>Sign up</h2>

      <Input id={'name'} value={name} setValue={setName} type={'text'} children={'Nombre del equipo'} required={true} />
      <Input id={'email'} value={email} setValue={setEmail} type={'email'} children={'Email'} required={true} />
      <Input
        id={'foundationDate'}
        value={foundationDate}
        setValue={setFoundationDate}
        type={'date'}
        children={'Fecha de fundación'}
      />
      <Input id={'province'} value={province} setValue={setProvince} type={'text'} children={'Provincia'} />
      <Input id={'tel'} value={tel} setValue={setTel} type={'tel'} children={'Teléfono'} />
      <Input
        id={'password'}
        value={password}
        setValue={setPassword}
        type={'password'}
        children={'Contraseña'}
        required={true}
      />
      <Input
        id={'repeatPassword'}
        value={repeatPassword}
        setValue={setRepeatPassword}
        type={'password'}
        children={'Repetir contraseña'}
        required={true}
      />
      <div className={'inputWrapper'}>
        <label htmlFor="about">Sobre el equipo...</label>
        <textarea
          name="about"
          id="about"
          value={bio}
          onChange={handleChange}
          placeholder="Información adicional que quieras añadir..."
        />
      </div>

      <button />
    </form>
  );
};

export default TeamRegisterForm;
