import { useState } from 'react';
import List from '../components/List';
import UserInfoHeader from '../components/UserInfoHeader';
import Selector from './Selector';
import Input from './Input';

const ExploreSelector = () => {
  const positions = ['Top', 'Jng', 'Mid', 'Adc', 'Supp'];

  const [query, setQuery] = useState('name');
  const [queryOrder, setQueryOrder] = useState('');

  const [nameQuery, setNameQuery] = useState('');
  const [positionQuery, setPositionQuery] = useState('');
  const [roleQuery, setRoleQuery] = useState('');
  const [provinceQuery, setProvinceQuery] = useState('');
  const [teamQuery, setTeamQuery] = useState('');

  const [exploreResults, setExploreResults] = useState([]);

  const explore = async (e) => {
    try {
      e.preventDefault();
      let queryUrl = '';

      switch (query) {
        case 'name':
          queryUrl = `&name=${nameQuery}`;
          break;
        case 'role':
          queryUrl = `&role=${roleQuery}`;
          break;
        case 'position':
          queryUrl = `&position=${positionQuery}`;
          break;
        case 'province':
          queryUrl = `&province=${provinceQuery}`;
          break;
        case 'team':
          queryUrl = `&team=${teamQuery}`;
          break;
        default:
          queryUrl = `&order=${queryOrder}`;
      }

      const res = await fetch(`http://localhost:8080/explore?type=${query}${queryUrl}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      });

      const fetchedExploreResults = await res.json();
      setExploreResults(fetchedExploreResults);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form id="exploreForm" onSubmit={explore}>
        <div className="selectorWrapper">
          <label htmlFor="explore">Búsqueda por:</label>
          <select name="explore" onChange={(e) => setQuery(e.target.value)}>
            <option value="name">Nombre</option>
            <option value="rank">Rango</option>
            <option value="age">Edad</option>
            <option value="role">Rol</option>
            <option value="position">Posición</option>
            <option value="province">Provincia</option>
            <option value="team">Equipo</option>
          </select>
        </div>

        {query === 'name' && (
          <Input
            id={'exploreName'}
            value={nameQuery}
            setValue={setNameQuery}
            type={'text'}
            placeholder={'Escribe aquí...'}
          />
        )}

        {query === 'position' && (
          <Selector
            id={'explorePosition'}
            data={positions}
            render={(position) => (
              <option key={positions.indexOf(position)} value={position.toLowerCase()}>
                {position}
              </option>
            )}
            selectedValue={positionQuery}
            setSelectedValue={setPositionQuery}
            children={'Posición:'}
          />
        )}

        {(query === 'rank' || query === 'age') && (
          <Selector
            id={'exploreOrder'}
            data={['ASC', 'DESC']}
            render={(order) => (
              <option key={['ASC', 'DESC'].indexOf(order)} value={order}>
                {order === 'ASC' ? 'Ascendente' : 'Descendente'}
              </option>
            )}
            selectedValue={queryOrder}
            setSelectedValue={setQueryOrder}
            children={'Orden:'}
          />
        )}

        {query === 'role' && (
          <Selector
            id={'exploreRole'}
            data={['Amateur', 'Scout', 'Player']}
            render={(role) => (
              <option key={['Amateur', 'Scout', 'Player'].indexOf(role)} value={role.toLowerCase()}>
                {role}
              </option>
            )}
            selectedValue={roleQuery}
            setSelectedValue={setRoleQuery}
            children={'Rol:'}
          />
        )}

        {query === 'province' && (
          <Input
            id={'exploreProvince'}
            value={provinceQuery}
            setValue={setProvinceQuery}
            type={'text'}
            placeholder={'Escribe aquí...'}
          />
        )}

        {query === 'team' && (
          <Input
            id={'exploreTeam'}
            value={teamQuery}
            setValue={setTeamQuery}
            type={'text'}
            placeholder={'Escribe aquí...'}
          />
        )}

        <button>Explorar</button>
      </form>

      {exploreResults.length < 1 ? (
        <p>No hay resultados para esta búsqueda</p>
      ) : (
        <section className={'exploreResults'}>
          <h2>Resultados de la búsqueda</h2>
          <List
            className={'teamPlayersList'}
            data={exploreResults}
            render={(result) => (
              <UserInfoHeader
                key={result.usr_id}
                userId={result.usr_id}
                avatar={result.usr_photo}
                name={result.usr_name}
                lastname={result.usr_lastname}
                nickname={result.usr_nickname}
                rank={result.usr_rank}
                position={result.usr_position}
              />
            )}
          />
        </section>
      )}
    </>
  );
};

export default ExploreSelector;
