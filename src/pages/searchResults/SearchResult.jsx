import React, { useEffect, useState } from "react";
import "./SearchResult.scss";
import { useParams } from "react-router-dom";
import useFetch from "../../costumhook/useFetch";
import { useSelector } from "react-redux";
import CorourselItem from "../../component/Corousel/CorourselItem";
import PosterFallback from "../../assets/no-poster.png";
import Img from "../../component/lazyLoadlmage/img";
import "../home/homeBanner/heroBanner.scss";

const SearchResult = () => {
  const [highestRatedMovie, setHighestRatedMovie] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState([]);
  const [data, setData] = useState([]);
  const { query } = useParams();
  const { url } = useSelector((state) => state.home);

  // Fetch movies and TV shows
  const { data: data1, loading: loading1 } = useFetch(`/search/movie`, { query });
  const { data: data2, loading: loading2 } = useFetch(`/search/tv`, { query });

  // Combine fetched data
  useEffect(() => {
    const combinedResults = [
      ...(data1?.results || []),
      ...(data2?.results || []),
    ];
    setData({ results: combinedResults });
  }, [data1, data2]);

  // Find the highest-rated movie
  useEffect(() => {
    if (data?.results?.length) {
      const maxRating = Math.max(
        ...data.results.map((movie) => movie.vote_average || 0)
      );
      const hratedmovie = data.results.filter(
        (movie) => movie.vote_average === maxRating
      );

      setHighestRatedMovie(hratedmovie);
      setSelectedMovie(hratedmovie);
    }
  }, [data]);

  return (
    <div className="searchContainer">
      {/* Hero Banner */}
      <div className="heroBanner">
        {!(loading1 || loading2) && selectedMovie?.[0] && (
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
              <h1>{selectedMovie[0]?.title || "No Title Available"}</h1>
            </div>
          </>
        )}
        <div className="opacity-layer"></div>
      </div>

      {/* Carousel Items */}
      <div className="itemcontainer">
    {data?.results?.map((item) => {
          const posterUrl = item.poster_path
            ? url.poster + item.poster_path
            : PosterFallback;

          return (
            <CorourselItem
      key={`${item.media_type || 'movie'}-${item.id}`}
              item={item}
              posterUrl={posterUrl}
              setSelectedMovie={setSelectedMovie}
      endpoint={item.media_type || "movie"}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SearchResult;
