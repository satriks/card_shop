import "./App.css";
import "./main.scss";
import "@fontsource/alegreya-sc/400.css";
import { Header } from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AboutMe from "./components/AboutMe/AboutMe";
import Cards from "./components/Cards/Cards";
import Title from "./components/Title/Title";
import Category from "./components/Category/Category";
import { useAppSelector } from "./models/hooks";
import UserPanel from "./components/User/UserPanel";

function App() {
  const userInfo = useAppSelector((state) => state.store.userInfo);

  return (
    <div className="wrapper">
      <Header />
      <Title />
      <Category />
      <Cards />
      <AboutMe />
      <Footer />
      {userInfo && <UserPanel />}
    </div>
  );
}

export default App;
