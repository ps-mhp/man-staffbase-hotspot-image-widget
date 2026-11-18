# Einstellungen

Im Konfigurationsdialog des Widgets steht nur ein Knopf: **Bild mit Punkten
bearbeiten**. Er öffnet das Vollbild-Fenster **Punkte setzen**, in dem alles
gepflegt wird — Quelle der Punkte, Bild, Darstellung, Menü-Einstellungen und
Punkte. Das Fenster öffnet sich beim Öffnen der Einstellungen auch von
selbst. **Übernehmen** speichert alles zusammen in einem Feld.

## Aufbau des Fensters

| Bereich | Inhalt |
| --- | --- |
| Kopf | Name des Widgets, Status („Punkt 2 geändert“), Rückgängig/Wiederholen, Umschalter **Editor · Desktop · Tablet · Mobil**, Hilfe, **Abbrechen** und **Übernehmen**. |
| Links | Im Modus „Manuell“ die **Punkte** in ihrer Reihenfolge (rote Nummer, Titel, Ziel) und **Neuer Punkt**; im Modus „Aus dem Menü“ die **Menü-Ebenen** als Baum. |
| Mitte | Die Leiste mit **Quelle der Punkte**, dem gerade bearbeiteten Bild, **Bild ändern** und – nur manuell – der **Darstellung**; darunter das Bild zum Setzen und Schieben der Punkte und eine Statuszeile. |
| Rechts | Der gewählte Punkt. Ist keiner gewählt, das **Bild** mit seiner Beschreibung bzw. im Menü-Modus das Panel **Menü**. |

In **Desktop**, **Tablet** und **Mobil** steht in der Mitte statt des Bildes
die Seite so, wie Lesende sie sehen; links und rechts lässt sich weiter
auswählen und einstellen.

## Einstellungen im Fenster

| Einstellung | Wo | Beschreibung |
| --- | --- | --- |
| Quelle der Punkte | Leiste über dem Bild | `Manuell` (voreingestellt) oder `Aus dem Menü`. Die Punkte des jeweils anderen Modus bleiben gespeichert. |
| Bild | Leiste, Panel „Bild“ bzw. „Menü“ | Das Bild, auf dem die Punkte liegen, aus der Mediathek — im Modus „Aus dem Menü“ das Bild der Startebene. Dazu die **Bildbeschreibung** (Alternativtext) für Screenreader; leer lassen, wenn das Bild nur schmückt. |
| Darstellung | Leiste über dem Bild | Nur „Manuell“: `Nummern` (voreingestellt, mit Liste neben dem Bild) oder `Punkte` (ohne Liste). |
| Startpunkt | Panel „Menü“ | Nur „Aus dem Menü“. Der Menüpunkt, dessen Unterpunkte die erste Ebene bilden. Auswahl aus der Liste oder über „Andere Menü-ID eingeben …“ die Adresse einer Seite. |
| Tiefe | Panel „Menü“ | Nur „Aus dem Menü“. Wie viele Ebenen erscheinen, der Startpunkt mitgezählt. Voreingestellt sind 3 Ebenen. |
| Klick auf einen Punkt mit Unterpunkten | Panel „Menü“ | Nur „Aus dem Menü“. `Ins Untermenü wechseln` (voreingestellt) oder `Seite öffnen`. |
| Bild der Ebene | Panel „Menü“ | Nur „Aus dem Menü“. Jede Ebene kann ein eigenes Bild tragen. |

Technisch steht alles im Attribut `config`. Widgets aus früheren Fassungen
tragen ihre Einstellungen noch in einzelnen Attributen (`image`,
`image-alt`, `points`, `display-mode` …). Gelesen wird je Einstellung:
was in `config` steht, gilt; sonst das alte Attribut; sonst die Vorgabe.
Beim Öffnen übernimmt das Fenster, was sich aus den alten Feldern lesen
lässt. Was es nicht lesen kann — im Content Designer etwa Auswahlfelder —,
schreibt es nicht nach `config`, bis Sie es im Fenster ändern; ein Hinweis
im Panel nennt diese Einstellungen. Öffnen und Übernehmen ohne Änderung
verändert ein bestehendes Widget deshalb nicht.

## Icon statt Punkt

Jeder Punkt kann in beiden Modi ein eigenes Bild (Icon) aus der Mediathek
tragen; es erscheint dann an Stelle des roten Punkts, proportional
eingepasst. Im Panel des Punkts steht dafür der Abschnitt **Icon**.

| Größe | Kantenlänge |
| --- | --- |
| S | 32 px |
| M | 48 px (voreingestellt) |
| L | 72 px |

Als **Hintergrund** steht Transparent (voreingestellt) zur Wahl oder eine
runde Fläche in Weiß, MAN-Rot, Anthrazit oder Hellgrau.

Hervorheben, Namensschild und Klick funktionieren wie beim Punkt. Im
nummerierten Modus steht die Nummer dann nur noch in der Liste.

## Werte von „Darstellung“

| Wert | Beschriftung im Fenster |
| --- | --- |
| `numbered` | Nummern (mit Liste neben dem Bild) |
| `dots` | Punkte (ohne Liste) |

## Werte von „Tiefe“

| Wert | Bedeutung |
| --- | --- |
| `2` | Startpunkt und seine Unterpunkte |
| `3` | dazu deren Unterpunkte (voreingestellt) |
| `4` bis `6` | entsprechend tiefer |

## Werte von „Klick auf einen Punkt mit Unterpunkten“

| Wert | Beschriftung im Fenster | Wirkung |
| --- | --- | --- |
| `enter` | Ins Untermenü wechseln | Das Widget blättert in das Untermenü: das Menü zeigt dessen Unterpunkte, das Bild wechselt auf das Bild dieser Ebene. |
| `open` | Seite öffnen | Der Punkt ist ein Link auf die Seite des Menüpunkts; Ziele außerhalb der App öffnen in einem neuen Tab. |

Punkte ohne Unterpunkte öffnen in beiden Fällen ihre Seite. Ordner ohne
eigene Seite wechseln in beiden Fällen ins Untermenü.

## Felder eines Punktes (Modus „Manuell“)

| Feld | Beschreibung |
| --- | --- |
| Titel | Pflicht. Ohne Titel nennt **Übernehmen** den Punkt im Status, statt zu übernehmen. |
| Beschreibung | Optional, mehrzeilig. |
| Link · Ziel | Optional. `Kein Link`, eine Seite aus der Liste des Systems oder über „Eigene Adresse eingeben …“ eine selbst eingetragene Adresse. |
| Link · Beschriftung des Buttons | Optional. Bleibt sie leer, zeigt der Button „Seite öffnen“. |
| Icon | Optional, siehe oben. |

Über dem Panel stehen die Aktionen des Punkts: nach oben, nach unten,
duplizieren, löschen.

## Grenzen

- Ein Bild trägt höchstens **20 Punkte**. Die Statuszeile unter dem Bild
  weist beim Versuch, einen weiteren zu setzen, darauf hin, statt ihn
  stillschweigend zu verwerfen; **Neuer Punkt** und **Duplizieren** sind
  dann gesperrt.
- Ein Punkt **ohne Titel** lässt sich nicht übernehmen: **Übernehmen** nennt
  ihn im Status, links ist er als „Titel fehlt“ markiert und rechts
  geöffnet.
- **Ohne Bild oder ohne mindestens einen Punkt zeigt das Widget nichts** —
  weder auf der veröffentlichten Seite noch als leerer Rahmen. Im Modus
  „Aus dem Menü“ gilt dasselbe ohne Startpunkt.
- Im Modus „Aus dem Menü“ trägt **jede Menüebene höchstens 20 Punkte**, und
  jeder Menüpunkt hat dort höchstens einen; ein weiterer Klick ins Bild
  versetzt ihn.
- Eine Menüebene **ohne eigenes Bild** zeigt das Bild der Ebene darüber.
  Punkte lassen sich auf ihr erst setzen, wenn sie ein eigenes Bild hat.
- Ob das Widget schmal oder breit dargestellt wird, richtet sich nach seiner
  eigenen Breite (unter 600 Pixel schmal), nicht nach der des Bildschirms. Die
  Vorschau **Mobil** zeigt deshalb dieselbe schmale Darstellung wie das
  Telefon; ein Widget in einer schmalen Spalte steht auch am Desktop schmal.

## Abhängigkeiten

Ändern Sie im Panel „Menü“ Startpunkt oder Tiefe, lädt das Menü sofort neu.
Punkte, die danach keinem Eintrag mehr zugeordnet sind, stehen links als
Fehler „Nicht mehr im Menü“ unter ihrer Ebene.

Die Beschriftung des Buttons wirkt nur, wenn dem Punkt überhaupt ein Ziel
zugewiesen ist. Ohne Ziel gibt es keinen Button, und das Feld erscheint
nicht.
