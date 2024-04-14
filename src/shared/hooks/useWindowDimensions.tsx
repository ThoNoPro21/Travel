import { useState, useEffect } from 'react';

interface WindowDimensions {
    width: number;
    height: number;
}

function getWindowDimensions(): WindowDimensions {
    if (typeof window !== 'undefined') {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height,
        };
    }
    return {
        width: 320,
        height: 768,
    }; // or return an empty object {}
}

/**
 * Returns screen width and screen height when you change screen size.
 *
 * @example
 * const { height, width } = useWindowDimensions();
 * @version 1.0
 */
export default function useWindowDimensions(): WindowDimensions {
    const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>(getWindowDimensions());

    useEffect(() => {
        function handleResize(): void {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);

        return (): void => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}
