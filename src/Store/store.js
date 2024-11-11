import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import rootReducer from "./root-reducers"; // Import your root reducer
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel1 from "redux-persist/lib/stateReconciler/autoMergeLevel1";
import { useDispatch, useSelector } from "react-redux";

const middleware = [logger];

const persistConfig = {
  key: "zonefy",
  stateReconciler: autoMergeLevel1,
  storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistedStore = persistStore(store);
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Selector function to get user state
export const selectZonefy = (state) => state.zonefy;

export default store;
