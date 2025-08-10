import React, { useRef } from "react";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import CorourselItem from "./CorourselItem";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ContentWrapper from "../contentWrapper/contentWrapper";
import PosterFallback from "../../assets/no-poster.png";

import "./Coroursel.scss";

const Coroursel = ({ data, loading, endpoint }) => {
  const carouselContainer = useRef();
  const { url } = useSelector((state) => state.home);
  const navigation = (dir) => {
    const container = carouselContainer.current;
    const scrollAmount =
      dir === "left"
        ? container.scrollLeft - (container.offsetWidth + 20)
        : container.scrollLeft + (container.offsetWidth + 20);

    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  };
  const skItem = () => {
    return (
      <div className="skeletonItem">
        <div className="posterBlock skeleton">hello</div>
        <div className="textBlock">
          <div className="title skeleton">hello</div>
          <div className="date skeleton">hello</div>
        </div>
      </div>
    );
  };
  return (
    <div>
      <div className="carousel">
        <ContentWrapper>
          <BsFillArrowRightCircleFill
            className="carouselRightNav arrow"
            onClick={() => navigation("Right")}
          />
          <BsFillArrowLeftCircleFill
            className="carouselLeftNav arrow"
            onClick={() => navigation("left")}
          />
          {!loading ? (
            <div className="carouselItems" ref={carouselContainer}>
              {data?.map((item) => {
                const posterUrl = item.poster_path
                  ? url.poster + item.poster_path
                  : PosterFallback;
                return (
                  <CorourselItem item={item} posterUrl={posterUrl} endpoint={endpoint}/>
                );
              })}
            </div>
          ) : (
            <div className="loadingSkeleton">
              {[...Array(20)].map((_, index) => (
                <React.Fragment key={index}>{skItem()}</React.Fragment>
              ))}
            </div>
          )}
        </ContentWrapper>
      </div>
    </div>
  );
};

export default Coroursel;
