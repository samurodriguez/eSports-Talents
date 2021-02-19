import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Input from './Input';
import Selector from './Selector';
import useRemoteTeams from '../hooks/useRemoteTeams';
import getRankNames from '../utils/getRankNames';

const UpdateUserForm = ({
  token,
  role,
  userId,
  oldName,
  oldLastname,
  oldEmail,
  oldNickname,
  oldProvince,
  oldTel,
  oldAbout,
  oldFavTeam,
  setIsProfileEditable,
}) => {
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
  const [favTeam, setFavTeam] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [bio, setBio] = useState('');
  const [team, setTeam] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedRank, setSelectedRank] = useState('');

  const userDataToUpdate =
    role === 'player'
      ? {
          name,
          lastname,
          email,
          nickname,
          password,
          repeatPassword,
          birth,
          tel,
          province,
          bio,
          team,
          position: selectedPosition,
          rank: selectedRank,
        }
      : role === 'scout'
      ? {
          name,
          lastname,
          email,
          nickname,
          password,
          repeatPassword,
          birth,
          tel,
          province,
          bio,
          team,
        }
      : {
          name,
          lastname,
          email,
          nickname,
          password,
          repeatPassword,
          birth,
          tel,
          province,
          bio,
          fav_team: favTeam,
        };

  const update = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:8080/user/${userId}/update`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `${token}`,
      },
      body: JSON.stringify(userDataToUpdate),
    });
    if (res.ok) {
      history.go(0);
    }
  };

  const handleChange = (event) => {
    setBio(event.target.value);
  };

  return (
    <form id="userUpdate" className="update" onSubmit={update}>
      <Input id={'name'} value={name} setValue={setName} type={'text'} children={'Nombre'} placeholder={oldName} />
      <Input
        id={'lastName'}
        value={lastname}
        setValue={setLastname}
        type={'text'}
        children={'Apellidos'}
        placeholder={oldLastname}
      />
      <Input
        id={'nickname'}
        value={nickname}
        setValue={setNickname}
        type={'text'}
        children={'Nickname'}
        placeholder={oldNickname}
      />
      <Input id={'email'} value={email} setValue={setEmail} type={'email'} children={'Email'} placeholder={oldEmail} />
      <Input id={'birth'} value={birth} setValue={setBirth} type={'date'} children={'Fecha de nacimiento'} />
      {role === 'amateur' && (
        <Input
          id={'favTeam'}
          value={favTeam}
          setValue={setFavTeam}
          type={'text'}
          children={'Equipo favorito'}
          placeholder={oldFavTeam}
        />
      )}
      {role !== 'amateur' && (
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
      )}
      {role === 'player' && (
        <>
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
        </>
      )}
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
        <label htmlFor="about">Sobre ti...</label>
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

export default UpdateUserForm;
