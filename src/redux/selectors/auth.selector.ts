import { RootState } from '@redux/store';

const authInfo = (state: RootState) => state.auth;
const forceReload = (state: RootState) => state.auth.forceReload;
const forceRedirectUrl = (state: RootState) => state.auth.forceRedirectUrl;

export default {
    authInfo,
    forceReload,
    forceRedirectUrl,
};
