import { useState, useEffect } from 'react';

const getOrientation = () => window.screen.orientation.type;
/**
 * Returns landscape and orientation for mobile device when you rotate the screen.
 *
 * @example
 * const orientation = useScreenOrientation();
 * @version 1.0
 */
const useScreenOrientation = () => {
    const [orientation, setOrientation] = useState(getOrientation());

    const updateOrientation = (event) => {
        setOrientation(getOrientation());
    };

    useEffect(() => {
        window.addEventListener('orientationchange', updateOrientation);
        return () => {
            window.removeEventListener('orientationchange', updateOrientation);
        };
    }, []);

    return orientation;
};

export default useScreenOrientation;
