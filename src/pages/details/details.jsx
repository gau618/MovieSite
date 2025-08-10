import React from 'react'
import {useParams} from "react-router-dom"
import useFetch from '../../costumhook/useFetch'
import DetailsBanner from './detailBanner/detailBanner'
import Cast from './cast/Cast'
import Videos from './videos/Videos'
import './details.scss'
import Recommendations from './recommendations/Recommendations'
const Details = () => {
 const { mediaType,id}=useParams();
 const { data, loading } = useFetch(`/${mediaType}/${id}/videos`);
 const { data: credits, loading: creditsLoading } = useFetch(`/${mediaType}/${id}/credits`);
  return (
  <div className="detailsPage">
      <DetailsBanner video={data?.results?.[0]} crew={credits?.crew}/>
  <Cast data={credits?.cast || []} />
  <Videos data={data?.results || []} />
  <Recommendations />
    </div>
  )
}

export default Details
