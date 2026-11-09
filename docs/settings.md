# Einstellungen

Im Konfigurationsdialog des Widgets steht nur ein Knopf: **Bild mit Punkten
bearbeiten …**. Er öffnet das Fenster, in dem alles gepflegt wird — Modus,
Bild, Darstellung, Menü-Einstellungen und Punkte. Das Fenster öffnet sich
beim Öffnen der Einstellungen auch von selbst. **Übernehmen** speichert alles
zusammen in einem Feld.

| Einstellung im Fenster | Beschreibung |
| --- | --- |
| Modus | `Manuell` (voreingestellt) oder `Menü`. Die Punkte des jeweils anderen Modus bleiben gespeichert. |
| Bild | Das Bild, auf dem die Punkte liegen, aus der Mediathek — im Modus „Menü“ das Bild der Startebene. Dazu der **Alternativtext** für Screenreader; leer lassen, wenn das Bild nur schmückt. |
| Darstellung | Nur „Manuell“. Voreingestellt ist `Nummeriert, mit Liste neben dem Bild`. |
| Startpunkt im Menü | Nur „Menü“. Der Menüpunkt, dessen Unterpunkte platziert werden. Auswahl aus der Liste oder über „Andere Menü-ID eingeben …“ die Adresse einer Seite. |
| Ebenen | Nur „Menü“. Wie viele Ebenen erscheinen, der Startpunkt mitgezählt. Voreingestellt sind 3. |
| Klick auf einen Punkt mit Unterpunkten | Nur „Menü“. `Ins Untermenü wechseln` (voreingestellt) oder `Seite öffnen`. |
| Ebene | Nur „Menü“. Welche Menüebene gerade bearbeitet wird; jede hat ihr eigenes Bild und ihre eigenen Punkte. |

Technisch steht alles im Attribut `config`. Widgets aus früheren Fassungen
tragen ihre Einstellungen noch in einzelnen Attributen (`image`,
`image-alt`, `points`, `display-mode` …). Solange `config` leer ist, gelten
diese; beim ersten **Übernehmen** im Fenster wandern sie nach `config`.

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

## Werte von „Klick auf einen Punkt mit Unterpunkten“

| Wert | Beschriftung im Dialog | Wirkung |
| --- | --- | --- |
| `enter` | Ins Untermenü wechseln | Das Widget blättert in das Untermenü: das Menü zeigt dessen Unterpunkte, das Bild wechselt auf das Bild dieser Ebene. |
| `open` | Seite öffnen | Der Punkt ist ein Link auf die Seite des Menüpunkts; Ziele außerhalb der App öffnen in einem neuen Tab. |

Punkte ohne Unterpunkte öffnen in beiden Fällen ihre Seite. Ordner ohne
eigene Seite wechseln in beiden Fällen ins Untermenü.

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
- Im Modus „Menü“ trägt **jede Menüebene höchstens 20 Punkte**, und jeder
  Menüpunkt hat dort höchstens einen; ein weiterer Klick ins Bild versetzt
  ihn.
- Eine Menüebene **ohne eigenes Bild** zeigt das Bild der Ebene darüber.
  Punkte lassen sich auf ihr erst setzen, wenn sie ein eigenes Bild hat.

## Abhängigkeiten

Ändern Sie im Fenster Startpunkt oder Ebenen, lädt das Menü sofort neu.
Punkte, die danach keinem Eintrag mehr zugeordnet sind, stehen unter
„Nicht mehr im Menü“.

Die Beschriftung des Buttons wirkt nur, wenn dem Punkt überhaupt ein Ziel
zugewiesen ist. Ohne Ziel gibt es keinen Button, und die Beschriftung bleibt
ohne Wirkung.
