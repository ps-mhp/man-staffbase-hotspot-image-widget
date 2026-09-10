# Décors

La boîte de configuration du widget comporte trois attributs. « Image » et
Les « points » sont maintenus dans la fenêtre qui apparaît lorsque vous ouvrez les paramètres
s’affiche lui-même ; les champs de texte derrière sont la version technique approximative et
Il ne faut pas le traiter à la main. 

| Attribut | Étiquette dans la boîte de dialogue | Description |
| --- | --- | --- |
| 'image' | Image | L’image sur laquelle se trouvent les points. Est définie dans la fenêtre via **Select image ...** depuis la bibliothèque média. |
| 'points' | Points | La liste des points avec position, titre, description et lien. Maintenu dans la même fenêtre. |
| « mode affichage » | Affichage | Contrôle la façon dont les points apparaissent sur la page publiée. Le réglage par défaut est « Numéroté, avec la liste à côté de l’image ». |

## Valeurs de la « Représentation » 

| Valeur | Étiquetage dans le dialogue |
| --- | --- |
| « numéroté » | Numéroté, avec une liste à côté de l’image |
| 'points' | Points, sans liste |

## Champs d’un point

| Champ | Description |
| --- | --- |
| Titre | Obligatoire. Sans titre, la fenêtre ne peut pas être fermée avec « Appliquer ». |
| Description | Optionnel, multi-lignes. |
| Destination | Optionnel. Une page de la liste du système ou une adresse saisie par soi-même. |
| Étiquette du bouton | Optionnel. S’il reste vide, le bouton affiche « Ouvrir la page ». |

## Frontières

- Une image a un maximum de **20 points**. La fenêtre s’affiche lors de la tentative de 
  d’en mettre un autre, au lieu de tacitement
  Jetez. 
- Un point **sans titre** ne peut pas être adopté : le bouton
  « Apply » reste verrouillé tant qu’au moins un point ne remporte pas de titre
  et la fenêtre indique le nombre de points concernés. 
- **Sans image ou sans au moins un point, le widget ne montre rien** — 
  ni sur la page publiée ni en tant que cadre vide. 

## Dépendance

L’étiquetage du bouton ne fonctionne que si le point a une cible.
est assigné. Sans cible, il n’y a pas de bouton, et l’appellation reste
sans effet.