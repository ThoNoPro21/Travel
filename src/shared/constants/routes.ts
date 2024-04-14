import React, { ReactNode } from 'react';
import Router from 'next/router';

import { DefaultUserPermission } from '@shared/models/enums';


/** ROUTING IMPORTANT RULES:
 * 1) Add 1 route: add the same key, same path to the Type "AppRoutes" and the Tree "routesTree"
 * 2) Key should be unique and in camelCase to be useful in object "appRoutes"
 * 3) Fields in the Type and Tree should be the same order, to prevent any missing
 * 4) Must order the 'index' to the first and the dynamic [id] to the end of one
 */

export type RoutePermission = {
    requiredAuthenticated: boolean;
    permissions: DefaultUserPermission | DefaultUserPermission[];
    redirectPath?: string;
};

const authenticatedRoute: RoutePermission = {
    requiredAuthenticated: true,
    permissions: [],
    redirectPath: '/auth/sign-in',
};

export const createRoutePermission = (
    permissions: DefaultUserPermission | DefaultUserPermission[],
    redirectPath?: string
) => ({
    requiredAuthenticated: Array.isArray(permissions) ? permissions.length > 0 : !!permissions,
    permissions,
    redirectPath: redirectPath || '/403',
});

export const getRoutePermission = (routingNode?: RouteItem) =>
    routingNode?.children?.find((x) => x.route === '')?.permissionRule || routingNode?.permissionRule;

export type RouteItem = {
    key: string;
    label?: ReactNode | string;
    route: string;
    component?: React.ElementType;
    children?: RouteItem[];
    permissionRule?: RoutePermission;
};

export type AppRoutes = {
    index: string;
    auth: {
        index: string;
        signIn: string;
        signUp: string;
        signOut: string;
        forgotPassword: string;
        changePassword: string;
        resetPassword: string;
    };
    myProfile: {
        index: string;
        edit: string;
    };
    error403: string;
    error404: string;
};


export const routesTree: RouteItem[] = [
    {
        key: 'index',
        label: 'Home',
        route: '',
        permissionRule: authenticatedRoute,
    },
    {
        key: 'auth',
        label: 'Auth',
        route: 'auth',
        children: [
            {
                key: 'signIn',
                label: 'Sign in',
                route: 'sign-in',
            },
            {
                key: 'signUp',
                label: 'Sign up',
                route: 'sign-up',
            },
            {
                key: 'signOut',
                label: 'Sign out',
                route: 'sign-out',
            },
            {
                key: 'forgotPassword',
                label: 'Forgot Password',
                route: 'forgot-password',
            },
            {
                key: 'changePassword',
                label: 'Change Password',
                route: 'change-password',
            },
            {
                key: 'resetPassword',
                label: 'Reset Password',
                route: 'reset-password',
            },
        ],
    },
    {
        key: 'myProfile',
        label: 'My Profile',
        route: 'my-profile',
        permissionRule: authenticatedRoute,
        children: [
            {
                key: 'index',
                label: 'My Profile',
                route: '',
                permissionRule: authenticatedRoute,
            },
            {
                key: 'edit',
                label: 'Edit Profile',
                route: 'edit',
                permissionRule: authenticatedRoute,
            },
        ],
    },
    // For Errors
    {
        key: 'error403',
        label: 'No permission',
        route: '403',
    },
    {
        key: 'error404',
        label: 'Page not found',
        route: '404',
    },
];

export const navigateOnClient = (routePath?: string, isReplace?: boolean) => {
    const { defaultLocale, locale: currentLocale } = Router || {};
    const localeRoutePath = currentLocale === defaultLocale ? routePath : `/${currentLocale}${routePath}`;

    if (localeRoutePath && window) {
        if (isReplace) {
            window.location.replace(localeRoutePath);
        } else {
            window.location.href = localeRoutePath;
        }
    }
};

export const redirect = (res, redirectUrl: string, isReplace?: boolean) => {
    if (typeof window !== 'undefined') {
        if (Router?.push) {
            isReplace ? Router.replace(redirectUrl) : Router.push(redirectUrl);
        } else {
            navigateOnClient(redirectUrl, isReplace);
        }
    } else {
        res?.writeHead(isReplace ? 301 : 302, { Location: redirectUrl });
        res?.end();
    }
};

function findNodeInRouteItems(slugs: string[], slugIndex: number, routeItems: RouteItem[]): RouteItem | undefined {
    let outputNode;
    const regex1: RegExp = /^\[.*\]$/;
    for (let i = 0; i < routeItems.length; i++) {
        if (routeItems[i].route === slugs[slugIndex] || regex1.test(routeItems[i].route)) {
            if (slugIndex < slugs.length - 1) {
                if (Array.isArray(routeItems[i].children)) {
                    return findNodeInRouteItems(slugs, slugIndex + 1, routeItems[i].children as RouteItem[]);
                }
                return outputNode;
            }
            return routeItems[i];
        }
    }
    return outputNode;
}

export const findRouteNodeByPath = (routePath: string): RouteItem | undefined => {
    let node;
    if (typeof routePath === 'string') {
        const slugs = routePath.split('/');
        if (slugs.length > 1) {
            return findNodeInRouteItems(slugs, 1, routesTree);
        }
        return routesTree[0];
    }
    return node;
};

const getChildPath = (parent: string = '', child: string = ''): string =>
    parent && child ? `${parent === '/' ? '' : parent}/${child}` : child || parent;

const getNodeRoute = (node: RouteItem, parentRoute: string = ''): { [field: string]: any } => {
    const routePath = getChildPath(parentRoute, node.route);
    if (!node?.children?.length) {
        return { [node.key]: routePath };
    }
    const arrRoutes = node?.children.map((x) => getNodeRoute(x, routePath));
    const objectRoute = arrRoutes.reduce((ac, a) => ({ ...ac, ...a }), {});
    return { [node.key]: objectRoute };
};

const getRoutesFromTree = (tree: RouteItem[]): AppRoutes => {
    const rootNode: RouteItem = {
        key: 'root',
        route: '/',
        children: [...tree],
    };
    const rootRoutes = getNodeRoute(rootNode);

    return rootRoutes?.root as AppRoutes;
};

const appRoutes = getRoutesFromTree(routesTree);

export default appRoutes;
