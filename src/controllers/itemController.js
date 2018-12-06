const itemQueries = require("../db/queries.items.js");
 module.exports = {
  index(req, res, next){
    itemQueries.getAllItems((err, items) => {
        if(err){
          console.log(err);
          res.redirect(500, "static/index");
        } else {
          //console.log(items);
          res.render("items/index", {items});
        }
      })
  },
  add(req, res, next){
      res.render("items/add");
  },
  create(req, res, next){
    //console.log(req);
     let newItem = {  //sending this object to itemQueries to send to PSQL
       name: req.body.name,
       userId: req.user.dataValues.id,
       userName: req.user.dataValues.username,
       priority: req.body.priority,
       budget: req.body.budget,
     };
     itemQueries.addItem(newItem, (err, item) => {
       //console.log(err);
       if(err){
         res.redirect(500, `/items/`);
       } else {
         res.redirect(303, `/items/`);
       }
     });
   },


   show(req, res, next){
     //console.log(req);
     itemQueries.getItem(req.params.id, (err, item) => {
       if(err || item == null){
         //console.log(err);
         res.redirect(404, "/");
       } else {
         res.render("items/show", {item});
       }
     });
   },

   destroy(req, res, next){
     //console.log(req.params.id);
     itemQueries.deleteItem(req.params.id, (err, item) => {
       if(err){
         res.redirect(500, `/items/${item.id}`)
       } else {
         res.redirect(303, "/items")
       }
     });

   },

   edit(req, res, next){
     //console.log(req.params.id);
     itemQueries.getItem(req.params.id, (err, item) => {
       if(err || item == null){
         //console.log(err);
         res.redirect(404, "/");
       } else {
         res.render("items/edit", {item});
       }
     });
   },

   delete(req, res, next){
     //console.log(req);
     //console.log(res);
     itemQueries.getItem(req.params.id, (err, item) => {
       if(err || item == null){
         res.redirect(404, "/");
       } else {
         res.render("items/delete", {item});
       }
     });
   },

   update(req, res, next){  //using PSQL metadata from current item to pass id into itemQueries.updateItem
     //console.log(req);
     itemQueries.updateItem(req.params.id, req.body, (err, item) => {
       if(err || item == null){
         res.redirect(404, `/items/${req.params.id}/edit`);
       } else {
        console.log("Item Updated.")
         res.redirect(`/items/`);
       }
     });
   },


}
