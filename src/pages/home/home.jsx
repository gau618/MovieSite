import React from 'react'
import "./home.scss"
import HeroBanner from './homeBanner/heroBanner'
import CommonFolder from './CommonFolder/CommonFolder'
import Populor from "./populor/populor";
import TopRated from './TopRated/TopRated';
const Home = () => {
  return (
    <div className='homepage'>
      <HeroBanner/>
      <CommonFolder/>
      <Populor/>
      <TopRated/>
      <div style={{height:"100px"}}></div>
    </div>
  )
}

export default Home;
