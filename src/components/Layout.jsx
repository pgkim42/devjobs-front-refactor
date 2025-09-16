import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import PageTransition from './PageTransition';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  );
};

export default Layout;