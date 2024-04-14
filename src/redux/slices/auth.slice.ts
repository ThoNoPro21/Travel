import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { deleteCookie } from 'cookies-next';

import { getRememberMeFromCookie, getUserInfoFromCookie, setCookieLife, tryCatch } from '@shared/utils/common.utils';
import {
    AUTH_COOKIE_NAME,
    COOKIE_EXPIRATION_DAYS,
    COOKIE_REMEMBER_EXPIRATION_DAYS,
    AUTH_COOKIE_RECORD_VERSION,
    AUTH_COOKIE_REMEMBER_ME,
} from '@shared/constants/variables';
import { AuthUserInfo } from '@shared/models/user/authUser.type';
import profileUploadQuery from '@redux/queries/profile.upload.query';

import authQuery from '../queries/auth.query';

export type RedirectActionPayload = {
    url: string;
    as?: string;
    options?;
    isReplace?: boolean;
};

export type SyncUserInfoFromCookiePayload = {
    asPath: string;
    basePath: string;
};

const getAuthUserInfoFromObject = (authInfo: AuthUserInfo): AuthUserInfo => {
    const {
        id,
        email,
        permissions,
        roles,
        name,
        access_token,
        first_time_login,
        status,
        is_valid_password,
        picture,
        picture_url,
        record_version,
    } = authInfo || {};
    const newUserInfo: AuthUserInfo = {
        id,
        email,
        permissions,
        roles,
        name,
        access_token,
        first_time_login,
        status,
        is_valid_password,
        picture,
        picture_url,
        record_version,
    };

    return newUserInfo;
};

export type AuthState = {
    isRemember?: boolean;
    userInfo: AuthUserInfo;
    forceReload?: boolean;
    forceRedirectUrl?: RedirectActionPayload;
};

const initialState: AuthState = {
    isRemember: !!getRememberMeFromCookie(),
    userInfo: { ...getAuthUserInfoFromObject(getUserInfoFromCookie()) },
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        redirectToUrl: (state, action: PayloadAction<RedirectActionPayload>) => {
            state.forceRedirectUrl = action.payload;
        },

        reloadPage: (state) => {
            state.forceReload = true;
        },
        logoutRequest: (state) => {
            const newRecordVersion = new Date().getTime();
            state.userInfo = {
                record_version: new Date().getTime(),
            };
            deleteCookie(AUTH_COOKIE_NAME);
            const record_version = (newRecordVersion + 1).toString();
            localStorage.setItem(AUTH_COOKIE_RECORD_VERSION, record_version);
        },
        saveCookie: (state) => {
            const expiredDays = state.isRemember ? COOKIE_REMEMBER_EXPIRATION_DAYS : COOKIE_EXPIRATION_DAYS;
            const authorizedData = state.userInfo;
            authorizedData.permissions = [];
            setCookieLife(AUTH_COOKIE_NAME, JSON.stringify(authorizedData), expiredDays);
            if (state.isRemember) {
                setCookieLife(AUTH_COOKIE_REMEMBER_ME, 'true', COOKIE_REMEMBER_EXPIRATION_DAYS);
            } else {
                deleteCookie(AUTH_COOKIE_REMEMBER_ME);
            }
        },
        syncUserInfoFromCookie: (state, action: PayloadAction<SyncUserInfoFromCookiePayload>) => {
            const recordVersionEvent = localStorage.getItem(AUTH_COOKIE_RECORD_VERSION);
            const localStorageEventRecordVersion = tryCatch(parseInt, 0, recordVersionEvent) || 0;
            if (localStorageEventRecordVersion) {
                const currentRecordVersion = state.userInfo?.record_version || 0;
                const newUserInfo = getAuthUserInfoFromObject(getUserInfoFromCookie());
                const newRecordVersion = localStorageEventRecordVersion || 0;
                // Check if have a new Record version, it means need to update the new info
                if (newRecordVersion > currentRecordVersion) {
                    state.userInfo = newUserInfo;
                    // RULE ALL: Reload any page after sync account
                    authSlice.caseReducers.reloadPage(state);
                }
            }
        },
        updateUserInfo: (state, action: PayloadAction<AuthUserInfo>) => {
            const newUserInfo = getAuthUserInfoFromObject({
                ...action.payload,
                record_version: new Date().getTime(),
            });

            if (newUserInfo.access_token) {
                state.userInfo = newUserInfo;
                authSlice.caseReducers.saveCookie(state);
                localStorage.setItem(AUTH_COOKIE_RECORD_VERSION, `${newUserInfo.record_version}`);
            }
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(authQuery.endpoints.login.matchFulfilled, (state, action) => {
            state.isRemember = !!action.meta.arg.originalArgs.remember;
            const { data } = action.payload;
            const newAction = authSlice.actions.updateUserInfo(data);
            authSlice.caseReducers.updateUserInfo(state, newAction);
        });
        builder.addMatcher(authQuery.endpoints.logout.matchFulfilled, (state) =>
            authSlice.caseReducers.logoutRequest(state)
        );
        builder.addMatcher(authQuery.endpoints.logout.matchRejected, (state) =>
            authSlice.caseReducers.logoutRequest(state)
        );
        builder.addMatcher(authQuery.endpoints.changePassword.matchFulfilled, (state) => {
            const newUserInfo = {
                ...state.userInfo,
                is_valid_password: true,
            };
            const newAction = authSlice.actions.updateUserInfo(newUserInfo);
            authSlice.caseReducers.updateUserInfo(state, newAction);
        });
        builder.addMatcher(profileUploadQuery.endpoints.uploadAvatar.matchFulfilled, (state, action) => {
            const { picture, picture_url } = action.payload?.data || {};
            const newUserInfo = {
                ...state.userInfo,
                picture,
                picture_url,
            };
            const newAction = authSlice.actions.updateUserInfo(newUserInfo);
            authSlice.caseReducers.updateUserInfo(state, newAction);
        });
    },
});

export const { reloadPage, redirectToUrl, logoutRequest, saveCookie, updateUserInfo, syncUserInfoFromCookie } =
    authSlice.actions;

export default authSlice.reducer;
