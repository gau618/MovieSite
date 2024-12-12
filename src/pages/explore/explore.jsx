import React, { useEffect, useState } from "react";
import "./explore.scss";
import { fetchDataFromApi } from "../../utils/api";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Img from "../../component/lazyLoadlmage/img";
import CorourselItem from "../../component/Corousel/CorourselItem";
import PosterFallback from "../../assets/no-poster.png"; // Adjusted path


const Explore = () => {
  const [data, setData] = useState([]);
  const [myMovies, setMyMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState();
  const [loading, setLoading] = useState(false);
  const { mediaType } = useParams();
  const { url } = useSelector((state) => state.home);
  
  useEffect(() => {
    setLoading(true);
    const fetchPopularAndChange = async () => {
      try {
        const [popularResp, changeResp] = await Promise.all([
          fetchDataFromApi(`/${mediaType}/popular`),
          fetchDataFromApi(`/${mediaType}/changes`)
        ]);
  
        // Combine the results
        const combinedData = [
          ...(popularResp.results || []),
          ...(changeResp.results || [])
        ];
  
        setData(combinedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPopularAndChange();
  }, [mediaType]);
  

  useEffect(() => {
    if (data.length > 0) {
      const fetchMovieDetails = async () => {
        try {
          const moviesPromises = data.map((item) =>
            fetchDataFromApi(`/${mediaType}/${item?.id}`)
          );
          const movies = await Promise.all(moviesPromises);
          setMyMovies(movies);
          setSelectedMovie(movies);
        } catch (error) {
          console.error("Error fetching movie details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchMovieDetails();
    }
  }, [data, mediaType]);
  console.log(selectedMovie);
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
