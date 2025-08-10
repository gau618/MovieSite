import React from "react";
import { useSelector } from "react-redux";
import "./genre.scss";
const Genres = ({ data }) => {
  const { genres } = useSelector((state) => state.home);
  const items = Array.isArray(data) ? data : [];
  return (
    <div className="genres">
      {items.slice(0, 2).map((g, idx) => {
        const id = typeof g === "object" ? g?.id : g;
        const name = genres?.[id]?.name || (typeof g === "object" ? g?.name : null);
        if (!id || !name) return null;
        return (
          <div key={`${id}-${idx}`} className="genre">
            {name}
          </div>
        );
      })}
    </div>
  );
};

export default Genres;
