import { useState } from 'react';
import ProfileInfo from '../Cards/ProfileInfo';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';



interface NavbarProps {
  userInfo: any;
  onSearchEmployee: (query: string) => void;
  handleClearSearch: () => void;
}

const Navbar = ({userInfo,onSearchEmployee,handleClearSearch}:NavbarProps) => {
  const [searchQuery,setSearchQuery] = useState("");
  const navigate = useNavigate(); // Correctly calling useNavigate as a function

  const onLogout = () => {
    localStorage.clear();
    userInfo = null;
    navigate("/login"); // Correct syntax for navigation
  };

  const handleSearch = () => {
    if(searchQuery){
      onSearchEmployee(searchQuery);

    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  }

  return (
<div className="flex items-center justify-between px-6 py-2 bg-gray-200 drop-shadow">
  <div className="flex items-center space-x-4">
    {/* Header Title */}
    <h2 className="py-2 text-xl font-medium text-black">User Management System</h2>

    {/* Navigation Links */}
    <nav className="flex items-center">
      <Link to="/dashboard" className="px-[550px] pr-10 text-gray-700 hover:underline">User</Link>
      <Link to="/company" className="px-4 pr-10 text-gray-700 hover:underline">Company</Link>
      <Link to="/login" className="px-4 text-gray-700 hover:underline">Log Out</Link>
    </nav>
  </div>
      <SearchBar 
      value={searchQuery}
      onChange={e => {
        setSearchQuery(e.target.value);
      }}
      handleSearch={handleSearch}
      onClearSearch={onClearSearch}/>
      {userInfo && <ProfileInfo userInfo={userInfo} onLogout={onLogout} />} {/* Render ProfileInfo only if userInfo exists */}
    </div>
  );
};

export default Navbar;
