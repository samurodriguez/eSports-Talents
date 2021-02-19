import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import useRemoteTeams from '../hooks/useRemoteTeams';
import Input from './Input';
import Selector from './Selector';
import getRankNames from '../utils/getRankNames';

const PlayerRegisterForm = (props) => {
  const history = useHistory();
  const [teams] = useRemoteTeams();
  const ranks = getRankNames();
  const positions = ['Top', 'Jng', 'Mid', 'Adc', 'Supp'];

  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [birth, setBirth] = useState('');
  const [province, setProvince] = useState('');
  const [tel, setTel] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [bio, setBio] = useState('');
  const [team, setTeam] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedRank, setSelectedRank] = useState('');

  const register = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8080/signup', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        role: 'player',
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
        team: team || null,
        position: selectedPosition || null,
        rank: selectedRank || null,
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
    <form id="playerRegister" className="register" onSubmit={register}>
      <img src={'/assets/roles/player.png'} alt={'Icono de jugador'} />
      <h2>Sign up</h2>

      <Input id={'name'} value={name} setValue={setName} type={'text'} children={'Nombre'} required={true} />
      <Input
        id={'lastName'}
        value={lastname}
        setValue={setLastname}
        type={'text'}
        children={'Apellidos'}
        required={true}
      />
      <Input
        id={'nickname'}
        value={nickname}
        setValue={setNickname}
        type={'text'}
        children={'Nickname'}
        required={true}
      />
      <Input id={'email'} value={email} setValue={setEmail} type={'email'} children={'Email'} required={true} />
      <Input id={'birth'} value={birth} setValue={setBirth} type={'date'} children={'Fecha de nacimiento'} />
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
      <Selector
        id={'teamSelector'}
        data={teams}
        render={(team) => (
          <option key={team.team_id} value={team.team_id}>
            {team.team_name}
          </option>
        )}
        selectedValue={team}
        setSelectedValue={setTeam}
        children={'Equipo'}
      />
      <Selector
        id={'rankSelector'}
        data={ranks}
        render={(rank) => (
          <option key={ranks.indexOf(rank)} value={ranks.indexOf(rank)}>
            {rank}
          </option>
        )}
        selectedValue={selectedRank}
        setSelectedValue={setSelectedRank}
        children={'Rango'}
      />
      <Selector
        id={'positionSelector'}
        data={positions}
        render={(position) => (
          <option key={positions.indexOf(position)} value={position.toLowerCase()}>
            {position}
          </option>
        )}
        selectedValue={selectedPosition}
        setSelectedValue={setSelectedPosition}
        children={'Posición'}
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

export default PlayerRegisterForm;
