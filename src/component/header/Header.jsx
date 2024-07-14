import React, { useState, useEffect} from "react";
import { HiOutlineSearch } from "react-icons/hi";
import "./Header.scss";
import ContentWrapper from "../contentWrapper/contentWrapper";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import logo from "../../assets/movix-logo.svg";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const [show, setshow] = useState("top");
  const [mobileMenu, setmobileMenu] = useState("");
  const [lastscroll, setlastscroll] = useState(0);
  const [showSearch, setShowSearch] = useState(true);
  const [Query, setQuery] = useState("");
  const [showSearch1, setShowSearch1] = useState(true);
  const navigate = useNavigate();
  const startlocation =useLocation();
  const searchqueryhandler = (event) => {
    if (event.key === "Enter" && Query.length > 0) {
      navigate(`/search/${Query}`);
      setTimeout(() => {
        setShowSearch(false);
        setShowSearch1(false);
      }, 1000);
    }
  };
  const searchInput = () => {
    showSearch ? setShowSearch(false) : setShowSearch(true);
  };

  const searchInput1 = () => {
    showSearch1 ? setShowSearch1(false) : setShowSearch1(true);
  };

  const mobilesidebar = () => {
    setmobileMenu(true);
  };
  const navigationHandler = (type) => {
    if (type === "movie") {
      navigate("/explore/movie");
    } else {
      navigate("/explore/tv");
    }
    setmobileMenu(false);
  };
  const headerscroll = () => {
    console.log()
    if (window.scrollY > 200) {
      if (window.scrollY > lastscroll &&!mobileMenu) {
        setshow("hide");
      } else {
        setshow("show");
      }
    } else {
      setshow("top");
    }
    setlastscroll(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", headerscroll);
    return () => {
      window.removeEventListener("scroll", headerscroll);
    };
  }, [lastscroll]);
  useEffect(()=>{
        window.scrollTo(0,0);
  },[startlocation.pathname])
  return (
    <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
      <ContentWrapper>
        <div>
          <img src={logo} alt="" />
        </div>
        <ul className="menuItems">
          <li className="menuItem" onClick={() => navigationHandler("movie")}>
            Movie
          </li>
          <li className="menuItem" onClick={() => navigationHandler("tv")}>
            TV Show
          </li>
          <li>
            <input
              type="text"
              onChange={(e) => setQuery(e.target.value)}
              onKeyUp={(event) => {
                searchqueryhandler(event);
              }}
              className={`headersearch ${showSearch ? "Displaysearch" : ""}`}
            />
          </li>
          <li className="menuItem">
            <HiOutlineSearch onClick={searchInput} />
          </li>
        </ul>
        <div className="mobileMenuItems">
          <input
            type="text"
            onChange={(e) => setQuery(e.target.value)}
            onKeyUp={(event) => {
              searchqueryhandler(event);
            }}
            className={`headersearch ${showSearch1 ? "Displaysearch" : ""}`}
          />
          <HiOutlineSearch className="headersvg" onClick={searchInput1} />
          {mobileMenu ? (
            <VscChromeClose
              onClick={() => {
                setmobileMenu(false);
              }}
            />
          ) : (
            <SlMenu onClick={mobilesidebar} />
          )}
        </div>
      </ContentWrapper>
    </header>
  );
};

export default Header;
