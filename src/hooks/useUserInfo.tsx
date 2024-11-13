import { useState, useEffect } from 'react';

const useUserInfo = () => {
    const [token, setToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUserInfo = localStorage.getItem('userInfo');

        if (storedUserInfo && storedToken) {
            setToken(storedToken);
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);

    return { token, userInfo };
};

export default useUserInfo;
