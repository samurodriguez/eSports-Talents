import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Input from './Input';

const AmateurRegisterForm = (props) => {
  const history = useHistory();

  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [birth, setBirth] = useState('');
  const [province, setProvince] = useState('');
  const [tel, setTel] = useState('');
  const [favTeam, setFavTeam] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [bio, setBio] = useState('');

  const register = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8080/signup', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        role: 'amateur',
        name,
        lastname,
        email,
        nickname,
        password,
        repeatPassword,
        birth: birth || null,
        tel: tel || null,
        province: province || null,
        bio: bio || null,
        fav_team: favTeam || null,
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
    <form id="amateurRegister" className="register" onSubmit={register}>
      <img src={'/assets/roles/amateur.png'} alt={'Icono de aficionado'} />
      <h2>Sign up</h2>

      <Input id={'name'} value={name} setValue={setName} type={'text'} required={true} children={'Nombre'} />
      <Input
        id={'lastName'}
        value={lastname}
        setValue={setLastname}
        type={'text'}
        required={true}
        children={'Apellidos'}
      />
      <Input
        id={'nickname'}
        value={nickname}
        setValue={setNickname}
        type={'text'}
        required={true}
        children={'Nickname'}
      />
      <Input id={'email'} value={email} setValue={setEmail} type={'email'} required={true} children={'Email'} />
      <Input id={'birth'} value={birth} setValue={setBirth} type={'date'} children={'Fecha de nacimiento'} />
      <Input id={'province'} value={province} setValue={setProvince} type={'text'} children={'Provincia'} />
      <Input id={'tel'} value={tel} setValue={setTel} type={'tel'} children={'Teléfono'} />
      <Input id={'favTeam'} value={favTeam} setValue={setFavTeam} type={'text'} children={'Equipo favorito'} />
      <Input
        id={'password'}
        value={password}
        setValue={setPassword}
        type={'password'}
        required={true}
        children={'Contraseña'}
      />
      <Input
        id={'repeatPassword'}
        value={repeatPassword}
        setValue={setRepeatPassword}
        type={'password'}
        required={true}
        children={'Repetir contraseña'}
      />
      <div className={'inputWrapper'}>
        <label htmlFor="about">Sobre mí...</label>
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

export default AmateurRegisterForm;
