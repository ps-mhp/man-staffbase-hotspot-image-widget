# Ajustes

En el cuadro de diálogo de configuración del widget solo hay un botón: **Editar imagen con puntos
**. Este abre la ventana a pantalla completa **Establecer puntos**, en la que se gestiona todo
: el origen de los puntos, la imagen, la representación, los ajustes del menú y
puntos. La ventana también se abre automáticamente al acceder a la configuración
. **Aplicar** guarda todos los cambios en un solo campo.

## Estructura de la ventana

| Área | Contenido |
| --- | --- |
| Encabezado | Nombre del widget, estado («Punto 2 modificado»), Deshacer/Rehacer, conmutador **Editor · Ordenador · Tableta · Móvil**, Ayuda, **Cancelar** y **Aplicar**. |
| Izquierda | En el modo «Manual», los **puntos** en su orden (número en rojo, título, destino) y **Nuevo punto**; en el modo «Desde el menú», los **niveles del menú** en forma de árbol. |
| Centro | La barra con **Origen de los puntos**, la imagen que se está editando, **Cambiar imagen** y —solo en modo manual— la **Presentación**; debajo, la imagen para colocar y desplazar los puntos y una barra de estado. |
| Derecha | El punto seleccionado. Si no hay ninguno seleccionado, la **imagen** con su descripción o, en el modo de menú, el panel **Menú**. |

En **Ordenador**, **Tableta** y **Móvil**, en el centro, en lugar de la imagen,
aparece la página tal y como la ven los lectores; a la izquierda y a la derecha se pueden seguir
realizando selecciones y ajustes.

## Ajustes en la ventana

| Ajuste | Dónde | Descripción |
| --- | --- | --- |
| Fuente de los puntos | Barra situada encima de la imagen | `Manual` (por defecto) o `Desde el menú`. Los puntos del otro modo se mantienen guardados. |
| Imagen | Barra, panel «Imagen» o «Menú» | La imagen sobre la que se sitúan los puntos, de la biblioteca multimedia; en el modo «Del menú», la imagen del nivel de inicio. Además, la **descripción de la imagen** (texto alternativo) para lectores de pantalla; dése en blanco si la imagen es meramente decorativa. |
| Presentación | Barra situada encima de la imagen | Solo «Manual»: `Números` (predeterminado, con lista junto a la imagen) o `Puntos` (sin lista). |
| Punto de inicio | Panel «Menú» | Solo «Desde el menú». La opción del menú cuyos subelementos forman el primer nivel. Selección de la lista o, mediante «Introducir otro ID de menú…», la dirección de una página. |
| Profundidad | Panel «Menú» | Solo «Desde el menú». Cuántos niveles aparecen, contando el punto de inicio. El valor predeterminado es 3 niveles. |
| Clic en un punto con subpuntos | Panel «Menú» | Solo «Desde el menú». `Ir al submenú` (por defecto) o `Abrir página`. |
| Imagen del nivel | Panel «Menú» | Solo «Desde el menú». Cada nivel puede tener su propia imagen. |

Técnicamente, todo se encuentra en el atributo `config`. Los widgets de versiones anteriores
aún conservan su configuración en atributos individuales (`image`,
`image-alt`, `points`, `display-mode` …). Se lee cada configuración de la siguiente manera:
se aplica lo que figure en `config`; en su defecto, el antiguo atributo; y, si no, el valor por defecto.
Al abrirla, la ventana adopta lo que se puede leer en los campos antiguos.
Lo que no puede leer —por ejemplo, los campos de selección en el Content Designer—,
no lo escribe en `config` hasta que lo modifique en la ventana; una nota
en el panel indica estos ajustes. Por lo tanto, abrir y aplicar sin realizar cambios
no modifica un widget ya existente.

## Icono en lugar de punto

Cada punto puede llevar, en ambos modos, una imagen propia (icono) de la biblioteca multimedia;
esta aparecerá entonces en lugar del punto rojo, ajustada proporcionalmente. En el panel del punto se encuentra la sección **Icono**.

| Tamaño | Longitud del borde |
| --- | --- |
| S | 32 px |
| M | 48 px (por defecto) |
| L | 72 px |

Como **fondo** se puede elegir entre transparente (por defecto) o una
superficie redonda en blanco, rojo MAN, antracita o gris claro.

El resaltado, la etiqueta de nombre y el clic funcionan igual que en el punto. En el
modo numerado, el número solo aparece en la lista.

## Valores de «Presentación»

| Valor | Etiqueta en la ventana |
| --- | --- |
| `numbered` | Números (con lista junto a la imagen) |
| `dots` | Puntos (sin lista) |

## Valores de «Profundidad»

| Valor | Significado |
| --- | --- |
| `2` | Punto inicial y sus subpuntos |
| `3` | además, sus subpuntos (por defecto) |
| `4` a `6` | mayor profundidad, respectivamente |

## Valores de «Hacer clic en un punto con subpuntos»

| Valor | Etiqueta en la ventana | Efecto |
| --- | --- | --- |
| `enter` | Pasar al submenú | El widget navega hasta el submenú: el menú muestra sus subelementos y la imagen cambia a la de ese nivel. |
| `open` | Abrir página | El elemento es un enlace a la página del elemento del menú; los destinos fuera de la aplicación se abren en una nueva pestaña. |

Los elementos sin subelementos abren su página en ambos casos. Las carpetas sin
página propia pasan al submenú en ambos casos.

## Campos de una opción (modo «Manual»)

| Campo | Descripción |
| --- | --- |
| Título | Obligatorio. Sin título, al pulsar **Aceptar**, la opción se mantiene en el estado actual en lugar de aplicarse. |
| Descripción | Opcional, de varias líneas. |
| Enlace · Destino | Opcional. `Sin enlace`, una página de la lista del sistema o una dirección introducida manualmente mediante «Introducir dirección propia…». |
| Enlace · Texto del botón | Opcional. Si se deja en blanco, el botón muestra «Abrir página». |
| Icono | Opcional, véase más arriba. |

Encima del panel se encuentran las acciones del elemento: subir, bajar,
duplicar, eliminar.

## Límites

- Una imagen admite un máximo de **20 puntos**. La barra de estado situada debajo de la imagen
  lo indica cuando se intenta añadir otro, en lugar de
  descartarlo sin avisar; las opciones **Nuevo punto** y **Duplicar** quedan
  entonces desactivadas.
- Un punto **sin título** no se puede aplicar: **Aplicar** lo indica
  en el estado; a la izquierda aparece marcado como «Falta título» y a la derecha
  se muestra abierto.
- **Sin imagen o sin al menos un punto, el widget no muestra nada** —
  ni en la página publicada ni como un marco vacío. En el modo
  «Desde el menú» ocurre lo mismo si no hay un punto inicial.
- En el modo «Desde el menú», **cada nivel del menú puede contener un máximo de 20 elementos**, y
  cada opción del menú tiene allí como máximo uno; al hacer clic de nuevo en la imagen,
  se desplaza.
- Un nivel del menú **sin imagen propia** muestra la imagen del nivel superior.
  Solo se pueden colocar puntos en él cuando tiene una imagen propia.
- El hecho de que el widget se muestre estrecho o ancho depende de su
  propia anchura (se considera estrecho si es inferior a 600 píxeles), no de la de la pantalla. Por eso, la
  vista previa **Móvil** muestra la misma presentación estrecha que el
  teléfono; un widget situado en una columna estrecha también se muestra estrecho en el escritorio.

## Dependencias

Si se modifica el punto de inicio o la profundidad en el panel «Menú», el menú se recarga inmediatamente.
Los elementos que, tras ello, ya no estén asignados a ninguna entrada, aparecerán a la izquierda como
el error «Ya no está en el menú» debajo de su nivel.

El texto del botón solo se muestra si al elemento se le ha asignado un destino
. Sin destino, no hay botón y el campo no aparece
.
