const devcert = require("devcert");
const https = require("https");
const next = require("next");

(async () => {
  const { key, cert } = await devcert.certificateFor("localhost");
  const app = next({ dev: true });
  const handle = app.getRequestHandler();
  await app.prepare();
  https
    .createServer({ key, cert }, (req, res) => handle(req, res))
    .listen(3000, () => {
      console.log("🚀 HTTPS dev 서버: https://localhost:3000");
    });
})();
