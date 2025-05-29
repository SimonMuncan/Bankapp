import React from 'react';
import { Outlet } from 'react-router-dom';
import NavbarComponent from './Navbar';

const MainLayout = () => {
  return (
    <>
      <NavbarComponent />
      <div> 
        <Outlet /> 
      </div>
    </>
  );
};

export default MainLayout;