import React from "react";
import './Coroursel.scss'
import dayjs from "dayjs";
import Img from "../lazyLoadlmage/img";
import { useNavigate } from "react-router-dom";
import Genres from "../genres/genre";
import Rating from "../Ratingbox/Rating";
export default function CorourselItem({item,posterUrl,setSelectedMovie,endpoint}) {
    const navigate = useNavigate();
    const handleHover=()=>{
      setSelectedMovie([item]);
    } 
    //console.log(item);
  return (
    <div
      key={item?.id}
      className="carouselItem"
      onMouseEnter={handleHover} 
      onClick={() => {
        navigate(`/${item?.media_type || endpoint}/${item?.id}`);
;
      }}
    >
      <div className="posterBlock" >
        <Img src={posterUrl} />
        <Rating rating={item?.vote_average} />
        <Genres data={item?.genre_ids||item?.genres} />
      </div>
      <div className="textBlock">
        <span className="title">{item?.title || item?.name}</span>
        <span className="data">
          {dayjs(item?.release_date).format("MMM D, YYYY")}
        </span>
      </div>
    </div>
  );
}
