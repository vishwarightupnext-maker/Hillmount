import HolidayListPage from "../components/HolidayListPage";
import HeroImg from "../assets/special/honeymoon.svg";

const SpecialityTours = () => (
  <HolidayListPage
    packageType="speciality"
    heroImageSrc={HeroImg}
    heroTagline="Curated Experiences"
    heroTitle={["Journeys Built for", "Special Moments."]}
    heroDesc="Handpicked speciality tours for every kind of traveller — romance, adventure, culture & more."
    ctaLabel="Explore Speciality Tours"
    detailPath="/speciality-tours"
  />
);

export default SpecialityTours;
