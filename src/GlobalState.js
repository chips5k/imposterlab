import React from "react";

const initialState = {
  navStack: ["Home"],
  navDir: "forwards",
  loggedIn: false,
};

const rootReducer = (state, action) => {
  switch (action.type) {
    case "PUSH_NAV":
      return {
        ...state,
        navDir: "forwards",
        navStack: action.value
          ? [action.value, ...state.navStack]
          : state.navStack,
      };
    case "POP_NAV":
      return {
        ...state,
        navDir: "backwards",
        navStack: state.navStack.slice(1),
      };
    default:
      throw new Error("Invalid action");
  }
};

const StateContext = React.createContext(initialState);
const DispatchContext = React.createContext((a) => {});

const StateProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(rootReducer, initialState);
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export { StateProvider, DispatchContext, StateContext };
