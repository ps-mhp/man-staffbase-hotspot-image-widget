# Paramètres

La boîte de dialogue de configuration du widget comporte neuf attributs ; ceux qui
sont affichés dépendent du **mode**. « Image » et
« Points » sont gérés dans la fenêtre qui s'affiche automatiquement à l'ouverture des paramètres
; les champs de texte situés derrière correspondent à la version brute technique et
ne doivent pas être modifiés manuellement. Dans le Content Designer, « Image »
affiche à la place la fonction de téléchargement d’image du Designer — l’image y est sélectionnée directement dans le
formulaire.

| Attribut | Libellé dans la boîte de dialogue | Description |
| --- | --- | --- |
| `image` | Image | L’image sur laquelle se trouvent les points. Dans l’éditeur classique, sélectionnez-la via **Sélectionner une image…** dans la fenêtre à partir de la médiathèque ; dans le Content Designer, elle est sélectionnée directement dans le formulaire. |
| `image-alt` | Texte alternatif | Décrit l’image pour les lecteurs d’écran ; laisser vide si elle est purement décorative. Peut également être modifié dans la fenêtre sous « Texte alternatif ». |
| `source` | Mode | `Manuel` (par défaut) ou `Menu`. Masque les champs de l’autre mode ; leur contenu reste enregistré. |
| `points` | Points | « Manuel » uniquement. Liste des points avec position, titre, description et lien. À gérer dans la même fenêtre. |
| `display-mode` | Affichage | « Manuel » uniquement. Détermine la manière dont les éléments apparaissent sur la page publiée. La valeur par défaut est `Numéroté, avec liste à côté de l’image`. |
| `menu-id` | Point de départ dans le menu | « Menu » uniquement. L'élément de menu dont les sous-éléments sont placés ; il peut lui-même être placé. Sélection dans le menu ou, via « Saisir un autre ID de menu… », l'adresse d'une page. |
| `menu-depth` | Niveaux | Uniquement « Menu ». Nombre de niveaux affichés, point de départ compris. La valeur par défaut est 3. |
| `menu-click` | Clic sur un élément | « Menu » uniquement. `Ouvrir la page` (par défaut) ou `Afficher à côté dans le menu`. |
| `menu-points` | Éléments de menu sur l’image | « Menu » uniquement. Emplacement des éléments du menu. À définir dans la fenêtre « Placer les éléments du menu… ». |

## Valeurs de « Affichage »

| Valeur | Libellé dans la boîte de dialogue |
| --- | --- |
| `numbered` | Numéroté, avec une liste à côté de l’image |
| `dots` | Points, sans liste |

## Valeurs de « Niveaux »

| Valeur | Signification |
| --- | --- |
| `2` | Point de départ et ses sous-éléments |
| `3` | ainsi que leurs sous-éléments (par défaut) |
| `4` à `6` | Niveaux inférieurs correspondants |

## Valeurs de « Clic sur un élément »

| Valeur | Libellé dans la boîte de dialogue | Effet |
| --- | --- | --- |
| `open` | Ouvrir la page | Le point est un lien vers la page de l'élément de menu ; les destinations situées en dehors de l'application s'ouvrent dans un nouvel onglet. |
| `reveal` | Afficher à côté dans le menu | Le menu situé à côté de l'image se déplace jusqu'à l'élément de menu et le met en surbrillance. |

Les dossiers ne disposant pas de page propre s’affichent dans le menu dans les deux cas.

## Champs d’un élément (mode « Manuel »)

| Champ | Description |
| --- | --- |
| Titre | Obligatoire. Sans titre, la fenêtre ne peut pas être fermée avec « Valider ». |
| Description | Facultatif, sur plusieurs lignes. |
| Destination | Facultatif. Une page issue de la liste du système ou une adresse saisie manuellement. |
| Libellé du bouton | Facultatif. S’il reste vide, le bouton affiche « Ouvrir la page ». |

## Contraintes

- Une image comporte au maximum **20 points**. Si vous essayez d’en
  ajouter un autre, la fenêtre vous en informe au lieu de le
  rejeter tacitement.
- Un point **sans titre** ne peut pas être enregistré : le bouton
  « Enregistrer » reste désactivé tant qu’au moins un point n’a pas de titre
  et la fenêtre indique le nombre de points concernés.
- **Sans image ou sans au moins un point, le widget n’affiche rien** —
  ni sur la page publiée, ni sous forme de cadre vide. En mode
  « Menu », il en va de même en l’absence de point de départ.
- En mode « Menu », **chaque élément de menu ne peut comporter qu’un seul point au maximum** ; un
  clic supplémentaire sur l’image le déplace.

## Dépendances

La fenêtre « Placer les éléments de menu… » lit le point de départ et les niveaux à son
ouverture. Après une modification, fermez la fenêtre puis rouvrez-la.

Le libellé du bouton n’a d’effet que si une destination est effectivement
attribuée au point. Sans destination, il n’y a pas de bouton et le libellé reste
sans effet.
