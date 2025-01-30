import { configureStore } from "@reduxjs/toolkit";
import MainSlice from "./MainSlice";
import { cardApi } from "./cardAPI";

const store = configureStore({
  reducer: { [cardApi.reducerPath]: cardApi.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cardApi.middleware),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
