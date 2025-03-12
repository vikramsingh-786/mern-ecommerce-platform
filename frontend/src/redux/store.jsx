import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { productApi } from '../api/productApi';
import { orderApi } from '../api/orderApi';
import { cartApi } from '../api/cartApi';
import { authApi } from '../api/authApi';
import { userApi } from '../api/userApi'; 
import { paymentApi } from '../api/paymentApi';
import { categoryApi } from '../api/categoryApi';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], 
};

const rootReducer = combineReducers({
  [paymentApi.reducerPath]: paymentApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
  [userApi.reducerPath]: userApi.reducer, 
  [categoryApi.reducerPath]: categoryApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }).concat(
      authApi.middleware,  
      productApi.middleware, 
      orderApi.middleware, 
      cartApi.middleware,
      userApi.middleware,
      paymentApi.middleware,
      categoryApi.middleware,
    ),
});

export const persistor = persistStore(store);
