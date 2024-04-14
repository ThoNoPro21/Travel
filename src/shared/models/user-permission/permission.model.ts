import { DefaultUserPermission } from '../enums';

interface IUserPermission {
    id?: number;
    slug: DefaultUserPermission | null;
    description: string | null;
}
export default IUserPermission;
