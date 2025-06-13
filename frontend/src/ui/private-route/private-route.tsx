import { Loader } from '@mantine/core';
import React from 'react';
import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { checkAuth } from '~/actions/user-actions';
import { AppRoute } from '~/conts';

export const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true);
      const result = await checkAuth(false);
      setIsAuthenticated(result);
      setIsLoading(false);
    };
    verifyAuth().then();
  }, []);

  if (isLoading) {
    return <Loader/>;
  }

  return isAuthenticated ? <Outlet/> : <Navigate to={AppRoute.Root} replace/>;
};
