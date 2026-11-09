# Einstellungen

Der Konfigurationsdialog des Widgets führt neun Attribute; welche davon zu
sehen sind, hängt vom **Modus** ab. „Bild“ und
„Punkte“ werden im Fenster gepflegt, das sich beim Öffnen der Einstellungen
von selbst zeigt; die Textfelder dahinter sind die technische Rohfassung und
sollten nicht von Hand bearbeitet werden. Im Content Designer zeigt „Bild“
stattdessen den Bild-Upload des Designers — dort wird das Bild direkt im
Formular gewählt.

| Attribut | Beschriftung im Dialog | Beschreibung |
| --- | --- | --- |
| `image` | Bild | Das Bild, auf dem die Punkte liegen. Im klassischen Editor über **Bild wählen …** im Fenster aus der Mediathek, im Content Designer direkt im Formular gewählt. |
| `image-alt` | Alternativtext | Beschreibt das Bild für Screenreader; leer lassen, wenn es nur schmückt. Auch im Fenster unter „Alternativtext“ bearbeitbar. |
| `source` | Modus | `Manuell` (voreingestellt) oder `Menü`. Blendet die Felder des jeweils anderen Modus aus; deren Inhalte bleiben gespeichert. |
| `points` | Punkte | Nur „Manuell“. Die Liste der Punkte mit Position, Titel, Beschreibung und Link. Wird im selben Fenster gepflegt. |
| `display-mode` | Darstellung | Nur „Manuell“. Steuert, wie die Punkte auf der veröffentlichten Seite erscheinen. Voreingestellt ist `Nummeriert, mit Liste neben dem Bild`. |
| `menu-id` | Startpunkt im Menü | Nur „Menü“. Der Menüpunkt, dessen Unterpunkte platziert werden; er selbst lässt sich ebenfalls platzieren. Auswahl aus dem Menü oder über „Andere Menü-ID eingeben …“ die Adresse einer Seite. |
| `menu-depth` | Ebenen | Nur „Menü“. Wie viele Ebenen erscheinen, der Startpunkt mitgezählt. Voreingestellt sind 3. |
| `menu-click` | Klick auf einen Punkt | Nur „Menü“. `Seite öffnen` (voreingestellt) oder `Im Menü daneben zeigen`. |
| `menu-points` | Menüpunkte auf dem Bild | Nur „Menü“. Wo die Menüpunkte liegen. Wird im Fenster „Menüpunkte platzieren …“ gepflegt. |

## Werte von „Darstellung“

| Wert | Beschriftung im Dialog |
| --- | --- |
| `numbered` | Nummeriert, mit Liste neben dem Bild |
| `dots` | Punkte, ohne Liste |

## Werte von „Ebenen“

| Wert | Bedeutung |
| --- | --- |
| `2` | Startpunkt und seine Unterpunkte |
| `3` | dazu deren Unterpunkte (voreingestellt) |
| `4` bis `6` | entsprechend tiefer |

## Werte von „Klick auf einen Punkt“

| Wert | Beschriftung im Dialog | Wirkung |
| --- | --- | --- |
| `open` | Seite öffnen | Der Punkt ist ein Link auf die Seite des Menüpunkts; Ziele außerhalb der App öffnen in einem neuen Tab. |
| `reveal` | Im Menü daneben zeigen | Das Menü neben dem Bild blättert zum Menüpunkt und markiert ihn. |

Ordner ohne eigene Seite werden in beiden Fällen im Menü gezeigt.

## Felder eines Punktes (Modus „Manuell“)

| Feld | Beschreibung |
| --- | --- |
| Titel | Pflicht. Ohne Titel lässt sich das Fenster nicht mit „Übernehmen“ schließen. |
| Beschreibung | Optional, mehrzeilig. |
| Ziel | Optional. Eine Seite aus der Liste des Systems oder eine selbst eingetragene Adresse. |
| Beschriftung des Buttons | Optional. Bleibt sie leer, zeigt der Button „Seite öffnen“. |

## Grenzen

- Ein Bild trägt höchstens **20 Punkte**. Das Fenster weist beim Versuch,
  einen weiteren zu setzen, darauf hin, statt ihn stillschweigend zu
  verwerfen.
- Ein Punkt **ohne Titel** lässt sich nicht übernehmen: der Button
  „Übernehmen“ bleibt gesperrt, solange mindestens ein Punkt keinen Titel
  trägt, und das Fenster nennt die Zahl der betroffenen Punkte.
- **Ohne Bild oder ohne mindestens einen Punkt zeigt das Widget nichts** —
  weder auf der veröffentlichten Seite noch als leerer Rahmen. Im Modus
  „Menü“ gilt dasselbe ohne Startpunkt.
- Im Modus „Menü“ trägt **jeder Menüpunkt höchstens einen Punkt**; ein
  weiterer Klick ins Bild versetzt ihn.

## Abhängigkeiten

Startpunkt und Ebenen liest das Fenster „Menüpunkte platzieren …“ beim
Öffnen. Nach einer Änderung schließen Sie das Fenster und öffnen es neu.

Die Beschriftung des Buttons wirkt nur, wenn dem Punkt überhaupt ein Ziel
zugewiesen ist. Ohne Ziel gibt es keinen Button, und die Beschriftung bleibt
ohne Wirkung.
