import React from "react";
import { useNavigate } from "react-router-dom";
import ContentWrapper from "../../component/contentWrapper/contentWrapper";
import "./404.scss";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="not-found">
      <div className="bg"></div>
      <ContentWrapper>
        <div className="card">
          <div className="code">404</div>
          <h1 className="title">Page not found</h1>
          <p className="desc">
            The page you’re looking for doesn’t exist or was moved.
          </p>
          <div className="actions">
            <button className="primary" onClick={() => navigate("/")}>
              Go Home
            </button>
            <button
              className="secondary"
              onClick={() => navigate("/explore/movie")}
            >
              Explore Movies
            </button>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default NotFound;
