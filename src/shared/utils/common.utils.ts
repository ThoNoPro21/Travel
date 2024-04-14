import dayjs from 'dayjs';
import { FieldArrayPath, FieldPath } from 'react-hook-form';
import { getCookie, setCookie } from 'cookies-next';
import { toast } from 'react-toastify';

import {
    SortParams,
    ApiResponse,
    ApiResponseCode,
    Response400Message,
    ResponseMessage,
    PaginationApiResponseData,
} from '@shared/constants/types';
import { DATE_FORMAT } from '@shared/constants/constants';
import { API_HOST, AUTH_COOKIE_NAME, AUTH_COOKIE_REMEMBER_ME } from '@shared/constants/variables';
import {
    CsvFileIcon,
    DocFileIcon,
    DocxFileIcon,
    JpegFileIcon,
    JpgFileIcon,
    PdfFileIcon,
    PngFileIcon,
    PptFileIcon,
    PptxFileIcon,
    TxtFileIcon,
    XlsFileIcon,
    XlsxFileIcon,
} from '@shared/icons/common/FileIcons';

import { validateUrl } from './validation';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export const tryCatch = (f: any, defaultValue: any, ...args: any[]): typeof f => {
    let result;
    try {
        result = f(...args);
    } catch {
        result = defaultValue;
    }

    return result;
};

export const uuid = (length: number = 10) => {
    const hex = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let output = '';
    for (let i = 0; i < length; ++i) {
        output += hex.charAt(Math.floor(Math.random() * hex.length));
    }
    return output;
};

export const getFullName = (firstName: string, lastName: string, middleName: string = ''): string => {
    const parts = [firstName, middleName, lastName].filter((x) => x && typeof x === 'string');
    return parts.join(' ').trim();
};

export const convertTtoRPaginationData = <T, R>(
    responseDataT: PaginationApiResponseData<T>,
    convertFunc: (item: T) => R
): PaginationApiResponseData<R> => {
    const responseDataR: PaginationApiResponseData<R> = {
        ...responseDataT,
        data: (responseDataT.data || []).map((x) => convertFunc(x)),
    };

    return responseDataR;
};

export const getImageUrl = (relativePath: string = ''): string => {
    if (!relativePath) {
        return relativePath;
    }

    const slash = relativePath?.[0] === '/' ? '' : '/';
    const parts = [API_HOST, relativePath?.trim()];
    return parts.join(slash);
};

export const imageNameFromPath = (relativePath?: string | null): string | null => {
    if (!relativePath) {
        return relativePath ?? null;
    }

    const parts = relativePath.split('/');
    const lastPart = parts[parts.length - 1];

    return lastPart;
};

export const enumTypeToOptions = <T extends { [s: string]: unknown }>(
    enumType: T,
    valueIndex: 0 | 1 = 0,
    labelIndex: 0 | 1 = 1
): { value: any; label: any }[] =>
    Object.entries(enumType).map((entry) => ({
        value: entry[valueIndex],
        label: entry[labelIndex],
    }));

export const flatArrayToObjectByKey = <T extends { key: string }>(arrayT: T[]): { [field: string]: T } =>
    arrayT.reduce((ac, a) => ({ ...ac, [a.key]: a }), {}) as {
        [field: string]: T;
    };

export const setCookieLife = (name: string, value: string, days: number) => {
    setCookie(name, value, { maxAge: days * 24 * 60 * 60 });
};

export const getUserInfoFromCookie = () => {
    const auth = getCookie(AUTH_COOKIE_NAME)?.toString();

    try {
        return auth?.length ? JSON.parse(auth) : {};
    } catch (err) {
        return {};
    }
};

export const getRememberMeFromCookie = () => !!getCookie(AUTH_COOKIE_REMEMBER_ME);

export const flatArrayToObject = <T>(arrayT: T[]): { [field: string]: T } =>
    arrayT.reduce(
        (ac, a) => ({
            ...ac,
            [typeof a === 'string' || typeof a === 'number' ? a : 'objectKey']: a,
        }),
        {}
    ) as {
        [field: string]: T;
    };

export const multiStringsToEnums = <T>(values?: string): T[] => {
    const enums = typeof values === 'string' && values ? values.split(',') : [];
    return enums as T[];
};

export const arrayEnumsToString = <T>(enums?: T[]): string | undefined => {
    const stringValues = enums?.map((x) => x?.toString?.());
    const value = stringValues?.length ? stringValues.join(',') : undefined;
    return value;
};

export const dataArrayToOptions = <T>(data: T[], labelField: string, valueField: string) =>
    data.map((item) => ({
        label: item[labelField],
        value: item[valueField],
    }));

export const nameToFieldArrayPath = <T extends { [field: string]: unknown }>(
    fieldName: string,
    index: number,
    name: string
) => `${fieldName}.${index}.${name}` as FieldArrayPath<T>;

export const nameToFieldPath = <T extends { [field: string]: unknown }>(
    fieldName: string,
    index: number,
    name: string
) => `${fieldName}.${index}.${name}` as FieldPath<T>;

export const formatDate = (date: string, format: string = DATE_FORMAT.customDate) =>
    dayjs(date, DATE_FORMAT.date).format(format);

export const formatUrl = (url?: any) => {
    const urlValue = url ? url?.trim?.() : '';
    if (!urlValue) {
        return '';
    }

    const urlPath = url.includes('https') || url.includes('http') ? '' : 'http://';
    const urlString = urlPath + url;
    const formattedUrl = !validateUrl(urlString) ? urlString : '';

    return formattedUrl;
};

export const getCodeFromMessageObject = (
    messageObject: ResponseMessage | Response400Message,
    isError400?: boolean
): string => {
    let localeMessageCode = '';

    if (messageObject) {
        const firstMessageFieldKey = Object.keys(messageObject)[0];
        const messageField = messageObject[firstMessageFieldKey];
        localeMessageCode = firstMessageFieldKey;

        if (isError400 && messageField) {
            localeMessageCode = Object.keys(messageObject[firstMessageFieldKey])?.[0]; // this MessageCode of first error on field
        }
    }

    return localeMessageCode;
};

export const notifyMessageFromErrorApi = (queryError: FetchBaseQueryError, customMessage?: string) => {
    const { data, status } = queryError || {};
    const { code, message: messageObject } = (data as ApiResponse<unknown>) || {};
    const resCode = code || status;
    const isError400 = resCode === ApiResponseCode.error.code_400;

    const message =
        customMessage || `api-response:code-${getCodeFromMessageObject(messageObject, isError400) || 0}`;
        // i18n?.t(`api-response:code-${getCodeFromMessageObject(messageObject, isError400) || 0}`) || ''; TODO: update i18n with app-routing
    toast.error(message);
};

export const notifyUnauthorizedMessageFromErrorApi = () => {
    const message = 'Sorry, but you don’t have permission to access this resource. Please contact administrator.';
    toast.error(message);
};

export const notifyMessageFromSuccessApi = (payload: ApiResponse<any>, customMessage?: string) => {
    const message = customMessage || `api-response:code-${getCodeFromMessageObject(payload?.message) || 1}`;
    //customMessage || i18n?.t(`api-response:code-${getCodeFromMessageObject(payload?.message) || 1}`) || ''; TODO: update i18n with app-routing
    toast.success(message);
};

export const getSortParamsToAPI = (sortParams?: SortParams) => {
    if (!sortParams) {
        return {};
    }
    const sortType = sortParams?.sortType === 'descend' ? 'desc' : 'asc';
    const sortField = `sort[${sortParams?.sortColumn}]`;
    return {
        [sortField]: sortType,
    };
};

export const handleGetTextErr = (error: any): string => {
    const { data, status } = error || {};
    const { code, message: messageObject } = (data as ApiResponse<unknown>) || {};
    const resCode = code || status;
    const isError400 = resCode === ApiResponseCode.error.code_400;
    const message = `api-response:code-${getCodeFromMessageObject(messageObject, isError400) || 0}`;
    // i18n?.t(`api-response:code-${getCodeFromMessageObject(messageObject, isError400) || 0}`) || ''; // TODO: update i18n with app-routing
    return message;
};

// Acceptance String or File
export const getFileTypeIcon = (type: any) => {
    let typeHandled: string = '';
    if (typeof type === 'object') {
        type = type.name;
    }
    if (type?.indexOf('.') !== -1) {
        typeHandled = type?.split('.').pop() ?? '';
    } else {
        typeHandled = type;
    }
    // pdf, txt, doc, docx, jpg, png, jpeg, xls, xlsx, csv, ppt, pptx
    const drinks = {
        pdf: PdfFileIcon,
        txt: TxtFileIcon,
        doc: DocFileIcon,
        docx: DocxFileIcon,
        jpg: JpgFileIcon,
        png: PngFileIcon,
        jpeg: JpegFileIcon,
        xls: XlsFileIcon,
        xlsx: XlsxFileIcon,
        csv: CsvFileIcon,
        ppt: PptFileIcon,
        pptx: PptxFileIcon,
    };
    return drinks[typeHandled.toLocaleLowerCase()]?.();
};

type SortParamsHandleOption = {
    prefix?: string;
};

export const getSortParamsFromSorter = (
    sorter?: any[] | any,
    options?: SortParamsHandleOption
): Record<string, string> => {
    const { prefix } = options || {};
    const sortOption: any[] = [];
    if (!Array.isArray(sorter)) {
        if (sorter.order !== undefined) {
            sortOption.push({
                fieldName: sorter.columnKey,
                sortOrder: sorter.order === 'descend' ? 'desc' : sorter.order === 'ascend' ? 'asc' : '',
            });
        }
    } else {
        sorter?.forEach((item: any) => {
            if (item.order !== 'undefined') {
                sortOption.push({
                    fieldName: item.columnKey,
                    sortOrder: item.order === 'descend' ? 'desc' : item.order === 'ascend' ? 'asc' : '',
                });
            }
        });
    }
    const sortParamsObject = {};
    sortOption.map((x) => {
        sortParamsObject[`${prefix || ''}${x.fieldName}`] = x.sortOrder;
        return null;
    });
    return sortParamsObject;
};

export const convertSortFilterToQuery = (sortItems: Record<string, any>, filterItems: Record<string, any>) => {
    const result: Record<string, string> = {};

    Object.keys(sortItems).forEach((key) => {
        if (sortItems[key]) {
            result[`sort[${key}]`] = sortItems[key];
        }
    });

    Object.keys(filterItems).forEach((key) => {
        if (filterItems[key]) {
            result[`filter[${key}]`] = filterItems[key];
        }
    });

    return result;
};
