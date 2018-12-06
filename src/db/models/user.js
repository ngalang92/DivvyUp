'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
     type: DataTypes.STRING,
     allowNull: false,
    },
    email: {
     type: DataTypes.STRING,
     allowNull: false,
     validate: {
       isEmail: { msg: "Must be a valid email" },
     },
    },
    password: {
     type: DataTypes.STRING,
     allowNull: false
    },

  }, {});
  User.associate = function(models) {
    User.hasMany(models.Item, {
      foreignKey: "userId",
      as: "items"
    })

   User.hasMany(models.Mark, {
      foreignKey: "userId",
      as: "marks"
    });
  
  };


  return User;
};
