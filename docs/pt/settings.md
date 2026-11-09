# Definições

A caixa de diálogo de configuração do widget apresenta nove atributos; quais deles
são visíveis depende do **modo**. «Imagem» e
«Pontos» são definidos na janela que aparece automaticamente ao abrir as definições; os campos de texto a seguir correspondem à versão técnica bruta e
não devem ser editados manualmente. No Content Designer, «Imagem»
mostra, em vez disso, o carregamento de imagens do Designer — onde a imagem é selecionada diretamente no
formulário.

| Atributo | Rótulo na caixa de diálogo | Descrição |
| --- | --- | --- |
| `image` | Imagem | A imagem sobre a qual se encontram os pontos. No editor clássico, seleciona-se através de **Selecionar imagem…** na janela a partir da biblioteca de multimédia; no Content Designer, seleciona-se diretamente no formulário. |
| `image-alt` | Texto alternativo | Descreve a imagem para leitores de ecrã; deixe em branco se for apenas decorativa. Também pode ser editado na janela em «Texto alternativo». |
| `source` | Modo | `Manual` (predefinido) ou `Menu`. Oculta os campos do outro modo; os respetivos conteúdos permanecem guardados. |
| `points` | Pontos | Apenas «Manual». A lista de pontos com posição, título, descrição e link. É editada na mesma janela. |
| `display-mode` | Apresentação | Apenas «Manual». Controla a forma como os itens aparecem na página publicada. A predefinição é `Numerado, com lista ao lado da imagem`. |
| `menu-id` | Ponto de partida no menu | Apenas «Menu». O item do menu cujos subitens serão posicionados; ele próprio também pode ser posicionado. Seleção a partir do menu ou, através de «Introduzir outro ID de menu…», o endereço de uma página. |
| `menu-depth` | Níveis | Apenas «Menu». Quantos níveis aparecem, incluindo o ponto inicial. O valor predefinido é 3. |
| `menu-click` | Clique num item | Apenas «Menu». `Abrir página` (predefinido) ou `Mostrar ao lado no menu`. |
| `menu-points` | Itens do menu na imagem | Apenas «Menu». Onde se encontram os itens do menu. É definido na janela «Colocar itens do menu…». |

## Valores de «Apresentação»

| Valor | Legenda na caixa de diálogo |
| --- | --- |
| `numbered` | Numerado, com lista ao lado da imagem |
| `dots` | Pontos, sem lista |

## Valores de «Níveis»

| Valor | Significado |
| --- | --- |
| `2` | Ponto inicial e os seus subitens |
| `3` | Além disso, os subitens destes (predefinição) |
| `4` a `6` | Níveis correspondentemente mais profundos |

## Valores de «Clique num ponto»

| Valor | Texto na caixa de diálogo | Efeito |
| --- | --- | --- |
| `open` | Abrir página | O ponto é um link para a página do item do menu; destinos fora da aplicação abrem-se num novo separador. |
| `reveal` | Mostrar ao lado no menu | O menu ao lado da imagem desloca-se para o item do menu e destaca-o. |

As pastas sem página própria são apresentadas no menu em ambos os casos.

## Campos de um ponto (modo «Manual»)

| Campo | Descrição |
| --- | --- |
| Título | Obrigatório. Sem título, a janela não pode ser fechada com «Aplicar». |
| Descrição | Opcional, várias linhas. |
| Destino | Opcional. Uma página da lista do sistema ou um endereço introduzido pelo utilizador. |
| Texto do botão | Opcional. Se ficar em branco, o botão exibe «Abrir página». |

## Limites

- Uma imagem pode conter, no máximo, **20 pontos**. Ao tentar
  definir mais um, a janela avisa o utilizador, em vez de o
  rejeitar silenciosamente.
- Um ponto **sem título** não pode ser guardado: o botão
  «Guardar» permanece bloqueado enquanto pelo menos um ponto não tiver
  um título, e a janela indica o número de pontos afetados.
- **Sem imagem ou sem pelo menos um ponto, o widget não mostra nada** —
  nem na página publicada, nem como uma moldura vazia. No modo
  «Menu», o mesmo se aplica sem ponto inicial.
- No modo «Menu», **cada opção do menu contém, no máximo, um ponto**; um
  clique adicional na imagem desloca-o.

## Dependências

A janela «Colocar opções do menu…» lê o ponto inicial e os níveis ao
ser aberta. Após uma alteração, feche a janela e volte a abri-la.

A legenda do botão só tem efeito se tiver sido atribuído um destino
ao ponto. Sem destino, não existe botão e a legenda fica
sem efeito.
