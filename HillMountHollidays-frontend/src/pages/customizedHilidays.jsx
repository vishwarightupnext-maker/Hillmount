import HolidayListPage from "../components/HolidayListPage";
import HeroImg from "../assets/customholidays.webp";

const CustomizedHolidays = () => (
  <HolidayListPage
    packageType="customized"
    heroImageSrc={HeroImg}
    heroTagline="Tailor-Made Travel"
    heroTitle={["Designed", "Around You."]}
    heroDesc="Personalised journeys crafted with comfort, care, and the feeling of home."
    ctaLabel="Create My Journey"
    detailPath="/personalised-holidays"
  />
);

export default CustomizedHolidays;

