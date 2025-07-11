import { AuthWrapper } from './AuthWrapper';

export const ProtectedRoute = ({ children }) => {
    return (
        <AuthWrapper>
            {children}
        </AuthWrapper>
    );
};