import { Navigate, Route, Routes } from 'react-router';
import { AppRoutes } from './AppRoutes';

const App = () => {
  return (
    <Routes>
      <Route path={AppRoutes.Root} element={<Navigate to={AppRoutes.Profile} />} />
      <Route path={AppRoutes.Book} element={<Navigate to={AppRoutes.Book} />} />
    </Routes>
  );
};

export default App;
