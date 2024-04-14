import { DefaultUserPermission } from '../enums';

import IUserPermission from './permission.model';

type UserPermission = {
    id?: number;
    slug?: DefaultUserPermission;
    description?: string;
};

export default UserPermission;

export const mapFromIUserPermission = (response: IUserPermission): UserPermission => {
    if (!response) {
        return response;
    }

    const output: UserPermission = {
        id: response.id,
        slug: response.slug || undefined,
        description: response.description || undefined,
    };
    return output;
};

export const mapToIUserPermission = (response: UserPermission): IUserPermission => {
    if (!response) {
        return response;
    }

    const output: IUserPermission = {
        id: response.id,
        slug: response.slug || null,
        description: response.description || null,
    };

    return output;
};
