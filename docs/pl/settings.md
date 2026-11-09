# Ustawienia

Okno dialogowe konfiguracji widżetu zawiera dziewięć atrybutów; to, które z nich są
widoczne, zależy od **trybu**. „Obraz” i
„Punkty” są edytowane w oknie, które pojawia się automatycznie po otwarciu ustawień; pola tekstowe znajdujące się za nimi stanowią techniczną wersję roboczą i
nie należy ich edytować ręcznie. W Content Designerze „Obraz”
wyświetla natomiast obraz przesłany przez projektanta — tam obraz wybiera się bezpośrednio w
formularzu.

| Atrybut | Etykieta w oknie dialogowym | Opis |
| --- | --- | --- |
| `image` | Obraz | Obraz, na którym znajdują się punkty. W klasycznym edytorze wybiera się go za pomocą opcji **Wybierz obraz…** w oknie z biblioteki multimediów, w Content Designerze wybiera się go bezpośrednio w formularzu. |
| `image-alt` | Tekst alternatywny | Opisuje obraz dla czytników ekranu; pozostaw puste, jeśli obraz pełni wyłącznie funkcję dekoracyjną. Można go również edytować w oknie w sekcji „Tekst alternatywny”. |
| `source` | Tryb | `Ręcznie` (domyślnie) lub `Menu`. Ukrywa pola drugiego trybu; ich zawartość pozostaje zapisana. |
| `points` | Punkty | Tylko „Ręcznie”. Lista punktów z pozycją, tytułem, opisem i linkiem. Edytowana w tym samym oknie. |
| `display-mode` | Wyświetlanie | Tylko „Ręcznie”. Określa sposób wyświetlania punktów na opublikowanej stronie. Domyślnym ustawieniem jest `Numerowane, z listą obok obrazu`. |
| `menu-id` | Punkt początkowy w menu | Tylko „Menu”. Pozycja menu, pod którą umieszczane są podpunkty; samą pozycję można również umieścić. Wybór z menu lub poprzez „Wprowadź inne ID menu…” – adres strony. |
| `menu-depth` | Poziomy | Tylko „Menu”. Ile poziomów ma się wyświetlać, wliczając punkt początkowy. Domyślnie ustawiono 3. |
| `menu-click` | Kliknięcie pozycji | Tylko „Menu”. `Otwórz stronę` (ustawienie domyślne) lub `Pokaż obok w menu`. |
| `menu-points` | Pozycje menu na obrazku | Tylko „Menu”. Gdzie znajdują się pozycje menu. Konfigurowane w oknie „Umieść pozycje menu…”. |

## Wartości „Wyświetlanie”

| Wartość | Etykieta w oknie dialogowym |
| --- | --- |
| `numbered` | Numerowane, z listą obok obrazu |
| `dots` | Kropki, bez listy |

## Wartości opcji „Poziomy”

| Wartość | Znaczenie |
| --- | --- |
| `2` | Punkt początkowy i jego podpunkty |
| `3` | oraz ich podpunkty (ustawienie domyślne) |
| `4` do `6` | odpowiednio głębsze |

## Wartości opcji „Kliknięcie punktu”

| Wartość | Etykieta w oknie dialogowym | Efekt |
| --- | --- | --- |
| `open` | Otwórz stronę | Punkt jest linkiem do strony pozycji menu; strony spoza aplikacji otwierają się w nowej karcie. |
| `reveal` | Pokaż obok w menu | Menu obok obrazka przewija się do pozycji menu i zaznacza ją. |

Foldery bez własnej strony są wyświetlane w menu w obu przypadkach.

## Pola pozycji (tryb „Ręczny”)

| Pole | Opis |
| --- | --- |
| Tytuł | Obowiązkowe. Bez tytułu nie można zamknąć okna przyciskiem „Zastosuj”. |
| Opis | Opcjonalne, wielowierszowe. |
| Adres docelowy | Opcjonalne. Strona z listy systemowej lub adres wpisany samodzielnie. |
| Etykieta przycisku | Opcjonalne. Jeśli pole pozostaje puste, przycisk wyświetla komunikat „Otwórz stronę”. |

## Ograniczenia

- Obraz może zawierać maksymalnie **20 punktów**. W przypadku próby
  dodania kolejnego punktu okno wyświetla odpowiedni komunikat, zamiast po cichu
  go odrzucać.
- Punkt **bez tytułu** nie może zostać zapisany: przycisk
  „Zapisz” pozostaje zablokowany, dopóki co najmniej jeden punkt nie ma tytułu,
  a okno podaje liczbę punktów, których to dotyczy.
- **Bez obrazu lub bez co najmniej jednego punktu widget nic nie wyświetla** —
  ani na opublikowanej stronie, ani jako pusta ramka. W trybie
  „Menu” to samo dotyczy sytuacji bez punktu początkowego.
- W trybie „Menu” **każda pozycja menu może zawierać maksymalnie jedną pozycję**;
  kolejne kliknięcie na obrazku powoduje jej przesunięcie.

## Zależności

Okno „Umieść pozycje menu…” odczytuje pozycję początkową i poziomy przy
otwarciu. Po wprowadzeniu zmian należy zamknąć okno i otworzyć je ponownie.

Etykieta przycisku działa tylko wtedy, gdy punktowi przypisano jakikolwiek cel.
Bez celu nie ma przycisku, a etykieta pozostaje
bez skutku.
