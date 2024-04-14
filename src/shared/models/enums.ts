import { enumTypeToOptions } from '@shared/utils/common.utils';

/** enums in Admin tool: Audit logs, Users, Roles */
export enum DefaultUserRole {
    editor = 'mod',
    user = 'user',
}

// New permissions
export enum DefaultUserPermission {
    // Custom User + Role Management Permission:
    user_role_management = '0199',

    // Role Permissions
    role_list = '0101',
    role_details = '0102',
    role_create = '0103',
    role_update = '0104',
    role_delete = '0105',

    // User Permissions
    user_list = '0201',
    user_details = '0202',
    user_create = '0203',
    user_update = '0204',
    user_delete = '0205',
}

/** other enums */
export enum ValueMaxLength {
    extra = 1000,
    long_extra = 500,
    super_extra = 65535,
    long = 255,
    medium = 200,
    short = 50,
    short_tiny = 30,
    tiny = 20,
    number = 10,
    long_text = 65553,
}

const enumOptions = {
    // Enums in User
    UserPermission: enumTypeToOptions(DefaultUserPermission),
};

export default enumOptions;
