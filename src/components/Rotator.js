import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import shim from "../assets/images/shim.png";
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
const Shimage = styled.img`
  width: 100%;
`;

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

const Cycler = ({ images }) => {
  const [items, setItems] = useState(images ? [images[0]] : []);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems([images[parseInt(Math.random() * images.length)]]);
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [images]);

  if (items.length === 0) {
    return <React.Fragment />;
  }

  return (
    <StyledRotator>
      <TransitionGroup component={null}>
        {items.map((image) => (
          <CSSTransition key={image.name} timeout={500}>
            <StyledRotatorItem>
              <StyledRotatorImage src={image.url} alt={image.name} />
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
      </TransitionGroup>
      <Shimage src={shim} />
    </StyledRotator>
  );
};

const Rotator = () => {
  const [images, setImages] = useState();
  useEffect(() => {
    async function getData() {
      try {
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

  return (
    <React.Fragment>
      {images && (
        <Cycler
          images={filterImages(images, (height, _) => height >= 1080)}
        ></Cycler>
      )}
    </React.Fragment>
  );
};

export default Rotator;
