import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./heroBanner.scss";
import useFetch from "../../../costumhook/useFetch";
import Img from "../../../component/lazyLoadlmage/img";
import ContentWrapper from "../../../component/contentWrapper/contentWrapper";
const HeroBanner = () => {
  const [background, setbackground] = useState("");
  const [Query, setQuery] = useState("");
  const { data, loading } = useFetch("/movie/popular");
  const { url } = useSelector((state) => state.home);
  const navigate = useNavigate();
  const searchbybutton = (event) => {
    searchqueryhandler(event);
    console.log(event.type);
  };
  const searchqueryhandler = (event) => {
    if ((event.key === "Enter" || event.type === "click") && Query.length > 0) {
      navigate(`/search/${Query}`);
    }
  };
  useEffect(() => {
    const bg =
      url.backdrop +
      data?.results?.[Math.floor(Math.random() * 20)]?.backdrop_path;
    setbackground(bg);
  }, [data]);
  return (
    <>
      <div className="heroBanner">
        {!loading && (
          <div className="backgroundimage">
            <Img src={background}></Img>
          </div>
        )}
        <div className="opacity-layer"></div>
        <ContentWrapper>
          <div className="herobannaecontant">
            <span className="title">Welcome</span>
            <span className="subTitle">
              Discover endless entertainment, waiting for you to explore today.
            </span>
            <div className="searchInput">
              <input
                type="text"
                onKeyUp={(event) => {
                  searchqueryhandler(event);
                }}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search your movie or tv show..."
              ></input>
              <button onClick={(event) => searchbybutton(event)}>Search</button>
            </div>
          </div>
        </ContentWrapper>
      </div>
    </>
  );
};

export default HeroBanner;
