"use strict";
module.exports = (sequelize, DataTypes) => {
  var Item = sequelize.define("Item", {

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    priority: {
      type: DataTypes.STRING,
    },

    budget: {
      type: DataTypes.FLOAT,
      allowNull: true
    },

    userName: DataTypes.STRING,

  }, {});
  Item.associate = function(models) {
    // associations can be defined here

     Item.belongsTo(models.User, {
       foreignKey: "userId",
       onDelete: "CASCADE"
     });


     Item.hasMany(models.Mark, {
        foreignKey: "itemId",
        as: "marks"
     });

     Item.afterCreate((item, callback) => {
       return models.Mark.create({
         value: false,
         userId: item.userId,
         itemId: item.id,
       });
     });


  };

/*
  Item.prototype.hasUpmarkFor = function(){
     if(this.marks.userId === this.userId) return 'true';
  };
  Item.prototype.hasDownmarkFor = function(){
     if(this.marks.userId === this.userId) return 'true';
  };
*/

  return Item;
};
