function gerarPrompt() {
  var depoimentos = document.getElementById("depoimentos").value;
  var sentimento = document.getElementById("sentimento").value;
  var inicioDepoimentos = "<início dos depoimentos>";
  var fimDepoimentos = "<fim dos depoimentos>";

  // Dividindo os depoimentos em linhas
  var linhasDepoimentos = depoimentos.split("##");

  // Removendo espaços em branco no início e fim das linhas
  linhasDepoimentos = linhasDepoimentos.map((linha) => linha.trim());

  // Filtrando linhas em branco ou contendo apenas "##"
  linhasDepoimentos = linhasDepoimentos.filter((linha) => linha.length > 0);

  // Enumerando e formatando os depoimentos
  var depoimentosEnumerados = linhasDepoimentos.map((linha, indice) => {
    var numeroDepoimento = indice + 1;
    return `${numeroDepoimento}. ${linha}`;
  });

  // Construindo o prompt
  var prompt = `Abaixo estão alguns depoimentos ${sentimento.toLowerCase()} de clientes sobre um determinado curso. Sua tarefa é analisar esses depoimentos e categorizá-los em diferentes sentimentos e categorias. Você deve considerar apenas o que está entre "<início dos depoimentos>" e "<fim dos depoimentos>", 
todo o resto écontexto e exemplo.

Depoimentos:\n\n${inicioDepoimentos}\n\n${depoimentosEnumerados.join(
    "\n"
  )}\n\n${fimDepoimentos}\n\n
\nSepare os depoimentos em sentimentos analisando os depoimentos dos clientes sobre um determinado curso ou
produto, categorize-os e agrupe-os em diferentes sentimentos (Negativo, Neutro, Positivo).
\nAgrupe comentários de um mesmo sentimento em uma única descrição, a tabela 1 deve ter apenas 3
linhas(Positivo, Neutro, Negativo), a descrição pode ser mais detalhada.

\nÉ IMPORTANTE que faça uma análise, do tipo "Positivo | Depoimentos relatam que o curso foi
incrível, que é recomendado, que superou as expectativas e indicariam para os amigos", seja em
Positivo, Neutro e Negativo. Além disso, quero que ordene, do que possui maior quantidade para o menor.
\nVale lembrar também, que é esperado depoimentos mais positivos caso sejam promotores, mais neutros e sem sentimento caso sejam Neutros e mais negativos caso sejam detratores.
\nAqui está a um exemplo tabela, categorizando os depoimentos por sentimento:

| Sentimento | Descrição | Quantidade | Percentual |
| -------------------- | --------- | ---------- | ---------- |
| Positivo | Depoimentos que relatam que o curso foi bom, incrível, que recomendam, que superou as expectativas | 9 | 45% |
| Neutro | Depoimentos que relatam que o curso foi razoável, satisfatório, mediano | 7 | 35% |
| Negativo | Depoimentos que relatam que o curso foi uma decepção, que faltou algo, que não recomendam, que foi perda de tempo | 4 | 20% |
`;

  var numTokens = contarTokens(prompt);

  var avisoElement = document.getElementById("aviso");
  avisoElement.textContent = `Número de tokens: ${numTokens}`;

  if (numTokens > 4000) {
    avisoElement.textContent += " (AVISO: Número de tokens é maior que 4000 e pode exceder o limite do chatGPT facilmente)";
    avisoElement.className = "aviso vermelho"; // Define a classe "vermelho"
  } else if (numTokens > 3000) {
    avisoElement.textContent += " (AVISO: Número de tokens alto, pode exceder o limite do chatGPT";
    avisoElement.className = "aviso amarelo"; // Define a classe "amarelo"
  } else {
    avisoElement.className = "aviso verde"; // Define a classe "verde"
  }

  document.getElementById("resultado").textContent = prompt;
}

function copiarPrompt() {
  var resultado = document.getElementById("resultado");
  var range = document.createRange();
  range.selectNode(resultado);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
  alert("O prompt foi copiado para a área de transferência!");
}

function contarTokens(texto) {
  // Divide o texto em palavras usando espaço como separador
  var palavras = texto.split(/\s+/);

  // Remove palavras vazias e símbolos que não devem ser contados como tokens
  var tokens = palavras.filter(function (palavra) {
    return (
      palavra.length > 0 &&
      palavra !== "##" &&
      palavra !== "|" &&
      palavra !== "-" &&
      palavra !== ">"
    );
  });

  return tokens.length;
}
