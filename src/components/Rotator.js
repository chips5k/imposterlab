import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getJSON } from "../lib/net";
import SvgSpinnerRotator from "../assets/images/spinner-rotator.svg";

const filterItems = (images, sizePredicate) => {
  const out = {};

  for (const i of images) {
    for (const x of i.images) {
      for (const y of x.imageInstances) {
        if (sizePredicate(y.imageInfo.width, y.imageInfo.height)) {
          out[i.name] = {
            name: i.name,
            url: y.imageInfo.fullPath,
            description: i.description,
            width: y.imageInfo.width,
            height: y.imageInfo.height,
          };
        }
      }
    }
  }
  return Object.values(out);
};

const getItems = async () => {
  try {
    const data = await getJSON(
      "http://tv.animelab.com/api/racks/1?rackPage=0&rackLimit=5"
    );

    return data.panels[0].data.items;
  } catch (e) {
    console.error(e);
    return [];
  }
};

const StyledRotator = styled.div`
  // This positioning is need to prevent content
  // being hidden under other elements
  z-index: 1;
  position: relative;
`;

const NavContainer = styled.div`
  position: absolute;
  height: 1em;
  width: 100%;
  bottom: 25%;
  align-items: center;
  justify-content: center;
  display: flex;
  z-index: 1;
  width: 100%;
`;

const Nav = styled.div`
  display: flex;
  padding: 0.4em;
  border-radius: 100em;
  background: rgba(59, 0, 135, 0.8);
`;

const NavItem = styled.div`
  width: 0.5em;
  border-radius: 100em;
  background: ${({ focus }) => (focus ? "white" : "rgba(255,255,255,0.5)")};
  height: 0.5em;
  margin: 0em 0.5em;
`;

const Caption = styled.div`
  padding-left: 1.5em;
  position: absolute;
  bottom: 40%;
  margin: 0;
  width: 100%;
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 1);
  color: white;
`;
const Label = styled.div`
  font-size: 3em;
  font-weight: bold;

  color: white;
  z-index: 1;
`;

const Description = styled.div`
  margin: 0;
  width: 100%;
  font-size: 1em;
  z-index: 1;
`;

const SliderFrame = styled.div`
  width: 100%;
  overflow: hidden;
`;

const Slider = styled.div`
  display: flex;
  transition: 0.5s;
  transform: translateX(${({ translate }) => translate});
`;

const Item = styled.div``;

const SpinnerRotator = () => {
  return (
    <img alt="Loading..." src={SvgSpinnerRotator} style={{ width: "100%" }} />
  );
};

const StyledLoader = styled.div`
  width: 100%;
  align-items: center;
  justify-content: center;
  display: ${({ visible }) => (visible ? "flex" : "none")};
`;

const Loader = ({ visible, focus }) => (
  <StyledLoader focus={focus} visible={visible}>
    <SpinnerRotator />
  </StyledLoader>
);

const StyledImage = styled.img`
  display: ${({ visible }) => (visible ? "block" : "none")};
  width: 100vw;
`;

const Image = ({ src, focus, alt }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <React.Fragment>
      <Loader focus={focus} visible={!loaded} />
      <StyledImage
        src={src}
        focus={focus}
        alt={alt}
        onLoad={() => setLoaded(true)}
        visible={loaded}
      />
    </React.Fragment>
  );
};

const Rotator = React.forwardRef(({ title, active }, ref) => {
  //load initial data
  const [items, setItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    (async () => {
      const items = await getItems();
      const filtered = filterItems(items, (w, h) => h >= 1080);
      setItems(filtered);
    })();
  }, []);

  useEffect(() => {
    if (active) {
      const keyHandler = (e) => {
        if (e.key === "ArrowLeft") {
          setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
        }

        if (e.key === "ArrowRight") {
          setSelectedIndex((prev) =>
            prev + 1 < items.length ? prev + 1 : prev
          );
        }
      };
      window.addEventListener("keydown", keyHandler);
      return () => {
        window.removeEventListener("keydown", keyHandler);
      };
    }
  }, [active, items]);

  const translate = `calc(${selectedIndex * -100}%)`;
  return (
    <StyledRotator ref={ref}>
      <NavContainer>
        <Nav>
          {items.map((n, i) => (
            <NavItem key={"nav-" + n.name} focus={i === selectedIndex} />
          ))}
        </Nav>
      </NavContainer>
      <SliderFrame>
        <Slider translate={translate}>
          {items.map((n, i) => (
            <Item key={n.name}>
              <Image focus={i === selectedIndex} alt={n.name} src={n.url} />
              <Caption>
                <Label>{n.name}</Label>
                <Description>{n.description}</Description>
              </Caption>
            </Item>
          ))}
        </Slider>
      </SliderFrame>
    </StyledRotator>
  );
});

export default Rotator;
