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
      "http://tv.animelab.com/api/shows/popular?page=1&limit=8",
      {
        mode: "no-cors",
      }
    );
    const data = await response.json();

    return data.list;
  } catch (e) {
    console.error(e);
    return [];
  }
};

const Rack = React.forwardRef(({ active }, ref) => {
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

  const translate = `calc(${selectedIndex * (-100 / items.length)}%)`;
  return (
    <div ref={ref}>
      <h2>RackName</h2>
      <div
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
              key={n.name}
              style={{
                background: "black",
                margin: "1em",
                border: `${
                  i === selectedIndex ? "5px solid pink" : "5px solid white"
                }`,
              }}
            >
              <img
                style={{ width: "100%", minWidth: "220px" }}
                alt={n.name}
                src={n.url}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default Rack;
