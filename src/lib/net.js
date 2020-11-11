const electron = window.require("electron");

const getJSON = (url) => {
  return new Promise((resolve, reject) => {
    console.log(electron);
    const request = electron.remote.net.request(url);
    request.on("response", (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });

      response.on("error", (e) => {
        reject(e);
      });
    });
    request.end();
  });
};

export { getJSON };
