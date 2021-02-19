import Menu from '../components/Menu';
import FixedBar from '../components/FixedBar';
import Footer from '../components/Footer';
import ExploreSelector from '../components/ExploreSelector';

const HomePage = (props) => {
  return (
    <>
      <FixedBar />
      <main>
        <section className="explore">
          <ExploreSelector />
        </section>
      </main>
      <Menu />
      <Footer />
    </>
  );
};

export default HomePage;
