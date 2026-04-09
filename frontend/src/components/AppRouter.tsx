import { Routes, Route, Navigate } from 'react-router-dom';
import { authRoutes, publicRoutes } from '@/routes/routes';
import { BASE_ROUTE } from '@/utils/consts';

const AppRouter = () => {
    const isAuth = false;

    return (
        <Routes>
            {isAuth &&
                authRoutes.map(element => (
                    <Route key={element.path} path={element.path} element={<element.Component />} />
                ))}
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