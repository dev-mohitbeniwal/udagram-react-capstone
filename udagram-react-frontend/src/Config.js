const REACT_APP_BACKEND_HOST =
  "http://a2401a0f0d8b64df0855c9d4844f4c4e-1440663746.us-east-2.elb.amazonaws.com:8080";
export const GET_FEED_API = `${REACT_APP_BACKEND_HOST}/api/v0/feed`;
export const POST_FEED_API = `${REACT_APP_BACKEND_HOST}/api/v0/feed`;
export const POST_VIDEO_API = `${REACT_APP_BACKEND_HOST}/api/v0/video`;
export const GET_VIDEO_API = `${REACT_APP_BACKEND_HOST}/api/v0/video`;
export const LOGIN_API = `${REACT_APP_BACKEND_HOST}/api/v0/users/auth/login`;
export const REGISTER_API = `${REACT_APP_BACKEND_HOST}/api/v0/users/auth`;
export const FEED_SIGNED_URL_API = `${REACT_APP_BACKEND_HOST}/api/v0/feed/signed-url/`;
export const VIDEO_SIGNED_URL_API = `${REACT_APP_BACKEND_HOST}/api/v0/video/signed-url/`;
