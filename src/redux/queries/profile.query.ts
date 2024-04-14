import { createApi } from '@reduxjs/toolkit/query/react';

import { ApiResponse } from '@shared/constants/types';
import baseQuery from './base.query';
import API_ENDPOINT from '@redux/apiEndpoint';

const profileQuery = createApi({
    reducerPath: 'profileAPI',
    baseQuery: baseQuery(API_ENDPOINT.profile.base),
    endpoints: (builder) => ({
        uploadAvatar: builder.mutation<ApiResponse<any>, FormData>({
            query: (formData) => ({
                url: API_ENDPOINT.profile.uploadAvatar,
                method: 'POST',
                body: { formData },
                prepareHeaders: (headers: any) => {
                    headers.set('Content-Type', 'multipart/form-data');
                    return headers;
                },
                formData: true,
            }),
        }),
        getProfile: builder.query<ApiResponse<any>, void>({
            query: () => ({
                url: API_ENDPOINT.profile.getProfile,
                method: 'GET',
            }),
        }),
        updateProfile: builder.mutation<ApiResponse<any>, any>({
            query: (updatingProfile) => ({
                url: API_ENDPOINT.profile.updateProfile,
                method: 'PUT',
                body: updatingProfile,
            }),
        }),
    }),
});

export default profileQuery;

export const { useGetProfileQuery, useUpdateProfileMutation, useLazyGetProfileQuery } = profileQuery;
