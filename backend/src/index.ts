import { app } from "./app.js";
import { PORT } from "./config/env.config.js";

const port = PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${port}`);
});
