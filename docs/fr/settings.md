# Paramètres

La boîte de dialogue de configuration du widget ne comporte qu’un seul bouton : **Modifier l’image avec des points
**. Il ouvre la fenêtre plein écran **Définir les points**, dans laquelle tout
est géré : source des points, image, affichage, paramètres du menu et
points. Cette fenêtre s’ouvre également automatiquement
lorsque vous accédez aux paramètres. **Appliquer** enregistre l’ensemble des modifications dans un seul champ.

## Structure de la fenêtre

| Zone | Contenu |
| --- | --- |
| En-tête | Nom du widget, état (« Point 2 modifié »), Annuler/Rétablir, bouton de basculement **Éditeur · Bureau · Tablette · Mobile**, Aide, **Annuler** et **Appliquer**. |
| À gauche | En mode « Manuel », les **points** dans leur ordre (numéro en rouge, titre, destination) et **Nouveau point** ; en mode « À partir du menu », les **niveaux de menu** sous forme d’arborescence. |
| Centre | La barre avec la **source des points**, l’image en cours d’édition, **Modifier l’image** et – en mode manuel uniquement – l’**affichage** ; en dessous, l’image permettant de placer et de déplacer les points, ainsi qu’une barre d’état. |
| À droite | Le point sélectionné. Si aucun n’est sélectionné, l’**image** avec sa description ou, en mode « Menu », le panneau **Menu**. |

En modes **Bureau**, **Tablette** et **Mobile**, au centre, à la place de l’image,
s’affiche la page telle que les lecteurs la voient ; à gauche et à droite, il est possible de poursuivre
la sélection et les réglages.

## Paramètres dans la fenêtre

| Paramètre | Où | Description |
| --- | --- | --- |
| Source des points | Barre au-dessus de l’image | `Manuel` (par défaut) ou `Depuis le menu`. Les points de l’autre mode restent enregistrés. |
| Image | Barre, panneau « Image » ou « Menu » | L’image sur laquelle se trouvent les points, issue de la médiathèque — en mode « À partir du menu », l’image du niveau de départ. À cela s’ajoute la **description de l’image** (texte alternatif) pour les lecteurs d’écran ; à laisser vide si l’image est purement décorative. |
| Affichage | Barre au-dessus de l’image | Uniquement « Manuel » : `Numéros` (par défaut, avec une liste à côté de l’image) ou `Points` (sans liste). |
| Point de départ | Panneau « Menu » | Uniquement « À partir du menu ». L’élément de menu dont les sous-éléments constituent le premier niveau. Sélection dans la liste ou, via « Saisir un autre ID de menu… », l’adresse d’une page. |
| Profondeur | Panneau « Menu » | Uniquement « À partir du menu ». Nombre de niveaux affichés, point de départ compris. La valeur par défaut est de 3 niveaux. |
| Clic sur un élément comportant des sous-éléments | Panneau « Menu » | Uniquement « À partir du menu ». `Aller dans le sous-menu` (par défaut) ou `Ouvrir la page`. |
| Image du niveau | Panneau « Menu » | Uniquement « À partir du menu ». Chaque niveau peut avoir sa propre image. |

Techniquement, tout se trouve dans l’attribut `config`. Les widgets des versions antérieures
conservent leurs paramètres dans des attributs individuels (`image`,
`image-alt`, `points`, `display-mode` …). L’ordre de priorité est le suivant :
ce qui figure dans `config` s’applique ; sinon, l’ancien attribut ; sinon, la valeur par défaut.
À l’ouverture, la fenêtre reprend ce qu’elle peut lire à partir des anciens champs.
Ce qu’elle ne peut pas lire — dans le Content Designer, par exemple les champs de sélection —,
elle ne l’écrit pas dans `config` tant que vous ne l’avez pas modifié dans la fenêtre ; une remarque
dans le panneau indique ces paramètres. Ouvrir et appliquer sans modification
ne modifie donc pas un widget existant.

## Une icône à la place d’un point

Dans les deux modes, chaque point peut comporter sa propre image (icône) issue de la médiathèque ;
celle-ci apparaît alors à la place du point rouge, redimensionnée
proportionnellement. Dans le panneau du point, la section **Icône** est prévue à cet effet.

| Taille | Longueur des bords |
| --- | --- |
| S | 32 px |
| M | 48 px (par défaut) |
| L | 72 px |

Pour le **fond**, vous pouvez choisir entre la transparence (par défaut) ou une
surface ronde en blanc, rouge MAN, anthracite ou gris clair.

La mise en évidence, le libellé et le clic fonctionnent comme pour le point. En
mode numéroté, le numéro n’apparaît alors plus que dans la liste.

## Valeurs de « Affichage »

| Valeur | Libellé dans la fenêtre |
| --- | --- |
| `numbered` | Numéros (avec liste à côté de l'image) |
| `dots` | Points (sans liste) |

## Valeurs de « Profondeur »

| Valeur | Signification |
| --- | --- |
| `2` | Point de départ et ses sous-éléments |
| `3` | ainsi que leurs sous-éléments (par défaut) |
| `4` à `6` | niveaux inférieurs correspondants |

## Valeurs de « Clic sur un point avec des sous-éléments »

| Valeur | Libellé dans la fenêtre | Effet |
| --- | --- | --- |
| `enter` | Accéder au sous-menu | Le widget fait défiler le sous-menu : le menu affiche ses sous-éléments, l'image passe à celle de ce niveau. |
| `open` | Ouvrir la page | L'élément est un lien vers la page correspondante ; les destinations situées en dehors de l'application s'ouvrent dans un nouvel onglet. |

Les éléments sans sous-éléments ouvrent leur page dans les deux cas. Les dossiers sans
page propre accèdent au sous-menu dans les deux cas.

## Champs d’un élément (mode « Manuel »)

| Champ | Description |
| --- | --- |
| Titre | Obligatoire. Sans titre, **Appliquer** affiche l’élément dans l’historique au lieu de l’appliquer. |
| Description | Facultatif, multiligne. |
| Lien · Destination | Facultatif. `Pas de lien`, une page issue de la liste du système ou une adresse saisie manuellement via « Saisir sa propre adresse… ». |
| Lien · Libellé du bouton | Facultatif. Si ce champ reste vide, le bouton affiche « Ouvrir la page ». |
| Icône | Facultatif, voir ci-dessus. |

Au-dessus du panneau se trouvent les actions relatives à l’élément : remonter, descendre,
dupliquer, supprimer.

## Limites

- Une image peut contenir au maximum **20 points**. La barre d’état sous l’image
  signale cette limite lorsque l’on tente d’en ajouter un autre, au lieu de le
  rejeter tacitement ; les options **Nouveau point** et **Dupliquer** sont
  alors désactivées.
- Un point **sans titre** ne peut pas être validé : **Valider** l’indique
  dans l’état ; à gauche, il est marqué « Titre manquant » et à droite,
  il est ouvert.
- **Sans image ou sans au moins un élément, le widget n’affiche rien** —
  ni sur la page publiée, ni sous forme de cadre vide. En mode
  « À partir du menu », il en va de même sans élément de départ.
- En mode « À partir du menu », **chaque niveau de menu contient au maximum 20 éléments**, et
  chaque élément de menu n’en contient qu’un seul ; un clic supplémentaire sur l’image
  le déplace.
- Un niveau de menu **sans image propre** affiche l’image du niveau supérieur.
  On ne peut y placer des points que si elle possède sa propre image.
- L’affichage du widget en mode étroit ou large dépend de sa
  propre largeur (étroit en dessous de 600 pixels), et non de celle de l’écran. L’
  aperçu **Mobile** affiche donc le même affichage étroit que le
  téléphone ; un widget placé dans une colonne étroite reste également étroit sur le bureau.

## Dépendances

Si vous modifiez le point de départ ou la profondeur dans le panneau « Menu », le menu se recharge immédiatement.
Les éléments qui ne sont plus associés à aucune entrée apparaissent alors à gauche sous la forme d’une
erreur « Plus dans le menu » sous leur niveau.

Le libellé du bouton n’apparaît que si une destination
est attribuée à l’élément. Sans destination, il n’y a pas de bouton et le champ n’apparaît
pas.
