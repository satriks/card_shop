import { useAppDispatch } from "../../models/hooks";
import { setUserInfo } from "../../redux/MainSlice";
import cancel from "../../assets/common/cancel.png";
import "./UserPanel.scss";
import CancelButton from "../Common/CancelButton/cancelButton";

type Props = {};

export default function UserPanel({}: Props) {
  const dispatch = useAppDispatch();

  return (
    <div className="userPanel_wrapper" onClick={closeUserInfo}>
      <div className="userPanel">
        <h2>Личный кабинет </h2>
        <button>ФИО</button>
        <button>Изменить пароль</button>
        <button>Телефон</button>
        <button>Электронный адрес</button>
        <button>Доставка</button>
        <button>Способы оплаты</button>
        <button>Мои заказы</button>
        <CancelButton
          onClick={() => {
            dispatch(setUserInfo());
          }}
        />
      </div>
    </div>
  );

  function closeUserInfo(e: React.MouseEvent) {
    e.preventDefault();
    if ((e.target as HTMLElement).className == "userPanel_wrapper") {
      dispatch(setUserInfo());
    }

    // dispatch(setUserInfo())
  }
}
