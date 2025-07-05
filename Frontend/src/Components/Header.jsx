import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Header() {
  const user = useSelector(state => state.user.user);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleHomeClick = () => {
    navigate('/home');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand" onClick={handleHomeClick} role="button" tabIndex={0}>
          <div className="logo">
            <span className="logo-text">✓</span>
          </div>
          <h1 className="header-title">Media Hub</h1>
        </div>
        {user && (
          <div 
            className="user-profile"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleProfileClick}
          >
            {user.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt={`${user.username}'s profile`}
                className="profile-picture-header"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.classList.remove('hidden');
                }}
              />
            ) : (
              <div className="profile-picture-fallback">
                {getInitials(user.username)}
              </div>
            )}
            <div 
              className="profile-picture-fallback hidden"
            >
              {getInitials(user.username)}
            </div>
            <div className="user-info">
              <p className="username-header">{user.username}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;