import React from 'react';
import { use } from 'react';
import { NavLink } from 'react-router';
import { AuthContext } from '../../Context/Auth/AuthContext';

const NavbarLargeDevice = () => {
    const {user} = use(AuthContext);

    return (
        <nav className="hidden md:flex items-center space-x-6">
                  <NavLink
                    to="/"
                    className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to="/coverage"
                    className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
                  >
                    Coverage
                  </NavLink>
                  <NavLink
                    to="/sendparcel"
                    className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
                  >
                    Send a Parcel
                  </NavLink>
        
                  <NavLink
                    to="/rider-registration"
                    className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
                  >
                    Be a Rider
                  </NavLink>
                  {user && (
                    <NavLink
                      to="/dashboard"
                      className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
                    >
                      Dashboard
                    </NavLink>
                  )}
                </nav>
    );
};

export default NavbarLargeDevice;