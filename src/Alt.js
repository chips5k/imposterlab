import React, { useContext, useState, useEffect, useRef } from "react";

const App = () => {
  const items = [1, 2, 3, 4, 5];
  const refs = {
    rotator: useRef("rotator"),
    racks: useRef("racks"),
  };
  const sections = [refs.rotator, refs.racks];

  const [section, setSection] = useState(0);
  const [item, setItem] = useState(0);
  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowLeft":
        setItem((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
        break;
      case "ArrowRight":
        setItem((prev) => (prev + 1 < items.length ? prev + 1 : prev));
        break;
      case "ArrowUp":
        setSection((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
        break;

      case "ArrowDown":
        setSection((prev) => (prev + 1 < sections.length ? prev + 1 : prev));
        break;
    }
  };

  useEffect(() => {
    const keyPress = window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", keyPress);
    };
  }, []);
  const offsetY = sections[section] ? sections[section].current.offsetTop : 0;
  const translate = `calc(${item * (-100 / items.length)}%)`;
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
          ref={refs.rotator}
          style={{
            width: "100%",
            height: "700px",
            background: "blue",
          }}
        ></div>
        <div
          ref={refs.racks}
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
                    i === item ? "5px solid pink" : "5px solid white"
                  }`,
                }}
              >
                <img
                  style={{ width: "100%" }}
                  src="http://0c86e2d1-madman-com-au.akamaized.net/shows/attack-on-titan_portrait-key-art-normal-small_62136.jpeg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
