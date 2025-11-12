import React from "react";
import { useParams } from "react-router-dom";
import ContentWrapper from "../../../component/contentWrapper/contentWrapper";
import useFetch from "../../../costumhook/useFetch";
import Coroursel from "../../../component/Corousel/Coroursel";
import "./recommendations.scss";

const Recommendations = () => {
  const { mediaType, id } = useParams();

  const { data, loading } = useFetch(`/${mediaType}/${id}/recommendations`);

  const results = data?.results || [];
  if (!loading && results.length === 0) return null;

  return (
    <div className="recommendationsSection">
      <ContentWrapper>
        <h3 className="sectionHeading">Recommendations</h3>
        <Coroursel data={results} loading={loading} endpoint={mediaType} />
      </ContentWrapper>
    </div>
  );
};

export default Recommendations;
