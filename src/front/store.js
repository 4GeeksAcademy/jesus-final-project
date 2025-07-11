export const initialStore = () => {
  return {
    message: null,
    user: null,
    isAuthenticated: localStorage.getItem("token") ? true : false,
    userId: localStorage.getItem("userId"),
    token: localStorage.getItem("token") || null,
    refresh_token: localStorage.getItem("refresh_token") || null
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "login_success":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("refresh_token", action.payload.refresh_token);
      localStorage.setItem("userId", action.payload.userId);
      return {
        ...store,
        isAuthenticated: true,
        token: action.payload.token,
        refresh_token: action.payload.refresh_token,
        userId: action.payload.userId,
        user: action.payload.user,
      };

    case "logout":
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("userId");
      return {
        ...store,
        isAuthenticated: false,
        token: null,
        refresh_token: null,
        userId: null,
        user: null,
      };

      

    default:
      console.error("Unknown action dispatched:", action);
      throw Error("Unknown action.");
  }
}
