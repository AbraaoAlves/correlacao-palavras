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
    let list_jogos_palavras = listaJogosDePalavras();
    
    let construcoes = list_jogos_palavras.map(j => dao.constroi(jogo_palavras));
    
    let estatisticas = Promise.all(construcoes).then((lista) => 
        lista.filter(textoutils.comparaSeMeioEhStopWord)
    );
    
    return Promise.all(estatisticas).then((lista) =>
        lista.map(upsertEstatistica)
    );
}

function listaJogosDePalavras(){
    var list_jogos_palavras = [];
    
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
            list_jogos_palavras.push(jogo_palavras);
            
        }
        console.log('Faltam: ' + (textosNormalizados.length - indexTextos) + ' Textos');
    }
    return list_jogos_palavras;
}

function calculaFrequencia(estatistica) {
    return ((estatistica.frequencia + 1) / qtTotalPalavrasTexto) * 100;
}

function upsertEstatistica(estatistica) {
    return dao.encontra(estatistica).then((estatisticaEncontrada) => {
        if (estatisticaEncontrada) {
            estatisticaEncontrada.frequencia = calculaFrequencia(estatisticaEncontrada);
          
            return dao.atualiza(estatisticaEncontrada);
        } else {
            return dao.cria(estatistica);
        }
    });
}