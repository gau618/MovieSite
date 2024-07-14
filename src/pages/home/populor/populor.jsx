import React from "react";
import { useState } from "react";
import ContentWrapper from "../../../component/contentWrapper/contentWrapper";
import SwitchTab from "../../../component/SwitchTabs/SwitchTab";
import useFetch from "../../../costumhook/useFetch";
import Coroursel from "../../../component/Corousel/Coroursel";
const Populor = () => {
const currentYear= new Date().getFullYear();
  const [endpoint, setendpoint] = useState("movie");
  const { data, loading } = useFetch(`/${endpoint}/popular`);
  const onTabChange = (tab, index) => {
    setendpoint(tab === "Movie" ? "movie" : "tv");
  };
  return (
    <div>
      <div className="Commonsection">
        <ContentWrapper>
          <span className="CommonsectionTitle">Best  of {currentYear}</span>
          <SwitchTab data={["Movie", "TV Show"]} onTabChange={onTabChange} />
        </ContentWrapper>
        <Coroursel endpoint={endpoint} data={data?.results} loading={loading} />
      </div>
    </div>
  );
};

export default Populor;