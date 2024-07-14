import React from "react";
import { useState } from "react";
import ContentWrapper from "../../../component/contentWrapper/contentWrapper";
import SwitchTab from "../../../component/SwitchTabs/SwitchTab";
import useFetch from "../../../costumhook/useFetch";
import Coroursel from "../../../component/Corousel/Coroursel";
import "../home.scss"
const CommonFolder = () => {
  const [endpoint, setendpoint] = useState("day");
  const { data, loading } = useFetch(`/trending/all/${endpoint}`);
  const onTabChange = (tab, index) => {
    setendpoint(tab === "Day" ? "day" : "week");
  };
  return (
    <div>
      <div className="Commonsection">
        <ContentWrapper>
          <span className="CommonsectionTitle">Trending</span>
          <SwitchTab data={["Day", "Week"]} onTabChange={onTabChange} />
        </ContentWrapper>
        <Coroursel data={data?.results} loading={loading} />
      </div>
    </div>
  );
};

export default CommonFolder;
