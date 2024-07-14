import React from "react";
import { useSelector } from "react-redux";
import "./genre.scss";
const Genres = ({ data }) => {
  const { genres } = useSelector((state) => state.home);
;  return (
    <div className="genres">
    {data.slice(0, 2).map((g) => { 
      if (!genres[g]?.name) return null;
      return (
        <div key={g} className="genre">
          {genres[g]?.name}
        </div>
      );
    })}
  </div>
  
  );
};

export default Genres;
