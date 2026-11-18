# FAQ

**Pytanie:** Ustawiłem punkt, ale przycisk „Zastosuj” nie działa.

Odpowiedź: Co najmniej jeden punkt nie ma jeszcze tytułu. Punkt bez tytułu
zostałby utracony podczas stosowania — dlatego przycisk **Zastosuj** wyświetla go w statusie
okna zamiast go zastosować. Po lewej stronie jest on oznaczony jako „Brak tytułu”,
po prawej jest otwarty, a przy polu widnieje ta sama informacja.

**Pytanie:** Widżet nie wyświetla nic na stronie.

Odpowiedź: Albo brakuje obrazka, albo nie ustawiono jeszcze żadnego punktu. W
obu przypadkach obszar pozostaje celowo pusty, zamiast wyświetlać pustą ramkę lub
obrazek zastępczy. Otwórz ustawienia i sprawdź
obie te rzeczy.

**Pytanie:** Dlaczego jeden link otwiera okno nad stroną, a inny
nową kartę?

Odpowiedź: Zależy to od tego, skąd pochodzi adres docelowy. **Strona z
listy** systemu pojawia się w oknie nad bieżącą stroną. Natomiast
**adres wpisany samodzielnie** otwiera natomiast zawsze nową kartę.
Powód: strony zewnętrzne często nie mogą być technicznie osadzone w oknie
— zablokowane okno pozostałoby wtedy po prostu puste, bez wyświetlania komunikatu o błędzie.
Nowa karta jest zatem niezawodnym rozwiązaniem dla wszystkiego, co znajduje się poza
systemem.

**Pytanie:** Na liście stron nie ma ani jednej strony, tylko
pole na adres.

Odpowiedź: Lista stron systemu była niedostępna podczas otwierania.
Informuje o tym tekst ostrzegawczy. W takim przypadku należy wpisać adres
ręcznie lub zamknąć okno i otworzyć je ponownie.

**Pytanie:** Umieściłem link do strony, ale po ponownym
otwarciu pojawia się komunikat, że zapisana strona nie znajduje się na liście
.

Odpowiedź: Strona, do której prowadzi link, została prawdopodobnie usunięta lub nie jest już
dostępna. Dotychczasowy link pozostaje aktywny, dopóki sam go
nie zmienisz lub nie usuniesz — samo otwarcie okna nie powoduje jego usunięcia.

**Pytanie:** Co dzieje się z elementami podczas automatycznego tłumaczenia
strony?

Odpowiedź: Tłumaczone są tytuł, opis oraz etykieta
przycisku każdego punktu. Położenie punktu na obrazku oraz miejsce docelowe
linku pozostają niezmienione — nie są to elementy językowe, a w przypadku miejsca docelowego
tłumaczenie tylko zniszczyłoby adres.

**Pytanie:** Dlaczego strona, do której prowadzi link, czasami wyświetla się w oknie jako pusta,
chociaż link wskazuje stronę z listy?

Odpowiedź: Nawet w przypadku stron z własnego systemu osadzanie może się nie powieść,
na przykład gdy sama strona docelowa technicznie uniemożliwia osadzanie. W takim
przypadku należy skorzystać z linku „Otwórz w nowej karcie” w nagłówku okna — właśnie
po to tam się znajduje.

**Pytanie:** Czy mogę umieścić więcej niż 20 punktów na obrazku?

Odpowiedź: Nie. Od 20 punktów znaczniki nakładają się na siebie, a
lista obok obrazka stałaby się dłuższa niż sam obrazek. Edytor wyświetla odpowiednie
ostrzeżenie przy próbie umieszczenia 21. punktu.

**Pytanie:** W trybie „Z menu” zmieniłem nazwę pozycji menu. Czy muszę
dostosować widżet?

Odpowiedź: Nie. Zapisywane jest jedynie to, gdzie na obrazku znajduje się dana pozycja menu.
Tytuł i miejsce docelowe są pobierane na nowo z menu przy każdym wywołaniu — nowa nazwa
pojawia się natychmiast.

**Pytanie:** Dlaczego niektórzy koledzy i koleżanki widzą mniej punktów niż ja?

Odpowiedź: W trybie „Z menu” każdy widzi tylko punkty dotyczące pozycji menu, które
może również zobaczyć w menu aplikacji. Jest to zamierzone: punkt nie powinien
prowadzić do strony, której nie da się otworzyć.

**Pytanie:** Czy stracę swoje punkty, jeśli przełączę się między trybem „Ręcznie” a „Z
menu”?

Odpowiedź: Nie. Oba tryby zapisują punkty oddzielnie. Kto przełączy się z powrotem,
znajdzie punkty z drugiego trybu w niezmienionym stanie.

**Pytanie:** Czy każdy poziom menu może mieć własny obraz?

Odpowiedź: Tak. W oknie w trybie „Z menu” wybierz po lewej stronie poziom,
a po prawej, w sekcji **Obraz poziomu**, wybierz obraz z biblioteki multimediów. Poziom
bez własnego obrazu wyświetla obraz poziomu znajdującego się powyżej wraz z jego punktami.

**Pytanie:** Dlaczego pozycja menu nie pojawia się w menu obok obrazu, mimo że
istnieje?

Odpowiedź: Albo jest on ustawiony w menu aplikacji na „Niewidoczny”, albo
znajduje się głębiej niż wartość ustawiona w polu **Głębokość**. W pierwszym przypadku pozostaje
on ukryty również tutaj; w drugim należy zwiększyć głębokość.

**Pytanie:** W oknie widnieje komunikat „Niewidoczne w oknie dialogowym: …”. Co to oznacza?

Odpowiedź: Widżet pochodzi z wersji, w której każde ustawienie miało
własne pole w formularzu. Niektóre z tych pól nie ujawniają swojej wartości
— na przykład pola wyboru w Content Designerze. Okno wyświetla w tym przypadku
wartość domyślną, ale jej nie zapisuje: widget zachowuje swoją dotychczasową
wartość, dopóki nie zmienisz ustawienia w samym oknie. Otwarcie i
zatwierdzenie bez wprowadzania zmian nie powoduje więc zmiany w widgecie.
