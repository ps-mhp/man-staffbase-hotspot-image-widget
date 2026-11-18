# Definições

Na caixa de diálogo de configuração do widget existe apenas um botão: **Editar imagem com pontos
**. Este abre a janela em ecrã inteiro **Definir pontos**, onde tudo
é configurado — origem dos pontos, imagem, apresentação, definições do menu e
pontos. A janela abre-se automaticamente ao aceder às definições.
**Aplicar** guarda tudo num único campo.

## Estrutura da janela

| Área | Conteúdo |
| --- | --- |
| Cabeçalho | Nome do widget, estado («Ponto 2 alterado»), Anular/Repetir, botão de alternância **Editor · Ambiente de trabalho · Tablet · Telemóvel**, Ajuda, **Cancelar** e **Aplicar**. |
| Esquerda | No modo «Manual», os **pontos** pela sua ordem (número vermelho, título, destino) e **Novo ponto**; no modo «A partir do menu», os **níveis do menu** apresentados como uma árvore. |
| Centro | A barra com a **Fonte dos pontos**, a imagem atualmente a ser editada, **Alterar imagem** e – apenas no modo manual – a **Apresentação**; por baixo, a imagem para definir e deslocar os pontos e uma barra de estado. |
| Direita | O ponto selecionado. Se nenhum estiver selecionado, a **imagem** com a sua descrição ou, no modo de menu, o painel **Menu**. |

Nos modos **Desktop**, **Tablet** e **Móvel**, no centro, em vez da imagem,
aparece a página tal como os leitores a vêem; à esquerda e à direita é possível continuar
a selecionar e a definir opções.

## Configurações na janela

| Configuração | Onde | Descrição |
| --- | --- | --- |
| Origem dos pontos | Barra acima da imagem | `Manual` (predefinição) ou `A partir do menu`. Os pontos do outro modo permanecem guardados. |
| Imagem | Barra, painel «Imagem» ou «Menu» | A imagem sobre a qual os pontos se encontram, proveniente da biblioteca multimédia — no modo «Do menu», a imagem do nível inicial. Além disso, a **descrição da imagem** (texto alternativo) para leitores de ecrã; deixe em branco se a imagem for meramente decorativa. |
| Apresentação | Barra acima da imagem | Apenas «Manual»: `Números` (predefinido, com lista ao lado da imagem) ou `Pontos` (sem lista). |
| Ponto inicial | Painel «Menu» | Apenas «A partir do menu». O item do menu cujos subitens formam o primeiro nível. Seleção a partir da lista ou, através de «Introduzir outro ID de menu…», o endereço de uma página. |
| Profundidade | Painel «Menu» | Apenas «A partir do menu». Quantos níveis aparecem, incluindo o ponto inicial. A predefinição é de 3 níveis. |
| Clique num ponto com subitens | Painel «Menu» | Apenas «A partir do menu». `Ir para o submenu` (predefinição) ou `Abrir página`. |
| Imagem do nível | Painel «Menu» | Apenas «A partir do menu». Cada nível pode ter a sua própria imagem. |

Tecnicamente, tudo se encontra no atributo `config`. Os widgets de versões anteriores
ainda mantêm as suas configurações em atributos individuais (`image`,
`image-alt`, `points`, `display-mode` …). A leitura é feita por configuração:
o que estiver em `config` prevalece; caso contrário, o antigo atributo; caso contrário, o valor predefinido.
Ao abrir, a janela aplica o que consegue ler nos campos antigos.
O que não consegue ler — por exemplo, campos de seleção no Content Designer —,
não é gravado em `config` até que o altere na janela; uma nota
no painel indica essas definições. Abrir e aplicar sem alterações
não altera, portanto, um widget existente.

## Ícone em vez de ponto

Cada ponto pode, em ambos os modos, conter uma imagem própria (ícone) da biblioteca de multimédia;
esta aparece então no lugar do ponto vermelho, ajustada proporcionalmente. No painel do ponto, existe a secção **Ícone** para esse efeito.

| Tamanho | Comprimento do lado |
| --- | --- |
| S | 32 px |
| M | 48 px (predefinição) |
| L | 72 px |

Como **fundo**, pode escolher entre Transparente (predefinição) ou uma
área redonda em branco, vermelho MAN, antracite ou cinzento claro.

O realce, a etiqueta de nome e o clique funcionam tal como no ponto. No
modo numerado, o número aparece apenas na lista.

## Valores de «Apresentação»

| Valor | Legenda na janela |
| --- | --- |
| `numbered` | Números (com lista ao lado da imagem) |
| `dots` | Pontos (sem lista) |

## Valores de «Profundidade»

| Valor | Significado |
| --- | --- |
| `2` | Ponto inicial e os seus subitens |
| `3` | além disso, os seus subitens (predefinição) |
| `4` a `6` | profundidades correspondentes |

## Valores de «Clique num ponto com subitens»

| Valor | Legenda na janela | Efeito |
| --- | --- | --- |
| `enter` | Passar para o submenu | O widget navega para o submenu: o menu apresenta os seus subitens e a imagem muda para a imagem desse nível. |
| `open` | Abrir página | O item é um link para a página do item do menu; destinos fora da aplicação abrem-se num novo separador. |

Os itens sem subitens abrem a sua página em ambos os casos. As pastas sem
página própria passam para o submenu em ambos os casos.

## Campos de um item (modo «Manual»)

| Campo | Descrição |
| --- | --- |
| Título | Obrigatório. Sem título, **Aplicar** mantém o item no estado atual, em vez de o aplicar. |
| Descrição | Opcional, várias linhas. |
| Link · Destino | Opcional. `Sem link`, uma página da lista do sistema ou, através de «Introduzir endereço próprio…», um endereço introduzido pelo utilizador. |
| Link · Texto do botão | Opcional. Se ficar em branco, o botão exibe «Abrir página». |
| Ícone | Opcional, ver acima. |

Acima do painel encontram-se as ações do item: subir, descer,
duplicar, eliminar.

## Limites

- Uma imagem pode conter, no máximo, **20 itens**. A barra de estado abaixo da imagem
  avisa quando se tenta adicionar mais um, em vez de o
  rejeitar silenciosamente; as opções **Novo item** e **Duplicar** ficam
  então bloqueadas.
- Um ponto **sem título** não pode ser aplicado: **Aplicar** indica
  isso no estado; à esquerda, aparece marcado como «Falta título» e, à direita,
  está aberto.
- **Sem imagem ou sem pelo menos um ponto, o widget não mostra nada** —
  nem na página publicada, nem como uma moldura vazia. No modo
  «A partir do menu», aplica-se o mesmo sem um ponto inicial.
- No modo «A partir do menu», **cada nível do menu contém, no máximo, 20 itens**, e
  cada opção do menu tem, no máximo, um; um clique adicional na imagem
  desloca-o.
- Um nível do menu **sem imagem própria** mostra a imagem do nível superior.
  Só é possível colocar pontos nela se tiver uma imagem própria.
- O facto de o widget ser apresentado estreito ou largo depende da sua
  própria largura (estreito se for inferior a 600 píxeis), e não da largura do ecrã. A
  pré-visualização **Móvel** mostra, por isso, a mesma apresentação estreita que o
  telemóvel; um widget numa coluna estreita também fica estreito no ambiente de trabalho.

## Dependências

Se alterar o ponto inicial ou a profundidade no painel «Menu», o menu é recarregado imediatamente.
Os itens que, após essa alteração, já não estejam associados a nenhuma entrada, aparecem à esquerda como
erro «Já não está no menu», abaixo do seu nível.

A legenda do botão só tem efeito se ao item tiver sido atribuído um destino
. Sem destino, não há botão e o campo não aparece
.
