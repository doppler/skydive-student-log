const parseJwt = token => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(c => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

module.exports = parseJwt;

const jwtToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiaW5zdHJ1Y3RvciIsImluc3RydWN0b3JJZCI6MSwibmFtZSI6IkRhdmlkIFJvc2UiLCJpYXQiOjE1NzU4OTg5MDQsImV4cCI6MTU3NTk4NTMwNCwiYXVkIjoicG9zdGdyYXBoaWxlIiwiaXNzIjoicG9zdGdyYXBoaWxlIn0.Bxlk89tkhL3R7ROtFn9vK2XW2ZnTxa3hawima2r6Fec";

console.log(parseJwt(jwtToken));
