# Perguntas Frequentes

**Pergunta:** Defini um ponto, mas a opção «Aplicar» não funciona.

Resposta: Pelo menos um ponto ainda não tem título. Um ponto sem título
seria perdido ao aplicar — por isso, a opção **Aplicar** indica-o no estado
da janela, em vez de o aplicar. À esquerda, está marcado como «Falta título»,
à direita, está aberto e no campo aparece a mesma indicação.

**Pergunta:** O widget não mostra nada na página.

Resposta: Ou falta a imagem, ou ainda não foi definido nenhum ponto. Em
ambos os casos, a área permanece deliberadamente em branco, em vez de mostrar uma moldura vazia ou
uma imagem de preenchimento. Abra as definições e verifique
ambas as opções.

**Pergunta:** Por que razão um link abre uma janela sobre a página, enquanto outro
abre um novo separador?

Resposta: Isso depende da origem do destino. Uma **página da
lista** do sistema aparece numa janela sobre a página atual. Uma
**endereço introduzido pelo próprio utilizador**, por outro lado, abre sempre um novo separador. A
razão: muitas vezes, não é tecnicamente possível incorporar páginas externas numa janela
— uma janela bloqueada ficaria simplesmente vazia, sem apresentar qualquer mensagem de erro
. O novo separador é, por isso, a forma mais fiável para tudo o que está fora do
sistema.

**Pergunta:** Na lista de páginas não aparece nenhuma página, mas sim um
campo para introduzir um endereço.

Resposta: A lista de páginas do sistema não estava acessível no momento da abertura. Um
texto informativo chama a atenção para isso. Neste caso, introduza o endereço
manualmente ou feche a janela e volte a abri-la.

**Pergunta:** Criei uma ligação para uma página, mas ao voltar a
abri-la aparece uma mensagem a indicar que a página guardada não consta da lista
.

Resposta: A página para a qual foi criado o link foi provavelmente eliminada ou já não está
acessível. O link anterior permanece ativo até que o altere ou
elimine — o simples facto de abrir a janela não o elimina.

**Pergunta:** O que acontece aos elementos durante a tradução automática da
página?

Resposta: São traduzidos o título, a descrição e o texto do
botão de cada ponto. A posição de um ponto na imagem, bem como o destino
de um link, permanecem inalterados — não se trata de texto, e no caso do destino,
uma tradução apenas corromperia o endereço.

**Pergunta:** Por que razão a página para a qual o link aponta aparece, por vezes, vazia na janela,
apesar de o link apontar para uma página da lista?

Resposta: Mesmo no caso de páginas do próprio sistema, a incorporação pode falhar,
por exemplo, se a própria página de destino impedir tecnicamente a incorporação. Nesse caso,
utilize o link «Abrir num novo separador» no cabeçalho da janela — é exatamente
para isso que ele está lá.

**Pergunta:** Posso colocar mais de 20 pontos numa imagem?

Resposta: Não. A partir de 20 pontos, os marcadores sobrepõem-se uns aos outros e a
lista ao lado da imagem ficaria mais longa do que a própria imagem. O editor avisa-o quando
tentar colocar um 21.º ponto.

**Pergunta:** Renomeei um item do menu no modo «A partir do menu». Tenho de
ajustar o widget?

Resposta: Não. Apenas é guardada a localização de cada item do menu na imagem.
O título e o destino são obtidos diretamente do menu sempre que o widget é acedido — o novo nome
aparece imediatamente.

**Pergunta:** Por que razão alguns colegas vêem menos pontos do que eu?

Resposta: No modo «A partir do menu», cada pessoa vê apenas os pontos relativos aos itens de menu que
também pode ver no menu da aplicação. Isto é intencional: um ponto não deve
conduzir a uma página que depois não possa ser aberta.

**Pergunta:** Perco os meus pontos se alternar entre «Manual» e «A partir do
menu»?

Resposta: Não. Ambos os modos guardam os pontos separadamente. Quem voltar ao modo anterior,
encontrará os pontos do outro modo inalterados.

**Pergunta:** Cada nível do menu pode ter a sua própria imagem?

Resposta: Sim. Na janela, no modo «A partir do menu», selecione o nível à esquerda
e, à direita, em **Imagem do nível**, escolha a sua imagem da biblioteca multimédia. Um nível
sem imagem própria mostra a imagem do nível acima, juntamente com os respetivos pontos.

**Pergunta:** Por que razão um item do menu não aparece ao lado da imagem, apesar de
existir?

Resposta: Ou está definido como «Não visível» no menu da aplicação, ou
está mais profundo do que o valor definido em **Profundidade**. No primeiro caso, permanece
também aqui oculto; no segundo, aumente a profundidade.

**Pergunta:** Na janela aparece «Não legível a partir da caixa de diálogo: …». O que significa isto?

Resposta: O widget provém de uma versão em que cada configuração tinha um
campo próprio no formulário. Alguns desses campos não revelam o seu valor
— no Content Designer, por exemplo, os campos de seleção. A janela mostra, nesse caso,
o valor predefinido, mas não o grava: o widget mantém o seu valor anterior
até que altere a configuração na própria janela. Abrir e
aplicar sem alterações não altera, portanto, o widget.
