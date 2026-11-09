# Impostazioni

La finestra di dialogo di configurazione del widget presenta nove attributi; quali di questi siano
visibili dipende dalla **modalità**. Nella modalità “Menu”, “Immagine” corrisponde all’immagine del
livello iniziale; le immagini dei livelli inferiori vengono selezionate nella finestra “Posizionare voci di menu
…». «Immagine» e
«Voci» vengono gestiti nella finestra che si apre automaticamente all’apertura delle impostazioni
; i campi di testo sottostanti rappresentano la versione tecnica grezza e
non devono essere modificati manualmente. Nel Content Designer, «Immagine»
invece il caricamento dell’immagine del Designer — lì l’immagine viene selezionata direttamente nel
modulo.

| Attributo | Etichetta nella finestra di dialogo | Descrizione |
| --- | --- | --- |
| `image` | Immagine | L’immagine su cui si trovano i punti. Nell’editor classico tramite **Seleziona immagine…** nella finestra dalla libreria multimediale, nel Content Designer selezionata direttamente nel modulo. |
| `image-alt` | Testo alternativo | Descrive l’immagine per gli screen reader; lasciare vuoto se è solo decorativa. Modificabile anche nella finestra alla voce «Testo alternativo». |
| `source` | Modalità | `Manuale` (impostazione predefinita) o `Menu`. Nasconde i campi dell’altra modalità; i relativi contenuti rimangono salvati. |
| `points` | Punti | Solo «Manuale». L'elenco dei punti con posizione, titolo, descrizione e link. Viene gestito nella stessa finestra. |
| `display-mode` | Visualizzazione | Solo «Manuale». Controlla come i punti appaiono sulla pagina pubblicata. L'impostazione predefinita è `Numerati, con elenco accanto all'immagine`. |
| `menu-id` | Punto di partenza nel menu | Solo «Menu». La voce di menu le cui sottovoci vengono posizionate sull’immagine. Selezione dal menu o, tramite «Inserisci altro ID menu…», l’indirizzo di una pagina. |
| `menu-depth` | Livelli | Solo «Menu». Numero di livelli visualizzati, compreso il punto di partenza. L’impostazione predefinita è 3. |
| `menu-click` | Clic su una voce con sottovoci | Solo «Menu». `Passa al sottomenu` (impostazione predefinita) o `Apri pagina`. |
| `menu-points` | Voci di menu sull’immagine | Solo «Menu». Per ogni livello di menu, l’immagine e la posizione delle voci. Viene gestito nella finestra «Posiziona voci di menu…». |

## Valori di «Visualizzazione»

| Valore | Etichetta nella finestra di dialogo |
| --- | --- |
| `numbered` | Numerato, con elenco accanto all’immagine |
| `dots` | Punti, senza elenco |

## Valori di «Livelli»

| Valore | Significato |
| --- | --- |
| `2` | Punto iniziale e relative voci secondarie |
| `3` | più le relative voci secondarie (impostazione predefinita) |
| da `4` a `6` | livelli successivi |

## Valori di «Clic su un punto con voci secondarie»

| Valore | Etichetta nella finestra di dialogo | Effetto |
| --- | --- | --- |
| `enter` | Passa al sottomenu | Il widget passa al sottomenu: il menu mostra le voci secondarie, l’immagine passa a quella di quel livello. |
| `open` | Apri pagina | La voce è un link alla pagina corrispondente alla voce di menu; le destinazioni esterne all’app si aprono in una nuova scheda. |

Le voci senza sottovoci aprono la propria pagina in entrambi i casi. Le cartelle senza
una propria pagina passano al sottomenu in entrambi i casi.

## Campi di una voce (modalità «Manuale»)

| Campo | Descrizione |
| --- | --- |
| Titolo | Obbligatorio. Senza titolo non è possibile chiudere la finestra con «Applica». |
| Descrizione | Facoltativa, su più righe. |
| Destinazione | Facoltativo. Una pagina dall’elenco del sistema o un indirizzo inserito manualmente. |
| Etichetta del pulsante | Facoltativo. Se lasciato vuoto, il pulsante mostra «Apri pagina». |

## Limiti

- Un’immagine può contenere al massimo **20 punti**. Se si tenta di
  aggiungerne un altro, la finestra lo segnala invece di
  scartarlo silenziosamente.
- Un punto **senza titolo** non può essere salvato: il pulsante
  «Applica» rimane disabilitato finché almeno un punto non ha un titolo
  e la finestra indica il numero dei punti interessati.
- **Senza immagine o senza almeno un punto, il widget non mostra nulla** —
  né sulla pagina pubblicata né come cornice vuota. Nella modalità
  «Menu» vale lo stesso, senza punto iniziale.
- Nella modalità «Menu», **ogni livello di menu contiene al massimo 20 voci** e ogni
  voce di menu ne ha al massimo una; un ulteriore clic sull’immagine la sposta
  altrove.
- Un livello di menu **senza immagine propria** mostra l’immagine del livello superiore.
  È possibile inserire voci su di esso solo se dispone di un’immagine propria.

## Dipendenze

La finestra «Posiziona voci di menu …» legge il punto di partenza e i livelli all’
apertura. Dopo aver apportato una modifica, chiudere la finestra e riaprirla.

L’etichetta del pulsante ha effetto solo se alla voce è stata assegnata una destinazione
. Senza destinazione non c’è alcun pulsante e l’etichetta rimane
senza effetto.
