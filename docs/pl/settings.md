# Ustawienia

Okno konfiguracyjne widżetu ma cztery atrybuty. "Obraz" oraz
"Punkty" są utrzymywane w oknie, które pojawia się po otwarciu Ustawień
pokazuje się sam; pola tekstowe stojące za nim to techniczna, wstępna wersja i
nie powinno być edytowane ręcznie. W Content Designer, Obraz 
zamiast tego przesyłanie obrazu przez projektanta — tam obraz jest zapisywany bezpośrednio w
Forma wybrana. 

| Atrybut | Etykieta w dialogu | Opis |
| --- | --- | --- |
| 'obraz' | Obraz | Obraz, na którym znajdują się kropki. W klasycznym edytorze za pomocą **Wybierz obraz ...** w oknie z biblioteki multimedialnej, w Projektantze treści wybranym bezpośrednio w formularzu. |
| 'image-alt' | Tekst alternatywny | Opisuje obraz dla czytników ekranu; pozostawić puste, jeśli tylko dekoruje. Można go także edytować w oknie pod "Tekst alternatywny". |
| 'punkty' | Punkty | Lista punktów z pozycją, tytułem, opisem i linkiem. Przechowywana w tym samym oknie. |
| 'tryb wyświetlania' | Wyświetlacz | Kontroluje, jak kropki pojawiają się na opublikowanej stronie. Domyślne ustawienie to 'Numerowane, z listą obok obrazu'. |

## Wartości "reprezentacji" 

| Wartość | Etykietowanie w dialogu |
| --- | --- |
| 'numerowany' | Numerowany, z listą obok obrazu |
| 'kropki' | Kropki, bez listy |

## Pola punktu

| Pole | Opis |
| --- | --- |
| Tytuł | Obowiązkowe. Bez tytułu okno nie może zostać zamknięte za pomocą "Aplikuj". |
| Opis | Opcjonalnie, wieloliniowe. |
| Cel | Opcjonalnie. Strona z listy systemu lub adres wpisany samodzielnie. |
| Etykieta przycisku | Opcjonalne. Jeśli pozostaje pusty, przycisk pokazuje "Otwórz stronę". |

## Granice

- Obraz ma maksymalnie **20 punktów**. Okno pokazuje, gdy próbuje 
  by ustawić kolejną, zamiast milcząco
  Porzuć. 
- Punkt **bez tytułu** nie może być przyjęty: przycisk
  "Aplikuj" pozostaje zablokowane, dopóki przynajmniej jeden punkt nie zapewni tytułu
  a okno wskazuje liczbę dotkniętych punktów. 
- **Bez obrazu lub bez przynajmniej jednej kropki widżet nic nie pokazuje** — 
  ani na opublikowanej stronie, ani jako pusta ramka. 

## Zależność

Oznaczenie przycisku działa tylko wtedy, gdy punkt w ogóle ma cel.
jest przypisywane. Bez celu nie ma przycisku, a etykieta pozostaje
bez efektu.