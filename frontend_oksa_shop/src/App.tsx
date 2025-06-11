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
  setPageNotFound,
  setUserAccess,
  setUserEmail,
  setUserFirstName,
  setUserLastName,
  setUserMiddleName,
  setUserPhone,
  setUserReset,
} from "./redux/MainSlice";
import { CardDataDto } from "./models/models";
import Cart from "./components/Cart/Cart";
import CardDetail from "./components/CardDetail/CardDetail";
import Delivery from "./components/Delivery/Delivery";
import { useRememberUser } from "./utils/utils";
import { getDeliversApi, getUserApi } from "./utils/api";
import ResetPassword from "./components/Common/ResetPassword/ResetPassword";
import SendResetEmail from "./components/Common/SendResetEmail/SendResetEmail";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import CookieConsent from "react-cookie-consent";
import ModalAlert from "./components/Common/ModalAlert/ModalAlert";

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
  const pageNotFound = useAppSelector((state) => state.store.pageNotFound);
  const { rememberUser } = useRememberUser();
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
          dispatch(setDeliveryName(address.delivery_name!));
          dispatch(setDeliveryTariffCodeState(address.delivery_tariff_code));
          dispatch(setDeliveryOfficeState(address.delivery_office));
          dispatch(setDeliveryOfficeDetail(address.delivery_office_detail!));
          dispatch(setDeliveryAddress(address.delivery_address!));
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

  useEffect(() => {
    const url = new URL(window.location.href);
    const hasParam = url.searchParams.has("reset");
    const pageNotFoundStatus = url.searchParams.has("status");
    const hasReloaded = localStorage.getItem("hasReloaded");

    if (pageNotFoundStatus) {
      const status = url.searchParams.get("status");
      if (status == "404") {
        dispatch(setPageNotFound(true));
      }
    }

    if (hasParam) {
      const access = url.searchParams.get("user");
      if (access) {
        Cookies.set("_wp_kcrt", access);
      }
      if (!hasReloaded) {
        window.location.reload();
        localStorage.setItem("hasReloaded", "true");
      }
      dispatch(setUserAccess(access));
      dispatch(setUserReset(true));
    }

    const timer = setTimeout(() => {}, 1000);
    return () => clearTimeout(timer);
  }, [dispatch, user.isReset]);

  useEffect(() => {
    if (check) {
      rememberUser();
      setCheck(false);
    }
  }, [check, rememberUser]);

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
      const category: string[] = [];

      data.forEach((element: CardDataDto) => {
        category.push(...element.categories);
      });
      dispatch(setCategory(["Все", ...new Set(category)]));
    }
  }, [user, data, delivery, dispatch]);

  if (pageNotFound) {
    return <PageNotFound />;
  }

  return (
    <div className="wrapper">
      <Header />
      <Title />
      {isDelivery && <Delivery />}
      {activeCard && <CardDetail card={activeCard} />}
      {cartIsActive && <Cart />}
      <Category />
      {isError && (
        <ModalAlert
          onClose={() => {}}
          duration={2000}
          addClass=""
          message={
            "Произошла ошибка попробуйте обновить страницу. \n  Если ошибка сохранится свяжитесь с администрацией сайта"
          }
        />
      )}
      {isLoading ? <Spinner /> : <Cards />}
      <AboutMe />
      <Footer />
      {userInfo && <UserPanel />}
      {user.isReset && <ResetPassword />}
      {user.isSendReset && <SendResetEmail />}
      <CookieConsent
        location="bottom"
        buttonText="Согласен"
        cookieName="myAwesomeCookieName2"
        style={{ background: "#c3abdb" }}
        buttonStyle={{ color: "#4e503b", fontSize: "16px" }}
        expires={150}
      >
        Оставаясь на сайте, вы соглашаетесь на использование cookie-файлов,
        нужных нам для аналитики с помощью Яндекс.Метрика и top.mail.ru..
        Нажмите "Согласен", чтобы продолжить{" "}
      </CookieConsent>
    </div>
  );
}

export default App;
