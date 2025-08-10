import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ContentWrapper from "../../../component/contentWrapper/contentWrapper";
import Img from "../../../component/lazyLoadlmage/img";
import Avatar from "../../../assets/avatar.png";
import "./cast.scss";

const Cast = ({ data = [] }) => {
  const { url } = useSelector((state) => state.home);
  const navigate = useNavigate();
  if (!data?.length) return null;
  return (
    <div className="castSection">
      <ContentWrapper>
        <h3 className="sectionHeading">Top Cast</h3>
        <div className="listItems">
          {data.slice(0, 12).map((item) => {
            const imgUrl = item.profile_path
              ? url.profile + item.profile_path
              : Avatar;
            return (
              <div
                className="listItem"
                key={item.id}
                onClick={() => navigate(`/person/${item.id}`)}
                title={item.name}
              >
                <div className="profileImg">
                  <Img src={imgUrl} />
                </div>
                <div className="name">{item.name}</div>
                <div className="character">{item.character}</div>
              </div>
            );
          })}
        </div>
      </ContentWrapper>
    </div>
  );
};

export default Cast;
