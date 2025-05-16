import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CardDataDto,
  DeliveryAddressDto,
  DeliveryDto,
  OfficeDto,
  ReceiverDto,
} from "../models/models";

interface InitialStateType {
  cards: CardDataDto[];
  category: { all: string[]; isActive: string | null };
  isUserInfo: boolean;
  isDelivery: boolean;
  cart: {
    items: CardDataDto[];
    isActive: boolean;
  };
  cardDetail: CardDataDto | null;
  receiver: ReceiverDto;
  user: {
    isActive: boolean;
    access: string | null;
    firstName: string | null;
    lastName: string | null;
    middleName: string | null;
    phone: string | null;
    email: string | null;
    isReset: boolean;
    isSendReset: boolean;
  };
  addresses: DeliveryDto[] | null;
  delivery: {
    deliverySelf: boolean;
    deliveryAddress: DeliveryAddressDto | null;
    deliveryCost: number | null | undefined;
    deliveryOffice: string | null;
    deliveryOfficeDetail: OfficeDto | null;
    deliveryTariffCode: string | null;
    deliveryName: string | null;
    deliveryTime: {
      minDeliveryTime: number | null;
      maxDeliveryTime: number | null;
    };
  };
  hesReloaded: boolean;
  scrollTo: HTMLDivElement | null;
}

const initialState: InitialStateType = {
  cards: [],
  isUserInfo: false,
  isDelivery: false,
  category: {
    all: [],
    isActive: null,
  },
  cart: {
    items: [],
    isActive: false,
  },
  cardDetail: null,
  receiver: {
    name: null,
    phone: null,
    email: null,
  },
  user: {
    isActive: false,
    access: null,
    firstName: null,
    lastName: null,
    middleName: null,
    phone: null,
    email: null,
    isReset: false,
    isSendReset: false,
  },
  addresses: null,
  delivery: {
    deliverySelf: false,
    deliveryAddress: null,
    deliveryCost: null,
    deliveryOffice: null,
    deliveryTariffCode: null,
    deliveryName: null,
    deliveryOfficeDetail: null,
    deliveryTime: { minDeliveryTime: null, maxDeliveryTime: null },
  },
  hesReloaded: false,
  scrollTo: null,
};

const MainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    // Редьюсер для обновления страницы
    setHasReloaded: (state, action: PayloadAction<boolean>) => {
      state.hesReloaded = action.payload;
    },
    // Редьюсер для установки состояния активности пользователя
    setUserActiveState: (state, action: PayloadAction<boolean>) => {
      state.user.isActive = action.payload;
    },
    // Редьюсер для установки токена доступа
    setUserAccess: (state, action: PayloadAction<string | null>) => {
      state.user.access = action.payload;
    },
    // Редьюсер для установки имени
    setUserFirstName: (state, action: PayloadAction<string | null>) => {
      state.user.firstName = action.payload;
    },
    // Редьюсер для установки фамилии
    setUserLastName: (state, action: PayloadAction<string | null>) => {
      state.user.lastName = action.payload;
    },
    // Редьюсер для установки отчества
    setUserMiddleName: (state, action: PayloadAction<string | null>) => {
      state.user.middleName = action.payload;
    },
    // Редьюсер для установки телефона
    setUserPhone: (state, action: PayloadAction<string | null>) => {
      state.user.phone = action.payload;
    },
    // Редьюсер для состояния сброса пароля
    setUserReset: (state, action: PayloadAction<boolean>) => {
      state.user.isReset = action.payload;
    },
    setSendReset: (state, action: PayloadAction<boolean>) => {
      state.user.isSendReset = action.payload;
    },
    // Редьюсер для установки email
    setUserEmail: (state, action: PayloadAction<string | null>) => {
      state.user.email = action.payload;
    },
    setUserInfo: (state: InitialStateType, action: PayloadAction<boolean>) => {
      state.isUserInfo = action.payload;
    },
    setDelivery: (state: InitialStateType, action: PayloadAction<boolean>) => {
      state.isDelivery = action.payload;
    },
    //Элемент для скрола
    setScrollTo: (
      state: InitialStateType,
      action: PayloadAction<HTMLDivElement | null>
    ) => {
      state.scrollTo = action.payload;
    },

    setAddresses: (state, action: PayloadAction<DeliveryDto[] | null>) => {
      state.addresses = action.payload;
    },
    setCards: (state, action: PayloadAction<CardDataDto[]>) => {
      state.cards = action.payload;
    },
    setCategory: (state, action: PayloadAction<string[]>) => {
      state.category.all = action.payload;
    },
    setActiveCategory: (state, action: PayloadAction<string>) => {
      state.category.isActive = action.payload;
      state.scrollTo?.scrollIntoView({ behavior: "smooth" });
    },
    setActiveCart: (state, action: PayloadAction<boolean>) => {
      state.cart.isActive = action.payload;
    },
    setCardDetail: (state, action: PayloadAction<CardDataDto | null>) => {
      state.cardDetail = action.payload;
    },
    setDeliveryAddress: (state, action: PayloadAction<DeliveryAddressDto>) => {
      state.delivery.deliveryAddress = action.payload;
    },
    setDeliveryName: (state, action: PayloadAction<string>) => {
      state.delivery.deliveryName = action.payload;
    },
    setDeliveryCostState: (
      state,
      action: PayloadAction<number | null | undefined>
    ) => {
      state.delivery.deliveryCost = action.payload;
    },
    setDeliveryOfficeState: (state, action) => {
      state.delivery.deliveryOffice = action.payload;
    },
    setDeliveryTime: (
      state,
      action: PayloadAction<[number, number] | null | undefined>
    ) => {
      state.delivery.deliveryTime.minDeliveryTime = action.payload
        ? action.payload[0]
        : null;
      state.delivery.deliveryTime.maxDeliveryTime = action.payload
        ? action.payload[1]
        : null;
    },
    setDeliveryOfficeDetail: (
      state: InitialStateType,
      action: PayloadAction<OfficeDto | null>
    ) => {
      state.delivery.deliveryOfficeDetail = action.payload;
    },
    setDeliveryTariffCodeState: (state, action) => {
      state.delivery.deliveryTariffCode = action.payload;
    },
    setDeliverySelfState: (state, action) => {
      state.delivery.deliverySelf = action.payload;
    },
    // Редьюсер для установки имени получателя
    setReceiverName: (state, action: PayloadAction<string | null>) => {
      state.receiver.name = action.payload;
    },
    // Редьюсер для установки телефона получателя
    setReceiverPhone: (state, action: PayloadAction<string | null>) => {
      state.receiver.phone = action.payload;
    },
    // Редьюсер для установки email получателя
    setReceiverEmail: (state, action: PayloadAction<string | null>) => {
      state.receiver.email = action.payload;
    },
    addCard: (state, action: PayloadAction<CardDataDto>) => {
      const cardData = action.payload;
      if (state.cart.items.some((item) => item.id === cardData.id)) {
        return;
      }
      state.cart.items.push(cardData);
    },
    delCard: (state, action: PayloadAction<CardDataDto>) => {
      const index = state.cart.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index === -1) {
        return;
      }
      state.cart.items.splice(index, 1);
    },
  },
});

export const {
  setHasReloaded,
  setUserActiveState,
  setUserAccess,
  setUserFirstName,
  setUserLastName,
  setUserMiddleName,
  setUserPhone,
  setUserEmail,
  setUserInfo,
  setUserReset,
  setSendReset,
  setDelivery,
  setAddresses,
  setCards,
  setCategory,
  setDeliveryAddress,
  setDeliveryCostState,
  setDeliveryOfficeState,
  setDeliveryOfficeDetail,
  setDeliveryTime,
  setDeliverySelfState,
  setDeliveryTariffCodeState,
  setDeliveryName,
  setActiveCategory,
  addCard,
  setActiveCart,
  delCard,
  setCardDetail,
  setReceiverName,
  setReceiverEmail,
  setReceiverPhone,
  setScrollTo,
} = MainSlice.actions;

export default MainSlice.reducer;
