import { useTranslation } from "react-i18next";
import "./navbar.scss";
import { Dropdown } from "@mui/base/Dropdown";
import { Menu } from "@mui/base/Menu";
import { AnimatedListbox } from "../NavbarStyleComponent/NavbarStyleComponent.tsx"
import languages from "../../i18n/i18nLanguages.ts";
import { MenuButton } from "../NavbarStyleComponent/NavbarStyleComponent.tsx";
import { MenuItem } from "@mui/material";
import { NavLink } from "react-router-dom";
import Logo from '../../assets/Logo.png'
import Search from "../Search/Search.tsx";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setisOpen] = useState<boolean>(false)
  const createHandleMenuClick = (lang: string) => {
    return () => {
      i18n.changeLanguage(lang);
    };
  };
function hideNavHamb(){
  if (window.innerWidth <= 830) {
    setisOpen(!isOpen);
  }
}

  return (
    <div className="navbar">
      <div className="icon">

        <img src={Logo} alt="logo img" />

      </div>

      {<div className={`menuSearchBox ${isOpen ? "menuSearchBoxActive" : ""}`}>
        <div className="menu">
          <ul>
            <li onClick={()=>{
              hideNavHamb()
            }}><NavLink to={'/home'} style={({ isActive }) => {
              return isActive ? { color: '#FFFFFF' } : { color: "#BFBFBF" }
            }}>
              {t("home")}
            </NavLink></li>
            <li onClick={()=>{
              hideNavHamb()
            }}><NavLink to={'/favorites'} style={({ isActive }) => {
              return isActive ? { color: '#FFFFFF' } : { color: "#BFBFBF" }
            }}>
              {t("favorite")}

            </NavLink></li>
            <li onClick={()=>{
              hideNavHamb()
            }}><NavLink to={'/watch-list'} style={({ isActive }) => {
              return isActive ? { color: '#FFFFFF' } : { color: "#BFBFBF" }

            }}>
              {t("watchList")}
            </NavLink></li>
          </ul>
        </div>
        <div className="searchBox">
          <Search hideNavHamb={hideNavHamb} />


        </div>
      </div>}
      <div className="rightNavSide">

        <Dropdown>
          <MenuButton>{t(i18n.language)}</MenuButton>
          <Menu slots={{ listbox: AnimatedListbox }}>
            {languages.map((language, index) => (
              <MenuItem
                key={index}
                onClick={createHandleMenuClick(`${language}`)}
              >
                {t(`${language}`)}
              </MenuItem>
            ))}
          </Menu>
        </Dropdown>
        <div onClick={() => setisOpen(!isOpen)} className={`hamburgerIcon ${isOpen ? "hamburgerIconActive" : ''}`}>
          <GiHamburgerMenu />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
