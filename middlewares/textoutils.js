'use strict';
var jsonfile=require('jsonfile'); 
var stopwords = jsonfile.readFileSync(__dirname + '/../jsons/STOPWORDS.json').records;

var textoUtil = {
    normalizaTexto: normalizaTexto,
    normalizaTextos: normalizaTextos,
    contaQtPalavrasTextos:contaQtPalavrasTextos
    ,contaQtPalavrasTexto:contaQtPalavrasTexto,
    comparaSeMeioEhStopWord:comparaSeMeioEhStopWord
}

function normalizaTextos(textos) {
    var textosnormalizados = [];
    textos.forEach(function (texto) {
        var textonormalizado = normalizaTexto(texto);
        textosnormalizados.push(textonormalizado);
    });
    return textosnormalizados;
}

function normalizaTexto(texto) {
    var normalizador = /|\.|\?|\!|\w\$|\, |\'|\:|\"|\;|\ \- /g;
    return texto.replace(normalizador, ' ');
}

function contaQtPalavrasTextos(textos) {
    var qtTotalPalavrasTexto=0;
    textos.forEach(function(texto) {
        qtTotalPalavrasTexto+=contaQtPalavrasTexto(texto);
    });
    return qtTotalPalavrasTexto;
}
function contaQtPalavrasTexto(texto) {
    var qtPalavrasTexto = 0;
    var palavrasTexto = texto.split(' ');
    palavrasTexto.forEach(function (item) {
        qtPalavrasTexto++;
    });
    return qtPalavrasTexto;
}

function comparaSeMeioEhStopWord(estatistica) {
   for(var st of stopwords){
       if(estatistica.meio===st){
           return true
       }else{
           return false;
       }
   }  
}



module.exports = textoUtil;
