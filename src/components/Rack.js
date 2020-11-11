import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getJSON } from "../lib/net";

const filterItems = (images, sizePredicate) => {
  const out = {};
  if (images) {
    for (const i of images) {
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

const getItems = async () => {
  try {
    const data = await getJSON(
      "http://tv.animelab.com/api/shows/popular?page=1&limit=8"
    );
    console.log({ data });
    return data.list;
  } catch (e) {
    console.error(e);
    return [];
  }
};

const StyledRack = styled.div`
  // This positioning is need to prevent content
  // being hidden under other elements
  z-index: 1;
  position: relative;
`;

const Title = styled.h2`
  padding: 1em 1em 0em 1em;
  margin: 0;
`;

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

const Image = styled.img`
  width: 100%;
  border-radius: 0.5em;
  border: ${({ focus }) =>
    focus ? "5px solid white" : "5px solid rgba(255,255,255,0)"};
`;

const Rack = React.forwardRef(({ title, active }, ref) => {
  //load initial data
  const [items, setItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    (async () => {
      const items = await getItems();
      const filtered = filterItems(items, (w, h) => h > w);
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

  const margins = selectedIndex * 2;
  const width = -100 / 5;
  const offset = width * selectedIndex;
  const translate = `calc(${offset}% - ${margins}em)`;

  return (
    <StyledRack ref={ref}>
      <Title>{title}</Title>
      <SliderFrame>
        <Slider translate={translate}>
          {items.map((n, i) => (
            <Item key={n.name}>
              <Image focus={i === selectedIndex} alt={n.name} src={n.url} />
            </Item>
          ))}
        </Slider>
      </SliderFrame>
    </StyledRack>
  );
});

export default Rack;
