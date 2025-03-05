const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('perro', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    raza: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    peso: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    vacunado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    id_dueno: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Dueno',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'Perro',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "id_dueno",
        using: "BTREE",
        fields: [
          { name: "id_dueno" },
        ]
      },
    ]
  });
};
