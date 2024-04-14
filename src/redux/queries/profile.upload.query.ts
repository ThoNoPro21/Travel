import { createApi } from '@reduxjs/toolkit/query/react';

import baseUploadQuery from './base.upload.query';
import API_ENDPOINT from '@redux/apiEndpoint';

const profileUploadQuery = createApi({
    reducerPath: 'profileAPI',
    baseQuery: baseUploadQuery(API_ENDPOINT.profile.base),
    endpoints: (builder) => ({
        uploadAvatar: builder.mutation<any, FormData>({
            query: (payload) => ({
                url: API_ENDPOINT.profile.uploadAvatar,
                method: 'POST',
                body: payload,
                formData: true,
            }),
        }),
    }),
});

export default profileUploadQuery;

export const { useUploadAvatarMutation } = profileUploadQuery;
