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
import { setCards, setCategory } from "./redux/MainSlice";
import { CardDataDto } from "./models/models";
import Cart from "./components/Cart/Cart";
import CardDetail from "./components/CardDetail/CardDetail";
import CityInput from "./components/Delivery/Delivery";

function App() {
  const { data = [], isLoading, isError } = useGetCardQuery("");
  const userInfo = useAppSelector((state) => state.store.userInfo);
  const cartIsActive = useAppSelector((state) => state.store.cart.isActive);
  const activeCard = useAppSelector((state) => state.store.cardDetail);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data.length > 0) {
      dispatch(setCards(data));
      let category: string[] = [];
      data.forEach((element: CardDataDto) => {
        category.push(...element.tags);
      });
      dispatch(setCategory(["Все", ...new Set(category)]));
    }
  }, [data, dispatch]);

  return (
    <div className="wrapper">
      <Header />
      <Title />
      <CityInput />
      {activeCard && <CardDetail card={activeCard} />}
      {cartIsActive && <Cart />}
      <Category />
      {isLoading ? <Spinner /> : <Cards />}
      <AboutMe />
      <Footer />
      {userInfo && <UserPanel />}
    </div>
  );
}

export default App;
