# Ajustes

En el cuadro de diálogo de configuración del widget solo hay un botón: **Editar imagen con puntos
…**. Este abre la ventana en la que se configuran todos los ajustes: modo,
imagen, presentación, ajustes del menú y puntos. La ventana se abre
automáticamente al acceder a la configuración. **Aplicar** guarda todos los
ajustes a la vez en un solo campo.

| Ajuste en la ventana | Descripción |
| --- | --- |
| Modo | `Manual` (predeterminado) o `Menú`. Los puntos del otro modo se mantienen guardados. |
| Imagen | La imagen sobre la que se sitúan los elementos, de la biblioteca multimedia; en el modo «Menú», la imagen del nivel de inicio. Además, el **texto alternativo** para lectores de pantalla; déjalo en blanco si la imagen es meramente decorativa. |
| Presentación | Solo en «Manual». El valor predeterminado es `Numerado, con lista junto a la imagen`. |
| Punto de inicio en el menú | Solo en «Menú». La opción del menú en la que se colocarán los subelementos. Selección de la lista o, mediante «Introducir otro ID de menú…», la dirección de una página. |
| Niveles | Solo «Menú». Cuántos niveles se muestran, contando el punto de inicio. El valor predeterminado es 3. |
| Clic en un elemento con subelementos | Solo «Menú». `Ir al submenú` (predeterminado) o `Abrir página`. |
| Nivel | Solo «Menú». El nivel del menú que se está editando en ese momento; cada uno tiene su propia imagen y sus propios elementos. |

Técnicamente, todo se encuentra en el atributo `config`. Los widgets de versiones anteriores
aún conservan sus ajustes en atributos individuales (`image`,
`image-alt`, `points`, `display-mode` …). Mientras `config` esté vacío, se aplicarán
estos; al hacer clic por primera vez en **Aplicar** en la ventana, se trasladarán a `config`.

## Imagen en lugar de punto

Cada punto puede incluir una imagen propia de la biblioteca multimedia en ambos modos;
esta aparecerá entonces en lugar del punto rojo, ajustada proporcionalmente.

| Tamaño | Longitud del borde |
| --- | --- |
| S | 32 px |
| M | 48 px (por defecto) |
| L | 72 px |

Como **fondo** se puede elegir entre transparente (por defecto) o una
superficie redonda en blanco, rojo MAN, antracita o gris claro.

El resaltado, la etiqueta con el nombre y el clic funcionan igual que con el punto. En el
modo numerado, el número solo aparece en la lista.

## Valores de «Presentación»

| Valor | Etiqueta en el cuadro de diálogo |
| --- | --- |
| `numbered` | Numerado, con lista junto a la imagen |
| `dots` | Puntos, sin lista |

## Valores de «Niveles»

| Valor | Significado |
| --- | --- |
| `2` | Punto inicial y sus subpuntos |
| `3` | además de sus subpuntos (por defecto) |
| `4` a `6` | niveles inferiores correspondientes |

## Valores de «Hacer clic en un punto con subpuntos»

| Valor | Etiqueta en el cuadro de diálogo | Efecto |
| --- | --- | --- |
| `enter` | Pasar al submenú | El widget navega hasta el submenú: el menú muestra sus subelementos y la imagen cambia a la de ese nivel. |
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
  «Menú» se aplica lo mismo sin punto de inicio.
- En el modo «Menú», **cada nivel del menú contiene como máximo 20 elementos**, y cada
  elemento del menú tiene como máximo uno; al hacer clic de nuevo en la imagen,
  se desplaza.
- Un nivel de menú **sin imagen propia** muestra la imagen del nivel superior.
  Solo se pueden colocar elementos en él cuando tenga una imagen propia.

## Dependencias

Si realizas cambios en la ventana «Punto de inicio» o «Niveles», el menú se recarga inmediatamente.
Los puntos que, a partir de entonces, ya no estén asignados a ninguna entrada, aparecerán en
«Ya no están en el menú».

El texto del botón solo tiene efecto si al punto se le ha asignado algún destino
. Sin destino, no hay botón y el texto queda
sin efecto.
