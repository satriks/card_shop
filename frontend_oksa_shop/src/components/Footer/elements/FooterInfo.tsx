import { useAppDispatch } from "../../../models/hooks";
import { setActiveCart, setDelivery } from "../../../redux/MainSlice";
import flowwow from "../../../assets/footer/flowwow.jpeg";
import master from "../../../assets/footer/Master.png";

export default function FooterInfo() {
  const dispatch = useAppDispatch();

  const scrollToAbout = () => {
    const aboutElement = document.querySelector(".about_wrapper");
    if (aboutElement) {
      const top = aboutElement.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const scrollToCategory = () => {
    const categoryElement = document.querySelector(".category");
    if (categoryElement) {
      const top = categoryElement.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="footer_info">
      <div className="footer_info_pages">
        <p>Информация:</p>

        <p onClick={scrollToCategory}> Каталог </p>
        <p onClick={scrollToAbout}> Обо мне </p>
        <p
          onClick={() => {
            dispatch(setDelivery(true));
          }}
        >
          Доставка
        </p>
        <p
          onClick={() => {
            dispatch(setActiveCart(true));
          }}
        >
          Корзина
        </p>

        {/* <p>Оплата</p> */}
      </div>
      <div className="footer_info_contacts">
        <p>Контакты:</p>
        <p>почта - email@email.ru </p>
        {/* <p>тел - +7(910)105-31-32</p> */}
        <p>Мои работы так же можно найти :</p>
        <div className="social_links">
          <div className="flowwow">
            <a
              href="https://flowwow.com/shop/kailin-cards/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={flowwow} alt="Логотип flowwow" />
            </a>
          </div>
          <div className="master">
            <a
              href="https://www.livemaster.ru/vereskun-yurij"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={master} alt="Логотип flowwow" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
