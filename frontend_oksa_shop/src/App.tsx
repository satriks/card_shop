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
import { useEffect, useState } from "react";
import Spinner from "./components/Common/Spinner/Spinner";
import {
  setAddresses,
  setCards,
  setCategory,
  setDeliveryAddress,
  setDeliveryCostState,
  setDeliveryName,
  setDeliveryOfficeDetail,
  setDeliveryOfficeState,
  setDeliverySelfState,
  setDeliveryTariffCodeState,
  setDeliveryTime,
  setUserActiveState,
  setUserEmail,
  setUserFirstName,
  setUserLastName,
  setUserMiddleName,
  setUserPhone,
} from "./redux/MainSlice";
import { CardDataDto } from "./models/models";
import Cart from "./components/Cart/Cart";
import CardDetail from "./components/CardDetail/CardDetail";
import Delivery from "./components/Delivery/Delivery";
import { useRememberUser } from "./utils/utils";
import { getDeliversApi, getUserApi, refreshApi } from "./utils/api";

function App() {
  const [check, setCheck] = useState(true);
  const { data = [], isLoading, isError } = useGetCardQuery("");
  const user = useAppSelector((state) => state.store.user);
  const delivery = useAppSelector((state) => state.store.delivery);
  const addresses = useAppSelector((state) => state.store.addresses);
  const userInfo = useAppSelector((state) => state.store.isUserInfo);
  const cartIsActive = useAppSelector((state) => state.store.cart.isActive);
  const isDelivery = useAppSelector((state) => state.store.isDelivery);
  const activeCard = useAppSelector((state) => state.store.cardDetail);
  const { rememberUser, token } = useRememberUser();
  const dispatch = useAppDispatch();
  const fetchUserData = async () => {
    if (user.isActive && user.access) {
      try {
        const resp = await getUserApi(user.access);
        dispatch(setUserFirstName(resp.first_name || null));
        dispatch(setUserLastName(resp.last_name || null));
        dispatch(setUserMiddleName(resp.middle_name || null));
        dispatch(setUserEmail(resp.email || null));
        dispatch(setUserPhone(resp.phone_number || null));
      } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
      }
    }
  };
  const setActiveDelivery = () => {
    const name = Cookies.get("_da");

    if (name) {
      const address = addresses?.filter((address) => {
        return address.delivery_name === name;
      })[0];

      if (address) {
        if (address) {
          dispatch(setDeliverySelfState(address.delivery_self || false));
          dispatch(setDeliveryCostState(Number(address.delivery_cost)));
          dispatch(setDeliveryName(address.delivery_name));
          dispatch(setDeliveryTariffCodeState(address.delivery_tariff_code));
          dispatch(setDeliveryOfficeState(address.delivery_office));
          dispatch(setDeliveryOfficeDetail(address.delivery_office_detail));
          dispatch(setDeliveryAddress(address.delivery_address));
          dispatch(
            setDeliveryTime([
              Number(address.min_delivery_time),
              Number(address.max_delivery_time),
            ])
          );
          if (address.delivery_name) Cookies.set("_da", address.delivery_name);
        }
      }
    }
  };

  //TODO подумать как переннести установку адреса из деливери в апп

  useEffect(() => {
    if (check) {
      rememberUser();
      setCheck(false);
    }
  }, [check]);

  useEffect(() => {
    fetchUserData();
    if (user.access && user.isActive) {
      getDeliversApi(user.access).then((response) => {
        dispatch(setAddresses(response));
      });
    }
    if (user.isActive && !delivery.deliveryName) {
      setActiveDelivery();
    }

    if (data.length > 0) {
      dispatch(setCards(data));
      let category: string[] = [];
      console.log(data);

      data.forEach((element: CardDataDto) => {
        category.push(...element.categories);
      });
      dispatch(setCategory(["Все", ...new Set(category)]));
    }
  }, [user, data, delivery, dispatch]);

  return (
    <div className="wrapper">
      <Header />
      <Title />
      {isDelivery && <Delivery />}
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
