# Ajustes

El cuadro de diálogo de configuración del widget incluye nueve atributos; cuáles de ellos
se muestran depende del **modo**. En el modo «Menú», «Imagen» es la imagen del
nivel inicial; las imágenes de los niveles inferiores se seleccionan en la ventana «Elementos del menú
…». «Imagen» y
«Opciones» se gestionan en la ventana que aparece automáticamente al abrir la configuración;
los campos de texto que hay detrás son el código técnico sin formato y
no deben modificarse manualmente. En el Content Designer, «Imagen»
, en cambio, la subida de imágenes del diseñador; allí se selecciona la imagen directamente en
el formulario.

| Atributo | Etiqueta en el cuadro de diálogo | Descripción |
| --- | --- | --- |
| `image` | Imagen | La imagen sobre la que se sitúan los puntos. En el editor clásico, a través de **Seleccionar imagen…** en la ventana de la biblioteca multimedia; en el Content Designer, se selecciona directamente en el formulario. |
| `image-alt` | Texto alternativo | Describe la imagen para los lectores de pantalla; déjalo en blanco si solo es decorativa. También se puede editar en la ventana, en «Texto alternativo». |
| `source` | Modo | `Manual` (predeterminado) o `Menú`. Oculta los campos del modo contrario; su contenido permanece guardado. |
| `points` | Puntos | Solo «Manual». La lista de puntos con posición, título, descripción y enlace. Se gestiona en la misma ventana. |
| `display-mode` | Visualización | Solo «Manual». Controla cómo aparecen los puntos en la página publicada. El valor predeterminado es `Numerado, con lista junto a la imagen`. |
| `menu-id` | Punto de inicio en el menú | Solo «Menú». La opción del menú cuyos subelementos se colocarán en la imagen. Selección desde el menú o, mediante «Introducir otro ID de menú…», la dirección de una página. |
| `menu-depth` | Niveles | Solo «Menú». Número de niveles que se muestran, incluido el punto de inicio. El valor predeterminado es 3. |
| `menu-click` | Clic en un punto con subpuntos | Solo «Menú». `Ir al submenú` (valor predeterminado) o `Abrir página`. |
| `menu-points` | Elementos del menú en la imagen | Solo «Menú». Por cada nivel del menú, la imagen y la ubicación de los elementos. Se configura en la ventana «Colocar elementos del menú…». |

## Valores de «Representación»

| Valor | Etiqueta en el cuadro de diálogo |
| --- | --- |
| `numbered` | Numerado, con lista junto a la imagen |
| `dots` | Puntos, sin lista |

## Valores de «Niveles»

| Valor | Significado |
| --- | --- |
| `2` | Punto inicial y sus subopciones |
| `3` | además de sus subopciones (por defecto) |
| `4` a `6` | a niveles cada vez más profundos |

## Valores de «Hacer clic en un punto con subopciones»

| Valor | Texto en el cuadro de diálogo | Efecto |
| --- | --- | --- |
| `enter` | Pasar al submenú | El widget se desplaza al submenú: el menú muestra sus subelementos y la imagen cambia a la de ese nivel. |
| `open` | Abrir página | El elemento es un enlace a la página del elemento del menú; los destinos fuera de la aplicación se abren en una nueva pestaña. |

Los elementos sin subelementos abren su página en ambos casos. Las carpetas sin
página propia pasan al submenú en ambos casos.

## Campos de una opción (modo «Manual»)

| Campo | Descripción |
| --- | --- |
| Título | Obligatorio. Sin título, no se puede cerrar la ventana con «Aceptar». |
| Descripción | Opcional, de varias líneas. |
| Destino | Opcional. Una página de la lista del sistema o una dirección introducida manualmente. |
| Texto del botón | Opcional. Si se deja en blanco, el botón muestra «Abrir página». |

## Limitaciones

- Una imagen puede contener un máximo de **20 puntos**. Si se intenta
  añadir uno más, la ventana lo señala, en lugar de descartarlo
  silenciosamente.
- Un punto **sin título** no se puede aplicar: el botón
  «Aplicar» permanece bloqueado mientras al menos un punto no tenga título
  y la ventana indica el número de puntos afectados.
- **Sin imagen o sin al menos un punto, el widget no muestra nada** —
  ni en la página publicada ni como un marco vacío. En el modo
  «Menú» se aplica lo mismo, salvo que no hay punto de inicio.
- En el modo «Menú», **cada nivel del menú contiene como máximo 20 elementos**, y cada
  elemento del menú tiene como máximo uno; al hacer clic de nuevo en la imagen,
  se desplaza.
- Un nivel de menú **sin imagen propia** muestra la imagen del nivel superior.
  Solo se pueden colocar elementos en él cuando tenga una imagen propia.

## Dependencias

La ventana «Colocar elementos del menú…» lee el punto de inicio y los niveles al
abrirse. Tras realizar un cambio, cierre la ventana y vuelva a abrirla.

El texto del botón solo tiene efecto si al elemento se le ha asignado un destino
. Sin destino, no hay botón y el texto queda
sin efecto.
