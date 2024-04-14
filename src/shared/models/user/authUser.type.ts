import { DefaultUserPermission } from '../enums';

type Roles = {
    id?: number;
    slug?: string;
    business_role_id?: number;
};
type AuthUserInfo = {
    id?: number;
    email?: string;
    permissions?: DefaultUserPermission[];
    roles?: Roles[];
    name?: string;
    access_token?: string;
    picture?: string;
    picture_url?: string;
    status?: number;
    first_time_login?: boolean;
    is_valid_password?: boolean; // It means: True = User has valid/strong password; False = User must change their password.
    record_version?: number; // It means: The latest Timestamp when AuthUserInfo saved in cookie. It will be synced to every tabs on this browser.
};
export type { AuthUserInfo, Roles };
