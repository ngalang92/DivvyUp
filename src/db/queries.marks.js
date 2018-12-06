const Mark = require("./models").Mark;
const Item = require("./models").Item;
const User = require("./models").User;

module.exports = {
 createMark(req, val, callback){
   //console.log(req);
   return Mark.findOne({
     where: {
       itemId: req.params.id,
    //   userId: req.user.dataValues.id    //might need this later
     }
   })
   .then((mark) => {

     if(mark){
       mark.value = val;
       mark.save()
       .then((mark) => {
         callback(null, mark);
       })
       .catch((err) => {
         callback(err);
       });
     } else {

       Mark.create({
         value: val,
         itemId: req.params.id,
    //     userId: req.user.dataValues.id    //might need this later
       }).then((mark) => {
         callback(null, mark);
       })
       .catch((err) => {
         callback(err);
       });
     }
   });
 }
}
