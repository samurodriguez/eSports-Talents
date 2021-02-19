import { Link } from 'react-router-dom';

const ContentSection = (props) => {
  const { title, content, role } = props;

  return (
    <section className="content">
      <div className="contentWrapper">
        <h2>{title}</h2>
        <p>{content}</p>
        <Link to={`/register/${role}`}>¡Regístrate aquí!</Link>
      </div>
      <img className="icon" src={`/assets/roles/${role}.png`} alt={`Icono de ${title}`} />
    </section>
  );
};

export default ContentSection;
