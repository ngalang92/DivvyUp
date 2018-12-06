module.exports = {
  init(app){
    const staticRoutes = require("../routes/static");
    const userRoutes = require("../routes/users");
    const itemRoutes = require("../routes/items")
    const markRoutes = require("../routes/marks");

    app.use(staticRoutes);
    app.use(userRoutes);
    app.use(itemRoutes);
    app.use(markRoutes);
  }
}
