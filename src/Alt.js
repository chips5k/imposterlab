import React, { useContext, useRef, useState, useEffect } from "react";
import styled from "styled-components";
import GlobalStyle from "./GlobalStyle";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { StateProvider, StateContext, DispatchContext } from "./GlobalState";

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
  position: fixed;
  width: 100%;
  z-index: 1;
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

const App = () => {
  const scene = {
    racks: {
      rotator: {
        items: [1, 2, 3, 4, 5],
        ref: useRef("rotator"),
      },
      recent: {
        items: [1, 2, 3, 4, 5],
        ref: useRef("recent"),
      },
      tv: {
        items: [1, 2, 3, 4, 5],
        ref: useRef("tv"),
      },
      movies: {
        items: [1, 2, 3, 4, 5],
        ref: useRef("movies"),
      },
      simulcast: {
        items: [1, 2, 3, 4, 5],
        ref: useRef("simulcast"),
      },
    },
  };

  [scene.racks.rotator.selected, scene.racks.rotator.setSelected] = useState(0);
  [scene.racks.recent.selected, scene.racks.recent.setSelected] = useState(0);
  [scene.racks.tv.selected, scene.racks.tv.setSelected] = useState(0);
  [scene.racks.movies.selected, scene.racks.movies.setSelected] = useState(0);
  [
    scene.racks.simulcast.selected,
    scene.racks.simulcast.setSelected,
  ] = useState(0);

  const sections = [
    scene.racks.rotator,
    scene.racks.recent,
    scene.racks.tv,
    scene.racks.movies,
    scene.racks.simulcast,
  ];
  const sectionRef = useRef("section");
  const [section, setSection] = useState(0);

  sectionRef.current = sections[section];

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowLeft":
        if (sectionRef.current.setSelected) {
          sectionRef.current.setSelected((prev) =>
            prev - 1 >= 0 ? prev - 1 : prev
          );
        }

        break;
      case "ArrowRight":
        if (sectionRef.current.setSelected) {
          sectionRef.current.setSelected((prev) =>
            prev + 1 < sectionRef.current.items.length ? prev + 1 : prev
          );
        }

        break;
      case "ArrowUp":
        setSection((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
        break;

      case "ArrowDown":
        setSection((prev) => (prev + 1 < sections.length ? prev + 1 : prev));
        break;
      default:
    }
  };

  useEffect(() => {
    const keyPress = window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", keyPress);
    };
  }, []);

  const offsetY = sectionRef.current.ref.current
    ? sectionRef.current.ref.current.offsetTop
    : 0;
  const marginY = section === 0 ? "0em" : "5em";
  const translateY = `calc(-${offsetY}px + ${marginY})`;
  return (
    <StateProvider>
      <GlobalStyle />
      <Header>
        <Title>
          <StyledLogo /> <b>imposter</b>lab
        </Title>
        <PrimaryNav />
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
            ref={scene.racks.rotator.ref}
            items={scene.racks.rotator.items}
            selected={scene.racks.rotator.selected}
          />
          <div style={{ marginTop: "-10%" }}>
            <Rack
              ref={scene.racks.recent.ref}
              items={scene.racks.recent.items}
              selected={scene.racks.recent.selected}
            ></Rack>
            <Rack
              ref={scene.racks.tv.ref}
              items={scene.racks.tv.items}
              selected={scene.racks.tv.selected}
            ></Rack>
            <Rack
              ref={scene.racks.movies.ref}
              items={scene.racks.movies.items}
              selected={scene.racks.movies.selected}
            ></Rack>
            <Rack
              ref={scene.racks.simulcast.ref}
              items={scene.racks.simulcast.items}
              selected={scene.racks.simulcast.selected}
            ></Rack>
          </div>
        </div>
      </div>
      <BottonFade />
    </StateProvider>
  );
};

const Rotator = React.forwardRef(({ items, selected }, ref) => {
  const translate = `calc(${selected * -100}%)`;
  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          transition: "0.5s",
          transform: `translateX(${translate})`,
        }}
      >
        {items.map((n, i) => (
          <div
            key={n}
            style={{
              background: "black",
            }}
          >
            <img
              style={{ width: "100vw" }}
              alt="Test"
              src="http://0c86e2d1-madman-com-au.akamaized.net/rotatoritems/rotator_item_239_widescreen-rotator-art-clean-large_96878.jpg"
            />
          </div>
        ))}
      </div>
    </div>
  );
});
const Rack = React.forwardRef(({ items, selected }, ref) => {
  const translate = `calc(${selected * (-100 / items.length)}%)`;
  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          minWidth: "900px",
          transition: "0.5s",
          transform: `translateX(${translate})`,
        }}
      >
        {items.map((n, i) => (
          <div
            key={n}
            style={{
              background: "black",
              margin: "1em",
              border: `${
                i === selected ? "5px solid pink" : "5px solid white"
              }`,
            }}
          >
            <img
              style={{ width: "100%" }}
              alt="Test"
              src="http://0c86e2d1-madman-com-au.akamaized.net/shows/attack-on-titan_portrait-key-art-normal-small_62136.jpeg"
            />
          </div>
        ))}
      </div>
    </div>
  );
});
export default App;
