import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CardDataDto, DeliveryAddressDto } from "../models/models";

interface InitialStateType {
  cards: CardDataDto[];
  category: { all: string[]; isActive: string | null };
  userInfo: boolean;
  delivery: boolean;
  cart: {
    items: CardDataDto[];
    isActive: boolean;
  };
  cardDetail: CardDataDto | null;
  user: {
    deliverySelf: boolean;
    deliveryAddress: DeliveryAddressDto | null;
    deliveryCost: number | null;
    deliveryOffice: string | null;
    deliveryTariffCode: string | null;
  };
}

const initialState: InitialStateType = {
  cards: [],
  category: {
    all: [],
    isActive: null,
  },
  userInfo: false,
  delivery: true,
  cart: {
    items: [],
    isActive: false,
  },
  cardDetail: null,
  user: {
    deliverySelf: false,
    deliveryAddress: null,
    deliveryCost: null,
    deliveryOffice: null,
    deliveryTariffCode: null,
  },
};

const MainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    setUserInfo: (state: InitialStateType) => {
      state.userInfo = !state.userInfo;
    },
    setDelivery: (state: InitialStateType) => {
      state.delivery = !state.delivery;
    },
    setCards: (state, action: PayloadAction<CardDataDto[]>) => {
      state.cards = action.payload;
    },
    setCategory: (state, action: PayloadAction<string[]>) => {
      state.category.all = action.payload;
    },
    setActiveCategory: (state, action: PayloadAction<string>) => {
      state.category.isActive = action.payload;
    },
    setActiveCart: (state) => {
      state.cart.isActive = !state.cart.isActive;
    },
    setCardDetail: (state, action: PayloadAction<CardDataDto | null>) => {
      state.cardDetail = action.payload;
    },
    setDeliveryAddress: (state, action: PayloadAction<DeliveryAddressDto>) => {
      state.user.deliveryAddress = action.payload;
    },
    setDeliveryCostState: (state, action: PayloadAction<number | null>) => {
      state.user.deliveryCost = action.payload;
    },
    setDeliveryOfficeState: (state, action) => {
      state.user.deliveryOffice = action.payload;
    },
    setDeliveryTariffCodeState: (state, action) => {
      state.user.deliveryTariffCode = action.payload;
    },
    setDeliverySelfState: (state, action) => {
      state.user.deliverySelf = action.payload;
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
  setUserInfo,
  setDelivery,
  setCards,
  setCategory,
  setDeliveryAddress,
  setDeliveryCostState,
  setDeliveryOfficeState,
  setDeliverySelfState,
  setDeliveryTariffCodeState,
  setActiveCategory,
  addCard,
  setActiveCart,
  delCard,
  setCardDetail,
} = MainSlice.actions;

export default MainSlice.reducer;
