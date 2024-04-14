export type NonEmptyArray<T> = [T, ...T[]];

export type Override<T, K extends Partial<{ [P in keyof T]: any }> | string> = K extends string
    ? Omit<T, K> & { [P in keyof T]: T[P] | unknown }
    : Omit<T, keyof K> & K;

export type OptionShape = {
    value: string | number;
    label: string;
};

export enum CompareType {
    lessThan = 'less',
    greaterThan = 'greater_than',
}

export type PaginationApiResponseData<T> = {
    current_page: number;
    data: T[];
    from: number;
    to: number;
    last_page: number;
    per_page: number;
    total: number;
    [field: string]: unknown;
};

export type ApiResponse<T> = {
    success: boolean;
    code: number;
    message: ResponseMessage | Response400Message;
    data: T;
};

export type ResponseMessage = {
    [code: string]: string;
};

export type Response400Message = {
    [field: string]: ResponseMessage;
};

export const ApiResponseCode = {
    error: {
        code_400: 400,
        code_401: 401,
        code_403: 403,
        code_404: 404,
    },
    success: {
        code_200: 200,
        code_201: 201,
        code_203: 203,
        code_204: 204,
    },

    server: {
        code_500: 500,
    },
};

export const ErrorCode = {
    Unauthenticated: '10001',
    UnauthorizedPassword: '10003',
};

export type ImageUploadResponse = { file_name: string; path: string };

export type PaginationParams = { page: number; pageSize: number };

export type SortType = 'ascend' | 'descend';
export enum ApiSortType {
    'asc' = 'asc',
    'desc' = 'desc',
}
export type SortParams = { sortColumn: string; sortType: SortType };


export type RequestPassword = {
    email: string;
};

export type ChangePasswordType = {
    currentPassword?: string;
    newPassword: string;
    confirmPassword: string;
};

export type ResetPasswordType = {
    password: string;
    password_confirmation: string;
};

export type SignIn = {
    email: string;
    password: string;
};

export type SignUp = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export type AddUpdateFormRef = {
    submit: () => void;
    reset?: (defaultValues) => void;
};

export type PaginationFiltersParams<T = Record<string, any>> = {
    pagination: PaginationParams;
    sorter?: Record<string, any>;
    filters?: {
        keyword?: string;
    } & T;
};
