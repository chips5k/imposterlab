import React, { useContext, useRef, useState, useEffect } from "react";
import styled from "styled-components";
import GlobalStyle from "./GlobalStyle";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { StateProvider, StateContext, DispatchContext } from "./GlobalState";

import { PlayCircle as Logo } from "@styled-icons/ionicons-sharp";

import Rack from "./components/Rack.js";
import Rotator from "./components/Rotator.js";

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
  position: fixed;
  width: 100%;
  z-index: 3;
  min-width: 800px;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  color: white;
  height: 5em;
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

const StyledPrimaryNav = styled.nav`
  margin-right: 1em;
`;

const PrimaryNavButton = styled.button`
  border: none;
  background: none;
  padding: 1em 1.5em;
  margin: 0 0em;
  font-size: 1em;
  outline: none;
  border-radius: 3em;
  color: white;
  transition: 0.5s;
  background: ${({ active }) =>
    active ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0)"};
  border: 0.2em solid
    ${({ active }) =>
      active ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0)"}; ;
`;

const BottonFade = styled.div`
  position: fixed;
  bottom: 0px;
  z-index: 1;
  height: 5em;
  width: 100%;
  background: linear-gradient(
    180deg,
    rgba(55, 0, 135, 0) 0%,
    rgba(55, 0, 135, 1) 100%
  );
`;

const PrimaryNav = ({ selectedRef, refs }) => {
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
        <PrimaryNavButton
          active={selectedRef === refs.login}
          ref={refs.login}
          onClick={push("Login")}
        >
          Login
        </PrimaryNavButton>
      </StyledPrimaryNav>
    );
  }

  return (
    <StyledPrimaryNav>
      <PrimaryNavButton
        active={selectedRef === refs.tv}
        ref={refs.tv}
        onClick={push("TV")}
      >
        TV
      </PrimaryNavButton>
      <PrimaryNavButton
        active={selectedRef === refs.movies}
        ref={refs.movies}
        onClick={push("Movies")}
      >
        Movies
      </PrimaryNavButton>
      <PrimaryNavButton
        active={selectedRef === refs.simulcast}
        ref={refs.simulcast}
        onClick={push("Simulcast")}
      >
        Simulcast
      </PrimaryNavButton>
      <PrimaryNavButton
        active={selectedRef === refs.kids}
        ref={refs.kids}
        onClick={push("Kids")}
      >
        Kids
      </PrimaryNavButton>
      <PrimaryNavButton
        active={selectedRef === refs.watchlist}
        ref={refs.watchlist}
        onClick={push("Watchlist")}
      >
        Watchlist
      </PrimaryNavButton>
    </StyledPrimaryNav>
  );
};

const App = () => {
  const refs = {
    home: useRef("home"),
    login: useRef("login"),
    tv: useRef("tv"),
    movies: useRef("movies"),
    simulcast: useRef("simulcast"),
    kids: useRef("kids"),
    watchlist: useRef("watchlist"),
    racks: {
      rotator: useRef("rotator-rack"),
      recent: useRef("recent-rack"),
      tv: useRef("tv-rack"),
      movies: useRef("movies-rack"),
      simulcast: useRef("simulcast-rack"),
    },
  };

  const orderedRefs = [
    //refs.login,
    refs.tv,
    refs.movies,
    refs.simulcast,
    refs.kids,
    refs.watchlist,
    refs.racks.rotator,
    refs.racks.recent,
    refs.racks.tv,
    refs.racks.movies,
    refs.racks.simulcast,
  ];
  const ROTATOR_INDEX = 5;

  const [refIndex, setRefIndex] = useState(ROTATOR_INDEX);

  const selectedRef = orderedRefs[refIndex];

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowLeft":
        if (refIndex < ROTATOR_INDEX) {
          setRefIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
        }
        break;
      case "ArrowRight":
        if (refIndex < ROTATOR_INDEX) {
          setRefIndex((prev) =>
            prev + 1 < orderedRefs.length ? prev + 1 : prev
          );
        }
        break;
      case "ArrowUp":
        setRefIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
        break;

      case "ArrowDown":
        setRefIndex((prev) =>
          prev + 1 < orderedRefs.length ? prev + 1 : prev
        );
        break;
      default:
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [orderedRefs]);

  let offsetY = selectedRef.current ? selectedRef.current.offsetTop : 0;
  const marginY = refIndex === ROTATOR_INDEX ? "-0em" : "5em";
  if (refIndex < ROTATOR_INDEX) {
    offsetY = 25;
  }
  const translateY = `calc(-${offsetY}px + ${marginY})`;
  return (
    <StateProvider>
      <GlobalStyle />
      <Header>
        <Title>
          <StyledLogo /> <b>imposter</b>lab
        </Title>
        <PrimaryNav selectedRef={selectedRef} refs={refs} />
      </Header>
      <div
        style={{
          overflow: "hidden",
          height: "100vh",
        }}
      >
        <div
          style={{
            transition: "0.5s",
            transform: `translateY(${translateY})`,
          }}
        >
          <Rotator
            ref={refs.racks.rotator}
            active={refs.racks.rotator === selectedRef}
          />
          <div
            style={{
              marginTop: "-15%",
            }}
          >
            <Rack
              title="Recent"
              ref={refs.racks.recent}
              active={refs.racks.recent === selectedRef}
            />
            <Rack
              title="TV"
              ref={refs.racks.tv}
              active={refs.racks.tv === selectedRef}
            />
            <Rack
              title="Movies"
              ref={refs.racks.movies}
              active={refs.racks.movies === selectedRef}
            />
            <Rack
              title="Simulcast"
              ref={refs.racks.simulcast}
              active={refs.racks.simulcast === selectedRef}
            />
          </div>
        </div>
      </div>
      <BottonFade />
    </StateProvider>
  );
};

export default App;
