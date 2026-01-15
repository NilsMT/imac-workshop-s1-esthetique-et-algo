# Fractales

XXX

## Structure

```
├───digital_litterature_1 : Traduction littérale de texte en valeurs équivalente en domino
└───digital_litterature_2 : Génération de parties de domino en fonction du texte
```

## Projets

### **nom_projet**

### Réflexion & Conception 1

J'ai auparavant déjà manipulé du texte, que cela soit pour une [police algorithmique](https://traducteur-kumarite.vercel.app/) (voir Brainstorming pour l'algorithme) ou avec les éléments du tableau périodique avec [de l'encryption périodique](https://github.com/NilsMT/periodic-encryption).

J'ai donc exploré comment retranscrire le code UNICODE en une chose originale, en explorant la [liste des caractères](https://www.vertex42.com/ExcelTips/unicode-symbols.html) je suis tombé sur les dominos, ce qui m'a inspiré.

La retranscription marche avec des soustractions successive, par exemple 13 sera exprimé avec un domino de 12 et un de 1 (`🂓🁤`).

Après un peu de code, je me suis rendu compte qu'il y avait beaucoup trop de dominos par caractères, j'ai donc décidé d'étendre la liste passant de `🂓🂓🂓🂓🂓🂓🂓🂓🁤` à `🁡🁡🀶` pour le caractère `a` ou les dominos horizontaux valent `valeur écrite + 12`, donc `🁍 = 4 + 12 = 16`.

Ensuite le texte provient d'une API, et j'ai décidé de prendre la première dans une liste d'API de citation.

### Réflexion & Conception 2

L'enfer commence, j'ai décidé de faire des mots exprimé en domino, et ceux-ci suivent une suite logique
Après 5h de code, j'ai finalement opté pour une solution qui palie à un problème ou le dernier domino joué excède la valeur du caractère suivant : un domino magique qui absorbe l'excès (et marque la fin d'un caractère).
