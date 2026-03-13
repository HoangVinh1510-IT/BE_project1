const express = require("express");
const methodOverride = require("method-override");
require("dotenv").config();

const database = require("./config/database");

const systemConfig = require("./config/system");

const routeAdmin = require("./routes/admin/index.router");
const route = require("./routes/client/index.route");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");

database.connect();

const app = express();
const port = process.env.PORT;

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));

app.set("views", "./views");
app.set("view engine", "pug");

// flash
app.use(cookieParser("ABCVSHSGY"));

app.use(session({ cookie: { maxAge: 6000 } }));

app.use(flash());
// end flash

// App Local varriables
// app.lodal là tạo ra các biến toàn cục mà file .pug nào cũng dùng được
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static("public"));

//routes
routeAdmin(app);
route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
