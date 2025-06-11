import React, { useEffect, useRef, useState } from "react";
import "./Delivery.scss";
import Cookies from "js-cookie";
import CancelButton from "../Common/CancelButton/CancelButton";
import { Map, Placemark, YMaps } from "@pbe/react-yandex-maps";
import { useAppDispatch, useAppSelector } from "../../models/hooks";
import {
  setAddresses,
  setDelivery,
  setDeliveryAddress,
  setDeliveryCostState,
  setDeliveryName,
  setDeliveryOfficeDetail,
  setDeliveryOfficeState,
  setDeliverySelfState,
  setDeliveryTariffCodeState,
  setDeliveryTime,
} from "../../redux/MainSlice";
import {
  useLazyGetCityDetailQuery,
  useLazyGetCityQuery,
  useLazyGetOfficesQuery,
  useLazyGetTariffsQuery,
} from "../../redux/cardAPI";
import DeliveryModal from "../Common/DeliverySaveModal/DeliveryModal";
import Spinner from "../Common/Spinner/Spinner";
import ModalAlert from "../Common/ModalAlert/ModalAlert";
import {
  CityDataDto,
  DeliveryAddressDto,
  DeliveryDto,
  GeoObjectCollectionDto,
  TariffDto,
} from "../../models/models";
import { createAddress, deleteAddress, getDeliversApi } from "../../utils/api";

type DeliveryName = {
  "Посылка склад-дверь": string;
  "Посылка склад-склад": string;
  "Экспресс склад-дверь": string;
  "Экспресс склад-склад": string;
};

const deliveryName: DeliveryName = {
  "Посылка склад-дверь": "Доставка по адресу",
  "Посылка склад-склад": "В пункт выдачи заказов",
  "Экспресс склад-дверь": "Экспресс доставка по адресу",
  "Экспресс склад-склад": "Экспресс в пункт выдачи заказов",
};

interface MapClickEvent {
  get: (key: string) => number[];
}

export default function Delivery() {
  const dispatch = useAppDispatch();
  const addresses = useAppSelector((state) => state.store.addresses);
  const delivery = useAppSelector((state) => state.store.delivery);
  const user = useAppSelector((state) => state.store.user);
  const deliveryWindow = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sdekOffice, setSdekOffice] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [tariffCode, setTariffCode] = useState<string>("");
  const [cityInfo, setCityInfo] = useState<CityDataDto>();
  const [cityInput, setCityInput] = useState<string>("");
  const [cityCurrent, setCityCurrent] = useState<boolean>();
  const [deliveryCost, setDeliveryCost] = useState<number>();
  const [isVisible, setIsVisible] = useState(true);
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    number[] | null
  >(null);

  // для доставки
  const [postCode, setPostCode] = useState<string | undefined>("");
  // стейты для формы
  const [street, setStreet] = useState<string>("");
  const [building, setBuilding] = useState<string>("");
  const [floor, setFloor] = useState<string>("");
  const [flat, setFlat] = useState<string>("");
  const [entrance, setEntrance] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const clearDeliveryForm = () => {
    setStreet("");
    setBuilding("");
    setComment("");
  };
  // Сообщения
  const [alertMessage, setAlertMessage] = useState(false);
  const [successDelAddress, setSuccessDelAddress] = useState<string | null>(
    null
  );
  const [errorDelAddress, setErrorDelAddress] = useState<string | null>(null);

  // стейты балуна
  const [baloonStreet, setBaloonStreet] = useState<string>("");
  const [baloonHouse, setBaloonHouse] = useState<string>("");
  const [baloonComment, setBaloonComment] = useState<string>("");

  // Запросы к апи
  const [
    getCity,
    { data: cityData, error: cityError, isLoading: isCityLoading },
  ] = useLazyGetCityQuery();
  const [getCityDetail, { data: cityDetail, error, isLoading }] =
    useLazyGetCityDetailQuery();
  const [
    getOffices,
    { data: officesData, error: officesError, isLoading: isOfficesLoading },
  ] = useLazyGetOfficesQuery();
  const [
    getTariffs,
    { data: tariffData, error: tariffError, isLoading: isLoadingTariff },
  ] = useLazyGetTariffsQuery();
  const getAddressFromCoordinates = async (
    latitude: string,
    longitude: string
  ) => {
    const apiKey = import.meta.env.VITE_YMAPS_KEY;
    const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&geocode=${longitude},${latitude}&format=json`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.response.GeoObjectCollection.featureMember.length > 0) {
        const address =
          data.response.GeoObjectCollection.featureMember[0].GeoObject
            .metaDataProperty.GeocoderMetaData.Address;
        setPostCode(findPostalCode(data.response.GeoObjectCollection));

        return address;
      } else {
        throw new Error("Адрес не найден");
      }
    } catch (error) {
      console.error("Ошибка получения адреса:", error);
      return null;
    }
  };

  // функции
  const closeFadeIn = () => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      dispatch(setDelivery(false));
      clearTimeout(timer);
    }, 800);
  };
  interface Dict {
    [key: string]: string | Dict;
  }
  const findPostalCode = (obj: Dict): string | undefined => {
    if (typeof obj === "object" && obj !== null) {
      // Проходим по всем ключам объекта
      for (const key in obj) {
        if (key === "PostalCode" && typeof obj[key] === "object") {
          const postalCodeObj = obj[key] as Dict;
          const res = postalCodeObj["PostalCodeNumber"];
          if (typeof res == "string") {
            return res; // Возвращаем найденный почтовый код
          } else {
            return undefined;
          }
        }

        if (typeof obj[key] === "object" && obj[key] !== null) {
          const result: string | undefined = findPostalCode(obj[key] as Dict);
          if (result) {
            // Если результат не undefined, возвращаем его
            return result;
          }
        }
      }
    }
    return undefined; // Возвращаем undefined, если ничего не найдено
  };

  const handleMapClick = (event: MapClickEvent) => {
    const coords: number[] = event.get("coords");
    setSelectedCoordinates(coords); // Сохраняем координаты

    // Получаем адрес по координатам
    getAddressFromCoordinates(coords[0].toString(), coords[1].toString()).then(
      (address: GeoObjectCollectionDto) => {
        clearDeliveryForm();
        const bStreet = address.Components.filter(
          (item) => item.kind == "street"
        )[0]?.name;
        const bHouse = address.Components.filter(
          (item) => item.kind == "house"
        )[0]?.name;
        setBaloonStreet(bStreet);
        setBaloonHouse(bHouse);
        setStreet(bStreet);
        setBuilding(bHouse);
        setHandleTariffCode("137");
      }
    );
  };
  const handleChange = (event: React.ChangeEvent) => {
    setSelectedOption((event.target as HTMLInputElement).value);
  };
  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCityInput(value);
    if (cityInput.length >= 2) {
      getCity(cityInput);
    } else {
      setCityCurrent(false);
    }
  };
  const wrapperCancel = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).className == "delivery_wrapper") {
      closeFadeIn();
    }
  };
  const scrollDown = (shift = 0) => {
    if (deliveryWindow.current) {
      deliveryWindow.current.scrollIntoView({ behavior: "smooth" });
      deliveryWindow.current.scrollBy(0, shift);
    }
  };
  const setHandleTariffCode = (code: string) => {
    setTariffCode(code);
    if (tariffData && tariffData.length > 0) {
      const tariffs = tariffData as TariffDto[];
      const tariff = tariffs.filter((tariff) => {
        return tariff.tariff_code == Number(code);
      })[0];

      setDeliveryCost(tariff.delivery_sum * 1.2);
      dispatch(setDeliveryTime([tariff.calendar_min, tariff.calendar_max]));
    }
  };
  const sendAddress = (deliveryAddressDetail: DeliveryDto) => {
    if (user.access && user.access != null) {
      const token = user.access;

      try {
        createAddress(token, deliveryAddressDetail);
        const timeout = setTimeout(() => {
          getDeliversApi(user.access!).then((response) => {
            dispatch(setAddresses(response));
          });
          clearTimeout(timeout);
        }, 3000);
      } catch (error) {
        console.error("Ошибка при создании доставки:", error);
      }
    }
  };
  const delAddress = (id: number) => {
    const newAddresses = addresses?.filter((address) => {
      return address.id != id;
    });
    if (newAddresses) dispatch(setAddresses(newAddresses));
    const token = user.access;
    if (token) {
      deleteAddress(token, id)
        .then((response) => {
          if (response.status == 204)
            setSuccessDelAddress("Адрес успешно удален");
        })
        .catch((error) => {
          setErrorDelAddress(error.message);
        });
    }
  };
  // проверка на имена ток же нужно сделать(при создании)

  const setAddress = (address: DeliveryDto) => {
    if (address) {
      dispatch(setDeliverySelfState(address.delivery_self || false));
      dispatch(setDeliveryCostState(Number(address.delivery_cost)));
      dispatch(setDeliveryName(address.delivery_name!));
      dispatch(setDeliveryTariffCodeState(address.delivery_tariff_code));
      dispatch(setDeliveryOfficeState(address.delivery_office));
      if (address.delivery_office_detail) {
        dispatch(setDeliveryOfficeDetail(address.delivery_office_detail));
      }
      if (address.delivery_address) {
        dispatch(setDeliveryAddress(address.delivery_address));
      }
      dispatch(
        setDeliveryTime([
          Number(address.min_delivery_time),
          Number(address.max_delivery_time),
        ])
      );
      if (address.delivery_name) Cookies.set("_da", address.delivery_name);
      closeFadeIn();
    }
  };

  const saveDelivery = (name: string) => {
    const deliveryAddressDetail: DeliveryDto = {};

    if (selectedOption === "self") {
      dispatch(setDeliverySelfState(true));
      deliveryAddressDetail.delivery_self = true;
      dispatch(setDeliveryCostState(0));
      deliveryAddressDetail.delivery_cost = "0";
      dispatch(setDeliveryName("Самовывоз"));
      deliveryAddressDetail.delivery_name = "Самовывоз";
    }
    if (selectedOption === "delivery") {
      dispatch(setDeliverySelfState(false));
      deliveryAddressDetail.delivery_self = false;
      dispatch(setDeliveryTariffCodeState(tariffCode));
      deliveryAddressDetail.delivery_tariff_code = tariffCode;
      dispatch(setDeliveryCostState(deliveryCost));
      deliveryAddressDetail.delivery_cost = deliveryCost?.toString();

      if (["136", "483"].includes(tariffCode)) {
        dispatch(setDeliveryOfficeState(sdekOffice));
        deliveryAddressDetail.delivery_office = sdekOffice;
        dispatch(setDeliveryName(name));
        deliveryAddressDetail.delivery_name = name;
        deliveryAddressDetail.delivery_office_detail =
          delivery.deliveryOfficeDetail;
      }

      if (cityDetail && ["137", "482"].includes(tariffCode)) {
        dispatch(setDeliveryOfficeDetail(null));
        deliveryAddressDetail.delivery_office_detail = null;
        dispatch(setDeliveryOfficeState(null));
        deliveryAddressDetail.delivery_office = null;

        const city = cityDetail[0];
        const value: DeliveryAddressDto = {
          code: cityInfo?.code,
          city_uuid: cityInfo?.city_uuid,
          city: city.city,
          country_code: city.country_code,
          country: city.country,
          region: city.region,
          region_code: city.region_code,
          sub_region: city.sub_region,
          longitude: selectedCoordinates?.[0],
          latitude: selectedCoordinates?.[1],
          time_zone: city.time_zone,
          address: `${street}, ${building}, квартира ${flat}, этаж ${floor}, подъезд ${entrance}`,
          postal_code: postCode,
        };

        dispatch(setDeliveryAddress(value));
        deliveryAddressDetail.delivery_address = value;
        dispatch(setDeliveryName(name));
        deliveryAddressDetail.delivery_name = name;
      }
      deliveryAddressDetail.min_delivery_time =
        delivery.deliveryTime.minDeliveryTime;
      deliveryAddressDetail.max_delivery_time =
        delivery.deliveryTime.maxDeliveryTime;
    }

    sendAddress(deliveryAddressDetail);
    if (deliveryAddressDetail.delivery_name)
      Cookies.set("_da", deliveryAddressDetail.delivery_name);
    closeFadeIn();
  };
  const checkSave = () => {
    if (["136", "483"].includes(tariffCode)) {
      if (sdekOffice) {
        setIsModalOpen(true);
      } else {
        setAlertMessage(true);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    if (!isLoading && !isOfficesLoading && cityDetail) {
      setCityCurrent(true); // Устанавливаем cityCurrent в true только после загрузки данных
    }
  }, [isLoading, isOfficesLoading, officesData, cityDetail]);

  return (
    <div
      className={`delivery_wrapper ${!isVisible ? "hide" : ""}`}
      onClick={wrapperCancel}
    >
      <div className="delivery">
        <h2>Выбор доставки</h2>
        <div className="delivery_addresses">
          {addresses &&
            addresses.map((address) => {
              return (
                <div
                  className="delivery_address"
                  key={address.delivery_name! + address.id!}
                >
                  <button
                    onClick={() => {
                      setAddress(address);
                    }}
                  >
                    {address.delivery_name}
                  </button>
                  <CancelButton
                    onClick={() => {
                      if (address.id) delAddress(address.id);
                    }}
                  />
                </div>
              );
            })}
        </div>
        <div className="delivery_select">
          <label>
            <input
              type="radio"
              value="self"
              checked={selectedOption === "self"}
              onChange={handleChange}
            />
            Самовывоз
          </label>
          <label>
            <input
              type="radio"
              value="delivery"
              checked={selectedOption === "delivery"}
              onChange={handleChange}
            />
            Доставка
          </label>
        </div>
        {/* Самовывоз секция */}
        {selectedOption === "self" && (
          <YMaps
            query={{
              apikey: import.meta.env.VITE_YMAPS_KEY,
              lang: "ru_RU",
            }}
          >
            <div className="delivery_map">
              <Map
                defaultState={{ center: [55.719029, 37.681532], zoom: 11 }}
                style={{ width: "70%", height: "40vh", margin: "30px auto" }}
              >
                {
                  <Placemark
                    geometry={[55.664152, 37.7532]}
                    properties={{
                      hintContent: "Kailin cards", // Текст всплывающей подсказки
                      balloonContent:
                        "Забрать открытку вы можете тут<br>Адрес: ул. Братиславская, д. 6<br>Рабочие часы: 10:00 - 18:00<br>По предварительному согласованию", // Содержимое балуна
                    }}
                    options={{
                      preset: "islands#icon", // Стиль метки
                      iconColor: "#b17ae8", // Цвет метки
                    }}
                    modules={[
                      "geoObject.addon.balloon",
                      "geoObject.addon.hint",
                    ]}
                    onClick={() => {}}
                  />
                }
              </Map>
            </div>
          </YMaps>
        )}
        {selectedOption === "self" && (
          <div className="delivery_info_wrapper">
            <h2>Выбранный тип доставки</h2>
            <div className="delivery_info_self">
              <span>г.Москва ул.Братиславская д.6 </span>
              <span>0 руб</span>
            </div>
            <button
              onClick={() => {
                saveDelivery("Самовывоз");
              }}
            >
              Сохранить
            </button>
          </div>
        )}
        {/* конец Самовывоз секция */}
        {/* Доставка секция */}

        {selectedOption === "delivery" && (
          <div className="delivery_city_input" ref={deliveryWindow}>
            <label>
              Введите город доставки
              <p>
                <input
                  type="text"
                  value={cityInput}
                  onChange={handleCityChange}
                  placeholder="Начните вводить город"
                />
              </p>
            </label>
            {isCityLoading && <Spinner />}
            {cityError && (
              <ModalAlert
                onClose={() => {}}
                duration={2000}
                addClass=""
                message={
                  "Произошла ошибка попробуйте обновить страницу. \n  Если ошибка сохранится свяжитесь с администрацией сайта"
                }
              />
            )}
            {cityData && cityData.length > 0 && (
              <ul className="city_dropdown">
                {cityData.map((city) => (
                  <li
                    className="city_dropdown_item"
                    key={city.city_uuid}
                    onClick={() => {
                      setCityInfo(city);
                      setCityInput(city.full_name);

                      getCity("");
                      getCityDetail(city.code);
                      getOffices(city.code);
                      getTariffs(city.code);
                    }}
                  >
                    {city.full_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {(error || officesError) && (
          <ModalAlert
            onClose={() => {}}
            duration={2000}
            addClass=""
            message={
              "Произошла ошибка попробуйте обновить страницу. \n  Если ошибка сохранится свяжитесь с администрацией сайта"
            }
          />
        )}
        {selectedOption === "delivery" &&
          cityDetail &&
          cityCurrent &&
          officesData && (
            <YMaps
              query={{
                apikey: import.meta.env.VITE_YMAPS_KEY,
                lang: "ru_RU",
              }}
            >
              <div className="delivery_map">
                <Map
                  defaultState={{
                    center: [cityDetail[0].latitude, cityDetail[0].longitude],
                    zoom: 11,
                  }}
                  style={{
                    width: "80%",
                    height: "40vh",
                    margin: "30px auto",
                  }}
                  onLoad={() => {
                    scrollDown();
                    setCityInput(cityInput.split(",")[0]);
                  }}
                  onClick={handleMapClick}
                >
                  {officesData.map((office) => (
                    <Placemark
                      key={office.uuid}
                      geometry={[
                        office.location.latitude,
                        office.location.longitude,
                      ]}
                      properties={{
                        hintContent: office.name, // Текст всплывающей подсказки
                        balloonContent: `${office.location.address_full}<br>${office.work_time}`,
                      }}
                      modules={[
                        "geoObject.addon.balloon",
                        "geoObject.addon.hint",
                      ]}
                      onClick={() => {
                        const address =
                          office.location.address_full.split(", ");
                        const city = cityInput.split(",")[0];
                        const data = address.slice(address.indexOf(city) + 1);
                        // const point =
                        clearDeliveryForm();
                        setStreet(data[0]);
                        setBuilding(data[1]);
                        setComment(office.note);
                        setHandleTariffCode("136");
                        scrollDown();
                        setSdekOffice(office.code);
                        dispatch(setDeliveryOfficeDetail(office));
                      }}
                    />
                  ))}
                  {selectedCoordinates && (
                    <Placemark
                      geometry={selectedCoordinates} // Устанавливаем координаты для метки
                      options={{
                        preset: "islands#icon",
                        iconColor: "#b17ae8",
                      }}
                      onClick={() => {
                        clearDeliveryForm();
                        setStreet(baloonStreet);
                        setBuilding(baloonHouse);
                        setComment(baloonComment);
                        setHandleTariffCode("137");
                        scrollDown();
                      }}
                    />
                  )}
                </Map>
              </div>
            </YMaps>
          )}
        {tariffError && (
          <ModalAlert
            onClose={() => {}}
            duration={2000}
            addClass=""
            message={
              "Произошла ошибка попробуйте обновить страницу. \n  Если ошибка сохранится свяжитесь с администрацией сайта"
            }
          />
        )}
        {isLoadingTariff && <Spinner />}
        {selectedOption === "delivery" && !isLoadingTariff && (
          <div className="delivery_select_detail">
            {selectedOption === "delivery" &&
              tariffData &&
              tariffData.map((tariff) => (
                <label key={tariff.tariff_code}>
                  <input
                    type="radio"
                    value={tariff.tariff_code}
                    checked={tariffCode === String(tariff.tariff_code)}
                    onChange={(event) => {
                      setHandleTariffCode(
                        (event.target as HTMLInputElement).value
                      );
                    }}
                  />

                  {deliveryName[tariff.tariff_name as keyof DeliveryName] +
                    " ( " +
                    tariff.delivery_sum * 1.2 +
                    " руб, займет: " +
                    tariff.calendar_min +
                    "-" +
                    tariff.calendar_max +
                    " дней )"}
                </label>
              ))}
          </div>
        )}

        {selectedOption === "delivery" && !isLoadingTariff && tariffData && (
          <div className="delivery_info">
            <h2>Информация по доставке</h2>
            <div className="delivery_info_row1">
              <input
                type="text"
                placeholder="Улица"
                value={street}
                onChange={(event) => {
                  const value = (event.target as HTMLInputElement).value;
                  if (tariffCode === "137") setBaloonStreet(value);
                  setStreet(value);
                }}
              />
              <input
                type="text"
                placeholder="номер дома"
                value={building}
                onChange={(event) => {
                  const value = (event.target as HTMLInputElement).value;
                  if (tariffCode === "137") setBaloonHouse(value);
                  setBuilding(value);
                }}
              />
            </div>
            {["137", "482"].includes(tariffCode) && (
              <div className="delivery_info_row2">
                <input
                  type="text"
                  placeholder="Квартира"
                  value={flat}
                  onChange={(event) => {
                    setFlat((event.target as HTMLInputElement).value);
                  }}
                />
                <input
                  type="text"
                  placeholder="Подъезд"
                  value={entrance}
                  onChange={(event) => {
                    setEntrance((event.target as HTMLInputElement).value);
                  }}
                />
                <input
                  type="text"
                  placeholder="Этаж"
                  value={floor}
                  onChange={(event) => {
                    setFloor((event.target as HTMLInputElement).value);
                  }}
                />
              </div>
            )}
            <div className="delivery_info_row3">
              <textarea
                placeholder="Комментарий"
                value={comment}
                onChange={(event) => {
                  const value = (event.target as HTMLTextAreaElement).value;
                  if (tariffCode === "137") setBaloonComment(value);
                  setComment(value);
                }}
              />
            </div>
            <button onClick={checkSave}>Сохранить</button>
          </div>
        )}
        {/* конец Доставка секция */}
        {errorDelAddress && (
          <ModalAlert
            message={errorDelAddress}
            duration={1500}
            onClose={() => {
              setErrorDelAddress(null);
            }}
          />
        )}
        {successDelAddress && (
          <ModalAlert
            addClass="success"
            message={successDelAddress}
            duration={1500}
            onClose={() => {
              setSuccessDelAddress(null);
            }}
          />
        )}
        {alertMessage && (
          <ModalAlert
            message="Выберите пункт получения"
            duration={1500}
            onClose={() => {
              setAlertMessage(false);
            }}
          />
        )}

        <DeliveryModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          onSave={saveDelivery}
        />
        <CancelButton
          onClick={() => {
            closeFadeIn();
          }}
        />
      </div>
    </div>
  );
}
