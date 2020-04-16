import actions from "../actions";

export const userReducer = (state, action) => {
  switch (action.type) {
    case actions.user.auth:
      return {
        isLoading: false,
        data: action.data,
      };
    case actions.user.logout:
      return {
        isLoading: false,
        data: null,
      };

    default:
      return state;
  }
};
