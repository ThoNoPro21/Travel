import { useEffect } from 'react';
import { useRouter } from 'next/router';

import authSelector from '@redux/selectors/auth.selector';

import { useAppSelector } from '../../redux/hook';

const useUpdatePageOnAuthChange = () => {
    const isForceReload = useAppSelector(authSelector.forceReload);
    const forceRedirectUrl = useAppSelector(authSelector.forceRedirectUrl);
    const router = useRouter();

    useEffect(() => {
        if (isForceReload) {
            console.info('[!] Processing: Sync your authenticated info and refresh the page');
            router.reload();
        } else if (forceRedirectUrl?.url) {
            const { url, as, options, isReplace } = forceRedirectUrl;
            console.info('[!] Processing: Sync your authenticated info and redirect to the page', url);
            !isReplace ? router.push(url, as, options) : router.replace(url, as, options);
        }
    }, [isForceReload, forceRedirectUrl]);
};

export default useUpdatePageOnAuthChange;
