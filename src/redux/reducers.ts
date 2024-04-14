import { Middleware } from '@reduxjs/toolkit';

// TODO: import all using queries
import authQuery from './queries/auth.query';
import profileQuery from './queries/profile.query';

// TODO: import all using slices
import authSlice from './slices/auth.slice';

const middlewares: Middleware[] = [];
const ReducerCollection = {
    slice: {
        auth: authSlice,
    },
    queries: {
        [authQuery.reducerPath]: authQuery.reducer,
        [profileQuery.reducerPath]: profileQuery.reducer,
    },
    middleware: middlewares.concat(authQuery.middleware, profileQuery.middleware),
};

export default ReducerCollection;
