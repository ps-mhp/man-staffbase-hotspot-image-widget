# Einstellungen

Der Konfigurationsdialog des Widgets führt drei Attribute. „Bild“ und
„Punkte“ werden im Fenster gepflegt, das sich beim Öffnen der Einstellungen
von selbst zeigt; die Textfelder dahinter sind die technische Rohfassung und
sollten nicht von Hand bearbeitet werden.

| Attribut | Beschriftung im Dialog | Beschreibung |
| --- | --- | --- |
| `image` | Bild | Das Bild, auf dem die Punkte liegen. Wird im Fenster über **Bild wählen …** aus der Mediathek gesetzt. |
| `points` | Punkte | Die Liste der Punkte mit Position, Titel, Beschreibung und Link. Wird im selben Fenster gepflegt. |
| `display-mode` | Darstellung | Steuert, wie die Punkte auf der veröffentlichten Seite erscheinen. Voreingestellt ist `Nummeriert, mit Liste neben dem Bild`. |

## Werte von „Darstellung“

| Wert | Beschriftung im Dialog |
| --- | --- |
| `numbered` | Nummeriert, mit Liste neben dem Bild |
| `dots` | Punkte, ohne Liste |

## Felder eines Punktes

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
  weder auf der veröffentlichten Seite noch als leerer Rahmen.

## Abhängigkeit

Die Beschriftung des Buttons wirkt nur, wenn dem Punkt überhaupt ein Ziel
zugewiesen ist. Ohne Ziel gibt es keinen Button, und die Beschriftung bleibt
ohne Wirkung.
