import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getJSON } from "../lib/net";
import SvgSpinnerRack from "../assets/images/spinner-rack.svg";
import SvgSpinnerSmall from "../assets/images/spinner-small.svg";

const filterItems = (images, sizePredicate) => {
  const out = {};
  for (const i of images) {
    //not sure why but occasionally we get an undefined element in the returned array
    if (i) {
      for (const x of i.images) {
        for (const y of x.imageInstances) {
          if (sizePredicate(y.imageInfo.width, y.imageInfo.height)) {
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

const getItems = async (type, filter) => {
  try {
    const data = await getJSON(
      `http://tv.animelab.com/api/${type}/${filter}?page=1&limit=8`
    );
    return data.list;
  } catch (e) {
    return [];
  }
};

const StyledRack = styled.div`
  // This positioning is need to prevent content
  // being hidden under other elements
  z-index: 1;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 2em 0em 0em 1.5em;
`;

const Title = styled.h2`
  padding: 0;
  margin: 0;
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 1);
  margin-right: 0.5em;
`;

const SpinnerSmall = ({ visible }) => {
  if (visible) {
    return (
      <img alt="Loading..." style={{ height: "1.5em" }} src={SvgSpinnerSmall} />
    );
  }
  return null;
};

const SliderFrame = styled.div`
  width: 100%;
  overflow: hidden;
`;

const Slider = styled.div`
  display: flex;
  min-width: 900px;
  transition: 0.5s;
  transform: translateX(${({ translate }) => translate});
`;

const Item = styled.div`
  margin: 1em;
  box-sizing: border-box;
  min-width: calc((100% - 0px) / 5);
  width: calc((100% - 0px) / 5);
  max-width: calc((100% - 0px) / 5);
`;

const StyledImage = styled.img`
  width: 100%;
  border-radius: 0.5em;
  display: ${({ visible }) => (visible ? "block" : "none")};
  border: ${({ focus }) =>
    focus ? "5px solid white" : "5px solid rgba(255,255,255,0)"};
`;

const SpinnerRack = () => {
  return (
    <img alt="Loading..." src={SvgSpinnerRack} style={{ width: "100%" }} />
  );
};

const StyledLoader = styled.div`
  width: 100%;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  display: ${({ visible }) => (visible ? "flex" : "none")};
  border-radius: 0.5em;
  border: ${({ focus }) =>
    focus ? "5px solid white" : "5px solid rgba(255,255,255,0)"};
`;

const Loader = ({ visible, focus }) => (
  <StyledLoader focus={focus} visible={visible}>
    <SpinnerRack />
  </StyledLoader>
);

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

const Rack = React.forwardRef(({ title, type, filter, active }, ref) => {
  //load initial data
  const [items, setItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const items = await getItems(type, filter);
      const filtered = filterItems(items, (w, h) => h > w);
      setItems(filtered);
      setLoading(false);
    })();
  }, [filter, type]);

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

  const margins = selectedIndex * 2;
  const width = -100 / 5;
  const offset = width * selectedIndex;
  const translate = `calc(${offset}% - ${margins}em)`;

  return (
    <StyledRack ref={ref}>
      <Header>
        <Title>{title}</Title>
        <SpinnerSmall visible={loading} />
      </Header>
      <SliderFrame>
        <Slider translate={translate}>
          {items.map((n, i) => (
            <Item key={n.name}>
              <Image
                focus={active && i === selectedIndex}
                alt={n.name}
                src={n.url}
              />
              <Label>{n.name}</Label>
            </Item>
          ))}
        </Slider>
      </SliderFrame>
    </StyledRack>
  );
});

const Label = styled.div`
  margin-top: 0.5em;
`;
export default Rack;
