import React, { useState, useEffect } from "react";
import styled from "styled-components";

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

export default Rack;
