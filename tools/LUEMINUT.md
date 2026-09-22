# Mallisivustojen generaattori

Tekee kokonaisen sivuston asetustiedostosta. Käytetään myyntimalleihin:
uusi toimiala on noin tunnin työ, ei päivän.

## Käyttö

```
python3 tools/build.py                 # kaikki sivustot
python3 tools/build.py sahko           # yksi
NODE_PATH=<polku>/node_modules node tools/render.js   # kuvitukset
node tools/verify.js                   # tarkistukset
```

## Tiedostot

| Tiedosto | Tehtävä |
|---|---|
| `palette.py` | Sävykulmasta 14 väritokenia. Hakee kirkkaudet niin, että kontrastivaatimukset täyttyvät, ja **kaatuu jos ne eivät täyty**. |
| `sites.py` | Sisältö: palvelut, asiakasryhmät, kysymykset, lupaukset. Tänne lisätään uusi toimiala. |
| `build.py` | Kokoaa HTML:n ja kääntää pohjatyylin uuteen sävyyn. |
| `scenes.html` | Kuvitusten piirto. 18 kohtausta, parametrina paletti. |
| `render.js` | Renderöi kohtaukset selaimella kuviksi. |
| `verify.js` | Ylivuoto, kontrasti, alt-tekstit, kosketuskohteet, JS-virheet. |
| `asiakas.py` | Tekee toimialamallista asiakaskohtaisen kopion yrityksen nimella. |

## Uuden toimialan lisääminen

1. Lisää merkintä `sites.py`:n `SITES`-sanakirjaan
2. Lisää kohtaukset `scenes.html`:ään (`S['nimi']=(w,h)=>...`)
3. Aja `build.py`, `render.js`, pakkaa kuvat, aja `verify.js`

Sävyn valinta: `hue` on sävykulma 0–360, `sat` korostusten kylläisyys ja
`dark_sat` tummien pintojen kylläisyys. Lämpimillä sävyillä (0–60)
`dark_sat` pitää olla matala, muuten tumma pinta muuttuu ruskeaksi.

## Asiakaskohtainen malli

Kun asiakas kiinnostuu puhelimessa, hanelle tehdaan oma kopio toimialamallista:

```
python3 tools/asiakas.py siivous "Siivouspalvelu Kota"
python3 tools/asiakas.py --alat          # listaa toimialat
```

Tulos menee kansioon `asiakkaat/<nimi>/`. Vain yrityksen nimi vaihtuu —
logo, otsikot ja yritys-sivun nimikentat. Puhelin, osoite, hinnat,
aukioloajat ja y-tunnus jaavat paikanvaraajiksi, ja mallihuomautus jaa
ylalaitaan. Sivu ei esita olevansa asiakkaan oikea sivusto.

Kuvitukset kopioidaan toimialamallista, joten `build.py` ja `render.js`
pitaa olla ajettuna ensin.

## Mitä nämä eivät ole

Mallisivustot eivät esitä olevansa kenenkään olemassa olevan yrityksen
sivuja. Nimet ovat yleisnimiä, jokaisella sivulla on mallihuomautus, ja
kaikki yrityskohtainen tieto on keltainen paikanvaraaja. Sivut on merkitty
`noindex`, jotta ne eivät päädy hakukoneisiin.
