import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CardData } from "../models/models";

interface InitialStateType {
  cards: CardData[];
  userInfo: boolean;
  delivery: boolean;
  cart: {
    items: CardData[];
    isActive: boolean;
  };
  cardDetail: number | null;
}

const initialState: InitialStateType = {
  cards: [],
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
    setUserInfo(state: InitialStateType) {
      state.userInfo = !state.userInfo;
    },
    // startAuthorization(state) {
    //   state.authorization = true;
    // },
    // setIsChangeFile(
    //   state,
    //   action: PayloadAction<{
    //     name?: string;
    //     description?: string;
    //     id?: string;
    //   }>
    // ) {
    //   state.isChangeFile.isActive = !state.isChangeFile.isActive;
    //   if (action.payload) {
    //     state.isChangeFile.name = action.payload.name;
    //     state.isChangeFile.description = action.payload.description;
    //     state.isChangeFile.id = action.payload.id;
    //   }
    // },
  },
});

// export const GET_TOKEN = "main/getToken";
// export const getToken = createAction<{
//   username: string;
//   password: string;
// }>(GET_TOKEN);
// export const REGISTRATION = "main/registration";
// export const registration = createAction<RegistrationData>(REGISTRATION);
// export const GET_USERS = "main/getUsers";
// export const get_users = createAction(GET_USERS);
// export const GET_FILES = "main/getFiles";

export const { setUserInfo } = MainSlice.actions;

export default MainSlice.reducer;
