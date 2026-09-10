# Escenarios

El diálogo de configuración del widget tiene tres atributos. "Imagen" y
Los "puntos" se mantienen en la ventana que aparece al abrir Configuración
se muestra a sí mismo; los campos de texto detrás son la versión técnica aproximada y
No debe procesarse a mano. 

| Atributo | Etiqueta en el diálogo | Descripción |
| --- | --- | --- |
| 'imagen' | Imagen | La imagen en la que están ubicados los puntos. Se establece en la ventana mediante **Seleccionar imagen ...** de la biblioteca multimedia. |
| 'puntos' | Puntos | La lista de puntos con posición, título, descripción y enlace. Mantenidos en la misma ventana. |
| 'modo de visualización' | Visualización | Controla cómo aparecen los puntos en la página publicada. La configuración predeterminada es 'Numerado, con lista junto a la imagen'. |

## Valores de "Representación" 

| Valor | Etiquetado en el diálogo |
| --- | --- |
| 'numerado' | Numerado, con la lista junto a la imagen |
| 'puntos' | Puntos, sin lista |

## Campos de un punto

| Campo | Descripción |
| --- | --- |
| Título | Obligatorio. Sin título, la ventana no puede cerrarse con "Aplicar". |
| Descripción | Opcional, de varias líneas. |
| Destino | Opcional. Una página de la lista del sistema o una dirección introducida por uno mismo. |
| Etiqueta del botón | Opcional. Si permanece vacío, el botón muestra "Abrir página". |

## Fronteras

- Una imagen tiene un máximo de **20 puntos**. La ventana se muestra al intentar 
  para poner otro, en vez de tácitamente
  Deshacerse. 
- Un punto **sin título** no puede adoptarse: el botón
  "Aplicar" permanece bloqueado mientras al menos un punto no gane un título
  y la ventana indica el número de puntos afectados. 
- **Sin imagen o sin al menos un punto, el widget no muestra nada** — 
  ni en la página publicada ni como marco vacío. 

## Dependencia

El etiquetado del botón solo funciona si el punto tiene un objetivo.
se asigna. Sin objetivo, no hay botón, y la etiqueta permanece
sin efecto.