# Instellingen

De configuratiedialoog van de widget heeft drie attributen. "Afbeelding" en
"Punten" worden behouden in het venster dat verschijnt wanneer je Instellingen opent
toont zichzelf; de tekstvelden erachter zijn de technische, ruwe versie en
Mag niet met de hand worden verwerkt. 

| Attribuut | Label in dialoog | Beschrijving |
| --- | --- | --- |
| 'afbeelding' | Afbeelding | De afbeelding waarop de stippen zich bevinden. Wordt in het venster ingesteld via **Selecteer afbeelding ...** uit de mediabibliotheek. |
| 'punten' | Punten | De lijst van punten met positie, titel, beschrijving en link. Bijgehouden in hetzelfde venster. |
| 'Display-modus' | Display | Bepaalt hoe de stippen op de gepubliceerde pagina verschijnen. De standaardinstelling is 'Genummerd, met lijst naast de afbeelding'. |

## Waarden van "Representatie" 

| Waarde | Labelen in dialoog |
| --- | --- |
| 'genummerd' | Genummerd, met lijst naast de afbeelding |
| 'stippen' | Stippen, zonder lijst |

## Velden van een punt

| Veld | Beschrijving |
| --- | --- |
| Titel | Verplicht. Zonder titel kan het venster niet worden gesloten met "Solliciteren". |
| Beschrijving | Optioneel, meerlijnig. |
| Bestemming | Optioneel. Een pagina uit de systeemlijst of een zelfingevoerd adres. |
| Label van de knop | Optioneel. Als deze leeg blijft, toont de knop "Pagina openen". |

## Grenzen

- Een afbeelding heeft maximaal **20 punten**. Het venster wordt weergegeven wanneer je probeert 
  om een andere te stellen, in plaats van stilzwijgend
  Afdoen. 
- Een punt **zonder titel** kan niet worden aangenomen: de knop
  "Apply" blijft vergrendeld zolang er ten minste één punt geen titel wordt gewonnen
  en het venster geeft het aantal getroffen punten aan. 
- **Zonder afbeelding of zonder ten minste één stip toont de widget niets** — 
  noch op de gepubliceerde pagina, noch als een leeg frame. 

## Afhankelijkheid

De etikettering van de knop werkt alleen als het punt überhaupt een doel heeft.
wordt toegewezen. Zonder doel is er geen knop en blijft het label aanwezig
zonder effect.