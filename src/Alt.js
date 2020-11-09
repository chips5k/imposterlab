import React, { useState, useEffect, useRef } from "react";

const App = () => {
  const scene = {
    rotator: {
      ref: useRef("rotator"),
    },
    racks: {
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

  [scene.racks.recent.selected, scene.racks.recent.setSelected] = useState(0);
  [scene.racks.tv.selected, scene.racks.tv.setSelected] = useState(0);
  [scene.racks.movies.selected, scene.racks.movies.setSelected] = useState(0);
  [
    scene.racks.simulcast.selected,
    scene.racks.simulcast.setSelected,
  ] = useState(0);

  const sections = [
    scene.rotator,
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
  return (
    <div
      style={{
        overflow: "hidden",
        height: "100vh",
      }}
    >
      <div
        style={{
          transition: "0.5s",
          border: "1px solid red",
          transform: `translateY(-${offsetY}px)`,
        }}
      >
        <div
          ref={scene.rotator.ref}
          style={{
            width: "100%",
            height: "700px",
            background: "blue",
          }}
        ></div>
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
  );
};

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
