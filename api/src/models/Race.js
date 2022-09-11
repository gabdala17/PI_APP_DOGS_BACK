const { DataTypes, UUIDV4 } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('race', {
    id:{
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue:DataTypes.UUIDV4
      },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    heightMax:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    heightMin:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    weightMax:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    weightMin:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    life_spanMin:{
        type: DataTypes.STRING,
    },
    life_spanMax:{
        type: DataTypes.STRING,
    }, 
    image:{
        type: DataTypes.STRING,
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  });
};