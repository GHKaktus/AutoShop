import { Routes, Route, Navigate } from 'react-router-dom';
import { authRoutes, publicRoutes } from '@/routes/routes';
import { BASE_ROUTE, LOGIN_ROUTE } from '@/utils/consts';
import { useAppSelector } from '@/store/hooks';
import { getIsAuthenticated } from '@/store/auth';

const AppRouter = () => {
    const isAuth = useAppSelector(getIsAuthenticated);

    return (
        <Routes>
            {
                authRoutes.map(element => (
                    <Route
                        key={element.path}
                        path={element.path}
                        element={isAuth ? <element.Component /> : <Navigate to={LOGIN_ROUTE} replace />}
                    />
                ))
            }
            {
                publicRoutes.map(element => (
                    <Route key={element.path} path={element.path} element={<element.Component />} />
                ))
            }
            <Route path='*' element={<Navigate to={BASE_ROUTE} replace />} />
        </Routes>
    );
};

export default AppRouter;
