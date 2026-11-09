# Paramètres

La boîte de dialogue de configuration du widget comporte neuf attributs ; ceux qui
sont affichés dépendent du **mode**. En mode « Menu », « Image » correspond à l’image du
niveau de départ ; les images des niveaux inférieurs sont sélectionnées dans la fenêtre « Placer les éléments de menu
… ». « Image » et
« Options » sont gérés dans la fenêtre qui s’affiche automatiquement à l’ouverture des paramètres
; les champs de texte situés derrière correspondent à la version brute technique et
ne doivent pas être modifiés manuellement. Dans le Content Designer, « Image »
affiche en revanche le téléchargement d’image du Designer — l’image y est sélectionnée directement dans le
formulaire.

| Attribut | Libellé dans la boîte de dialogue | Description |
| --- | --- | --- |
| `image` | Image | L’image sur laquelle se trouvent les points. Dans l’éditeur classique, via **Sélectionner une image…** dans la fenêtre à partir de la médiathèque ; dans le Content Designer, sélectionnée directement dans le formulaire. |
| `image-alt` | Texte alternatif | Décrit l’image pour les lecteurs d’écran ; laisser vide si elle est uniquement décorative. Peut également être modifié dans la fenêtre sous « Texte alternatif ». |
| `source` | Mode | `Manuel` (par défaut) ou `Menu`. Masque les champs de l’autre mode ; leur contenu reste enregistré. |
| `points` | Points | « Manuel » uniquement. Liste des points avec leur position, leur titre, leur description et leur lien. À gérer dans la même fenêtre. |
| `display-mode` | Affichage | Uniquement « Manuel ». Détermine la manière dont les points apparaissent sur la page publiée. La valeur par défaut est `Numéroté, avec liste à côté de l’image`. |
| `menu-id` | Point de départ dans le menu | « Menu » uniquement. L'élément de menu dont les sous-éléments seront placés sur l'image. Sélection dans le menu ou, via « Saisir un autre ID de menu… », l'adresse d'une page. |
| `menu-depth` | Niveaux | « Menu » uniquement. Nombre de niveaux affichés, point de départ compris. La valeur par défaut est 3. |
| `menu-click` | Clic sur un élément comportant des sous-éléments | Uniquement « Menu ». `Accéder au sous-menu` (par défaut) ou `Ouvrir la page`. |
| `menu-points` | Éléments de menu sur l’image | « Menu » uniquement. Pour chaque niveau de menu, l’image et la position des éléments. À définir dans la fenêtre « Placer les éléments de menu… ». |

## Valeurs de « Affichage »

| Valeur | Libellé dans la boîte de dialogue |
| --- | --- |
| `numbered` | Numéroté, avec une liste à côté de l'image |
| `dots` | Points, sans liste |

## Valeurs de « Niveaux »

| Valeur | Signification |
| --- | --- |
| `2` | Point de départ et ses sous-éléments |
| `3` | ainsi que leurs sous-éléments (par défaut) |
| `4` à `6` | niveaux inférieurs correspondants |

## Valeurs de « Clic sur un point comportant des sous-éléments »

| Valeur | Libellé dans la boîte de dialogue | Effet |
| --- | --- | --- |
| `enter` | Accéder au sous-menu | Le widget fait défiler le sous-menu : le menu affiche ses sous-éléments, l'image passe à celle de ce niveau. |
| `open` | Ouvrir la page | L’élément est un lien vers la page de l’élément de menu ; les destinations situées en dehors de l’application s’ouvrent dans un nouvel onglet. |

Les éléments sans sous-éléments ouvrent leur page dans les deux cas. Les dossiers sans
page propre accèdent au sous-menu dans les deux cas.

## Champs d’un élément (mode « Manuel »)

| Champ | Description |
| --- | --- |
| Titre | Obligatoire. Sans titre, la fenêtre ne peut pas être fermée avec « Appliquer ». |
| Description | Facultatif, multiligne. |
| Destination | Facultatif. Une page issue de la liste du système ou une adresse saisie manuellement. |
| Libellé du bouton | Facultatif. S’il reste vide, le bouton affiche « Ouvrir la page ». |

## Contraintes

- Une image comporte au maximum **20 points**. Si vous essayez d’en
  ajouter un autre, la fenêtre vous en informe au lieu de le
  rejeter tacitement.
- Un point **sans titre** ne peut pas être validé : le bouton
  « Valider » reste verrouillé tant qu’au moins un point n’a pas de titre
  et la fenêtre indique le nombre de points concernés.
- **Sans image ou sans au moins un point, le widget n’affiche rien** —
  ni sur la page publiée, ni sous forme de cadre vide. En mode
  « Menu », il en va de même sans point de départ.
- En mode « Menu », **chaque niveau de menu comporte au maximum 20 éléments**, et chaque
  élément de menu n’en comporte qu’un seul ; un clic supplémentaire sur l’image le déplace
  .
- Un niveau de menu **sans image propre** affiche l’image du niveau supérieur.
  On ne peut y placer des éléments que s’il dispose de sa propre image.

## Dépendances

La fenêtre « Placer les éléments de menu… » lit le point de départ et les niveaux à son
ouverture. Après une modification, fermez la fenêtre puis rouvrez-la.

Le libellé du bouton n’a d’effet que si une destination
est attribuée à l’élément. Sans destination, il n’y a pas de bouton et le libellé reste
sans effet.
