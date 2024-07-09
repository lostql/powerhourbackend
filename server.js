const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const { handleOK } = require("./responseHandlers/responseHandler");
const {
  globalErrorMiddleware,
} = require("./Middlewares/globalErrorMiddleware");
const server = require("./Routes/index");
const { reqLogger } = require("./configs/logger.config");

if (process.env.NODE_ENV == "dev") {
  dotenv.config({ path: path.join(__dirname, ".env.dev") });
} else {
  dotenv.config();
}
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(express.static("public"));

app.use("/health-check", (req, res, next) => {
  handleOK(res, 200, null, "Health check route");
});

app.use(reqLogger);
app.use("/api", server);

app.use(globalErrorMiddleware);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
