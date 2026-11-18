# Ustawienia

W oknie dialogowym konfiguracji widżetu znajduje się tylko jeden przycisk: **Edytuj obraz z punktami
**. Otwiera on okno pełnoekranowe **Ustawianie punktów**, w którym dokonuje się wszystkich
ustawień — źródła punktów, obrazu, wyświetlania, ustawień menu oraz
punkty. Okno to otwiera się również automatycznie po
uruchomieniu ustawień. Przycisk **Zastosuj** zapisuje wszystkie zmiany w jednym polu.

## Struktura okna

| Obszar | Zawartość |
| --- | --- |
| Nagłówek | Nazwa widżetu, status („Zmieniono punkt 2”), Cofnij/Powtórz, przełącznik **Edytor · Komputer stacjonarny · Tablet · Urządzenie mobilne**, Pomoc, **Anuluj** i **Zastosuj**. |
| Po lewej | W trybie „Ręcznie” **punkty** w kolejności (czerwony numer, tytuł, cel) oraz **Nowy punkt**; w trybie „Z menu” **poziomy menu** w postaci drzewa. |
| Środek | Pasek z **źródłem punktów**, aktualnie edytowanym obrazkiem, opcją **Zmień obrazek** oraz – tylko w trybie ręcznym – opcją **Wyświetlanie**; poniżej obrazek służący do umieszczania i przesuwania punktów oraz pasek stanu. |
| Po prawej | Wybrany punkt. Jeśli żaden nie jest zaznaczony, wyświetla się **obrazek** wraz z opisem lub – w trybie menu – panel **Menu**. |

W trybach **Komputer stacjonarny**, **Tablet** i **Urządzenie mobilne** pośrodku, zamiast obrazu,
wyświetlana jest strona tak, jak widzą ją czytelnicy; po lewej i prawej stronie można dalej
dokonywać wyboru i dostosowywać ustawienia.

## Ustawienia w oknie

| Ustawienie | Gdzie | Opis |
| --- | --- | --- |
| Źródło punktów | Pasek nad obrazem | `Ręcznie` (ustawienie domyślne) lub `Z menu`. Punkty z pozostałych trybów pozostają zapisane. |
| Obraz | Pasek, panel „Obraz” lub „Menu” | Obraz, na którym znajdują się punkty, z biblioteki multimediów — w trybie „Z menu” obraz z poziomu startowego. Dodatkowo **opis obrazu** (tekst alternatywny) dla czytników ekranu; pozostawić puste, jeśli obraz ma charakter wyłącznie dekoracyjny. |
| Wyświetlanie | Pasek nad obrazem | Tylko „Ręcznie”: `Numery` (ustawienie domyślne, z listą obok obrazu) lub `Punkty` (bez listy). |
| Punkt początkowy | Panel „Menu” | Tylko „Z menu”. Pozycja menu, której podpunkty tworzą pierwszy poziom. Wybór z listy lub poprzez „Wprowadź inny identyfikator menu…” – adres strony. |
| Głębokość | Panel „Menu” | Tylko „Z menu”. Liczba wyświetlanych poziomów, wliczając punkt początkowy. Domyślnie ustawiono 3 poziomy. |
| Kliknięcie punktu z podpunktami | Panel „Menu” | Tylko „Z menu”. `Przejdź do podmenu` (ustawienie domyślne) lub `Otwórz stronę`. |
| Obraz poziomu | Panel „Menu” | Tylko „Z menu”. Każdy poziom może mieć własny obraz. |

Technicznie wszystko znajduje się w atrybucie `config`. Widżety z wcześniejszych wersji
nadal przechowują swoje ustawienia w poszczególnych atrybutach (`image`,
`image-alt`, `points`, `display-mode` …). Każde ustawienie jest odczytywane w następującej kolejności:
obowiązuje to, co znajduje się w `config`; w przeciwnym razie – stary atrybut; w ostateczności – wartość domyślna.
Po otwarciu okno przejmuje wartości odczytane ze starych pól.
Tego, czego nie może odczytać — na przykład pól wyboru w Content Designerze —
nie zapisuje w `config`, dopóki nie zmienisz tego w oknie; informacja
w panelu wskazuje te ustawienia. Otwarcie i zatwierdzenie bez wprowadzania zmian
nie powoduje zatem modyfikacji istniejącego widżetu.

## Ikona zamiast kropki

Każda kropka może w obu trybach zawierać własny obraz (ikonę) z biblioteki multimediów;
pojawia się on wówczas w miejscu czerwonej kropki, proporcjonalnie
dopasowany. W panelu punktu znajduje się w tym celu sekcja **Ikona**.

| Rozmiar | Długość krawędzi |
| --- | --- |
| S | 32 px |
| M | 48 px (ustawienie domyślne) |
| L | 72 px |

Jako **tło** można wybrać opcję przezroczystą (ustawienie domyślne) lub
okrągły obszar w kolorze białym, czerwonym MAN, antracytowym lub jasnoszarym.

Podświetlenie, etykieta z nazwą i kliknięcie działają tak samo jak w przypadku punktu. W
trybie numerowanym numer pojawia się wówczas wyłącznie na liście.

## Wartości opcji „Wygląd”

| Wartość | Etykieta w oknie |
| --- | --- |
| `numbered` | Numery (z listą obok obrazu) |
| `dots` | Kropki (bez listy) |

## Wartości opcji „Głębokość”

| Wartość | Znaczenie |
| --- | --- |
| `2` | Punkt początkowy i jego podpunkty |
| `3` | oraz ich podpunkty (ustawienie domyślne) |
| `4` do `6` | odpowiednio głębsze |

## Wartości opcji „Kliknięcie na punkt z podpunktami”

| Wartość | Etykieta w oknie | Efekt |
| --- | --- | --- |
| `enter` | Przejście do podmenu | Widżet przechodzi do podmenu: menu wyświetla jego podpunkty, a obraz zmienia się na obraz z tego poziomu. |
| `open` | Otwórz stronę | Pozycja jest linkiem do strony odpowiadającej tej pozycji menu; strony spoza aplikacji otwierają się w nowej karcie. |

Pozycje bez podpunktów otwierają w obu przypadkach swoją stronę. Foldery bez
własnej strony przechodzą w obu przypadkach do podmenu.

## Pola pozycji (tryb „Ręczny”)

| Pole | Opis |
| --- | --- |
| Tytuł | Obowiązkowe. Bez tytułu przycisk **Zastosuj** wyświetla pozycję w statusie zamiast ją zatwierdzać. |
| Opis | Opcjonalne, wielowierszowe. |
| Link · Miejsce docelowe | Opcjonalne. `Brak linku`, strona z listy systemowej lub adres wprowadzony samodzielnie za pomocą opcji „Wprowadź własny adres…”. |
| Link · Etykieta przycisku | Opcjonalne. Jeśli pole pozostaje puste, przycisk wyświetla komunikat „Otwórz stronę”. |
| Ikona | Opcjonalne, patrz wyżej. |

Nad panelem znajdują się działania związane z pozycją: w górę, w dół,
duplikuj, usuń.

## Ograniczenia

- Obraz może zawierać maksymalnie **20 punktów**. Pasek stanu pod obrazem
  wskazuje na to przy próbie dodania kolejnego punktu, zamiast
  cicho go odrzucać; opcje **Nowy punkt** i **Duplikuj** są
  wtedy zablokowane.
- Punktu **bez tytułu** nie można zatwierdzić: opcja **Zatwierdź**
  wskazuje to w statusie, po lewej stronie jest on oznaczony jako „Brak tytułu”, a po prawej
  otwarty.
- **Bez obrazu lub bez co najmniej jednej pozycji widget nic nie wyświetla** —
  ani na opublikowanej stronie, ani jako pusta ramka. W trybie
  „Z menu” to samo dotyczy sytuacji bez pozycji początkowej.
- W trybie „Z menu” **każdy poziom menu może zawierać maksymalnie 20 pozycji**, a
  każda pozycja menu ma tam maksymalnie jedną; kolejne kliknięcie w obrazek
  przenosi ją.
- Poziom menu **bez własnego obrazka** wyświetla obrazek z poziomu wyższego.
  Punkty można na nim umieścić dopiero wtedy, gdy posiada on własny obraz.
- To, czy widżet jest wyświetlany w wersji wąskiej czy szerokiej, zależy od jego
  własnej szerokości (poniżej 600 pikseli – wąska), a nie od szerokości ekranu. Dlatego
  podgląd **mobilny** pokazuje ten sam wąski wygląd co
  telefon; widget w wąskiej kolumnie pozostaje wąski również na komputerze stacjonarnym.

## Zależności

Jeśli w panelu „Menu” zmienisz punkt początkowy lub głębokość, menu natychmiast się odświeży.
Pozycje, które po tej zmianie nie są już przypisane do żadnego wpisu, pojawiają się po lewej stronie jako
błąd „Nie ma już w menu” poniżej swojego poziomu.

Etykieta przycisku działa tylko wtedy, gdy pozycji przypisano jakikolwiek cel
. Bez celu nie ma przycisku, a pole nie pojawia się
.
