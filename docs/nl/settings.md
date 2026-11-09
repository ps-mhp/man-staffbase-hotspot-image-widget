# Instellingen

Het configuratievenster van de widget bevat negen attributen; welke daarvan
worden weergegeven, hangt af van de **modus**. In de modus „Menu“ is „Afbeelding“ de afbeelding van het
startniveau; de afbeeldingen van lagere niveaus worden in het venster „Menu-items
plaatsen …” geselecteerd. „Afbeelding” en
„Items” worden bewerkt in het venster dat automatisch verschijnt bij het openen van de instellingen;
de tekstvelden erachter zijn de technische ruwe versie en
mogen niet handmatig worden bewerkt. In de Content Designer verwijst „Afbeelding”
daarentegen de afbeeldingsupload van de Designer weer — daar wordt de afbeelding direct in het
formulier geselecteerd.

| Attribuut | Label in het dialoogvenster | Beschrijving |
| --- | --- | --- |
| `image` | Afbeelding | De afbeelding waarop de punten liggen. In de klassieke editor via **Afbeelding selecteren …** in het venster vanuit de mediabibliotheek, in de Content Designer direct in het formulier geselecteerd. |
| `image-alt` | Alternatieve tekst | Beschrijft de afbeelding voor schermlezers; laat leeg als deze alleen decoratief is. Ook bewerkbaar in het venster onder „Alternatieve tekst“. |
| `source` | Modus | `Handmatig` (standaard) of `Menu`. Verbergt de velden van de andere modus; de inhoud daarvan blijft opgeslagen. |
| `points` | Punten | Alleen „Handmatig“. De lijst met punten met positie, titel, beschrijving en link. Wordt in hetzelfde venster bijgewerkt. |
| `display-mode` | Weergave | Alleen „Handmatig“. Bepaalt hoe de punten op de gepubliceerde pagina worden weergegeven. De standaardinstelling is `Genummerd, met lijst naast de afbeelding`. |
| `menu-id` | Startpunt in het menu | Alleen „Menu“. Het menu-item waarvan de subitems op de afbeelding worden geplaatst. Keuze uit het menu of via „Andere menu-ID invoeren …“ het adres van een pagina. |
| `menu-depth` | Niveaus | Alleen „Menu“. Hoeveel niveaus er worden weergegeven, inclusief het startpunt. Standaard is dit 3. |
| `menu-click` | Klik op een punt met subpunten | Alleen „Menu“. `Naar het submenu gaan` (standaard) of `Pagina openen`. |
| `menu-points` | Menu-items op de afbeelding | Alleen „Menu“. Per menuniveau de afbeelding en de positie van de items. Wordt onderhouden in het venster „Menu-items plaatsen …“. |

## Waarden van „Weergave“

| Waarde | Label in het dialoogvenster |
| --- | --- |
| `numbered` | Genummerd, met lijst naast de afbeelding |
| `dots` | Punten, zonder lijst |

## Waarden van „Niveaus“

| Waarde | Betekenis |
| --- | --- |
| `2` | Startpunt en de bijbehorende subitems |
| `3` | plus de bijbehorende subitems (standaard) |
| `4` tot `6` | overeenkomstig dieper |

## Waarden van „Klik op een punt met subitems“

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

- Een afbeelding bevat maximaal **20 punten**. Het venster geeft een melding wanneer je
  een extra punt probeert toe te voegen, in plaats van dit stilzwijgend te
  verwerpen.
- Een punt **zonder titel** kan niet worden opgeslagen: de knop
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

Het venster „Menu-items plaatsen …“ leest het startpunt en de niveaus bij het
openen. Na een wijziging sluit u het venster en opent u het opnieuw.

De tekst op de knop heeft alleen effect als aan het menu-item überhaupt een bestemming
is toegewezen. Zonder bestemming is er geen knop en blijft de tekst
zonder effect.
