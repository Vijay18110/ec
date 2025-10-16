import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = (redirectIfUnauth = false) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const checkAuth = () => {
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setIsAuthenticated(true);
                setToken(storedToken);
            } else {
                setIsAuthenticated(false);
                setToken(null);
                if (redirectIfUnauth) navigate("/login");
            }
        };

        checkAuth();

        // ✅ Listen for changes to localStorage (e.g. logout in another tab)
        window.addEventListener("storage", checkAuth);

        return () => {
            window.removeEventListener("storage", checkAuth);
        };
    }, [redirectIfUnauth, navigate]);

    return { isAuthenticated, token };
};

export default useAuth;
