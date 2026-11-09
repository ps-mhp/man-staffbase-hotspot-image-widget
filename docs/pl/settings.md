# Ustawienia

W oknie dialogowym konfiguracji widżetu znajduje się tylko jeden przycisk: **Edytuj obraz z punktami
…**. Otwiera on okno, w którym można zarządzać wszystkimi ustawieniami — trybem,
obrazem, wyglądem, ustawieniami menu i punktami. Okno to otwiera się
automatycznie po uruchomieniu ustawień. Przycisk **Zastosuj** zapisuje wszystkie
zmiany w jednym polu.

| Ustawienie w oknie | Opis |
| --- | --- |
| Tryb | `Ręczny` (ustawienie domyślne) lub `Menu`. Punkty z drugiego trybu pozostają zapisane. |
| Obraz | Obraz z biblioteki multimediów, na którym znajdują się pozycje — w trybie „Menu” jest to obraz poziomu startowego. Dodatkowo **tekst alternatywny** dla czytników ekranu; pozostaw puste, jeśli obraz pełni wyłącznie funkcję dekoracyjną. |
| Wyświetlanie | Tylko „Ręcznie”. Domyślnym ustawieniem jest `Numerowane, z listą obok obrazu`. |
| Punkt początkowy w menu | Tylko „Menu”. Pozycja menu, której podpunkty mają zostać umieszczone. Wybór z listy lub poprzez „Wprowadź inny identyfikator menu…” adres strony. |
| Poziomy | Tylko „Menu”. Liczba wyświetlanych poziomów, wliczając punkt początkowy. Domyślnie 3. |
| Kliknięcie punktu z podpunktami | Tylko „Menu”. `Przejdź do podmenu` (ustawienie domyślne) lub `Otwórz stronę`. |
| Poziom | Tylko „Menu”. Który poziom menu jest aktualnie edytowany; każdy ma własny obraz i własne pozycje. |

Technicznie wszystko znajduje się w atrybucie `config`. Widżety z wcześniejszych wersji
nadal przechowują swoje ustawienia w poszczególnych atrybutach (`image`,
`image-alt`, `points`, `display-mode` …). Dopóki `config` jest puste, obowiązują
te ustawienia; przy pierwszym **zastosowaniu** w oknie są one przenoszone do `config`.

## Wartości „Wyświetlania”

| Wartość | Etykieta w oknie dialogowym |
| --- | --- |
| `numbered` | Numerowane, z listą obok obrazu |
| `dots` | Kropki, bez listy |

## Wartości opcji „Poziomy”

| Wartość | Znaczenie |
| --- | --- |
| `2` | Punkt początkowy i jego podpunkty |
| `3` | oraz ich podpunkty (ustawienie domyślne) |
| `4` do `6` | odpowiednio głębiej |

## Wartości opcji „Kliknięcie punktu z podpunktami”

| Wartość | Etykieta w oknie dialogowym | Efekt |
| --- | --- | --- |
| `enter` | Przejście do podmenu | Widżet przechodzi do podmenu: menu wyświetla jego podpunkty, a obraz zmienia się na obraz z tego poziomu. |
| `open` | Otwórz stronę | Pozycja jest linkiem do strony danej pozycji menu; strony spoza aplikacji otwierają się w nowej karcie. |

Pozycje bez podpunktów otwierają w obu przypadkach swoją stronę. Foldery bez
własnej strony przechodzą w obu przypadkach do podmenu.

## Pola pozycji (tryb „Ręczny”)

| Pole | Opis |
| --- | --- |
| Tytuł | Obowiązkowe. Bez tytułu nie można zamknąć okna przyciskiem „Zastosuj”. |
| Opis | Opcjonalne, wielowierszowe. |
| Cel | Opcjonalne. Strona z listy systemowej lub adres wprowadzony samodzielnie. |
| Etykieta przycisku | Opcjonalne. Jeśli pozostanie puste, przycisk wyświetla komunikat „Otwórz stronę”. |

## Ograniczenia

- Obraz może zawierać maksymalnie **20 punktów**. W przypadku próby
  dodania kolejnego punktu okno wyświetla odpowiedni komunikat, zamiast
  cicho go odrzucać.
- Punkt **bez tytułu** nie może zostać zatwierdzony: przycisk
  „Zapisz” pozostaje zablokowany, dopóki co najmniej jeden punkt nie ma tytułu,
  a okno podaje liczbę punktów, których to dotyczy.
- **Bez obrazu lub bez co najmniej jednego punktu widget nic nie wyświetla** —
  ani na opublikowanej stronie, ani jako pusta ramka. W trybie
  „Menu” obowiązują te same zasady, z wyjątkiem punktu początkowego.
- W trybie „Menu” **każdy poziom menu może zawierać maksymalnie 20 pozycji**, a każda
  pozycja menu ma tam co najwyżej jedną; kolejne kliknięcie na obrazek powoduje
  jej przesunięcie.
- Poziom menu **bez własnego obrazu** wyświetla obraz poziomu nadrzędnego.
  Punkty można na nim umieścić dopiero wtedy, gdy ma on własny obraz.

## Zależności

W przypadku zmiany w oknie „Punkt początkowy” lub „Poziomy” menu natychmiast się odświeża.
Punkty, które po tej zmianie nie są już przypisane do żadnej pozycji, znajdują się w sekcji
„Nie ma już w menu”.

Etykieta przycisku działa tylko wtedy, gdy punktowi przypisano jakikolwiek cel.
Bez celu nie ma przycisku, a etykieta pozostaje
bez skutku.
