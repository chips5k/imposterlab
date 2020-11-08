import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import GlobalStyle from "./GlobalStyle";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { StateProvider, StateContext, DispatchContext } from "./GlobalState";
import shim from "./shim.png";
import { PlayCircle as Logo } from "@styled-icons/ionicons-sharp";

const Screens = styled.div`
  position: relative;
  height: 100%;
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
  transition: 0.5s;
  overflow: hidden;
  width: 100%;
  height: 100%;
`;

const HomeScreen = () => {
  const [images, setImages] = useState();
  useEffect(() => {
    async function getData() {
      try {
        //http://tv.animelab.com//api/rotators/6
        const response = await fetch(
          "http://tv.animelab.com/api/racks/1?rackPage=0&rackLimit=5",
          {
            mode: "no-cors",
          }
        );
        const data = await response.json();

        setImages(data.panels[0].data.items);
      } catch (e) {
        // TODO
      }
    }
    getData();
  }, []);

  const dispatch = useContext(DispatchContext);
  return (
    <Screen>
      {images && (
        <Rotator
          images={filterImages(images, (height, _) => height >= 1080)}
        ></Rotator>
      )}
      <Rack />
    </Screen>
  );
};

const filterImages = (images, sizePredicate) => {
  const out = {};
  if (images) {
    for (const i of images) {
      for (const x of i.images) {
        for (const y of x.imageInstances) {
          if (sizePredicate(y.imageInfo.height, y.imageInfo.width)) {
            out[i.name] = {
              name: i.name,
              url: y.imageInfo.fullPath,
              description: i.description,
            };
          }
        }
      }
    }
  }
  return Object.values(out);
};

const StyledRotator = styled.div`
  margin-bottom: 1em;
  position: relative;
  & > .enter {
    transform: translateX(100%);
  }

  & > .enter-active {
    transform: translateX(0%);
  }

  & > .exit {
    transform: translateX(0%);
  }

  & > .exit-active {
    transform: translateX(-100%);
  }
`;
const StyledRotatorItem = styled.div`
  transition: 0.5s;
  width: 100%;
  z-index: 1;
  position: absolute;
`;

const StyledRotatorImage = styled.img`
  width: 100%;
`;

const StyledRotatorImageCaption = styled.div`
  position: absolute;
  z-index: 1;
  bottom: 0px;
  padding: 2em 2em;
  text-shadow: 2px 2px #000;
`;
const StyledRotatorImageTitle = styled.h2`
  font-size: 2.5em;
  margin: 0;
  padding: 0;
`;

const StyledRotatorImageDescription = styled.p`
  font-size: 1em;
  margin: 0;
  padding: 0;
  margin-top: 0.5em;
`;

const StyledRack = styled.div`
  padding: 2em;
  padding-top: 0;
`;

const RackTitle = styled.h2`
  text-shadow: 2px 2px #000;
  color: white;
`;
const RackItems = styled.div`
  display: flex;
  flex-direction: row;

  & > div:last-child {
    margin-right: 0em;
  }
`;
const RackItem = styled.div`
  width: 100%;
  overflow: hidden;
  margin-right: 1em;
  & > img {
    width: 110%;
  }
`;

const Rack = () => {
  const [images, setImages] = useState([]);
  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch(
          "http://tv.animelab.com/api/shows/popular?page=3&limit=5&rackPage=1&rackLimit=5",
          {
            mode: "no-cors",
          }
        );
        const data = await response.json();

        setImages(filterImages(data.list, (height, width) => height > width));
      } catch (e) {
        // TODO
      }
    }
    getData();
  }, []);

  return (
    <StyledRack>
      <RackTitle>Simulcasts</RackTitle>
      <RackItems>
        {images.map((image) => (
          <RackItem>
            <img src={image.url} />
          </RackItem>
        ))}
      </RackItems>
    </StyledRack>
  );
};

const Shimage = styled.img`
  width: 100%;
`;

const Rotator = ({ images }) => {
  const [items, setItems] = useState([images[0]]);
  useEffect(() => {
    const interval = setInterval(() => {
      setItems([images[parseInt(Math.random() * images.length)]]);
    }, 3000);
  }, []);
  return (
    <TransitionGroup component={StyledRotator}>
      {items.map((image) => (
        <CSSTransition key={image.name} timeout={500}>
          <StyledRotatorItem>
            <StyledRotatorImage src={image.url} />
            <StyledRotatorImageCaption>
              <StyledRotatorImageTitle>{image.name}</StyledRotatorImageTitle>
              {image.description && (
                <StyledRotatorImageDescription>
                  {image.description}
                </StyledRotatorImageDescription>
              )}
            </StyledRotatorImageCaption>
          </StyledRotatorItem>
        </CSSTransition>
      ))}
      <Shimage src={shim} />
    </TransitionGroup>
  );
};

const TvScreen = () => {
  const dispatch = useContext(DispatchContext);
  return <Screen>TV Series</Screen>;
};

const MoviesScreen = () => {
  const dispatch = useContext(DispatchContext);
  return <Screen>Movies</Screen>;
};

const SimulcastScreen = () => {
  const dispatch = useContext(DispatchContext);
  return <Screen>Simulcast</Screen>;
};

const KidsScreen = () => {
  const dispatch = useContext(DispatchContext);
  return <Screen>Kids</Screen>;
};

const WatchlistScreen = () => {
  const dispatch = useContext(DispatchContext);
  return <Screen>Watchlist</Screen>;
};

const ScreenNotFound = () => {
  const dispatch = useContext(DispatchContext);
  return <Screen>404 Not found</Screen>;
};

const AccountScreen = () => {
  const dispatch = useContext(DispatchContext);
  return <Screen>Account</Screen>;
};

const LoginScreen = () => {
  const dispatch = useContext(DispatchContext);
  return <Screen>Login</Screen>;
};

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

function App() {
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

const ScreenRouter = () => {
  const { navStack, navDir } = useContext(StateContext);
  return (
    <TransitionGroup component={Screens} className={navDir}>
      {navStack.slice(0, 1).map((n) => (
        <CSSTransition key={n} timeout={200}>
          {renderScreen(n)}
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};

const renderScreen = (screen) => {
  switch (screen) {
    case "TV":
      return <TvScreen />;
    case "Movies":
      return <MoviesScreen />;
    case "Simulcast":
      return <SimulcastScreen />;
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
      return <ScreenNotFound />;
  }
};

export default App;
