import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import "./Header.scss";
import ContentWrapper from "../contentWrapper/contentWrapper";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import logo from "../../assets/movix-logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { aiParseSearch, isNaturalLanguageQuery } from "../../utils/ai";
import { useSelector } from "react-redux";
import { mapGenreNamesToIds } from "../../utils/ai";
import AiOverlay from "../skeleton/AiOverlay";

const Header = () => {
  const [show, setshow] = useState("top");
  const [mobileMenu, setmobileMenu] = useState("");
  const [lastscroll, setlastscroll] = useState(0);
  const [showSearch, setShowSearch] = useState(true);
  const [Query, setQuery] = useState("");
  const [showSearch1, setShowSearch1] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  // AI is always on now
  const { genres } = useSelector((state) => state.home);
  const navigate = useNavigate();
  const startlocation = useLocation();
  // Use the actual input value from the event to avoid stale React state
  const searchqueryhandler = (event) => {
    if (event.key === "Enter") {
      const val =
        event.target && event.target.value
          ? String(event.target.value).trim()
          : String(Query || "").trim();
      if (!val) return;
      if (isNaturalLanguageQuery(val)) {
        // Use AI for natural language queries
        handleAiSearch(val);
      } else {
        // Plain title search goes to normal results
        navigate(`/search/${encodeURIComponent(val)}`);
      }
      setTimeout(() => {
        setShowSearch(false);
        setShowSearch1(false);
      }, 1000);
    }
  };
  const handleAiSearch = async (q) => {
    try {
      setAiLoading(true);
      const parsed = await aiParseSearch(q);
      const mediaType = parsed?.mediaType || "movie";
      const names = parsed?.filters?.with_genres_names || [];
      const ids = mapGenreNamesToIds(genres, names);
      const year = parsed?.filters?.year;
      const vote = parsed?.filters?.vote_average_gte;
      const sort_by = parsed?.filters?.sort_by;
      const origin = parsed?.filters?.with_origin_country;
      const origLang = parsed?.filters?.with_original_language;
      const date_gte = parsed?.filters?.date_gte;
      const date_lte = parsed?.filters?.date_lte;
      const searchParams = new URLSearchParams();
      if (ids.length) searchParams.set("with_genres", ids.join(","));
      if (year) searchParams.set("year", String(year));
      if (vote) searchParams.set("vote_average_gte", String(vote));
      if (sort_by) searchParams.set("sort_by", sort_by);
      if (origin) searchParams.set("with_origin_country", origin);
      if (origLang) searchParams.set("with_original_language", origLang);
      if (date_gte) searchParams.set("date_gte", date_gte);
      if (date_lte) searchParams.set("date_lte", date_lte);
      navigate(`/explore/${mediaType}?${searchParams.toString()}`);
    } catch (e) {
      // Fallback to plain search on error
      navigate(`/search/${q}`);
    } finally {
      setAiLoading(false);
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
      if (window.scrollY > lastscroll && !mobileMenu) {
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [startlocation.pathname]);
  return (
    <>
      <AiOverlay visible={aiLoading} message="Understanding your request…" />
      <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
        <ContentWrapper>
          <div
            className="logo"
            onClick={() => {
              navigate("/");
            }}
          >
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
            {/* AI toggle removed; AI is always on */}
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
            {/* AI toggle removed in mobile too */}
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
    </>
  );
};

export default Header;
