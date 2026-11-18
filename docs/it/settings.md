# Impostazioni

Nella finestra di dialogo di configurazione del widget è presente un solo pulsante: **Modifica immagine con punti
**. Questo apre la finestra a schermo intero **Imposta punti**, in cui viene gestito tutto
— origine dei punti, immagine, visualizzazione, impostazioni del menu e
punti. La finestra si apre automaticamente anche all’apertura delle impostazioni
. **Applica** salva tutto in un unico campo.

## Struttura della finestra

| Area | Contenuto |
| --- | --- |
| Intestazione | Nome del widget, stato («Punto 2 modificato»), Annulla/Ripeti, selettore **Editor · Desktop · Tablet · Mobile**, Aiuto, **Annulla** e **Applica**. |
| Sinistra | In modalità «Manuale», i **punti** nel loro ordine (numero rosso, titolo, destinazione) e **Nuovo punto**; in modalità «Dal menu», i **livelli del menu** sotto forma di albero. |
| Centro | La barra con **Origine dei punti**, l’immagine attualmente in modifica, **Modifica immagine** e – solo in modalità manuale – la **Visualizzazione**; sotto, l’immagine per posizionare e spostare i punti e una barra di stato. |
| A destra | Il punto selezionato. Se non ne è selezionato nessuno, l’**immagine** con la relativa descrizione oppure, in modalità menu, il pannello **Menu**. |

Nelle modalità **Desktop**, **Tablet** e **Mobile**, al centro, al posto dell’immagine,
viene visualizzata la pagina così come la vedono i lettori; a sinistra e a destra è possibile
effettuare ulteriori selezioni e impostazioni.

## Impostazioni nella finestra

| Impostazione | Dove | Descrizione |
| --- | --- | --- |
| Origine dei punti | Barra sopra l’immagine | `Manuale` (impostazione predefinita) o `Dal menu`. I punti dell’altra modalità rimangono salvati. |
| Immagine | Barra, pannello «Immagine» o «Menu» | L’immagine su cui si trovano i punti, dalla libreria multimediale — nella modalità «Dal menu» l’immagine del livello iniziale. Inoltre, la **descrizione dell’immagine** (testo alternativo) per i lettori di schermo; lasciare vuoto se l’immagine è solo decorativa. |
| Visualizzazione | Barra sopra l’immagine | Solo «Manuale»: `Numeri` (impostazione predefinita, con elenco accanto all’immagine) o `Punti` (senza elenco). |
| Punto di partenza | Pannello «Menu» | Solo «Dal menu». La voce di menu le cui sottovoci costituiscono il primo livello. Selezione dall’elenco o, tramite «Inserisci altro ID menu…», l’indirizzo di una pagina. |
| Profondità | Pannello «Menu» | Solo «Dal menu». Numero di livelli visualizzati, compreso il punto di partenza. L’impostazione predefinita è 3 livelli. |
| Clic su una voce con sottovoci | Pannello «Menu» | Solo «Dal menu». `Passa al sottomenu` (impostazione predefinita) o `Apri pagina`. |
| Immagine del livello | Pannello «Menu» | Solo «Dal menu». Ogni livello può avere una propria immagine. |

Tecnicamente, tutto è contenuto nell’attributo `config`. I widget delle versioni precedenti
conservano ancora le loro impostazioni in singoli attributi (`image`,
`image-alt`, `points`, `display-mode` …). Per ogni impostazione viene letto:
se è presente in `config`, prevale; altrimenti prevale il vecchio attributo; altrimenti prevale il valore predefinito.
All’apertura, la finestra applica ciò che è possibile leggere dai vecchi campi.
Ciò che non è in grado di leggere — ad esempio i campi di selezione nel Content Designer —
non viene scritto in `config` finché non lo si modifica nella finestra; un’indicazione
nel pannello segnala queste impostazioni. Aprire e applicare senza modifiche
non altera quindi un widget esistente.

## Icona al posto del punto

Ogni punto può avere, in entrambe le modalità, una propria immagine (icona) dalla libreria multimediale;
questa apparirà al posto del punto rosso, ridimensionata proporzionalmente. Nel pannello del punto è presente la sezione **Icona**.

| Dimensione | Lunghezza del lato |
| --- | --- |
| S | 32 px |
| M | 48 px (impostazione predefinita) |
| L | 72 px |

Come **sfondo** è possibile scegliere tra trasparente (impostazione predefinita) o un’
area circolare nei colori bianco, rosso MAN, antracite o grigio chiaro.

L'evidenziazione, l'etichetta e il clic funzionano come nel punto. Nella
modalità numerata, il numero compare solo nell'elenco.

## Valori di «Visualizzazione»

| Valore | Etichetta nella finestra |
| --- | --- |
| `numbered` | Numeri (con elenco accanto all’immagine) |
| `dots` | Punti (senza elenco) |

## Valori di «Profondità»

| Valore | Significato |
| --- | --- |
| `2` | Punto iniziale e relativi sottopunti |
| `3` | più i relativi sottopunti (impostazione predefinita) |
| da `4` a `6` | profondità corrispondente |

## Valori di «Clic su un punto con sottopunti»

| Valore | Etichetta nella finestra | Effetto |
| --- | --- | --- |
| `enter` | Passare al sottomenu | Il widget passa al sottomenu: il menu mostra le voci secondarie, l'immagine passa a quella di quel livello. |
| `open` | Apri pagina | La voce è un link alla pagina corrispondente alla voce di menu; le destinazioni esterne all’app si aprono in una nuova scheda. |

Le voci senza sottovoci aprono la propria pagina in entrambi i casi. Le cartelle senza
una propria pagina passano al sottomenu in entrambi i casi.

## Campi di una voce (modalità «Manuale»)

| Campo | Descrizione |
| --- | --- |
| Titolo | Obbligatorio. Senza titolo, **Applica** mantiene la voce nello stato attuale invece di applicarla. |
| Descrizione | Facoltativo, su più righe. |
| Link · Destinazione | Facoltativo. `Nessun link`, una pagina dall’elenco del sistema o un indirizzo inserito manualmente tramite «Inserisci indirizzo proprio…». |
| Link · Etichetta del pulsante | Facoltativo. Se lasciato vuoto, il pulsante mostra «Apri pagina». |
| Icona | Facoltativo, vedi sopra. |

Sopra il pannello sono presenti le azioni relative alla voce: su, giù,
duplica, elimina.

## Limiti

- Un’immagine può contenere al massimo **20 voci**. La barra di stato sotto l’immagine
  lo segnala quando si tenta di inserirne un’altra, invece di
  scartarla silenziosamente; **Nuova voce** e **Duplica** sono
  quindi disabilitati.
- Un punto **senza titolo** non può essere salvato: **Salva** lo indica
  nello stato, a sinistra è contrassegnato come «Titolo mancante» e a destra
  è aperto.
- **Senza immagine o senza almeno un punto, il widget non mostra nulla** —
  né sulla pagina pubblicata né come cornice vuota. Nella modalità
  «Dal menu» vale lo stesso senza punto iniziale.
- Nella modalità «Dal menu», **ogni livello di menu può contenere al massimo 20 voci** e
  ogni voce di menu ne ha al massimo una; un ulteriore clic sull’immagine
  la sposta.
- Un livello di menu **senza immagine propria** mostra l’immagine del livello superiore.
  È possibile posizionare punti su di esso solo se dispone di un'immagine propria.
- La visualizzazione del widget in formato stretto o largo dipende dalla sua
  larghezza (stretto se inferiore a 600 pixel), non da quella dello schermo. L’
  anteprima **Mobile** mostra quindi la stessa visualizzazione stretta del
  telefono; un widget in una colonna stretta rimane stretto anche sul desktop.

## Dipendenze

Se nel pannello «Menu» si modificano il punto di partenza o la profondità, il menu si ricarica immediatamente.
Le voci che in seguito non sono più associate a nessuna voce vengono visualizzate a sinistra come
errore «Non più nel menu» sotto il loro livello.

L’etichetta del pulsante ha effetto solo se alla voce è stata assegnata una destinazione
. Senza destinazione non c’è alcun pulsante e il campo non viene
visualizzato.
