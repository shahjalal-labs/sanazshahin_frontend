import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import adminAuth from "./ReduxFunction";

import baseApi from "./api/baseApi";

// 🔐 Persist configuration for authentication
const authPersistConfig = {
  key: "auth",
  storage,
};

// 🛍 Persist configuration for cart

const persistedAuthReducer = persistReducer(authPersistConfig, adminAuth);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,

    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

// ⚡ Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
