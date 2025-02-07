import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CardData } from "../models/models";

interface InitialStateType {
  cards: CardData[];
  cart: {
    isActive: boolean;
  };
  cardDetail: number | null;
}

const initialState: InitialStateType = {
  cards: [],
  cart: {
    isActive: false,
  },
  cardDetail: null,
};

const MainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
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

export const { startAuthorization } = MainSlice.actions;

export default MainSlice.reducer;
