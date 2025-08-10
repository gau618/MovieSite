import React, { useState, useEffect} from "react";
import { HiOutlineSearch } from "react-icons/hi";
import "./Header.scss";
import ContentWrapper from "../contentWrapper/contentWrapper";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import logo from "../../assets/movix-logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { aiParseSearch } from "../../utils/ai";
import { useSelector } from "react-redux";
import { mapGenreNamesToIds } from "../../utils/ai";

const Header = () => {
  const [show, setshow] = useState("top");
  const [mobileMenu, setmobileMenu] = useState("");
  const [lastscroll, setlastscroll] = useState(0);
  const [showSearch, setShowSearch] = useState(true);
  const [Query, setQuery] = useState("");
  const [showSearch1, setShowSearch1] = useState(true);
  const [aiMode, setAiMode] = useState(false);
  const { genres } = useSelector((state) => state.home);
  const navigate = useNavigate();
  const startlocation =useLocation();
  const searchqueryhandler = (event) => {
    if (event.key === "Enter" && Query.length > 0) {
      if (aiMode) {
        handleAiSearch(Query);
      } else {
        navigate(`/search/${Query}`);
      }
      setTimeout(() => {
        setShowSearch(false);
        setShowSearch1(false);
      }, 1000);
    }
  };
  const handleAiSearch = async (q) => {
    try {
      const parsed = await aiParseSearch(q);
      const mediaType = parsed?.mediaType || "movie";
      const names = parsed?.filters?.with_genres_names || [];
      const ids = mapGenreNamesToIds(genres, names);
      const year = parsed?.filters?.year;
      const vote = parsed?.filters?.vote_average_gte;
      const sort_by = parsed?.filters?.sort_by;
      const searchParams = new URLSearchParams();
      if (ids.length) searchParams.set("with_genres", ids.join(","));
      if (year) searchParams.set("year", String(year));
      if (vote) searchParams.set("vote_average_gte", String(vote));
      if (sort_by) searchParams.set("sort_by", sort_by);
      navigate(`/explore/${mediaType}?${searchParams.toString()}`);
    } catch (e) {
      // Fallback to plain search on error
      navigate(`/search/${q}`);
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
        <div
        className="logo"
        onClick={()=>{navigate('/')}}>
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
            <button className="aiToggle" onClick={() => setAiMode((v) => !v)}>
              {aiMode ? "AI: On" : "AI: Off"}
            </button>
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
          <button className="aiToggle" onClick={() => setAiMode((v) => !v)}>
            {aiMode ? "AI: On" : "AI: Off"}
          </button>
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
