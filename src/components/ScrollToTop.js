import React, { useEffect, Fragment } from 'react';
import { withRouter } from 'react-router-dom';

function ScrollToTop({ history, children }) {
    useEffect(() => {
        const unlisten = history.listen(() => {
            if(history.location.pathname.replace(/[0-9]/g, '') !== '/product/' && history.location.pathname !== '/'){
                window.scrollTo(0, 0);
            }
        });
        return () => {
            unlisten();
        }
    }, []);

    return <Fragment>{children}</Fragment>;
}

export default withRouter(ScrollToTop);