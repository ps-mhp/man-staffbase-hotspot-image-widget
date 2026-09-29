# Configurações

A caixa de diálogo de configuração do widget possui quatro atributos. "Imagem" e
"Pontos" são mantidos na janela que aparece quando você abre as Configurações
se mostra; os campos de texto atrás dela são a versão técnica aproximada e
Não deve ser editado manualmente. Em Designer de Conteúdo, Imagem 
em vez disso, o upload da imagem do designer — ali a imagem é salva diretamente no
Forma escolhida. 

| Atributo | Rótulo no Diálogo | Descrição |
| --- | --- | --- |
| 'imagem' | Imagem | A imagem onde os pontos estão localizados. No editor clássico via **Select image ...** na janela da biblioteca de mídia, no Content Designer selecionada diretamente no formulário. |
| 'image-alt' | Texto alternativo | Descreve a imagem para leitores de tela; deixe em branco se ela apenas decorar. Também pode ser editada na janela sob "Texto alternativo". |
| 'pontos' | Pontos | A lista de pontos com posição, título, descrição e link. Mantidos na mesma janela. |
| 'modo de exibição' | Exibição | Controla como os pontos aparecem na página publicada. A configuração padrão é 'Numerado, com lista ao lado da imagem'. |

## Valores de "Representação" 

| Valor | Rotulagem no diálogo |
| --- | --- |
| 'numerado' | Numerado, com a lista ao lado da imagem |
| 'pontos' | Pontos, sem lista |

## Campos de um ponto

| Campo | Descrição |
| --- | --- |
| Título | Obrigatório. Sem um título, a janela não pode ser fechada com "Aplicar". |
| Descrição | Opcional, multilinha. |
| Destino | Opcional. Uma página da lista do sistema ou um endereço digitado por você. |
| Rótulo do botão | Opcional. Se permanecer vazio, o botão mostra "Abrir página". |

## Fronteiras

- Uma imagem tem no máximo **20 pontos**. A janela aparece ao tentar 
  para definir outro, em vez de tacitamente
  descarte. 
- Um ponto **sem título** não pode ser adotado: o botão
  "Aplicar" permanece bloqueado desde que pelo menos um ponto não garanta um título
  e a janela indica o número de pontos afetados. 
- **Sem uma imagem ou sem pelo menos um ponto, o widget não mostra nada** — 
  nem na página publicada nem como moldura vazia. 

## Dependência

A rotulagem do botão só funciona se o ponto tiver um alvo.
é atribuído. Sem um alvo, não há botão, e o rótulo permanece
sem efeito.