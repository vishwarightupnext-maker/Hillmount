import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_BASE;

const HotelAvailablity = () => {
  const [hotelOptions, setHotelOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHotelPackages = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API}/api/hotel-packages`);

        if (!response.ok) {
          throw new Error(`Failed to fetch hotel packages (${response.status})`);
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setHotelOptions(result.data);
        } else {
          setHotelOptions([]);
        }
      } catch (err) {
        console.error("Error fetching hotel packages:", err);
        setError("Unable to load hotel options. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotelPackages();
  }, []);

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  const formatStay = (hotel) => {
    const destination = hotel.destination || hotel.package_name || "—";
    const checkIn = formatDate(hotel.check_in);
    const checkOut = formatDate(hotel.check_out);

    return { destination, dates: `${checkIn} - ${checkOut}` };
  };

  const formatPrice = (price, currency = "INR") => {
    if (price === undefined || price === null || price === "") return "Price on request";

    return `${currency} ${Number(price).toLocaleString("en-IN")}/-`;
  };

  const formatOccupancy = (occupancy) => {
    if (!occupancy) return "—";

    return occupancy.charAt(0).toUpperCase() + occupancy.slice(1);
  };

  const formatMeals = (meals) => {
    if (!meals) return "Not specified";

    const mealList = Array.isArray(meals) ? meals : [meals];

    return mealList
      .map((meal) => meal.charAt(0).toUpperCase() + meal.slice(1))
      .join(" + ");
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm scroll-mt-24">
      <div className="mb-4">
        <h2 className="text-[17px] font-extrabold text-gray-900 mb-1">
          Hotel Options & Package Cost
        </h2>

        <p className="text-[12.5px] text-gray-500 leading-relaxed">
          Package cost applies for a minimum of 10 guests travelling together.
        </p>
      </div>

      {hotelOptions.length > 0 && (
        <div className="mb-4">
          <h3 className="text-[13px] sm:text-sm font-extrabold text-[#203F65]">
            {hotelOptions[0].star_rating
              ? `PREMIUM ${hotelOptions[0].star_rating}*`
              : "HOTEL PACKAGE"}{" "}
            -{" "}
            {formatPrice(
              hotelOptions[0].price_per_adult,
              hotelOptions[0].currency || "INR"
            )}{" "}
            per adult on {formatOccupancy(hotelOptions[0].occupancy_type).toLowerCase()} occupancy
          </h3>
        </div>
      )}

      <div className="w-full overflow-x-auto rounded-lg">
        <table className="w-full min-w-[600px] table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[21%]" />
            <col className="w-[30%]" />
            <col className="w-[25.5%]" />
            <col className="w-[23.5%]" />
          </colgroup>

          <thead>
            <tr className="bg-[#175384] text-white">
              {["STAY / DATES", "HOTEL", "ROOMS", "MEALS"].map((heading) => (
                <th
                  key={heading}
                  className="border border-gray-200 px-3 py-3 text-[11px] font-bold tracking-wide sm:px-4"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="border border-gray-100 px-3 py-8 text-center text-sm text-gray-500"
                >
                  Loading hotel options...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={4}
                  className="border border-gray-100 px-3 py-8 text-center text-sm text-red-500"
                >
                  {error}
                  <button
                    onClick={() => window.location.reload()}
                    className="ml-2 font-semibold underline"
                  >
                    Retry
                  </button>
                </td>
              </tr>
            ) : hotelOptions.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="border border-gray-100 px-3 py-8 text-center text-sm text-gray-500"
                >
                  No hotel packages available.
                </td>
              </tr>
            ) : (
              hotelOptions.map((hotel, index) => {
                const stay = formatStay(hotel);

                const rooms = [
                  hotel.room_count ? `${hotel.room_count} ` : "",
                  hotel.room_type || "Rooms",
                ].join("");

                const hotelName = hotel.hotel_name || "Hotel to be confirmed";

                return (
                  <tr
                    key={hotel._id || index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border border-gray-100 px-3 py-3 align-top text-[12px] font-bold leading-relaxed text-[#203F65] sm:px-4">
                      {stay.destination}
                      <br />
                      {stay.dates}
                    </td>

                    <td className="border border-gray-100 px-3 py-3 align-top text-[12px] font-bold leading-relaxed text-[#203F65] sm:px-4">
                      {hotelName}
                      <br />
                      <span className="font-normal text-gray-500">
                        {hotel.alternative_hotel
                          ? `or ${hotel.alternative_hotel}`
                          : "or Similar"}
                      </span>
                    </td>

                    <td className="border border-gray-100 px-3 py-3 align-top text-[12px] leading-relaxed text-gray-700 sm:px-4">
                      {rooms}
                    </td>

                    <td className="border border-gray-100 px-3 py-3 align-top text-[12px] leading-relaxed text-gray-700 sm:px-4">
                      {formatMeals(hotel.meal_plan)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <p className="text-[12px] text-gray-600 leading-relaxed">
          <span className="font-bold text-gray-800">Hotel Notes:</span>{" "}
          1) Hotels will be confirmed subject to room availability; otherwise a
          similar-category hotel will be offered. 2) The itinerary may be
          rearranged according to hotel availability at the time of booking.
          3) Rooms and rates are subject to availability at reservation and may
          change even on the same day.
        </p>
      </div>
    </div>
  );
};

export default HotelAvailablity;
