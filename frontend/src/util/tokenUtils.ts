// utils/tokenUtils.js

/**
 * Giải mã JWT token để lấy thông tin payload
 * @param {string} token - JWT token cần giải mã
 * @returns {object|null} - Payload của token hoặc null nếu lỗi
 */
export const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Lấy access token từ sessionStorage
 * @returns {string|null} - Token hoặc null nếu không có
 */
export const getAccessToken = () => {
  return sessionStorage.getItem('access-token');
};

/**
 * Lưu access token vào sessionStorage
 * @param {string} token - Token cần lưu
 */
export const setAccessToken = (token : string) => {
  sessionStorage.setItem('access-token', token);
};

/**
 * Xóa access token khỏi sessionStorage
 */
export const removeAccessToken = () => {
  sessionStorage.removeItem('access-token');
};

/**
 * Lấy thông tin user từ token
 * @returns {object|null} - Thông tin user hoặc null nếu chưa đăng nhập
 */
export const getUserFromToken = () => {
  const token = getAccessToken();
  if (!token) return null;

  const decodedToken = decodeToken(token);
  if (!decodedToken) return null;

  return {
    id: decodedToken.sub,
    accountType: decodedToken.accountType, // 'FREE' hoặc 'PREMIUM'
    scope: decodedToken.scope,
    isPremium: decodedToken.accountType === 'PREMIUM',
    exp: decodedToken.exp,
    iat: decodedToken.iat
  };
};

/**
 * Kiểm tra xem token có hết hạn chưa
 * @returns {boolean} - true nếu token hết hạn, false nếu còn hiệu lực
 */
export const isTokenExpired = () => {
  const token = getAccessToken();
  if (!token) return true;

  const decodedToken = decodeToken(token);
  if (!decodedToken || !decodedToken.exp) return true;

  // exp là timestamp tính bằng giây, Date.now() tính bằng milliseconds
  return decodedToken.exp * 1000 < Date.now();
};

/**
 * Kiểm tra xem user có phải Premium không
 * @returns {boolean} - true nếu là Premium, false nếu không
 */
export const isPremiumUser = () => {
  const user = getUserFromToken();
  return user?.isPremium || false;
};

/**
 * Kiểm tra xem user đã đăng nhập chưa
 * @returns {boolean} - true nếu đã đăng nhập, false nếu chưa
 */
export const isAuthenticated = () => {
  const token = getAccessToken();
  return token !== null && !isTokenExpired();
};