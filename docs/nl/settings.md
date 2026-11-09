# Instellingen

In het configuratievenster van de widget staat slechts één knop: **Afbeelding met punten
bewerken …**. Deze opent het venster waarin alles wordt ingesteld — modus,
afbeelding, weergave, menu-instellingen en punten. Het venster wordt
ook automatisch geopend wanneer je de instellingen opent. Met **Toepassen** wordt alles
samen in één veld opgeslagen.

| Instelling in het venster | Beschrijving |
| --- | --- |
| Modus | `Handmatig` (standaard) of `Menu`. De punten van de andere modus blijven opgeslagen. |
| Afbeelding | De afbeelding uit de mediabibliotheek waarop de items staan — in de modus „Menu“ de afbeelding van het startniveau. Daarnaast de **alternatieve tekst** voor schermlezers; laat leeg als de afbeelding alleen decoratief is. |
| Weergave | Alleen „Handmatig“. De standaardinstelling is `Genummerd, met lijst naast de afbeelding`. |
| Startpunt in het menu | Alleen „Menu“. Het menu-item waarvan de subitems worden geplaatst. Keuze uit de lijst of via „Andere menu-ID invoeren …“ het adres van een pagina. |
| Niveaus | Alleen „Menu“. Hoeveel niveaus er worden weergegeven, inclusief het startpunt. Standaard is dit 3. |
| Klik op een punt met subpunten | Alleen „Menu“. `Naar het submenu gaan` (standaard) of `Pagina openen`. |
| Niveau | Alleen „Menu“. Welk menuniveau momenteel wordt bewerkt; elk niveau heeft zijn eigen afbeelding en zijn eigen punten. |

Technisch gezien staat alles in het attribuut `config`. Widgets uit eerdere versies
behouden hun instellingen nog in afzonderlijke attributen (`image`,
`image-alt`, `points`, `display-mode` …). Zolang `config` leeg is, gelden
deze; bij de eerste **Toepassen** in het venster worden ze verplaatst naar `config`.

## Afbeelding in plaats van punt

Elk punt kan in beide modi een eigen afbeelding uit de mediabibliotheek bevatten;
deze verschijnt dan in plaats van het rode punt, proportioneel aangepast.

| Grootte | Randlengte |
| --- | --- |
| S | 32 px |
| M | 48 px (standaard) |
| L | 72 px |

Markeren, naamplaatje en klikken werken net als bij de stip. In de
genummerde modus staat het nummer dan alleen nog in de lijst.

## Waarden van „Weergave“

| Waarde | Label in het dialoogvenster |
| --- | --- |
| `numbered` | Genummerd, met lijst naast de afbeelding |
| `dots` | Stippen, zonder lijst |

## Waarden van „Lagen“

| Waarde | Betekenis |
| --- | --- |
| `2` | Startpunt en de bijbehorende subpunten |
| `3` | plus de bijbehorende subpunten (standaard) |
| `4` tot `6` | overeenkomstig dieper |

## Waarden van „Klik op een punt met subpunten“

| Waarde | Tekst in het dialoogvenster | Effect |
| --- | --- | --- |
| `enter` | Naar het submenu gaan | De widget bladert naar het submenu: het menu toont de subitems ervan, de afbeelding verandert in de afbeelding van dit niveau. |
| `open` | Pagina openen | Het menu-item is een link naar de pagina van het menu-item; bestemmingen buiten de app worden in een nieuw tabblad geopend. |

Menu-items zonder subitems openen in beide gevallen hun pagina. Mappen zonder
eigen pagina gaan in beide gevallen naar het submenu.

## Velden van een item (modus „Handmatig“)

| Veld | Beschrijving |
| --- | --- |
| Titel | Verplicht. Zonder titel kan het venster niet worden gesloten met „Toepassen“. |
| Beschrijving | Optioneel, meerdere regels. |
| Bestemming | Optioneel. Een pagina uit de lijst van het systeem of een zelf ingevoerd adres. |
| Tekst op de knop | Optioneel. Als dit veld leeg blijft, toont de knop „Pagina openen“. |

## Beperkingen

- Een afbeelding bevat maximaal **20 punten**. Het venster geeft een melding wanneer wordt geprobeerd
  er nog een toe te voegen, in plaats van deze stilzwijgend te
  verwerpen.
- Een punt **zonder titel** kan niet worden overgenomen: de knop
  „Toepassen“ blijft geblokkeerd zolang ten minste één punt geen titel
  heeft, en het venster geeft het aantal betreffende punten aan.
- **Zonder afbeelding of zonder ten minste één punt toont de widget niets** —
  noch op de gepubliceerde pagina, noch als leeg kader. In de modus
  „Menu“ geldt hetzelfde, maar dan zonder startpunt.
- In de modus „Menu“ bevat **elk menuniveau maximaal 20 punten**, en elk
  menu-item heeft daar maximaal één; een extra klik op de afbeelding verplaatst
  het.
- Een menuniveau **zonder eigen afbeelding** toont de afbeelding van het niveau erboven.
  Er kunnen pas punten op worden geplaatst als het een eigen afbeelding heeft.

## Afhankelijkheden

Als u wijzigingen aanbrengt in het venster „Startpunt“ of „Niveaus“, wordt het menu onmiddellijk opnieuw geladen.
Punten die daarna niet meer aan een item zijn toegewezen, staan onder
„Niet meer in het menu“.

De tekst op de knop werkt alleen als er überhaupt een bestemming
aan het punt is toegewezen. Zonder bestemming is er geen knop en blijft de tekst
zonder effect.
