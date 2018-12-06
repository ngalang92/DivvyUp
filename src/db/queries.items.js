const Item = require("./models").Item;
const Mark = require("./models").Mark;


module.exports = {


  getAllItems(callback){
    return Item.all({
      include: [{
        model: Mark,
        as: "marks"
      }]
    })
    .then((items) => {
      callback(null, items);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getItem(id, callback){
    //console.log(id);
    return Item.findById(id, {
        include: [{
          model: Mark,
          as: "marks"
        }]
      })

    .then((item) => {
      callback(null, item);
    })
    .catch((err) => {
      callback(err);
    })
  },

  addItem(newItem, callback){
    //console.log(newItem);
    return Item.create({
      name: newItem.name,
      userId: newItem.userId,
      userName: newItem.userName,
      priority: newItem.priority,
      budget: newItem.budget

    })
    .then((item) => {
      callback(null, item);
    })
    .catch((err) => {
      callback(err);
    })
  },

  deleteItem(id, callback){
     return Item.destroy({
       where: {id}
     })
     .then((item) => {
       callback(null, item);
     })
     .catch((err) => {
       callback(err);
     })
  },

  updateItem(id, updatedItem, callback){
    console.log(updatedItem);
    return Item.findById(id)
    .then((item) => {
      //console.log(item);
      if(!item){
        return callback("Item not found");
      }
      item.update(updatedItem, {
          fields: Object.keys(updatedItem)
      })
      .then(() => {
        callback(null, item);
      })
      .catch((err) => {
        callback(err);
      });
    });
  }, //end updateItem

}
