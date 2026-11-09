# Instellingen

Het configuratievenster van de widget bevat negen attributen; welke daarvan
worden weergegeven, hangt af van de **modus**. „Afbeelding“ en
„Punten“ worden bewerkt in het venster dat automatisch verschijnt wanneer je de instellingen
opent; de tekstvelden daarachter zijn de technische ruwe versie en
mogen niet handmatig worden bewerkt. In de Content Designer toont „Afbeelding“
in plaats daarvan de afbeeldingsupload van de Designer — daar wordt de afbeelding direct in het
formulier geselecteerd.

| Attribuut | Label in het dialoogvenster | Beschrijving |
| --- | --- | --- |
| `image` | Afbeelding | De afbeelding waarop de punten liggen. In de klassieke editor via **Afbeelding selecteren …** in het venster uit de mediabibliotheek, in de Content Designer direct in het formulier geselecteerd. |
| `image-alt` | Alternatieve tekst | Beschrijft de afbeelding voor schermlezers; laat leeg als deze alleen ter versiering dient. Ook bewerkbaar in het venster onder „Alternatieve tekst“. |
| `source` | Modus | `Handmatig` (standaard) of `Menu`. Verbergt de velden van de andere modus; de inhoud daarvan blijft opgeslagen. |
| `points` | Punten | Alleen „Handmatig“. De lijst met punten met positie, titel, beschrijving en link. Wordt in hetzelfde venster bijgewerkt. |
| `display-mode` | Weergave | Alleen „Handmatig“. Bepaalt hoe de punten op de gepubliceerde pagina worden weergegeven. De standaardinstelling is `Genummerd, met lijst naast de afbeelding`. |
| `menu-id` | Startpunt in het menu | Alleen „Menu“. Het menu-item waarvan de subitems worden geplaatst; het item zelf kan ook worden geplaatst. Keuze uit het menu of via „Andere menu-ID invoeren …“ het adres van een pagina. |
| `menu-depth` | Niveaus | Alleen „Menu“. Hoeveel niveaus worden weergegeven, inclusief het startpunt. De standaardinstelling is 3. |
| `menu-click` | Klik op een punt | Alleen „Menu“. `Pagina openen` (standaard) of `Naast het menu weergeven`. |
| `menu-points` | Menu-items op de afbeelding | Alleen „Menu“. Waar de menu-items zich bevinden. Wordt ingesteld in het venster „Menu-items plaatsen …“. |

## Waarden van „Weergave“

| Waarde | Label in het dialoogvenster |
| --- | --- |
| `numbered` | Genummerd, met lijst naast de afbeelding |
| `dots` | Stippen, zonder lijst |

## Waarden van „Niveaus“

| Waarde | Betekenis |
| --- | --- |
| `2` | Startpunt en de bijbehorende subitems |
| `3` | plus de subitems daarvan (standaard) |
| `4` tot `6` | overeenkomstig dieper |

## Waarden van „Klik op een punt“

| Waarde | Tekst in het dialoogvenster | Effect |
| --- | --- | --- |
| `open` | Pagina openen | Het punt is een link naar de pagina van het menu-item; bestemmingen buiten de app worden in een nieuw tabblad geopend. |
| `reveal` | Naast het menu weergeven | Het menu naast de afbeelding bladert naar het menu-item en markeert het. |

Mappen zonder eigen pagina worden in beide gevallen in het menu weergegeven.

## Velden van een item (modus „Handmatig“)

| Veld | Beschrijving |
| --- | --- |
| Titel | Verplicht. Zonder titel kan het venster niet worden gesloten met „Toepassen“. |
| Beschrijving | Optioneel, meerdere regels. |
| Bestemming | Optioneel. Een pagina uit de systeemlijst of een zelf ingevoerd adres. |
| Tekst op de knop | Optioneel. Als dit veld leeg blijft, toont de knop „Pagina openen“. |

## Beperkingen

- Een afbeelding bevat maximaal **20 punten**. Het venster geeft een melding wanneer je
  probeert er nog een toe te voegen, in plaats van deze stilzwijgend te
  verwerpen.
- Een punt **zonder titel** kan niet worden overgenomen: de knop
  „Overnemen“ blijft geblokkeerd zolang ten minste één punt geen titel
  heeft, en het venster geeft het aantal betreffende punten aan.
- **Zonder afbeelding of zonder ten minste één punt toont de widget niets** —
  noch op de gepubliceerde pagina, noch als leeg kader. In de modus
  „Menu“ geldt hetzelfde zonder startpunt.
- In de modus „Menu“ bevat **elk menu-item maximaal één punt**; een
  extra klik op de afbeelding verplaatst het.

## Afhankelijkheden

Het venster „Menu-items plaatsen …“ leest het startpunt en de niveaus bij
het openen. Na een wijziging sluit u het venster en opent u het opnieuw.

De tekst op de knop werkt alleen als er überhaupt een bestemming
aan het punt is toegewezen. Zonder bestemming is er geen knop en heeft de tekst
geen effect.
