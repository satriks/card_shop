import "./App.css";
import "./main.scss";
import "@fontsource/alegreya-sc/400.css";
import { Header } from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AboutMe from "./components/AboutMe/AboutMe";
import Cards from "./components/Cards/Cards";
import Title from "./components/Title/Title";
import Category from "./components/Category/Category";

function App() {
  return (
    <div className="wrapper">
      <Header />
      <Title />
      <Category />
      <Cards />

      <AboutMe />
      <Footer />
    </div>
  );
}

export default App;
