# Paramètres

Dans la boîte de dialogue de configuration du widget, il n'y a qu'un seul bouton : **Modifier l'image avec des points
…**. Il ouvre la fenêtre dans laquelle tout est géré : mode,
image, affichage, paramètres du menu et points. Cette fenêtre s’ouvre
automatiquement lorsque vous accédez aux paramètres. Le bouton **Appliquer** enregistre l’ensemble des
paramètres dans un seul champ.

| Paramètre dans la fenêtre | Description |
| --- | --- |
| Mode | `Manuel` (par défaut) ou `Menu`. Les points de l’autre mode restent enregistrés. |
| Image | L’image sur laquelle se trouvent les éléments, issue de la médiathèque — en mode « Menu », l’image du niveau de départ. Ajoutez également le **texte alternatif** pour les lecteurs d’écran ; laissez ce champ vide si l’image est purement décorative. |
| Affichage | Uniquement « Manuel ». La valeur par défaut est `Numéroté, avec une liste à côté de l’image`. |
| Point de départ dans le menu | Uniquement « Menu ». L’élément de menu dont les sous-éléments seront placés. Sélection dans la liste ou, via « Saisir un autre ID de menu… », l’adresse d’une page. |
| Niveaux | Uniquement « Menu ». Nombre de niveaux affichés, point de départ compris. La valeur par défaut est 3. |
| Clic sur un élément comportant des sous-éléments | Uniquement « Menu ». `Accéder au sous-menu` (par défaut) ou `Ouvrir la page`. |
| Niveau | « Menu » uniquement. Le niveau de menu en cours d’édition ; chacun possède sa propre image et ses propres éléments. |

Techniquement, tout se trouve dans l’attribut `config`. Les widgets des versions antérieures
conservent encore leurs paramètres dans des attributs individuels (`image`,
`image-alt`, `points`, `display-mode` …). Tant que `config` est vide, ce sont
ces paramètres qui s’appliquent ; lors du premier **clic sur « Appliquer »** dans la fenêtre, ils sont transférés vers `config`.

## Image à la place d’un point

Dans les deux modes, chaque point peut afficher sa propre image issue de la médiathèque ;
celle-ci apparaît alors à la place du point rouge, redimensionnée proportionnellement.

| Taille | Longueur des côtés |
| --- | --- |
| S | 32 px |
| M | 48 px (par défaut) |
| L | 72 px |

La mise en évidence, l’étiquette de nom et le clic fonctionnent comme pour le point. En
mode numéroté, le numéro n’apparaît alors plus que dans la liste.

## Valeurs de « Affichage »

| Valeur | Libellé dans la boîte de dialogue |
| --- | --- |
| `numbered` | Numéroté, avec une liste à côté de l’image |
| `dots` | Points, sans liste |

## Valeurs de « Niveaux »

| Valeur | Signification |
| --- | --- |
| `2` | Point de départ et ses sous-points |
| `3` | ainsi que leurs sous-points (par défaut) |
| `4` à `6` | niveaux inférieurs correspondants |

## Valeurs de « Clic sur un point avec des sous-points »

| Valeur | Libellé dans la boîte de dialogue | Effet |
| --- | --- | --- |
| `enter` | Accéder au sous-menu | Le widget fait défiler le sous-menu : le menu affiche ses sous-éléments, l’image passe à celle de ce niveau. |
| `open` | Ouvrir la page | L'élément est un lien vers la page de l'élément de menu ; les destinations situées en dehors de l'application s'ouvrent dans un nouvel onglet. |

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
  On ne peut y placer des éléments que s’il dispose d’une image propre.

## Dépendances

Si vous effectuez des modifications dans la fenêtre « Point de départ » ou « Niveaux », le menu se recharge immédiatement.
Les points qui ne sont plus affectés à aucune entrée apparaissent alors sous
« N'apparaît plus dans le menu ».

Le libellé du bouton n'a d'effet que si une destination
est attribuée au point. Sans destination, il n'y a pas de bouton et le libellé reste
sans effet.
