let resposta = [];
let letrasUsadas = [];
let vida = 6;
let jogadorNome = "";
let dificuldade = "";

async function buscarPalavra() {
    let palavraValida = false;

    while (!palavraValida) {
        try {
            let response = await fetch("https://api.dicionario-aberto.net/random");
            let data = await response.json();
            let palavra = data.word.toLowerCase();

            if (
                (dificuldade === "facil" && palavra.length <= 5) ||
                (dificuldade === "medio" && palavra.length >= 6 && palavra.length <= 8) ||
                (dificuldade === "dificil" && palavra.length >= 9)
            ) {
                palavraEscolhida = palavra;
                palavraValida = true;
            }
        } catch (error) {
            console.error("Erro ao buscar palavra:", error);
        }
    }
}

async function iniciarJogo() {
    jogadorNome = document.getElementById("nomeJogador").value.trim();
    dificuldade = document.getElementById("dificuldade").value;

    if (!jogadorNome) {
        alert("Por favor, insira seu nome!");
        return;
    }

    document.getElementById("inicio").style.display = "none";
    document.getElementById("jogo").style.display = "block";
    document.getElementById("saudacao").innerText = `Olá, ${jogadorNome}! Você escolheu o nível ${dificuldade.toUpperCase()}.`;

    vida = 6;
    letrasUsadas = [];
    document.getElementById("mensagem").innerText = "";
    document.getElementById("vidas").innerText = "Vidas restantes: " + vida;

    await buscarPalavra();
    resposta = Array(palavraEscolhida.length).fill("_");
    document.getElementById("palavra").innerText = resposta.join(" ");
}

function verificarLetra() {
    let input = document.getElementById("letraInput");
    let letra = input.value.toLowerCase();
    input.value = "";
    input.focus();

    if (!letra || letra.length !== 1 || !/[a-zà-ú]/.test(letra)) {
        document.getElementById("mensagem").innerText = "Digite uma letra válida!";
        return;
    }

    if (letrasUsadas.includes(letra)) {
        document.getElementById("mensagem").innerText = "Essa letra já foi utilizada!";
        return;
    }

    letrasUsadas.push(letra);
    let acertou = false;

    for (let j = 0; j < palavraEscolhida.length; j++) {
        if (letra === palavraEscolhida[j]) {
            resposta[j] = letra.toUpperCase();
            acertou = true;
        }
    }

    if (!acertou) {
        vida--;
    }

    document.getElementById("palavra").innerText = resposta.join(" ");
    document.getElementById("vidas").innerText = "Vidas restantes: " + vida;

    if (!resposta.includes("_")) {
        document.getElementById("mensagem").innerText = `Parabéns, ${jogadorNome}! Você venceu!`;
    }

    if (vida === 0) {
        document.getElementById("mensagem").innerText = `Você perdeu, ${jogadorNome}! A palavra era: ${palavraEscolhida.toUpperCase()}`;
    }
}