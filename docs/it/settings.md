# Impostazioni

Nella finestra di dialogo di configurazione del widget è presente un solo pulsante: **Modifica immagine con punti
…**. Questo apre la finestra in cui si gestiscono tutte le impostazioni: modalità,
immagine, visualizzazione, impostazioni del menu e punti. La finestra si apre
automaticamente anche quando si aprono le impostazioni. **Applica** salva tutte le
impostazioni in un unico campo.

| Impostazione nella finestra | Descrizione |
| --- | --- |
| Modalità | `Manuale` (impostazione predefinita) o `Menu`. I punti dell’altra modalità rimangono salvati. |
| Immagine | L’immagine su cui si trovano le voci, dalla libreria multimediale — nella modalità «Menu», l’immagine del livello iniziale. Inoltre, il **testo alternativo** per gli screen reader; lasciare vuoto se l’immagine è solo decorativa. |
| Visualizzazione | Solo «Manuale». L’impostazione predefinita è `Numerata, con elenco accanto all’immagine`. |
| Punto di partenza nel menu | Solo «Menu». La voce di menu di cui verranno posizionate le sottovoci. Selezione dall’elenco o, tramite «Inserisci altro ID menu…», l’indirizzo di una pagina. |
| Livelli | Solo «Menu». Numero di livelli visualizzati, compreso il punto di partenza. L’impostazione predefinita è 3. |
| Clic su una voce con sottovoci | Solo «Menu». `Passa al sottomenu` (impostazione predefinita) o `Apri pagina`. |
| Livello | Solo «Menu». Quale livello del menu è attualmente in fase di modifica; ognuno ha la propria immagine e le proprie voci. |

Tecnicamente, tutto è contenuto nell’attributo `config`. I widget delle versioni precedenti
conservano ancora le loro impostazioni in singoli attributi (`image`,
`image-alt`, `points`, `display-mode` …). Finché `config` è vuoto, valgono
queste; al primo **Salva** nella finestra, vengono spostate in `config`.

## Immagine al posto del punto

Ogni punto può contenere, in entrambe le modalità, una propria immagine dalla libreria multimediale;
questa apparirà al posto del punto rosso, ridimensionata proporzionalmente.

| Dimensione | Lunghezza del lato |
| --- | --- |
| S | 32 px |
| M | 48 px (impostazione predefinita) |
| L | 72 px |

Come **sfondo** è possibile scegliere tra trasparente (impostazione predefinita) o un’
area circolare in bianco, rosso MAN, antracite o grigio chiaro.

L’evidenziazione, l’etichetta e il clic funzionano come per il punto. Nella
modalità numerata, il numero compare solo nell’elenco.

## Valori di «Visualizzazione»

| Valore | Etichetta nella finestra di dialogo |
| --- | --- |
| `numbered` | Numerato, con elenco accanto all’immagine |
| `dots` | Punti, senza elenco |

## Valori di «Livelli»

| Valore | Significato |
| --- | --- |
| `2` | Punto iniziale e relativi sottopunti |
| `3` | più le relative sottovoci (impostazione predefinita) |
| da `4` a `6` | livelli corrispondentemente più profondi |

## Valori di «Clic su un punto con sottovoci»

| Valore | Etichetta nella finestra di dialogo | Effetto |
| --- | --- | --- |
| `enter` | Passare al sottomenu | Il widget passa al sottomenu: il menu mostra le voci secondarie, l’immagine passa a quella di quel livello. |
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
  «Menu» vale lo stesso senza punto iniziale.
- Nella modalità «Menu», **ogni livello di menu contiene al massimo 20 voci** e ogni
  voce di menu ne ha al massimo una; un ulteriore clic sull’immagine la sposta
  altrove.
- Un livello di menu **senza immagine propria** mostra l’immagine del livello superiore.
  È possibile posizionare voci su di esso solo se dispone di un’immagine propria.

## Dipendenze

Se si apportano modifiche nella finestra «Punto di partenza» o «Livelli», il menu si aggiorna immediatamente.
I punti che in seguito non sono più assegnati a nessuna voce vengono visualizzati sotto
«Non più nel menu».

L’etichetta del pulsante ha effetto solo se al punto è stata assegnata una destinazione
. Senza destinazione non c’è alcun pulsante e l’etichetta rimane
senza effetto.
