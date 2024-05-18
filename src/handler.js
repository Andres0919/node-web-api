import { join, dirname } from "node:path";
import { parse, fileURLToPath } from "node:url";
import { DEFAULT_HEADER } from "./util/util.js";
import { routes } from "./routes/hero.js";
import { generateInstace } from "./factories/heroFactory.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const filePath = join(currentDir, "./../database", "data.json");

const heroService = generateInstace({ filePath });
const heroRoutes = routes({ heroService });

const allRoutes = {
  ...heroRoutes,
  default: (req, res) => {
    res.writeHead(404, DEFAULT_HEADER);
    res.write("Route not found");
    res.end();
  },
};

function handler(req, res) {
  const { url, method } = req;
  console.log({ url, method });
  const { pathname } = parse(url, true);
  const key = `${pathname}:${method.toLowerCase()}`;
  const route = allRoutes[key] || allRoutes.default;
  return Promise.resolve(route(req, res)).catch(handlerError(res));
}

function handlerError(res) {
  return (error) => {
    console.log("Something bad happened", error.stack);
    res.writeHead(500, DEFAULT_HEADER);
    res.write(JSON.stringify({ error: "internal server error!!" }));

    return res.end();
  };
}

export default handler;
