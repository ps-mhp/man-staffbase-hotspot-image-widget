# Ambientazioni

La finestra di configurazione del widget ha tre attributi. "Immagine" e
I "punti" sono mantenuti nella finestra che appare quando apri le impostazioni
si mostra da solo; i campi di testo dietro di essa sono la versione tecnica approssimativa e
Non dovrebbe essere lavorato a mano. 

| Attributo | Etichetta nel dialogo | Descrizione |
| --- | --- | --- |
| 'immagine' | Immagine | L'immagine su cui si trovano i puntini. È impostata nella finestra tramite **Seleziona immagine ...** dalla media library. |
| 'punti' | Punti | L'elenco dei punti con posizione, titolo, descrizione e collegamento. Mantenuti nella stessa finestra. |
| 'modalità visualizzazione' | Visualizzazione | Controlla come appaiono i punti nella pagina pubblicata. L'impostazione predefinita è 'Numerato, con elenco accanto all'immagine'. |

## Valori della "Rappresentazione" 

| Valore | Etichettatura nei dialoghi |
| --- | --- |
| 'numerato' | Numerato, con la lista accanto all'immagine |
| 'puntini' | Puntini, senza elenco |

## Campi di un punto

| Campo | Descrizione |
| --- | --- |
| Titolo | Obbligatorio. Senza un titolo, la finestra non può essere chiusa con "Applica". |
| Descrizione | Opzionale, multilinea. |
| Destinazione | Opzionale. Una pagina dalla lista del sistema o un indirizzo inserito da te. |
| Etichetta del pulsante | Opzionale. Se rimane vuoto, il pulsante mostra "Apri pagina". |

## Confini

- Un'immagine ha un massimo di **20 punti**. La finestra viene mostrata quando si cerca di 
  di impostarne un altro, invece che tacitamente
  Scarta. 
- Un punto **senza titolo** non può essere adottato: il pulsante
  "Applica" rimane bloccato finché almeno un punto non vince un titolo
  e la finestra indica il numero di punti interessati. 
- **Senza un'immagine o senza almeno un punto, il widget non mostra nulla** — 
  né sulla pagina pubblicata né come cornice vuota. 

## Dipendenza

L'etichettatura del pulsante funziona solo se il punto ha un bersaglio.
viene assegnato. Senza un bersaglio, non c'è un pulsante e l'etichetta rimane
senza effetto.