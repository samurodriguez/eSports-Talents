const List = ({ className, data, render }) => {
  return <ul className={className}>{data.map(render)}</ul>;
};

export default List;
