import { createApi } from '@reduxjs/toolkit/query/react';

import { ApiResponse, ResetPasswordType, RequestPassword, ChangePasswordType, SignUp } from '@shared/constants/types';
import { AuthUserInfo } from '@shared/models/user/authUser.type';

import baseQuery from './base.query';
import API_ENDPOINT from '@redux/apiEndpoint';

export type LogInPayload = {
    email: string;
    password: string;
    remember: boolean;
};

const authQuery = createApi({
    reducerPath: 'authAPI',
    baseQuery: baseQuery(API_ENDPOINT.auth.base),
    endpoints: (builder) => ({
        login: builder.mutation<ApiResponse<AuthUserInfo>, LogInPayload>({
            query: (credentials) => ({
                url: API_ENDPOINT.auth.login,
                method: 'POST',
                body: credentials,
            }),
            transformResponse: (response: ApiResponse<AuthUserInfo>) => {
                const newResponse = {
                    ...response,
                };
                return newResponse;
            },
        }),
        logout: builder.mutation<ApiResponse<unknown>, void>({
            query: () => ({
                url: API_ENDPOINT.auth.logout,
                method: 'POST',
            }),
        }),
        forgotPassword: builder.mutation<ApiResponse<RequestPassword>, RequestPassword>({
            query: (request) => ({
                url: API_ENDPOINT.auth.forgotPassword,
                method: 'POST',
                body: request,
            }),
        }),
        resetPassword: builder.mutation<ApiResponse<ResetPasswordType>, ResetPasswordType>({
            query: (newPasswordData) => ({
                url: API_ENDPOINT.auth.resetPassword,
                method: 'POST',
                body: newPasswordData,
            }),
        }),
        changePassword: builder.mutation<ApiResponse<ChangePasswordType>, ChangePasswordType>({
            query: (newPassword) => ({
                url: API_ENDPOINT.auth.changePassword,
                method: 'PUT',
                body: {
                    new_password: newPassword.newPassword,
                    old_password: newPassword.currentPassword,
                    new_password_confirmation: newPassword.confirmPassword,
                },
            }),
        }),

        signUp: builder.mutation<ApiResponse<unknown>, SignUp>({
            query: (newUser) => ({
                url: API_ENDPOINT.auth.signup,
                method: 'POST',
                body: newUser,
            }),
        }),
    }),
});

export default authQuery;

export const {
    useLoginMutation,
    useLogoutMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
    useSignUpMutation,
} = authQuery;
