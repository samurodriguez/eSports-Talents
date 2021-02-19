const rankNumberToName = (rankNumber) => {
  const rankNames = [
    'Hierro 4',
    'Hierro 3',
    'Hierro 2',
    'Hierro 1',
    'Bronze 4',
    'Bronze 3',
    'Bronze 2',
    'Bronze 1',
    'Plata 4',
    'Plata 3',
    'Plata 2',
    'Plata 1',
    'Oro 4',
    'Oro 3',
    'Oro 2',
    'Oro 1',
    'Platino 4',
    'Platino 3',
    'Platino 2',
    'Platino 1',
    'Diamante 4',
    'Diamante 3',
    'Diamante 2',
    'Diamante 1',
    'Master',
    'Grandmaster',
    'Challenger',
  ];

  return rankNames[rankNumber];
};

export default rankNumberToName;
