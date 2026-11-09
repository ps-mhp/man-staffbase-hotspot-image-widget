# Definições

A caixa de diálogo de configuração do widget apresenta nove atributos; quais deles
são visíveis depende do **modo**. No modo «Menu», «Imagem» é a imagem do
nível inicial; as imagens dos níveis inferiores são selecionadas na janela «Itens do menu
…». «Imagem» e
«Opções» são preenchidos na janela que aparece automaticamente ao abrir as definições;
os campos de texto a seguir são a versão técnica bruta e
não devem ser editados manualmente. No Content Designer, «Imagem»
, em vez disso, o upload de imagens do Designer — aí, a imagem é selecionada diretamente no
formulário.

| Atributo | Rótulo na caixa de diálogo | Descrição |
| --- | --- | --- |
| `image` | Imagem | A imagem sobre a qual se encontram os pontos. No editor clássico, através de **Selecionar imagem…** na janela da biblioteca de multimédia; no Content Designer, selecionada diretamente no formulário. |
| `image-alt` | Texto alternativo | Descreve a imagem para leitores de ecrã; deixe em branco se for apenas decorativa. Também pode ser editado na janela em «Texto alternativo». |
| `source` | Modo | `Manual` (predefinição) ou `Menu`. Oculta os campos do outro modo; os respetivos conteúdos permanecem guardados. |
| `points` | Pontos | Apenas «Manual». A lista de pontos com posição, título, descrição e link. É editada na mesma janela. |
| `display-mode` | Apresentação | Apenas «Manual». Controla a forma como os pontos aparecem na página publicada. A predefinição é `Numerado, com lista ao lado da imagem`. |
| `menu-id` | Ponto inicial no menu | Apenas «Menu». O item do menu cujos subitens serão colocados na imagem. Seleção a partir do menu ou, através de «Introduzir outro ID de menu…», o endereço de uma página. |
| `menu-depth` | Níveis | Apenas «Menu». Quantos níveis aparecem, incluindo o ponto inicial. O valor predefinido é 3. |
| `menu-click` | Clique num ponto com subitens | Apenas «Menu». `Ir para o submenu` (predefinido) ou `Abrir página`. |
| `menu-points` | Opções do menu na imagem | Apenas «Menu». Por cada nível do menu, a imagem e a localização das opções. É definido na janela «Colocar opções do menu…». |

## Valores de «Apresentação»

| Valor | Rótulo na caixa de diálogo |
| --- | --- |
| `numbered` | Numerado, com lista ao lado da imagem |
| `dots` | Pontos, sem lista |

## Valores de «Níveis»

| Valor | Significado |
| --- | --- |
| `2` | Ponto inicial e os seus subitens |
| `3` | além disso, os seus subitens (predefinição) |
| `4` a `6` | níveis correspondentemente mais profundos |

## Valores de «Clique num ponto com subitens»

| Valor | Legenda na caixa de diálogo | Efeito |
| --- | --- | --- |
| `enter` | Passar para o submenu | O widget navega para o submenu: o menu apresenta os seus subitens, a imagem muda para a imagem desse nível. |
| `open` | Abrir página | O item é um link para a página do item do menu; destinos fora da aplicação abrem-se num novo separador. |

Os itens sem subitens abrem a sua página em ambos os casos. As pastas sem
página própria passam para o submenu em ambos os casos.

## Campos de um item (modo «Manual»)

| Campo | Descrição |
| --- | --- |
| Título | Obrigatório. Sem título, a janela não pode ser fechada com «Aplicar». |
| Descrição | Opcional, com várias linhas. |
| Destino | Opcional. Uma página da lista do sistema ou um endereço introduzido pelo utilizador. |
| Texto do botão | Opcional. Se ficar em branco, o botão exibe «Abrir página». |

## Limites

- Uma imagem contém, no máximo, **20 pontos**. Ao tentar
  adicionar mais um, a janela avisa o utilizador, em vez de o
  rejeitar silenciosamente.
- Um ponto **sem título** não pode ser confirmado: o botão
  «Aplicar» permanece bloqueado enquanto houver pelo menos um ponto sem título
  e a janela indica o número de pontos afetados.
- **Sem imagem ou sem pelo menos um ponto, o widget não mostra nada** —
  nem na página publicada nem como uma moldura vazia. No modo
  «Menu», aplica-se o mesmo, sem ponto inicial.
- No modo «Menu», **cada nível do menu contém, no máximo, 20 itens**, e cada
  item do menu tem, no máximo, um; um clique adicional na imagem desloca-o
  para lá.
- Um nível de menu **sem imagem própria** mostra a imagem do nível superior.
  Só é possível colocar itens nesse nível se este tiver uma imagem própria.

## Dependências

A janela «Colocar itens de menu…» lê o ponto inicial e os níveis ao
ser aberta. Após uma alteração, feche a janela e volte a abri-la.

A legenda do botão só tem efeito se tiver sido atribuído um destino
ao ponto. Sem destino, não há botão e a legenda fica
sem efeito.
