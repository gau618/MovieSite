import React, { useEffect, useState } from "react";
import "./explore.scss";
import { fetchDataFromApi } from "../../utils/api";
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Img from "../../component/lazyLoadlmage/img";
import CorourselItem from "../../component/Corousel/CorourselItem";
import PosterFallback from "../../assets/no-poster.png"; // Adjusted path


const Explore = () => {
  const [data, setData] = useState([]);
  const [myMovies, setMyMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState([]); // keep as array [item]
  const [loading, setLoading] = useState(false);
  const { mediaType } = useParams();
  const location = useLocation();
  const { url } = useSelector((state) => state.home);
  
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams(location.search);
    const with_genres = params.get("with_genres");
    const year = params.get("year");
    const vote_average_gte = params.get("vote_average_gte");
    const sort_by = params.get("sort_by");

    const run = async () => {
      try {
        let results = [];
        if (with_genres || year || vote_average_gte || sort_by) {
          const discoverParams = { with_genres: with_genres || undefined, sort_by: sort_by || undefined };
          if (vote_average_gte) discoverParams["vote_average.gte"] = vote_average_gte;
          if (year) {
            if (mediaType === "movie") discoverParams.primary_release_year = year;
            if (mediaType === "tv") discoverParams.first_air_date_year = year;
          }
          const resp = await fetchDataFromApi(`/discover/${mediaType}`, discoverParams);
          results = resp?.results || [];
        } else {
          const popularResp = await fetchDataFromApi(`/${mediaType}/popular`);
          results = popularResp?.results || [];
        }

        if (!cancelled) {
          setData(results);
          setMyMovies(results);
          setSelectedMovie(results?.[0] ? [results[0]] : []);
        }
      } catch (error) {
        if (!cancelled) console.error("Error fetching data:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [mediaType, location.search]);
  
  // myMovies are now the list items directly; CorouselItem hover will still update selectedMovie
  // console.log(myMovies);
  const skItem = () => (
    <div className="skeletonItem">
      <div className="posterBlock skeleton"></div>
      <div className="textBlock">
        <div className="title skeleton"></div>
        <div className="date skeleton"></div>
      </div>
    </div>
  );

  return (
    <div className="explorecontainer">
      <div className="heroBanner">
        {!(loading) && selectedMovie?.[0] && (
          <>
            <div className="backgroundimage">
              <Img
                src={
                  selectedMovie[0]?.backdrop_path
                    ? url.backdrop + selectedMovie[0].backdrop_path
                    : PosterFallback
                }
              />
            </div>
            <div className="detailsontheSeaechpage">
              <h1>{selectedMovie[0]?.title||selectedMovie[0]?.name}</h1>
            </div>
          </>
        )}
        <div className="opacity-layer"></div>
      </div>
      <div className="exploreItems">
      {!loading ? (
        <>
              {myMovies?.map((item) => {
                const posterUrl = item.poster_path
                  ? url.poster + item.poster_path
                  : PosterFallback;
                return (
                  <CorourselItem item={item} posterUrl={posterUrl} setSelectedMovie={setSelectedMovie} endpoint={mediaType}/>
                );
              })}
              </>
          ) : (
            <div className="loadingSkeleton">
              {[...Array(20)].map((_, index) => (
                <React.Fragment key={index}>{skItem()}</React.Fragment>
              ))}
            </div>
          )}
          </div>
    </div>
  );
};

export default Explore;
