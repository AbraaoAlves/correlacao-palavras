var pg = require('pg');
var conString = "postgres://postgres:postgres@127.0.0.1/ic_desenvolvimento";
var client = new pg.Client(conString);
var crud = {
    constroi: constroi,
    encontra: encontra,
    cria: cria,
    atualiza: atualiza,
}

function constroi(jogo_palavras) {
    var estatistica = {};
    estatistica.esquerda = jogo_palavras.esquerda;
    estatistica.meio = jogo_palavras.meio;
    estatistica.direita = jogo_palavras.direita;
    estatistica.frequencia = 1;
    return estatistica;
}

function encontra(jogo_palavras) {
    var queryFind = "SELECT * FROM estatisticas WHERE direita=$1 and meio=$2 and esquerda=$3";
    var values = [jogo_palavras.direita, jogo_palavras.meio, jogo_palavras.esquerda];

    client.connect(function (err) {
        if (err) {
            console.error(err);
        }
        client.query(queryFind, values, function (err, result) {
            client.done();
            return result;
        });
    });


}

function cria(estatistica) {
    var queryInsert = "INSERT INTO estatistica(esquerda,meio,direita,frequencia) VALUES ($1,$2,$3,$4) return * ";
    var values = [estatistica.direita, estatistica.meio, estatistica.esquerda, estatistica.frequencia];

     client.connect(function (err) {
        if (err) {
            console.error(err);
        }
        client.query(queryInsert, values, function (err, result) {
            client.done();
            return result;
        });
    });
}

function atualiza(estatistica) {
    var queryUpdate = "UPDATE estatistica SET esquerda=$1,meio=$2,direita=$3,frequencia=$4 return *";
    var values = [estatistica.direita, estatistica.meio, estatistica.esquerda, estatistica.frequencia];

    client.connect(function (err) {
        if (err) {
            console.error(err);
        }
        client.query(queryUpdate, values, function (err, result) {
            client.done();
            return result;
        });
    });
}

module.exports = crud;