import { useEffect, useState } from 'react';
import ResponsiveObserve from '../responsiveObserve';

function useBreakpoint() {
    const [screens, setScreens] = useState({});

    useEffect(() => {
        const token = ResponsiveObserve.subscribe(supportScreens => {
            setScreens(supportScreens);
        });

        return () => ResponsiveObserve.unsubscribe(token);
    }, []);

    return screens;
}

export default useBreakpoint;
