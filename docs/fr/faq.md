# FAQ

**Question :** J'ai ajouté un élément, mais le bouton « Appliquer » ne fonctionne pas.

Réponse : Au moins un élément n'a pas encore de titre. Un élément sans titre
serait perdu lors de l'application — c'est pourquoi **Appliquer** l'affiche dans l'état
de la fenêtre, au lieu de l'appliquer. À gauche, il est signalé comme « Titre manquant »,
à droite, il est ouvert et la même remarque apparaît dans le champ.

**Question :** Le widget n'affiche rien du tout sur la page.

Réponse : Soit l’image manque, soit aucun élément n’a encore été défini. Dans
les deux cas, la zone reste volontairement vide, au lieu d’afficher un cadre vide ou
une image de remplacement. Ouvrez les paramètres et vérifiez
ces deux points.

**Question :** Pourquoi un lien ouvre-t-il une fenêtre par-dessus la page, tandis qu’un autre
ouvre un nouvel onglet ?

Réponse : Cela dépend de l’origine de la destination. Une **page issue de la
liste** du système s’affiche dans une fenêtre par-dessus la page actuelle. Une
**adresse saisie manuellement** ouvre en revanche toujours un nouvel onglet. La
raison : les pages externes ne peuvent souvent pas être intégrées techniquement dans une fenêtre
— une fenêtre bloquée resterait alors simplement vide, sans afficher de message d’erreur
. Le nouvel onglet est donc la solution la plus fiable pour tout ce qui se trouve en dehors du
système.

**Question :** La liste des pages ne contient aucune page, mais un
champ destiné à l’adresse.

Réponse : La liste des pages du système n’était pas accessible à l’ouverture. Un
message d’avertissement le signale. Dans ce cas, saisissez l’adresse
manuellement, ou fermez la fenêtre et rouvrez-la.

**Question :** J’ai créé un lien vers une page, mais lorsque je la
rouvre, un message indique que la page enregistrée ne figure pas dans la liste
.

Réponse : La page liée a probablement été supprimée ou n’est plus
accessible. Le lien existant reste en place jusqu’à ce que vous le
modifiiez ou le supprimiez vous-même — le simple fait d’ouvrir la fenêtre ne le supprime pas.

**Question :** Qu’advient-il des points lors de la traduction automatique de la
page ?

Réponse : Le titre, la description et le libellé du
bouton de chaque point sont traduits. La position d’un point sur l’image ainsi que la destination
d’un lien restent inchangées — ce ne sont pas des éléments linguistiques, et pour la destination,
une traduction ne ferait que corrompre l’adresse.

**Question :** Pourquoi la page vers laquelle pointe le lien apparaît-elle parfois vide dans la fenêtre,
alors que le lien renvoie vers une page de la liste ?

Réponse : Même pour les pages issues de votre propre système, l’intégration peut échouer,
par exemple si la page de destination empêche techniquement l’intégration. Dans ce cas,
utilisez le lien « Ouvrir dans un nouvel onglet » en haut de la fenêtre — c’est précisément
pour cela qu’il se trouve là.

**Question :** Puis-je placer plus de 20 marqueurs sur une image ?

Réponse : Non. À partir de 20 points, les marqueurs se chevauchent, et la
liste à côté de l’image deviendrait plus longue que l’image elle-même. L’éditeur vous le signale lorsque
vous essayez de placer un 21e point.

**Question :** J’ai renommé un élément de menu en mode « À partir du menu ». Dois-je
modifier le widget ?

Réponse : Non. Seule la position de chaque élément de menu sur l’image est enregistrée.
Le titre et la destination sont récupérés à chaque fois directement depuis le menu — le nouveau nom
apparaît immédiatement.

**Question :** Pourquoi certains collègues voient-ils moins de points que moi ?

Réponse : En mode « À partir du menu », chacun ne voit que les points correspondant aux éléments de menu auxquels il
ou elle a accès dans le menu de l’application. C’est voulu : un point ne doit
pas mener vers une page qui ne peut ensuite pas s’ouvrir.

**Question :** Est-ce que je perds mes points lorsque je passe du mode « Manuel » au mode « À partir du
menu » ?

Réponse : Non. Les deux modes enregistrent leurs points séparément. Si vous revenez en arrière,
vous retrouverez les points de l’autre mode tels quels.

**Question :** Chaque niveau de menu peut-il avoir sa propre image ?

Réponse : Oui. Dans la fenêtre en mode « À partir du menu », sélectionnez le niveau à gauche
et, à droite sous **Image du niveau**, choisissez votre image dans la médiathèque. Un niveau
sans image propre affiche l’image du niveau supérieur, ainsi que ses points.

**Question :** Pourquoi un élément de menu n’apparaît-il pas à côté de l’image dans le menu, alors qu’
il existe ?

Réponse : Soit il est défini sur « Non visible » dans le menu de l’application, soit
il se trouve à un niveau plus profond que celui défini sous **Profondeur**. Dans le premier cas, il reste
également masqué ici ; dans le second, augmentez la profondeur.

**Question :** La fenêtre indique « Non lisible depuis la boîte de dialogue : … ». Qu’est-ce que cela signifie ?

Réponse : Le widget provient d’une version dans laquelle chaque paramètre disposait de
son propre champ dans le formulaire. Certains de ces champs ne révèlent pas leur valeur,
comme les listes de sélection dans le Content Designer. La fenêtre affiche alors
la valeur par défaut, mais ne l'enregistre pas : le widget conserve sa valeur
précédente jusqu'à ce que vous modifiiez vous-même le paramètre dans la fenêtre. Ouvrir et
« Appliquer » sans modification ne change donc rien au widget.
