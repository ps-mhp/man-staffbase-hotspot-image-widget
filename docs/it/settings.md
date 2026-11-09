# Impostazioni

La finestra di dialogo di configurazione del widget presenta nove attributi; quali di questi
vengano visualizzati dipende dalla **modalità**. “Immagine” e
“Punti” vengono gestiti nella finestra che si apre automaticamente all’apertura delle impostazioni
; i campi di testo sottostanti rappresentano la versione tecnica grezza e
non devono essere modificati manualmente. Nel Content Designer, «Immagine»
mostra invece l’immagine caricata dal Designer — lì l’immagine viene selezionata direttamente nel
modulo.

| Attributo | Etichetta nella finestra di dialogo | Descrizione |
| --- | --- | --- |
| `image` | Immagine | L’immagine su cui si trovano i punti. Nell’editor classico, selezionabile tramite **Seleziona immagine…** nella finestra dalla libreria multimediale; nel Content Designer, selezionabile direttamente nel modulo. |
| `image-alt` | Testo alternativo | Descrive l’immagine per gli screen reader; lasciare vuoto se ha solo scopo decorativo. Modificabile anche nella finestra alla voce «Testo alternativo». |
| `source` | Modalità | `Manuale` (impostazione predefinita) o `Menu`. Nasconde i campi dell’altra modalità; i relativi contenuti rimangono salvati. |
| `points` | Punti | Solo «Manuale». L’elenco dei punti con posizione, titolo, descrizione e link. Viene gestito nella stessa finestra. |
| `display-mode` | Visualizzazione | Solo «Manuale». Controlla come appaiono le voci nella pagina pubblicata. L’impostazione predefinita è `Numerato, con elenco accanto all’immagine`. |
| `menu-id` | Punto di partenza nel menu | Solo «Menu». La voce di menu in cui vengono inserite le sottovoci; anche essa stessa può essere inserita. Selezione dal menu o, tramite «Inserisci altro ID menu…», l’indirizzo di una pagina. |
| `menu-depth` | Livelli | Solo «Menu». Quanti livelli vengono visualizzati, compreso il punto di partenza. Il valore predefinito è 3. |
| `menu-click` | Clic su una voce | Solo «Menu». `Apri pagina` (impostazione predefinita) o `Mostra accanto nel menu`. |
| `menu-points` | Voci di menu sull’immagine | Solo «Menu». Posizione delle voci di menu. Si gestisce nella finestra «Posiziona voci di menu…». |

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
| da `4` a `6` | livelli corrispondentemente più profondi |

## Valori di «Clic su un punto»

| Valore | Etichetta nella finestra di dialogo | Effetto |
| --- | --- | --- |
| `open` | Apri pagina | Il punto è un link alla pagina della voce di menu; le destinazioni esterne all’app si aprono in una nuova scheda. |
| `reveal` | Mostra accanto nel menu | Il menu accanto all’immagine scorre fino alla voce di menu e la evidenzia. |

Le cartelle prive di una pagina propria vengono visualizzate nel menu in entrambi i casi.

## Campi di una voce (modalità «Manuale»)

| Campo | Descrizione |
| --- | --- |
| Titolo | Obbligatorio. Senza titolo non è possibile chiudere la finestra con «Applica». |
| Descrizione | Facoltativo, su più righe. |
| Destinazione | Facoltativo. Una pagina dall’elenco del sistema o un indirizzo inserito manualmente. |
| Etichetta del pulsante | Facoltativo. Se lasciato vuoto, il pulsante mostra «Apri pagina». |

## Limiti

- Un’immagine può contenere al massimo **20 punti**. Se si tenta di
  aggiungerne un altro, la finestra lo segnala invece di ignorarlo
  silenziosamente.
- Un punto **senza titolo** non può essere salvato: il pulsante
  «Salva» rimane disattivato finché almeno un punto non ha un titolo
  e la finestra indica il numero di punti interessati.
- **Senza immagine o senza almeno un punto, il widget non mostra nulla** —
  né sulla pagina pubblicata né come cornice vuota. Nella modalità
  «Menu» vale lo stesso senza punto di partenza.
- Nella modalità «Menu», **ogni voce di menu può contenere al massimo una voce**; un
  ulteriore clic sull’immagine la sposta.

## Dipendenze

La finestra «Posiziona voci di menu …» legge il punto di partenza e i livelli all’
apertura. Dopo aver apportato una modifica, chiudere la finestra e riaprirla.

L’etichetta del pulsante ha effetto solo se al punto è stata assegnata una destinazione
. Senza destinazione non c’è alcun pulsante e l’etichetta rimane
senza effetto.
