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
  cardDetail: number | null;
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
  },
});

export const { setUserInfo, setCards, setCategory, setActiveCategory } =
  MainSlice.actions;

export default MainSlice.reducer;
