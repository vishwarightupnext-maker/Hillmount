const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_URL || "";
const BASE_URL = API_BASE ? `${API_BASE.replace(/\/$/, "")}/veena-api` : "/veena-api";

const HEADERS = {
  "x-api-key": "l3h1EvJdjEatKTDxBBDjq99jhTat6edl731UlTia",
  "X-Partner-Id": "mpfWKNkb4grRBbc5w53K",
  "x-user-currency": "INR",
};

/**
 * Fetch product list with filters
 */
export async function fetchProductList(params = {}) {
  const query = new URLSearchParams();
  
  if (params.PageNo) query.append("PageNo", params.PageNo);
  if (params.PageSize) query.append("PageSize", params.PageSize || 30);
  if (params.TravelType) query.append("TravelType", params.TravelType);
  if (params.ProductType) query.append("ProductType", params.ProductType);
  if (params.SectorName) query.append("SectorName", params.SectorName);
  if (params.CountryName) query.append("CountryName", params.CountryName);
  if (params.StateName) query.append("StateName", params.StateName);
  if (params.CityName) query.append("CityName", params.CityName);
  if (params.ProductCategoryCode) query.append("ProductCategoryCode", params.ProductCategoryCode);
  if (params.TourPriceFrom) query.append("TourPriceFrom", params.TourPriceFrom);
  if (params.TourPriceTo) query.append("TourPriceTo", params.TourPriceTo);
  if (params.DaysFrom) query.append("DaysFrom", params.DaysFrom);
  if (params.DaysTo) query.append("DaysTo", params.DaysTo);
  if (params.SortBy) query.append("SortBy", params.SortBy);
  if (params.SortDirection) query.append("SortDirection", params.SortDirection);
  if (params.patternText) query.append("patternText", params.patternText);

  const url = `${BASE_URL}/product-list?${query.toString()}`;
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) {
      throw new Error(`API status ${res.status}`);
    }
    const data = await res.json();
    console.log(`[VeenaWorldAPI] fetchProductList success (${params.ProductType || 'All'}):`, data.total, "products");
    return data;
  } catch (err) {
    console.error("[VeenaWorldAPI] fetchProductList failed:", err);
    return { total: 0, products: [], aggregations: {} };
  }
}

/**
 * Fetch single product static info
 */
export async function fetchProductDetail(productCode, travelType = "GIT") {
  if (!productCode) return null;
  const url = `${BASE_URL}/product/${productCode}?travelType=${travelType}`;
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) throw new Error(`API status ${res.status}`);
    const data = await res.json();
    console.log(`[VeenaWorldAPI] fetchProductDetail for ${productCode}:`, data);
    return data;
  } catch (err) {
    console.error(`[VeenaWorldAPI] fetchProductDetail failed for ${productCode}:`, err);
    return null;
  }
}

/**
 * Fetch departure cities for a product
 */
export async function fetchStartingLocations(productCode, travelType = "GIT") {
  if (!productCode) return [];
  const url = `${BASE_URL}/product/${productCode}/startingLocations?travelType=${travelType}`;
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) throw new Error(`API status ${res.status}`);
    const data = await res.json();
    if (travelType === "FIT") return data;
    return data.exLocation || [];
  } catch (err) {
    console.error(`[VeenaWorldAPI] fetchStartingLocations failed for ${productCode}:`, err);
    return [];
  }
}

/**
 * Fetch departure dates and pricing for GIT
 */
export async function fetchDepartureDates(productCode, options = {}) {
  if (!productCode) return null;
  const query = new URLSearchParams();
  if (options.startingLocation) query.append("startingLocation", options.startingLocation);
  if (options.isJL !== undefined) query.append("isJL", options.isJL);
  if (options.isNRI !== undefined) query.append("isNRI", options.isNRI);
  if (options.productType) query.append("productType", options.productType);

  const url = `${BASE_URL}/product/${productCode}/dates?${query.toString()}`;
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) throw new Error(`API status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`[VeenaWorldAPI] fetchDepartureDates failed for ${productCode}:`, err);
    return null;
  }
}

/**
 * Fetch complete departure details
 */
export async function fetchTourDetails(productCode, options = {}) {
  if (!productCode) return null;
  const query = new URLSearchParams();
  if (options.actualDepartureDate) query.append("actualDepartureDate", options.actualDepartureDate);
  if (options.startingLocation) query.append("startingLocation", options.startingLocation);
  if (options.startingLocationId) query.append("startingLocationId", options.startingLocationId);
  if (options.isJL !== undefined) query.append("isJL", options.isJL);
  if (options.isNRI !== undefined) query.append("isNRI", options.isNRI);
  if (options.productTypeCode) query.append("productTypeCode", options.productTypeCode);

  const url = `${BASE_URL}/product/${productCode}/tourDetails?${query.toString()}`;
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) throw new Error(`API status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`[VeenaWorldAPI] fetchTourDetails failed for ${productCode}:`, err);
    return null;
  }
}
