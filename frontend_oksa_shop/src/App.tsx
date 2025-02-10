import "./App.css";
import "./main.scss";
import "@fontsource/alegreya-sc/400.css";
import { Header } from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AboutMe from "./components/AboutMe/AboutMe";
import Cards from "./components/Cards/Cards";
import Title from "./components/Title/Title";
import Category from "./components/Category/Category";
import { useAppDispatch, useAppSelector } from "./models/hooks";
import UserPanel from "./components/User/UserPanel";
import { useGetCardQuery } from "./redux/cardAPI";
import { useEffect } from "react";
import Spinner from "./components/Common/Spiner/Spinner";
import { setCards } from "./redux/MainSlice";

function App() {
  const { data = [], isLoading, isError } = useGetCardQuery("");
  const userInfo = useAppSelector((state) => state.store.userInfo);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data.length > 0) {
      dispatch(setCards(data));
    }
  }, [data, dispatch]);

  return (
    <div className="wrapper">
      <Header />
      <Title />
      <Category />
      {isLoading ? <Spinner /> : <Cards />}
      <AboutMe />
      <Footer />
      {userInfo && <UserPanel />}
    </div>
  );
}

export default App;
