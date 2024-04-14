import { combineReducers, configureStore } from '@reduxjs/toolkit';
import ReducerCollection from '@redux/reducers';

const combinedReducer = combineReducers({
    ...ReducerCollection.slice,
    ...ReducerCollection.queries,
});

export const makeStore = () =>
    configureStore({
        reducer: combinedReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...ReducerCollection.middleware),
        //getDefaultMiddleware().concat(rtkQueryMiddleware, checkAuthMiddleware, ...AppStore.middleware),
    });

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<AppStore['getState']>;
