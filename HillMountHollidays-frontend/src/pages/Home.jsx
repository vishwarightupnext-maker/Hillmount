  import React from "react";
  import Banner from "../components/Banner";
  import ScrollMarquee from "../components/scrollMarquee";
  import WorldCard from "../components/WorldCard";
  import WorldCircle from "../components/WorldCircle";
  import Ad1 from "../components/ad1";
  import JourneyBonds from "../components/JourneyBonds";
  import CuratedLivingSpaces from "../components/CuratedLivingSpaces";
  import GuestStories from "../components/GuestStories";
  import CounterBanner from "../components/counterBanner";
  import GetToKnow from "../components/getToknow";
  import NextHome from "../components/nextHome";
  import StartPlanAdBanner from "../components/startPlanAdBanner";
  import ReelSection from "../components/reelSection";
  import FaqComponent from "../components/faqComponent";
  import HomeBlogSection from "../components/HomeBlogSection";
  const Home = () => {
    return (
      <div className="w-full">
        <Banner />
        <ScrollMarquee />
        <WorldCard />
        <WorldCircle />
        <Ad1 />
         <JourneyBonds />
      
        <CounterBanner />
         <ReelSection />
          <GetToKnow />
           <GuestStories />
        <CuratedLivingSpaces />
        <HomeBlogSection />
        <FaqComponent />
        <StartPlanAdBanner />
      </div>
    );
  };

  export default Home;
