import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import ContentWrapper from "../../component/contentWrapper/contentWrapper";
import useFetch from "../../costumhook/useFetch";
import Img from "../../component/lazyLoadlmage/img";
import Coroursel from "../../component/Corousel/Coroursel";
import Avatar from "../../assets/avatar.png";
import "./person.scss";

const Person = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { url } = useSelector((state) => state.home);

  const { data: person, loading } = useFetch(`/person/${id}`);
  const { data: credits } = useFetch(`/person/${id}/combined_credits`);

  if (!loading && !person) return null;

  const knownFor = (credits?.cast || [])
    .filter(Boolean)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 20);

  const avatarSrc = person?.profile_path ? url.profile + person.profile_path : Avatar;
  const born = person?.birthday && dayjs(person.birthday).isValid() ? dayjs(person.birthday).format("MMM D, YYYY") : person?.birthday;
  const died = person?.deathday && dayjs(person.deathday).isValid() ? dayjs(person.deathday).format("MMM D, YYYY") : person?.deathday;

  return (
    <div className="personPage">
      <ContentWrapper>
        {person && (
          <div className="personHeader">
            <div className="avatar">
              <Img src={avatarSrc} />
            </div>
            <div className="meta">
              <h1 className="name">{person.name}</h1>
              {person.known_for_department && (
                <div className="dept">{person.known_for_department}</div>
              )}
              <div className="facts">
                {born && <div><span className="label">Born:</span> {born}</div>}
                {died && <div><span className="label">Died:</span> {died}</div>}
                {person.place_of_birth && <div><span className="label">From:</span> {person.place_of_birth}</div>}
              </div>
              {person.biography && (
                <div className="bio">
                  <div className="heading">Biography</div>
                  <p>{person.biography}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </ContentWrapper>

      {knownFor.length > 0 && (
        <div className="knownForSection">
          <ContentWrapper>
            <h3 className="sectionHeading">Known For</h3>
            <Coroursel data={knownFor} loading={false} endpoint={undefined} />
          </ContentWrapper>
        </div>
      )}
    </div>
  );
};

export default Person;
