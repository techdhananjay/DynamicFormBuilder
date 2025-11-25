import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isAuthenticated } from '../utils/auth';
import { ROUTES } from '../utils/constants';

const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to={ROUTES.ADMIN_LOGIN} replace />;
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
