import React, { useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { FaSpotify } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";

import { useAuth } from "../../hooks/auth";

import DropdownMenu from "./Dropdown";

import { Container, Content } from "./styles";

const Header: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const { user } = useAuth();

  const handleDropdown = useCallback(() => {
    setShowDropdown(!showDropdown);
  }, [showDropdown]);

  return (
    <Container>
      <Content>
        <nav>
          <FaSpotify color="#fff" size={24} />
          <NavLink to="/artists" activeClassName="selected">
            Artistas
          </NavLink>
          <NavLink to="/favorite_tracks" activeClassName="selected">
            Músicas favoritas
          </NavLink>
          <NavLink to="/playlists" activeClassName="selected">
            Playlists
          </NavLink>
        </nav>

        <aside>
          <img src={user.avatar} alt={user.display_name} />
          <span>{user.display_name}</span>

          <button type="button" onClick={() => handleDropdown()}>
            <FiMoreVertical size={24} color="#fff" />
          </button>

          <DropdownMenu showDropdown={showDropdown} />
        </aside>
      </Content>
    </Container>
  );
};

export default Header;