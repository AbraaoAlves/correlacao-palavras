var jsonfile = require('jsonfile');
var textoutils = require('./middlewares/textoutils');
var dao = require('./middlewares/estatisticasDao');
 

var records = jsonfile.readFileSync(__dirname + '/jsons/textos.json').records;
var textos = [];
var qtTotalPalavrasTexto = 0;
records.forEach(function (record) {
    textos.push(record.texto);
});

var textosNormalizados = textoutils.normalizaTextos(textos);
qtTotalPalavrasTexto = textoutils.contaQtPalavrasTextos(textosNormalizados);


correlacionaPalavras();

function correlacionaPalavras() {
    for (var indexTextos = 0; indexTextos < textosNormalizados.length; indexTextos++) {
        var texto = textosNormalizados[indexTextos]
        console.log('Processando Texto: ' + indexTextos);
        var palavrasTexto = texto.split(' ');
        for (var indexTexto = 0; indexTexto < palavrasTexto.length; indexTexto++) {
            var esquerda = palavrasTexto[indexTexto - 1] || '';
            var meio = palavrasTexto[indexTexto];
            var direita = palavrasTexto[indexTexto + 1] || '';
            var jogo_palavras = {
                esquerda: esquerda,
                meio: meio,
                direita: direita
            };
            var estatistica = dao.constroi(jogo_palavras);
            var permiteCorrelacionar = textoutils.comparaSeMeioEhStopWord(estatistica);

            if (permiteCorrelacionar) {
                upsertEstatistica(estatistica);
            }
        }
        console.log('Faltam: ' + (textosNormalizados.length - indexTextos) + ' Textos');
    }
}


function calculaFrequencia(estatistica) {
    return ((estatistica.frequencia + 1) / qtTotalPalavrasTexto) * 100;
}

function upsertEstatistica(estatistica) {
    var estatisticaEncontrada = dao.encontra(estatistica);
    if (estatisticaEncontrada) {
        estatisticaEncontrada.frequencia = calculaFrequencia(estatisticaEncontrada);
        dao.atualiza(estatisticaEncontrada);
    } else {
        dao.cria(estatistica);
    }


}