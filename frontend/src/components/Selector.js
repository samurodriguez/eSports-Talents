const Selector = ({ id, data, render, selectedValue, setSelectedValue, children, placeholder }) => {
  return (
    <div className={'selectorWrapper'}>
      <label htmlFor={id}>{children}</label>
      <select id={id} name={id} value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}>
        <option key={'default'} value={'default'}>
          Escoge aquí...
        </option>
        {data.map(render)}
      </select>
    </div>
  );
};

export default Selector;
