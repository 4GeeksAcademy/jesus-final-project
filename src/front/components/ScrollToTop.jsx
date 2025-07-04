import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ children }) => {
    const location = useLocation();
    const prevLocation = useRef(location);

    useEffect(() => {
        if (location.pathname !== prevLocation.current.pathname) {
            window.scrollTo(0, 0);
        }
        prevLocation.current = location;
    }, [location]);

    return children;
};

export default ScrollToTop;
