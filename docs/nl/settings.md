# Instellingen

In het configuratievenster van de widget staat slechts één knop: **Afbeelding met punten
bewerken**. Deze opent het venster **Punten plaatsen** op volledig scherm, waarin alles
wordt ingesteld — bron van de punten, afbeelding, weergave, menu-instellingen en
punten. Het venster wordt ook automatisch geopend wanneer je de instellingen opent
. Met **Toepassen** wordt alles in één keer opgeslagen.

## Opbouw van het venster

| Gedeelte | Inhoud |
| --- | --- |
| Kop | Naam van de widget, status („Punt 2 gewijzigd“), Ongedaan maken/Opnieuw, schakelaar **Editor · Desktop · Tablet · Mobiel**, Help, **Annuleren** en **Toepassen**. |
| Links | In de modus „Handmatig“ de **punten** in hun volgorde (rood nummer, titel, doel) en **Nieuw punt**; in de modus „Vanuit het menu“ de **menuniveaus** als boomstructuur. |
| Midden | De balk met **Bron van de punten**, de afbeelding die momenteel wordt bewerkt, **Afbeelding wijzigen** en – alleen in de handmatige modus – de **Weergave**; daaronder de afbeelding voor het plaatsen en verschuiven van de punten en een statusbalk. |
| Rechts | Het geselecteerde punt. Als er geen punt is geselecteerd, wordt de **afbeelding** met de bijbehorende beschrijving weergegeven, of – in de menumodus – het paneel **Menu**. |

In **Desktop**, **Tablet** en **Mobiel** staat in het midden, in plaats van de afbeelding,
de pagina zoals lezers deze zien; links en rechts kun je verder
selecteren en instellen.

## Instellingen in het venster

| Instelling | Waar | Beschrijving |
| --- | --- | --- |
| Bron van de punten | Balk boven de afbeelding | `Handmatig` (standaard) of `Uit het menu`. De punten van de andere modus blijven opgeslagen. |
| Afbeelding | Balk, paneel „Afbeelding“ of „Menu“ | De afbeelding waarop de punten liggen, uit de mediabibliotheek — in de modus „Uit het menu“ de afbeelding van het startniveau. Daarnaast de **afbeeldingsbeschrijving** (alternatieve tekst) voor schermlezers; leeg laten als de afbeelding alleen decoratief is. |
| Weergave | Balk boven de afbeelding | Alleen „Handmatig“: `Nummers` (standaard, met lijst naast de afbeelding) of `Punten` (zonder lijst). |
| Startpunt | Paneel „Menu“ | Alleen „Uit het menu“. Het menu-item waarvan de subitems het eerste niveau vormen. Keuze uit de lijst of via „Andere menu-ID invoeren …“ het adres van een pagina. |
| Diepte | Paneel „Menu“ | Alleen „Vanuit het menu“. Hoeveel niveaus er worden weergegeven, inclusief het startpunt. Standaard zijn dit 3 niveaus. |
| Klik op een punt met subpunten | Paneel „Menu“ | Alleen „Vanuit het menu“. `Naar het submenu gaan` (standaard) of `Pagina openen`. |
| Afbeelding van het niveau | Paneel „Menu“ | Alleen „Uit het menu“. Elk niveau kan een eigen afbeelding hebben. |

Technisch gezien staat alles in het attribuut `config`. Widgets uit eerdere versies
bevatten hun instellingen nog in afzonderlijke attributen (`image`,
`image-alt`, `points`, `display-mode` …). Elke instelling wordt als volgt gelezen:
wat in `config` staat, geldt; anders het oude attribuut; anders de standaardinstelling.
Bij het openen neemt het venster over wat uit de oude velden kan worden gelezen.
Wat het niet kan lezen — in de Content Designer bijvoorbeeld keuzevelden —,
schrijft het niet naar `config`, totdat u het in het venster wijzigt; een opmerking
in het paneel vermeldt deze instellingen. Openen en toepassen zonder wijzigingen
verandert een bestaande widget daarom niet.

## Pictogram in plaats van punt

Elk punt kan in beide modi een eigen afbeelding (pictogram) uit de mediabibliotheek
bevatten; deze verschijnt dan in plaats van het rode punt, proportioneel
aangepast. In het paneel van de stip is hiervoor het gedeelte **Icoon** beschikbaar.

| Grootte | Randlengte |
| --- | --- |
| S | 32 px |
| M | 48 px (standaard) |
| L | 72 px |

Als **achtergrond** kun je kiezen uit Transparant (standaard) of een
rond vlak in wit, MAN-rood, antraciet of lichtgrijs.

Markeren, naamplaatje en klikken werken net als bij het punt. In de
genummerde modus staat het nummer dan alleen nog in de lijst.

## Waarden van „Weergave“

| Waarde | Label in het venster |
| --- | --- |
| `numbered` | Nummers (met lijst naast de afbeelding) |
| `dots` | Stippen (zonder lijst) |

## Waarden van „Diepte“

| Waarde | Betekenis |
| --- | --- |
| `2` | Startpunt en de bijbehorende subpunten |
| `3` | plus de subpunten daarvan (standaard) |
| `4` tot `6` | overeenkomstig dieper |

## Waarden van „Klik op een punt met subpunten“

| Waarde | Tekst in het venster | Effect |
| --- | --- | --- |
| `enter` | Naar het submenu gaan | De widget bladert naar het submenu: het menu toont de subitems ervan, de afbeelding verandert in de afbeelding van dat niveau. |
| `open` | Pagina openen | Het menu-item is een link naar de pagina van het menu-item; bestemmingen buiten de app worden in een nieuw tabblad geopend. |

Menu-items zonder subitems openen in beide gevallen hun pagina. Mappen zonder
eigen pagina gaan in beide gevallen naar het submenu.

## Velden van een item (modus „Handmatig“)

| Veld | Beschrijving |
| --- | --- |
| Titel | Verplicht. Zonder titel geeft **Toepassen** de status van het item weer, in plaats van het toe te passen. |
| Beschrijving | Optioneel, meerdere regels. |
| Link · Bestemming | Optioneel. `Geen link`, een pagina uit de systeemlijst of via „Eigen adres invoeren …“ een zelf ingevoerd adres. |
| Link · Tekst op de knop | Optioneel. Als dit veld leeg blijft, toont de knop „Pagina openen“. |
| Pictogram | Optioneel, zie hierboven. |

Boven het paneel staan de acties voor het item: omhoog, omlaag,
dupliceren, verwijderen.

## Beperkingen

- Een afbeelding bevat maximaal **20 punten**. De statusbalk onder de afbeelding
  geeft een melding wanneer je probeert er nog een toe te voegen, in plaats van deze
  stilletjes te negeren; **Nieuw punt** en **Dupliceren** zijn
  dan geblokkeerd.
- Een punt **zonder titel** kan niet worden overgenomen: **Overnemen** vermeldt
  dit in de status, links is het gemarkeerd als „Titel ontbreekt“ en rechts
  is het geopend.
- **Zonder afbeelding of zonder ten minste één punt toont de widget niets** —
  noch op de gepubliceerde pagina, noch als leeg kader. In de modus
  „Vanuit het menu“ geldt hetzelfde zonder startpunt.
- In de modus „Uit het menu“ bevat **elk menuniveau maximaal 20 punten**, en
  elk menu-item heeft daar maximaal één; een extra klik op de afbeelding
  verplaatst het.
- Een menuniveau **zonder eigen afbeelding** toont de afbeelding van het niveau erboven.
  Er kunnen pas punten op worden geplaatst als het een eigen afbeelding heeft.
- Of de widget smal of breed wordt weergegeven, hangt af van de
  eigen breedte (onder 600 pixels smal), niet van die van het scherm. Het
  voorbeeld **mobiel** toont daarom dezelfde smalle weergave als de
  telefoon; een widget in een smalle kolom is ook op de desktop smal.

## Afhankelijkheden

Als u in het paneel „Menu“ het startpunt of de diepte wijzigt, wordt het menu onmiddellijk opnieuw geladen.
Items die daarna niet meer aan een item zijn toegewezen, staan links als
foutmelding „Niet meer in het menu“ onder hun niveau.

De tekst op de knop werkt alleen als aan het item überhaupt een bestemming
is toegewezen. Zonder bestemming is er geen knop en verschijnt het veld
niet.
