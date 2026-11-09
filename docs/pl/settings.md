# Ustawienia

Okno dialogowe konfiguracji widżetu zawiera dziewięć atrybutów; to, które z nich są
widoczne, zależy od **trybu**. W trybie „Menu” „Obraz” to obraz
poziomu startowego; obrazy niższych poziomów są umieszczane w oknie „Pozycje menu
…”. „Obraz” i
„Pozycje” są edytowane w oknie, które pojawia się automatycznie po otwarciu ustawień;
pola tekstowe znajdujące się za nimi zawierają surową wersję techniczną i
nie należy ich edytować ręcznie. W Content Designerze „Obraz”
załadowany obraz z programu Content Designer — tam obraz wybiera się bezpośrednio w
formularzu.

| Atrybut | Etykieta w oknie dialogowym | Opis |
| --- | --- | --- |
| `image` | Obraz | Obraz, na którym znajdują się punkty. W klasycznym edytorze wybiera się je za pomocą opcji **Wybierz obraz…** w oknie z biblioteki multimediów, w Content Designerze wybiera się je bezpośrednio w formularzu. |
| `image-alt` | Tekst alternatywny | Opisuje obraz dla czytników ekranu; pozostaw puste, jeśli obraz pełni wyłącznie funkcję dekoracyjną. Można go również edytować w oknie w sekcji „Tekst alternatywny”. |
| `source` | Tryb | `Ręcznie` (domyślnie) lub `Menu`. Ukrywa pola drugiego trybu; ich zawartość pozostaje zapisana. |
| `points` | Punkty | Tylko „Ręcznie”. Lista punktów wraz z pozycją, tytułem, opisem i linkiem. Edytowana w tym samym oknie. |
| `display-mode` | Wyświetlanie | Tylko „Ręcznie”. Określa sposób wyświetlania punktów na opublikowanej stronie. Domyślnym ustawieniem jest `Numerowane, z listą obok obrazu`. |
| `menu-id` | Punkt początkowy w menu | Tylko „Menu”. Pozycja menu, której podpunkty zostaną umieszczone na obrazku. Wybór z menu lub poprzez „Wprowadź inny identyfikator menu…” – adres strony. |
| `menu-depth` | Poziomy | Tylko „Menu”. Liczba wyświetlanych poziomów, wliczając punkt początkowy. Domyślnie ustawiono 3. |
| `menu-click` | Kliknięcie punktu z podpunktami | Tylko „Menu”. `Przejdź do podmenu` (ustawienie domyślne) lub `Otwórz stronę`. |
| `menu-points` | Pozycje menu na obrazku | Tylko „Menu”. Obrazek i położenie pozycji dla każdego poziomu menu. Konfigurowane w oknie „Rozmieszczanie pozycji menu…”. |

## Wartości opcji „Wygląd”

| Wartość | Etykieta w oknie dialogowym |
| --- | --- |
| `numbered` | Numerowane, z listą obok obrazka |
| `dots` | Kropki, bez listy |

## Wartości opcji „Poziomy”

| Wartość | Znaczenie |
| --- | --- |
| `2` | Punkt początkowy i jego podpunkty |
| `3` | oraz ich podpunkty (ustawienie domyślne) |
| `4` do `6` | odpowiednio niżej |

## Wartości opcji „Kliknięcie punktu z podpunktami”

| Wartość | Etykieta w oknie dialogowym | Efekt |
| --- | --- | --- |
| `enter` | Przejdź do podmenu | Widżet przechodzi do podmenu: menu wyświetla jego podpunkty, a obraz zmienia się na obraz z tego poziomu. |
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

Punkt początkowy i poziomy są odczytywane przez okno „Umieść punkty menu…” przy
otwarciu. Po wprowadzeniu zmian należy zamknąć okno i otworzyć je ponownie.

Etykieta przycisku działa tylko wtedy, gdy punktowi przypisano jakikolwiek cel.
Bez celu nie ma przycisku, a etykieta pozostaje
bez skutku.
