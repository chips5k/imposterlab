import React, { useState, useEffect } from "react";
import styled from "styled-components";

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
    const response = await fetch(
      "http://tv.animelab.com/api/racks/1?rackPage=0&rackLimit=5",
      {
        mode: "no-cors",
      }
    );
    const data = await response.json();

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
  transition: 0.5s;
  transform: translateX(${({ translate }) => translate});
`;

const Item = styled.div``;

const Image = styled.img`
  width: 100vw;
`;

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
    </StyledRotator>
  );
});

export default Rotator;
