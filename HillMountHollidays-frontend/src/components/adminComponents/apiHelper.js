export const API = import.meta.env.VITE_API_BASE;

export const getToken = () =>
  localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');

export const clearToken = () => {
  localStorage.removeItem('adminToken');
  sessionStorage.removeItem('adminToken');
};

export const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export const authJsonHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  'Content-Type': 'application/json',
});


export const getTokenPayload = () => {
  const token = getToken();
  if (!token) return null;
  try { return JSON.parse(atob(token.split('.')[1])); } catch { return null; }
};

export const isSuperAdmin = () => getTokenPayload()?.role === 'admin';

export const getAccess = () => getTokenPayload()?.access ?? { blogs: 'none', customHolidays: 'none' };

export const safeFetch = async (url, options, navigate) => {
  const res = await fetch(url, options);
  if (res.status === 401) {
    clearToken();
    navigate('/login');
    return null;
  }
  return res;
};
