import React, { useRef } from "react";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import Img from "../lazyLoadlmage/img";
import ContentWrapper from "../contentWrapper/contentWrapper";
import Rating from "../Ratingbox/Rating";
import PosterFallback from "../../assets/__MACOSX/._no-poster.png";
import Genres from "../genres/genre";
import "./Coroursel.scss";

const Coroursel = ({ data, loading, endpoint }) => {
  const carouselContainer = useRef();
  const navigate = useNavigate();
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
                  <div
                    key={item.id}
                    className="carouselItem"
                    onClick={() => {
                      navigate(`${item.media_type || endpoint}/${item.id}`);
                    }}
                  >
                    <div className="posterBlock">
                      <Img src={posterUrl} />
                      <Rating rating={item.vote_average} />
                      <Genres data={item.genre_ids} />
                    </div>
                    <div className="textBlock">
                      <span className="title">{item.title || item.name}</span>
                      <span className="data">
                        {dayjs(item.release_date).format("MMM D, YYYY")}
                      </span>
                    </div>
                  </div>
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
