import { Loader } from '@mantine/core';
import React from 'react';
import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { checkAuth } from '~/actions/user-actions';
import { AppRoute } from '~/conts';

export const PublicRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const isAuth = await checkAuth(false);
        setIsAuthenticated(isAuth);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    verifyAuth().then();
  }, []);

  if (isLoading) {
    return <Loader/>;
  }

  return isAuthenticated ? <Navigate to={AppRoute.Shelf} replace/> : <Outlet/>;
}; 