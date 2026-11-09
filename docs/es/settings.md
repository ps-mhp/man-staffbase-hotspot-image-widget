# Ajustes

El cuadro de diálogo de configuración del widget incluye nueve atributos; cuáles de ellos
se muestran depende del **modo**. «Imagen» y
«Puntos» se configuran en la ventana que aparece automáticamente al abrir los ajustes; los campos de texto que aparecen a continuación son la versión técnica sin formato y
no deben modificarse manualmente. En el Content Designer, «Imagen»
muestra, en cambio, la función de subida de imágenes del diseñador; allí, la imagen se selecciona directamente en
el formulario.

| Atributo | Etiqueta en el cuadro de diálogo | Descripción |
| --- | --- | --- |
| `image` | Imagen | La imagen sobre la que se sitúan los puntos. En el editor clásico, se selecciona mediante **Seleccionar imagen…** en la ventana de la biblioteca multimedia; en el Content Designer, se selecciona directamente en el formulario. |
| `image-alt` | Texto alternativo | Describe la imagen para los lectores de pantalla; déjalo en blanco si solo tiene fines decorativos. También se puede editar en la ventana, en «Texto alternativo». |
| `source` | Modo | `Manual` (predeterminado) o `Menú`. Oculta los campos del otro modo; su contenido permanece guardado. |
| `points` | Puntos | Solo «Manual». La lista de puntos con posición, título, descripción y enlace. Se gestiona en la misma ventana. |
| `display-mode` | Visualización | Solo «Manual». Controla cómo aparecen los puntos en la página publicada. El valor predeterminado es `Numerado, con lista junto a la imagen`. |
| `menu-id` | Punto de inicio en el menú | Solo «Menú». La opción del menú cuyos subelementos se van a colocar; la propia opción también se puede colocar. Selección desde el menú o, mediante «Introducir otro ID de menú…», la dirección de una página. |
| `menu-depth` | Niveles | Solo «Menú». Cuántos niveles aparecen, contando el punto de inicio. El valor predeterminado es 3. |
| `menu-click` | Clic en una opción | Solo «Menú». `Abrir página` (predeterminado) o `Mostrar junto al menú`. |
| `menu-points` | Opciones del menú en la imagen | Solo «Menú». Ubicación de los elementos del menú. Se configura en la ventana «Colocar elementos del menú…». |

## Valores de «Presentación»

| Valor | Etiqueta en el cuadro de diálogo |
| --- | --- |
| `numbered` | Numerado, con lista junto a la imagen |
| `dots` | Puntos, sin lista |

## Valores de «Niveles»

| Valor | Significado |
| --- | --- |
| `2` | Punto inicial y sus subelementos |
| `3` | además, sus subelementos (por defecto) |
| `4` a `6` | Niveles correspondientemente más profundos |

## Valores de «Hacer clic en un punto»

| Valor | Texto en el cuadro de diálogo | Efecto |
| --- | --- | --- |
| `open` | Abrir página | El elemento es un enlace a la página del elemento del menú; los destinos fuera de la aplicación se abren en una nueva pestaña. |
| `reveal` | Mostrar junto al menú | El menú situado junto a la imagen se desplaza hasta el elemento del menú y lo resalta. |

Las carpetas que no tienen página propia se muestran en el menú en ambos casos.

## Campos de un elemento (modo «Manual»)

| Campo | Descripción |
| --- | --- |
| Título | Obligatorio. Sin título, no se puede cerrar la ventana con «Aceptar». |
| Descripción | Opcional, de varias líneas. |
| Destino | Opcional. Una página de la lista del sistema o una dirección introducida manualmente. |
| Texto del botón | Opcional. Si se deja en blanco, el botón muestra «Abrir página». |

## Limitaciones

- Una imagen puede contener un máximo de **20 elementos**. Si se intenta
  añadir uno más, la ventana lo indica, en lugar de descartarlo
  silenciosamente.
- No se puede aplicar un punto **sin título**: el botón
  «Aplicar» permanece bloqueado mientras al menos un punto no tenga título,
  y la ventana indica el número de puntos afectados.
- **Sin imagen o sin al menos un punto, el widget no muestra nada** —
  ni en la página publicada ni como marco vacío. En el modo
  «Menú», ocurre lo mismo si no hay punto de inicio.
- En el modo «Menú», **cada elemento del menú contiene como máximo un punto**; al
  hacer clic de nuevo en la imagen, se desplaza.

## Dependencias

La ventana «Colocar elementos del menú…» lee el punto de partida y los niveles al
abrirse. Tras realizar un cambio, cierre la ventana y vuelva a abrirla.

El texto del botón solo tiene efecto si al punto se le ha asignado un destino
. Sin destino, no hay botón y el texto no tiene
ningún efecto.
