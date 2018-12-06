"use strict";
module.exports = (sequelize, DataTypes) => {
  var Mark = sequelize.define("Mark", {
    value: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Mark.associate = function(models) {
    // associations can be defined here
    Mark.belongsTo(models.Item, {
      foreignKey: "itemId",
      onDelete: "CASCADE"
    });

    Mark.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
  };
  return Mark;
};
