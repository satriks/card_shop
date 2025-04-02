import "./App.css";
import "./main.scss";
import "@fontsource/alegreya-sc/400.css";
import Cookies from "js-cookie";
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
import Spinner from "./components/Common/Spinner/Spinner";
import { setCards, setCategory, setUserActiveState } from "./redux/MainSlice";
import { CardDataDto } from "./models/models";
import Cart from "./components/Cart/Cart";
import CardDetail from "./components/CardDetail/CardDetail";
import Delivery from "./components/Delivery/Delivery";
import { useRememberUser } from "./utils/utils";

function App() {
  const { data = [], isLoading, isError } = useGetCardQuery("");
  const userInfo = useAppSelector((state) => state.store.isUserInfo);
  const cartIsActive = useAppSelector((state) => state.store.cart.isActive);
  const delivery = useAppSelector((state) => state.store.isDelivery);
  const activeCard = useAppSelector((state) => state.store.cardDetail);
  const { remmemberUser, token } = useRememberUser();
  const dispatch = useAppDispatch();

  useEffect(() => {
    remmemberUser();

    if (data.length > 0) {
      dispatch(setCards(data));
      let category: string[] = [];
      console.log(data);

      data.forEach((element: CardDataDto) => {
        category.push(...element.categories);
      });
      dispatch(setCategory(["Все", ...new Set(category)]));
    }
  }, [data, dispatch]);

  return (
    <div className="wrapper">
      <Header />
      <Title />
      {delivery && <Delivery />}
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
