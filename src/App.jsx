import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import { fetchDataFromApi } from "./utils/api";
import { getApiConfiguration,getGenres } from "./store/homeSilce";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/home/home";
import Footer from "./component/footer/Footer";
import Header from "./component/header/Header";
import Details from "./pages/details/details";
import SearchResult from "./pages/searchResults/SearchResult";
import Explore from "./pages/explore/explore";
import NotFound from "./pages/404/404";
function App() {
  const dispatch = useDispatch();
  const apiTesting = () => {
    fetchDataFromApi("/configuration").then((res) => {
      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      };
      dispatch(getApiConfiguration(url));
    });
  };
  useEffect(() => {
    apiTesting();
    genresCall();
  }, []);

  const genresCall = async () => {
    let promises = [];
    let endPoints = ["tv", "movie"];
    let allGenres = {};

    endPoints.forEach((url) => {
        promises.push(fetchDataFromApi(`/genre/${url}/list`));
    });

    const data = await Promise.all(promises);
    data.map(({ genres }) => {
        return genres.map((item) => (allGenres[item.id] = item));
    });

    dispatch(getGenres(allGenres));
};

  return (
    <>
      <BrowserRouter>
        <Header></Header>
        <Routes>
          <Route path="/" element={<Home></Home>} />
        </Routes>
        <Routes>
          <Route path="/" element={<Footer></Footer>} />
        </Routes>
        <Routes>
          <Route path="/:mediaType/:id" element={<Details></Details>}/>
        </Routes>
        <Routes>
          <Route
            path="/search/:query"
            element={<SearchResult></SearchResult>}/>
        </Routes>
        <Routes>
          <Route path="/explore/:mediaType" element={<Explore></Explore>} />
        </Routes>
        <Routes>
          <Route path="*" element={<NotFound />} />
        </Routes>
        
      </BrowserRouter>
    </>
  );
}

export default App;
