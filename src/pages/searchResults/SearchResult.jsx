import React, { useEffect, useState } from "react";
import "./SearchResult.scss";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../costumhook/useFetch";
import { useSelector } from "react-redux";
import CorourselItem from "../../component/Corousel/CorourselItem";
import PosterFallback from "../../assets/no-poster.png";
import Img from "../../component/lazyLoadlmage/img";
import "../home/homeBanner/heroBanner.scss";
import {
  aiParseSearch,
  mapGenreNamesToIds,
  isNaturalLanguageQuery,
} from "../../utils/ai";
import AiOverlay from "../../component/skeleton/AiOverlay";

const SearchResult = () => {
  const [highestRatedMovie, setHighestRatedMovie] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState([]);
  const [data, setData] = useState([]);
  const { query } = useParams();
  const { url, genres } = useSelector((state) => state.home);
  const navigate = useNavigate();
  const [triedAi, setTriedAi] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Fetch movies and TV shows
  const { data: data1, loading: loading1 } = useFetch(`/search/movie`, {
    query,
  });
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

  // Immediate redirect for natural-language queries without waiting for API results
  useEffect(() => {
    if (triedAi) return;
    const q = String(query || "");
    if (!isNaturalLanguageQuery(q)) return;
    (async () => {
      try {
        setTriedAi(true);
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
        // ignore
      } finally {
        setAiLoading(false);
      }
    })();
  }, [genres, navigate, query, triedAi]);

  // If results finished loading and are empty, also try AI redirect
  useEffect(() => {
    if (triedAi) return;
    if (loading1 || loading2) return;
    const q = String(query || "");
    const noResults = !(data?.results?.length > 0);
    if (!noResults) return;
    if (!isNaturalLanguageQuery(q)) return;
    (async () => {
      try {
        setTriedAi(true);
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
        // ignore
      } finally {
        setAiLoading(false);
      }
    })();
  }, [
    data?.results?.length,
    genres,
    navigate,
    query,
    triedAi,
    loading1,
    loading2,
  ]);

  return (
    <div className="searchContainer">
      <AiOverlay visible={aiLoading} message="Finding matching filters…" />
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
              key={`${item.media_type || "movie"}-${item.id}`}
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
