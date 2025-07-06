export const initialStore = () => {
  return {
    message: null,
    user: null,
    isAuthenticated: localStorage.getItem("token") ? true : false,
    userId: null,
    token: null,
    refresh_token: null 
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "login_success":
      return {
        ...store,
        isAuthenticated: true,
        token: action.payload.token,
        refresh_token: action.payload.refreshToken,
        userId: action.payload.userId,
        user: action.payload.user,
      };

    case "logout":
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
