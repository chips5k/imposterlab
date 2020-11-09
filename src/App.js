import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import GlobalStyle from "./GlobalStyle";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { StateProvider, StateContext, DispatchContext } from "./GlobalState";

import HomeScreen from "./screens/HomeScreen";
import AccountScreen from "./screens/AccountScreen";
import LoginScreen from "./screens/LoginScreen";
import KidsScreen from "./screens/KidsScreen";
import MoviesScreen from "./screens/MoviesScreen";
import TVScreen from "./screens/TVScreen";
import SimulcastsScreen from "./screens/SimulcastsScreen";
import WatchlistScreen from "./screens/WatchlistScreen";
import NotFoundScreen from "./screens/NotFoundScreen";

import { PlayCircle as Logo } from "@styled-icons/ionicons-sharp";

const Screens = styled.div`
  position: relative;
  height: 100vh;
  overflow-y: scroll;
  &.forwards > .enter {
    transform: translateX(100%);
    opacity: 0;
  }

  &.forwards > .enter-active {
    transform: translateX(0%);
    opacity: 1;
  }

  &.forwards > .exit {
    transform: translateX(0%);
    opacity: 1;
  }

  &.forwards > .exit-active {
    transform: translateX(-100%);
    opacity: 0;
  }

  &.backwards > .enter {
    transform: translateX(-100%);
    opacity: 0;
  }

  &.backwards > .enter-active {
    transform: translateX(0%);
    opacity: 1;
  }

  &.backwards > .exit {
    transform: translateX(0%);
    opacity: 1;
  }

  &.backwards > .exit-active {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const Screen = styled.div`
  position: absolute;
  transition: 0.2s;
  overflow-y: visible;
  width: 100%;
  height: 100%;
`;

const Header = styled.header`
  background: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  color: white;
`;

const StyledLogo = styled(Logo)`
  height: 1em;
`;

const Title = styled.h1`
  padding: 0.8em 1em;
  margin: 0;
  font-size: 1.5em;
  font-weight: normal;
  & > b {
    font-family: "Varela Round", sans-serif;
  }
`;

const StyledPrimaryNav = styled.nav``;

const PrimaryNavButton = styled.button`
  border: none;
  background: none;
  padding: 1em 1.5em;
  margin: 0;
  font-size: 1em;
  outline: none;
  color: white;
`;

const PrimaryNav = () => {
  const dispatch = useContext(DispatchContext);
  const { navStack, loggedIn } = useContext(StateContext);
  const active = navStack[0];

  const push = (location) => () => {
    dispatch({ type: "PUSH_NAV", value: location });
  };

  const pop = () => () => {
    dispatch({ type: "POP_NAV" });
  };

  if (active !== "Home") {
    return (
      <StyledPrimaryNav>
        <PrimaryNavButton onClick={pop()}>Back</PrimaryNavButton>
      </StyledPrimaryNav>
    );
  }

  if (!loggedIn) {
    return (
      <StyledPrimaryNav>
        <PrimaryNavButton onClick={push("Login")}>Login</PrimaryNavButton>
      </StyledPrimaryNav>
    );
  }

  return (
    <StyledPrimaryNav>
      <PrimaryNavButton onClick={push("TV")}>TV</PrimaryNavButton>
      <PrimaryNavButton onClick={push("Movies")}>Movies</PrimaryNavButton>
      <PrimaryNavButton onClick={push("Simulcast")}>Simulcast</PrimaryNavButton>
      <PrimaryNavButton onClick={push("Kids")}>Kids</PrimaryNavButton>
      <PrimaryNavButton onClick={push("Watchlist")}>Watchlist</PrimaryNavButton>
    </StyledPrimaryNav>
  );
};

const ScreenRouter = () => {
  const { navStack, navDir } = useContext(StateContext);
  return (
    <TransitionGroup component={Screens} className={navDir}>
      {navStack.slice(0, 1).map((n) => (
        <CSSTransition key={n} timeout={200}>
          <Screen>{renderScreen(n)}</Screen>
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};

const renderScreen = (screen) => {
  switch (screen) {
    case "TV":
      return <TVScreen />;
    case "Movies":
      return <MoviesScreen />;
    case "Simulcast":
      return <SimulcastsScreen />;
    case "Kids":
      return <KidsScreen />;
    case "Watchlist":
      return <WatchlistScreen />;
    case "Home":
      return <HomeScreen />;
    case "Account":
      return <AccountScreen />;
    case "Login":
      return <LoginScreen />;

    default:
      return <NotFoundScreen />;
  }
};

const handleKeyDown = (e) => {
  window.scrollBy(100, 100);
};

function App() {
  useEffect(() => {
    const keyPress = window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("onKeyPress", keyPress);
    };
  }, []);

  return (
    <StateProvider>
      <GlobalStyle />
      <Header>
        <Title>
          <StyledLogo /> <b>imposter</b>lab
        </Title>
        <PrimaryNav />
      </Header>
      <ScreenRouter />
    </StateProvider>
  );
}

export default App;
