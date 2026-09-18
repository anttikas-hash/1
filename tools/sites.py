# -*- coding: utf-8 -*-
"""Mallisivustojen sisältö.

Nämä ovat myyntikäyttöön tarkoitettuja malleja, eivät oikeita yrityksiä.
Siksi nimet ovat yleisnimiä ja jokaisella sivulla on näkyvä mallihuomautus:
sivusto ei saa esittää olevansa kenenkään olemassa olevan yrityksen sivu.
Kaikki yrityskohtainen tieto on paikanvaraaja.
"""

SITES = {

'sahko': dict(
  slug='sahko', hue=38, sat=0.62, dark_sat=0.16,
  brand1='Sähkö', brand2='asennus',
  name='Sähköasennus',
  title='Sähköasennukset ja sähköremontit',
  desc='Sähköasennukset, sähköremontit, keskuksen uusiminen ja vikakorjaukset.',
  h1='Sähkötyöt tehdään kerralla oikein',
  lede='Sähköasennukset uudiskohteisiin, sähköremontit vanhaan ja vikakorjaukset '
       'silloin kun jokin lakkaa toimimasta. Työ tehdään määräysten mukaisesti ja '
       'siitä jää dokumentit.',
  hero='sahko-hero', band='sahko-band',
  band_text='Sähkötyö on joko tehty oikein tai se on turvallisuusriski.',
  facts=[('Kaikki työt','Asennukset, remontit ja vikakorjaukset saman katon alta.'),
         ('Dokumentit','Työstä jää käyttöönottotarkastuspöytäkirja.'),
         ('Kiinteä hinta','Sovitusta työstä annetaan kirjallinen hinta.')],
  services=[
    ('Sähköasennukset uudiskohteisiin','sahko-keskus',
     'Uuden rakennuksen koko sähköistys: keskus, ryhmäjohdot, pistorasiat, '
     'valaistus ja kytkennät. Sovitamme työn yhteen rakennusurakan aikatauluun.',
     ['Sähkökeskus ja ryhmäjohdot','Pistorasiat ja kytkimet','Valaistusasennukset',
      'Antenni- ja tietoliikennekaapelointi','Käyttöönottotarkastus ja dokumentit']),
    ('Sähköremontit ja saneeraus','sahko-kaapeli',
     'Vanhan sähköjärjestelmän uusiminen kokonaan tai osittain. Käymme kohteen läpi '
     'ennen tarjousta, koska vanhoissa taloissa pintojen alla on usein yllätyksiä.',
     ['Koko asunnon sähköremontti','Keskuksen uusiminen','Vanhan johdotuksen vaihto',
      'Lisäpistorasiat ja -ryhmät','Kylpyhuoneen sähköt']),
    ('Valaistus','sahko-valo',
     'Valaistuksen suunnittelu ja asennus sisälle ja ulos. Vanhan valaistuksen '
     'vaihto vähemmän sähköä kuluttavaan on usein nopeimmin takaisin maksava työ.',
     ['Sisävalaistus ja spotit','Piha- ja julkisivuvalaistus','Ohjaukset ja himmentimet',
      'Valaistuksen uusiminen']),
    ('Vikakorjaukset ja mittaukset','sahko-mittaus',
     'Kun sulake palaa toistuvasti tai jokin ei toimi, vika etsitään mittaamalla. '
     'Kerromme mitä löytyi ja mitä korjaus maksaa ennen kuin teemme sen.',
     ['Vianetsintä ja mittaukset','Sulake- ja keskusviat','Kosteus- ja maadoitusviat',
      'Määräaikaistarkastukset']),
  ],
  customers=[
    ('Kotitaloudet','Sähköremontit, lisäpistorasiat, valaistus ja vikakorjaukset omakotitaloihin ja asuntoihin.'),
    ('Taloyhtiöt','Keskusten uusiminen, yhteisten tilojen sähköt ja piha-alueiden valaistus.'),
    ('Yritykset','Toimitilojen sähköasennukset, muutostyöt ja valaistuksen uusiminen.'),
    ('Aliurakointi','Sähköasennukset osana toisen urakoitsijan kokonaisuutta.'),
  ],
  faq=[
    ('Saako sähkötyöstä kotitalousvähennystä?',
     'Asunnossa tehdyn sähkötyön työosuudesta voi tietyin edellytyksin saada kotitalousvähennystä. '
     'Uudisrakentaminen ei oikeuta vähennykseen. Voimassa olevat ehdot ja enimmäismäärät löytyvät '
     'osoitteesta <a href="https://www.vero.fi" rel="noopener">vero.fi</a>.'),
    ('Mitä dokumentteja työstä jää?',
     'Sähköasennuksista tehdään käyttöönottotarkastus ja siitä pöytäkirja. Säilytä se — '
     'sitä kysytään asunnon myynnin ja vakuutusasioiden yhteydessä.'),
    ('Voinko tehdä sähkötyöt itse?',
     'Osa pienistä töistä on sallittu maallikolle, mutta kiinteät asennukset, keskustyöt ja '
     'ryhmäjohdot vaativat sähköpätevyyden. Väärin tehty asennus on paloriski ja voi vaikuttaa '
     'vakuutuskorvaukseen.'),
    ('Kuinka nopeasti pääsette liikkeelle?',
     'Se riippuu työtilanteesta ja kohteesta. Soita, niin kerromme suoraan milloin pystymme '
     'aloittamaan — emme lupaa aikataulua, jota emme pidä.'),
  ],
  promises=[
    ('Kirjallinen hinta','Saat erittelyn siitä mitä hintaan kuuluu ja mitä ei — ei suullisia arvioita.'),
    ('Työ dokumentoidaan','Käyttöönottotarkastus tehdään ja pöytäkirja jää sinulle.'),
    ('Siisti jälki','Kaapeloinnit tehdään niin, että ne kestävät katsoa myös seinän auettua.'),
  ],
  about='tekee sähköasennukset, sähköremontit ja vikakorjaukset kotitalouksille, '
        'taloyhtiöille ja yrityksille.',
),

'maalaus': dict(
  slug='maalaus', hue=8, sat=0.52, dark_sat=0.15,
  brand1='Maalaus', brand2='liike',
  name='Maalausliike',
  title='Maalaus- ja tasoitetyöt',
  desc='Sisämaalaus, ulkomaalaus, tasoitetyöt ja tapetointi.',
  h1='Pinta kestää vain niin kauan kuin pohjatyö',
  lede='Sisä- ja ulkomaalaus, tasoitetyöt ja tapetointi. Suurin osa maalaustyöstä on '
       'sitä mitä tehdään ennen kuin maalipurkki avataan.',
  hero='maalaus-hero', band='maalaus-band',
  band_text='Hyvä maalaus näkyy vasta viiden vuoden päästä.',
  facts=[('Pohjatyö','Suojaus, tasoitus ja pohjustus kuuluvat hintaan.'),
         ('Siisti työmaa','Suojaukset paikallaan koko työn ajan.'),
         ('Kirjallinen hinta','Sovitusta työstä annetaan kirjallinen hinta.')],
  services=[
    ('Sisämaalaus','maalaus-sisa',
     'Asuntojen ja toimitilojen sisämaalaus. Suojaus, tasoitus ja pohjustus kuuluvat '
     'työhön — ne ovat se osa, joka ratkaisee lopputuloksen.',
     ['Seinien ja kattojen maalaus','Listat, ovet ja karmit','Keittiön kalusteovet',
      'Kosteiden tilojen pinnat','Suojaus ja loppusiivous']),
    ('Ulkomaalaus ja julkisivut','maalaus-ulko',
     'Puujulkisivun huoltomaalaus ja uuden pinnan maalaus. Vanha pinta pestään ja '
     'irtoava maali poistetaan ennen uutta — muuten uusi pinta irtoaa vanhan mukana.',
     ['Puujulkisivun huoltomaalaus','Pesu ja irtoavan maalin poisto','Homeenpoisto ja pohjustus',
      'Räystäät, ikkunat ja ovet','Peltipintojen maalaus']),
    ('Tasoitetyöt','maalaus-tasoite',
     'Seinien ja kattojen tasoitus maalausta tai tapetointia varten. Tasoitus on se, '
     'mikä tekee pinnasta suoran — maali ei korjaa epätasaista seinää.',
     ['Seinien ja kattojen tasoitus','Saumojen ja ruuvinkantojen tasoitus',
      'Vanhan pinnan korjaus','Hionta ja pölynhallinta']),
    ('Tapetointi','maalaus-suoja',
     'Tapetointi ja vanhan tapetin poisto. Pohja tasoitetaan ennen uutta tapettia, '
     'koska tapetti ei peitä epätasaisuuksia vaan korostaa niitä.',
     ['Vanhan tapetin poisto','Pohjan tasoitus ja pohjustus','Tapetointi',
      'Kuviollisten tapettien kohdistus']),
  ],
  customers=[
    ('Kotitaloudet','Asuntojen sisämaalaus, julkisivujen huoltomaalaus ja remonttien pintatyöt.'),
    ('Taloyhtiöt','Porraskäytävät, yhteiset tilat ja julkisivujen huoltomaalaus.'),
    ('Yritykset','Toimitilojen maalaus ja pintojen uusiminen sovittuina aikoina.'),
    ('Rakennusliikkeet','Maalaus- ja tasoitetyöt osana urakkaa.'),
  ],
  faq=[
    ('Saako maalaustyöstä kotitalousvähennystä?',
     'Asunnossa tehdyn maalaustyön työosuudesta voi tietyin edellytyksin saada kotitalousvähennystä. '
     'Uudisrakentaminen ei oikeuta vähennykseen. Voimassa olevat ehdot ja enimmäismäärät löytyvät '
     'osoitteesta <a href="https://www.vero.fi" rel="noopener">vero.fi</a>.'),
    ('Mihin aikaan vuodesta ulkomaalaus kannattaa tehdä?',
     'Ulkomaalaus tehdään lämpimänä ja kuivana aikana. Maalin valmistaja ilmoittaa vähimmäislämpötilan '
     'ja suurimman sallitun ilmankosteuden, ja niitä noudatetaan — liian kylmässä tai kostealla '
     'maalattu pinta ei kestä.'),
    ('Kuinka kauan asunnon maalaus kestää?',
     'Se riippuu pinta-alasta ja siitä, paljonko tasoitusta tarvitaan. Kerromme arvion katselmuksen '
     'yhteydessä, ja aikataulu kirjataan sopimukseen.'),
    ('Siirrättekö huonekalut?',
     'Sovitaan erikseen. Yleensä tilaaja tyhjentää tilan ja me suojaamme sen, mutta voimme hoitaa '
     'myös siirrot, jos se sovitaan etukäteen.'),
  ],
  promises=[
    ('Pohjatyö kuuluu hintaan','Suojaus, tasoitus ja pohjustus ovat osa työtä, eivät lisä.'),
    ('Suojaus pysyy','Lattiat, kalusteet ja ikkunat suojataan koko työn ajaksi.'),
    ('Sovittu aikataulu','Aikataulu kirjataan sopimukseen. Muutoksista kerrotaan heti.'),
  ],
  about='tekee sisä- ja ulkomaalaukset, tasoitetyöt ja tapetoinnit kotitalouksille, '
        'taloyhtiöille ja yrityksille.',
),

'piha': dict(
  slug='piha', hue=86, sat=0.46, dark_sat=0.20,
  brand1='Piha', brand2='ja maanrakennus',
  name='Piha- ja maanrakennus',
  title='Pihatyöt, kiveykset ja maanrakennus',
  desc='Kiveykset, terassit, salaojat ja pihan pohjatyöt.',
  h1='Piha kestää sen mitä pohja kestää',
  lede='Kiveykset, terassit, salaojat ja maanrakennustyöt. Näkyvä osa on kivi ja lauta, '
       'mutta kestävyys ratkaistaan pohjassa.',
  hero='piha-hero', band='piha-band',
  band_text='Painunut kiveys on aina pohjatyön virhe, ei kiven.',
  facts=[('Pohjatyö','Routimaton pohja tehdään ennen näkyvää pintaa.'),
         ('Vedet ohjataan','Sadevedet ja salaojat suunnitellaan osana pihaa.'),
         ('Kirjallinen hinta','Sovitusta työstä annetaan kirjallinen hinta.')],
  services=[
    ('Kiveykset ja laatoitukset','piha-kivi',
     'Pihakiveykset, kulkuväylät ja autopaikat. Kiveyksen kestävyys ratkaistaan '
     'pohjatyössä: routimaton rakenne ja oikeat kaadot estävät painumisen.',
     ['Pihakiveykset ja kulkuväylät','Autopaikat ja ajoluiskat','Reunatuet ja rajaukset',
      'Pohjatyöt ja routaeristys','Vanhan kiveyksen korjaus']),
    ('Terassit ja katokset','piha-terassi',
     'Terassit, portaat ja katokset. Rakenne tehdään niin, että se tuulettuu ja '
     'kuivuu — se on ainoa tapa saada puurakenteesta pitkäikäinen.',
     ['Puuterassit ja portaat','Komposiittiterassit','Terassin kaiteet',
      'Katokset ja pergolat','Vanhan terassin uusiminen']),
    ('Salaojat ja sadevedet','piha-salaoja',
     'Salaojitus, sadevesiviemärit ja pintavesien ohjaus. Väärin ohjattu vesi on '
     'yleisin syy kosteusvaurioon, ja sen korjaaminen jälkikäteen on kallista.',
     ['Salaojien asennus ja uusiminen','Sadevesiviemärit ja kaivot',
      'Perustusten vedeneristys','Pintavesien kallistukset','Rumpujen asennus']),
    ('Maanrakennus ja pohjatyöt','piha-maansiirto',
     'Kaivuu, täytöt ja maanrakennustyöt rakentamisen pohjaksi tai pihan muotoiluun. '
     'Teemme myös purkutyöt ja maa-ainesten ajot.',
     ['Kaivuu ja täytöt','Perustusten pohjatyöt','Pihan muotoilu ja tasaus',
      'Maa-ainesten ajot','Purkutyöt']),
  ],
  customers=[
    ('Kotitaloudet','Pihakiveykset, terassit, salaojat ja pihan muotoilu omakotitaloihin.'),
    ('Taloyhtiöt','Piha-alueiden kunnostukset, kulkuväylät ja sadevesijärjestelmät.'),
    ('Yritykset','Piha-alueet, paikoitusalueet ja kiinteistöjen ulkotyöt.'),
    ('Rakennusliikkeet','Pohjatyöt, kaivuu ja täytöt osana urakkaa.'),
  ],
  faq=[
    ('Saako pihatöistä kotitalousvähennystä?',
     'Asunnon pihalla tehdyn työn työosuudesta voi tietyin edellytyksin saada kotitalousvähennystä. '
     'Uudisrakentaminen ei oikeuta vähennykseen. Voimassa olevat ehdot ja enimmäismäärät löytyvät '
     'osoitteesta <a href="https://www.vero.fi" rel="noopener">vero.fi</a>.'),
    ('Tarvitaanko pihatöihin lupa?',
     'Osa töistä on luvanvaraisia — esimerkiksi maanpinnan korkeuden muuttaminen, puiden kaato ja '
     'joissakin kunnissa myös isot katokset. Lupaehdot vahvistaa aina kunnan rakennusvalvonta, '
     'ja autamme hakemuksen valmistelussa.'),
    ('Miksi kiveys painuu?',
     'Lähes aina siksi, että pohja on tehty liian ohuena tai väärästä materiaalista, tai vesi ei '
     'pääse pois. Siksi pohjarakenne eritellään tarjouksessa — se on se osa, jossa säästäminen '
     'näkyy muutaman vuoden päästä.'),
    ('Mihin aikaan vuodesta työt tehdään?',
     'Kaivuu- ja kiveystyöt tehdään sulan maan aikana. Kerromme katselmuksessa, mihin ajankohtaan '
     'työ realistisesti sijoittuu.'),
  ],
  promises=[
    ('Pohja eritellään','Tarjouksesta näkee, mitä pohjarakenteessa tehdään ja millä paksuudella.'),
    ('Vedet ohjataan','Kaadot ja vedenpoisto suunnitellaan osana työtä, ei jälkikäteen.'),
    ('Sovittu aikataulu','Aikataulu kirjataan sopimukseen. Sääesteistä kerrotaan heti.'),
  ],
  about='tekee pihakiveykset, terassit, salaojat ja maanrakennustyöt kotitalouksille, '
        'taloyhtiöille ja yrityksille.',
),

}
