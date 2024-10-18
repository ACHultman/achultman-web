import { useState, useEffect } from 'react';

function useCheckMobileScreen() {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const handleWindowSizeChange = () => setWidth(window.innerWidth);
        handleWindowSizeChange();
        window.addEventListener('resize', handleWindowSizeChange);
        return () =>
            window.removeEventListener('resize', handleWindowSizeChange);
    }, []);

    return width <= 576;
}

export default useCheckMobileScreen;
