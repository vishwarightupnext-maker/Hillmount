import HolidayListPage from "../components/HolidayListPage";
import HeroImg from "../assets/adBanner3.webp";

const Cruise = () => (
  <HolidayListPage
    packageType="cruise"
    heroImageSrc={HeroImg}
    heroTagline="Sail in Style"
    heroTitle={["Cruise Holidays.", "Ocean of Memories."]}
    heroDesc="Handpicked cruise journeys with luxurious stays, scenic ports, and everything taken care of."
    ctaLabel="Find My Cruise"
    detailPath="/cruise"
  />
);

export default Cruise;

