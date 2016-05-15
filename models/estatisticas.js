'use strict';
module.exports = function(sequelize, DataTypes) {
  var estatisticas = sequelize.define('estatisticas', {
    esquerda: DataTypes.STRING,
    meio: DataTypes.STRING,
    direita: DataTypes.STRING,
    frequencia: DataTypes.DOUBLE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    instanceMethods:{
      getJogoPalavras:function  () {
        return {
          esquerda:this.esquerda,
          meio:this.meio,
          direita:this.direita
        }
      }
    }
  });
  return estatisticas;
};