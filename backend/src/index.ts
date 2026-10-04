import { app } from "./app.js";
import { PORT } from "./config/env.config.js";
import redis from "./lib/redis.js";

const port = PORT;

app.listen(PORT, async () => {
  console.log(`Server is running on port: ${port}`);
});
