import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CardDataDto } from "../models/models";

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
    deliveryAddress: string | null;
  };
}

const initialState: InitialStateType = {
  cards: [],
  category: {
    all: [],
    isActive: null,
  },
  userInfo: false,
  delivery: false,
  cart: {
    items: [],
    isActive: false,
  },
  cardDetail: null,
  user: {
    deliveryAddress: null,
  },
};

const MainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    setUserInfo: (state: InitialStateType) => {
      state.userInfo = !state.userInfo;
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
    setDeliveryAddress: (state, action: PayloadAction<string>) => {
      state.user.deliveryAddress = action.payload;
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
  setCards,
  setCategory,
  setActiveCategory,
  addCard,
  setActiveCart,
  delCard,
  setCardDetail,
} = MainSlice.actions;

export default MainSlice.reducer;
