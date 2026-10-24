import HolidayListPage from "../components/HolidayListPage";
import HeroImg from "../assets/special/short-stay.svg";

const ShortStay = () => (
  <HolidayListPage
    packageType="short-stay"
    heroImageSrc={HeroImg}
    heroTagline="Quick Getaways"
    heroTitle={["Big Experiences.", "Short on Time."]}
    heroDesc="Perfectly packed short breaks for weekends, long weekends, and quick escapes."
    ctaLabel="Find My Quick Trip"
    detailPath="/short-stay"
  />
);

export default ShortStay;
