import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Router from 'next/router';

import { API_PATH } from '@shared/constants/variables';

import { RootState } from '../store';

const baseUploadQuery = (url: string) =>
    fetchBaseQuery({
        baseUrl: `${API_PATH}/${url}`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth?.userInfo?.access_token;
            token && headers.set('authorization', `Bearer ${token}`);
            headers.set('Accept-Language', Router.locale === Router.defaultLocale ? 'vi, vi-VN' : 'en, en-US');
            headers.set('Access-Control-Allow-Origin', '*');
            return headers;
        },
        credentials: 'include',
    });
export default baseUploadQuery;
