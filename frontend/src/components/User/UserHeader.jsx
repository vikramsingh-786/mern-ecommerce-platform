import React, { useState } from 'react';
import { Search, Menu, Bell, ChevronDown } from 'lucide-react';
import { FaSun, FaMoon } from 'react-icons/fa'; 
import { useTheme } from '../../contexts/ThemeContext'; 
import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import Input from '../Input';
import Dropdown from '../Dropdown';
import logo from '../../assets/logo.avif';
import { useLogoutMutation } from '../../api/authApi'; 
import { toast } from 'react-toastify';

const UserHeader = ({ setIsSidebarOpen, userInfo }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  // Use the logout mutation
  const [logout] = useLogoutMutation();

  // Handle logout
  const handleLogout = async () => {
    console.log("Logout button clicked"); // Debugging
    try {
      await logout().unwrap();
      toast.info("Logout Successfully");
      navigate('/login'); 
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-30 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-sm h-16`}
    >
      <div className="flex items-center justify-between px-4 h-full">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <img 
            src={logo} 
            alt="Logo" 
            className="h-10 cursor-pointer" 
            onClick={() => navigate('/')} 
          />

          {/* Sidebar Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            <Menu size={20} />
          </Button>

          {/* Search Bar (Visible on screens >= 600px) */}
          <div className="hidden sm:block w-64">
            <Input placeholder="Search..." icon={<Search size={16} />} />
          </div>

          {/* Search Icon (Visible on screens < 600px) */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search size={20} />
          </Button>
        </div>

        {/* Notification, Dark Mode Toggle, and User Dropdown */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          >
            {darkMode ? (
              <FaSun size={20} className="text-yellow-400" />
            ) : (
              <FaMoon size={20} className="text-gray-800" />
            )}
          </Button>

          {/* Notification Button */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User Dropdown */}
          <Dropdown
            trigger={
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  {userInfo?.name?.charAt(0)}
                </div>
                <span>{userInfo?.name}</span>
                <ChevronDown size={16} />
              </Button>
            }
          >
            <div className="py-1">
              <button 
                className="px-4 py-2 text-sm w-full text-left hover:bg-gray-100 hover:text-black"
                onClick={() => navigate('/profile')} 
              >
                Profile
              </button>
              <button 
                className="px-4 py-2 text-sm w-full text-left hover:bg-gray-100 hover:text-black"
                onClick={() => navigate('/settings')} 
              >
                Settings
              </button>
              <button 
                className="px-4 py-2 text-sm w-full text-left hover:bg-gray-100 text-red-500"
                onClick={handleLogout} // Handle logout
              >
                Logout
              </button>
            </div>
          </Dropdown>
        </div>
      </div>

      {/* Search Modal for Smaller Screens */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center p-4 sm:hidden">
          <div className={`w-full max-w-md rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search..."
                icon={<Search size={16} />}
                className="flex-1"
                autoFocus
              />
              <Button variant="ghost" onClick={() => setIsSearchOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default UserHeader;