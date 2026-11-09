# Definições

Na caixa de diálogo de configuração do widget existe apenas um botão: **Editar imagem com pontos
…**. Este abre a janela onde tudo é definido — modo,
imagem, apresentação, definições do menu e pontos. A janela abre-se
automaticamente ao aceder às definições. **Aplicar** guarda tudo
em conjunto num único campo.

| Definição na janela | Descrição |
| --- | --- |
| Modo | `Manual` (predefinido) ou `Menu`. Os pontos do outro modo permanecem guardados. |
| Imagem | A imagem na qual os itens se encontram, proveniente da biblioteca multimédia — no modo «Menu», a imagem do nível inicial. Além disso, o **texto alternativo** para leitores de ecrã; deixe em branco se a imagem for apenas decorativa. |
| Apresentação | Apenas «Manual». A predefinição é `Numerado, com lista ao lado da imagem`. |
| Ponto de partida no menu | Apenas «Menu». O item do menu cujos subitens serão posicionados. Seleção a partir da lista ou, através de «Introduzir outro ID de menu…», o endereço de uma página. |
| Níveis | Apenas «Menu». Quantos níveis aparecem, incluindo o ponto inicial. O valor predefinido é 3. |
| Clique num ponto com subitens | Apenas «Menu». `Ir para o submenu` (predefinido) ou `Abrir página`. |
| Nível | Apenas «Menu». Qual o nível do menu que está a ser editado; cada um tem a sua própria imagem e os seus próprios itens. |

Tecnicamente, tudo se encontra no atributo `config`. Os widgets de versões anteriores
ainda mantêm as suas configurações em atributos individuais (`image`,
`image-alt`, `points`, `display-mode` …). Enquanto `config` estiver vazio, estas prevalecem;
ao clicar pela primeira vez em **Aplicar** na janela, elas são transferidas para `config`.

## Imagem em vez de ponto

Cada ponto pode conter uma imagem própria da biblioteca de multimédia em ambos os modos;
esta aparece então no lugar do ponto vermelho, ajustada proporcionalmente.

| Tamanho | Comprimento do lado |
| --- | --- |
| S | 32 px |
| M | 48 px (predefinição) |
| L | 72 px |

O realce, a etiqueta de nome e o clique funcionam tal como no ponto. No
modo numerado, o número aparece então apenas na lista.

## Valores de «Apresentação»

| Valor | Legenda na caixa de diálogo |
| --- | --- |
| `numbered` | Numerado, com lista ao lado da imagem |
| `dots` | Pontos, sem lista |

## Valores de «Níveis»

| Valor | Significado |
| --- | --- |
| `2` | Ponto inicial e os seus subitens |
| `3` | Além disso, os seus subitens (predefinição) |
| `4` a `6` | Níveis correspondentemente mais profundos |

## Valores de «Clique num ponto com subitens»

| Valor | Rótulo na caixa de diálogo | Efeito |
| --- | --- | --- |
| `enter` | Passar para o submenu | O widget navega para o submenu: o menu mostra os seus subitens, a imagem muda para a imagem desse nível. |
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
- Um nível de menu **sem imagem própria** mostra a imagem do nível acima.
  Só é possível colocar itens nesse nível quando este tiver uma imagem própria.

## Dependências

Se efetuar alterações na janela «Ponto de partida» ou «Níveis», o menu é recarregado imediatamente.
Os pontos que, depois disso, já não estiverem atribuídos a nenhuma entrada, aparecem em
«Já não está no menu».

A legenda do botão só tem efeito se tiver sido atribuído um destino
ao ponto. Sem destino, não há botão e a legenda fica
sem efeito.
