# -*- coding: utf-8 -*-
"""Mallisivustojen sisältö.

Nämä ovat myyntikäyttöön tarkoitettuja malleja, eivät oikeita yrityksiä.
Siksi nimet ovat yleisnimiä ja jokaisella sivulla on näkyvä mallihuomautus:
sivusto ei saa esittää olevansa kenenkään olemassa olevan yrityksen sivu.
Kaikki yrityskohtainen tieto on paikanvaraaja.
"""

SITES = {

'sahko': dict(
  slug='sahko', glyph='salama', cta='Pyydä tarjous', hue=38, sat=0.50, dark_sat=0.34,
  brand1='Sähkö', brand2='asennus',
  name='Sähköasennus',
  title='Sähköasennukset ja sähköremontit',
  desc='Sähköasennukset, sähköremontit, keskuksen uusiminen ja vikakorjaukset.',
  h1='Sähköasennukset ja sähkökorjaukset',
  lede='Sähköasennukset uudiskohteisiin, sähköremontit vanhaan ja vikakorjaukset. '
       'Käyttöönottotarkastus tehdään ja pöytäkirja jää tilaajalle.',
  hero='sahko-hero',
  facts=[('Asennukset','Uudiskohteet, remontit ja vikakorjaukset.'),
         ('Käyttöönotto','Sähköasennuksista tehdään käyttöönottotarkastus ja pöytäkirja.'),
         ('Pätevyys','<span class="tbd">sähköpätevyys ja rekisterit</span>')],
  services=[
    ('Sähköasennukset uudiskohteisiin','sahko-keskus',
     'Uuden rakennuksen koko sähköistys: keskus, ryhmäjohdot, pistorasiat, '
     'valaistus ja kytkennät. Sovitamme työn yhteen rakennusurakan aikatauluun.',
     ['Sähkökeskus ja ryhmäjohdot','Pistorasiat ja kytkimet','Valaistusasennukset',
      'Antenni- ja tietoliikennekaapelointi','Käyttöönottotarkastus ja dokumentit']),
    ('Sähköremontit ja saneeraus','sahko-kaapeli',
     'Vanhan sähköjärjestelmän uusiminen kokonaan tai osittain. Kohde käydään läpi '
     'ennen tarjousta, koska vanhan asennuksen laajuus selviää vasta paikan päällä.',
     ['Koko asunnon sähköremontti','Keskuksen uusiminen','Vanhan johdotuksen vaihto',
      'Lisäpistorasiat ja -ryhmät','Kylpyhuoneen sähköt']),
    ('Valaistus','sahko-valo',
     'Valaistuksen suunnittelu ja asennus sisälle ja ulos. Vanhat valaisimet '
     'voidaan vaihtaa samalla käynnillä.',
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
     'Se riippuu työtilanteesta ja kohteesta. Soita ja kysy, niin kerromme '
     'milloin pystymme aloittamaan.'),
  ],
  promises=[
    ('Kirjallinen tarjous','Tarjouksessa on eritelty, mitä hintaan kuuluu ja mitä ei.'),
    ('Käyttöönottotarkastus','Tarkastus tehdään ja pöytäkirja jää tilaajalle.'),
    ('Ryhmien merkinnät','Ryhmät merkitään keskukseen asennuksen yhteydessä.'),
  ],
  about='tekee sähköasennukset, sähköremontit ja vikakorjaukset kotitalouksille, '
        'taloyhtiöille ja yrityksille.',
),

'maalaus': dict(
  slug='maalaus', glyph='tela', cta='Pyydä tarjous', hue=8, sat=0.52, dark_sat=0.42,
  brand1='Maalaus', brand2='liike',
  name='Maalausliike',
  title='Maalaus- ja tasoitetyöt',
  desc='Sisämaalaus, ulkomaalaus, tasoitetyöt ja tapetointi.',
  h1='Sisä- ja ulkomaalaus sekä tapetointi',
  lede='Sisä- ja ulkomaalaus, tasoitetyöt ja tapetointi. Suojaus, tasoitus ja '
       'pohjustus sisältyvät työhön.',
  hero='maalaus-hero',
  facts=[('Pohjatyö','Suojaus, tasoitus ja pohjustus kuuluvat työhön.'),
         ('Sisä ja ulko','Asunnot, julkisivut, tasoitetyöt ja tapetointi.'),
         ('Toimialue','<span class="tbd">toimialue</span>')],
  services=[
    ('Sisämaalaus','maalaus-sisa',
     'Asuntojen ja toimitilojen sisämaalaus. Suojaus, tasoitus ja pohjustus '
     'kuuluvat työhön.',
     ['Seinien ja kattojen maalaus','Listat, ovet ja karmit','Keittiön kalusteovet',
      'Kosteiden tilojen pinnat','Suojaus ja loppusiivous']),
    ('Ulkomaalaus ja julkisivut','maalaus-ulko',
     'Puujulkisivun huoltomaalaus ja uuden pinnan maalaus. Vanha pinta pestään ja '
     'irtoava maali poistetaan ennen uutta — muuten uusi pinta irtoaa vanhan mukana.',
     ['Puujulkisivun huoltomaalaus','Pesu ja irtoavan maalin poisto','Homeenpoisto ja pohjustus',
      'Räystäät, ikkunat ja ovet','Peltipintojen maalaus']),
    ('Tasoitetyöt','maalaus-tasoite',
     'Seinien ja kattojen tasoitus maalausta tai tapetointia varten. Tasoituksella '
     'pinta oikaistaan suoraksi ennen maalia tai tapettia.',
     ['Seinien ja kattojen tasoitus','Saumojen ja ruuvinkantojen tasoitus',
      'Vanhan pinnan korjaus','Hionta ja pölynhallinta']),
    ('Tapetointi','maalaus-suoja',
     'Tapetointi ja vanhan tapetin poisto. Pohja tasoitetaan ja pohjustetaan '
     'ennen uuden tapetin kiinnitystä.',
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
    ('Pohjatyö sisältyy','Suojaus, tasoitus ja pohjustus sisältyvät maalaustyöhön.'),
    ('Suojaus','Lattiat, kalusteet ja ikkunat suojataan työn ajaksi.'),
    ('Aikataulu','Aikataulu kirjataan sopimukseen. Muutoksista kerrotaan heti.'),
  ],
  about='tekee sisä- ja ulkomaalaukset, tasoitetyöt ja tapetoinnit kotitalouksille, '
        'taloyhtiöille ja yrityksille.',
),

'piha': dict(
  slug='piha', glyph='talo', cta='Pyydä tarjous', hue=108, sat=0.48, dark_sat=0.46,
  brand1='Piha', brand2='ja maanrakennus',
  name='Piha- ja maanrakennus',
  title='Pihatyöt, kiveykset ja maanrakennus',
  desc='Kiveykset, terassit, salaojat ja pihan pohjatyöt.',
  h1='Kiveykset, terassit ja maanrakennustyöt',
  lede='Kiveykset, terassit, salaojat ja maanrakennustyöt. Pohjarakenne ja '
       'vedenpoisto eritellään tarjouksessa.',
  hero='piha-hero',
  facts=[('Pohjatyö','Routaeristys ja pohjarakenne kuuluvat kiveystyöhön.'),
         ('Vedenpoisto','Salaojat ja kaadot tehdään osana pihan rakennetta.'),
         ('Toimialue','<span class="tbd">toimialue</span>')],
  services=[
    ('Kiveykset ja laatoitukset','piha-kivi',
     'Pihakiveykset, kulkuväylät ja autopaikat. Työhön kuuluvat pohjarakenne, '
     'routaeristys ja kaadot.',
     ['Pihakiveykset ja kulkuväylät','Autopaikat ja ajoluiskat','Reunatuet ja rajaukset',
      'Pohjatyöt ja routaeristys','Vanhan kiveyksen korjaus']),
    ('Terassit ja katokset','piha-terassi',
     'Terassit, portaat ja katokset. Puurakenne tehdään tuulettuvaksi ja '
     'kuivuvaksi.',
     ['Puuterassit ja portaat','Komposiittiterassit','Terassin kaiteet',
      'Katokset ja pergolat','Vanhan terassin uusiminen']),
    ('Salaojat ja sadevedet','piha-salaoja',
     'Salaojitus, sadevesiviemärit ja pintavesien ohjaus. Vedet ohjataan pois '
     'perustusten vierestä.',
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
     'joissakin kunnissa myös isot katokset. Lupaehdot vahvistaa aina kunnan '
     'rakennusvalvonta.'),
    ('Miksi kiveys painuu?',
     'Lähes aina siksi, että pohja on tehty liian ohuena tai väärästä materiaalista, tai vesi ei '
     'pääse pois. Siksi pohjarakenne eritellään tarjouksessa.'),
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


'katto': dict(
  slug='katto', glyph='talo', cta='Pyydä tarjous', hue=205, sat=0.50, dark_sat=0.52,
  brand1='Katto', brand2='palvelu',
  name='Kattoasennus',
  title='Kattoremontit ja kattojen huolto',
  desc='Katteen uusiminen, kattoremontit, räystäät ja sadevesijärjestelmät.',
  h1='Kattoremontit ja katteen uusiminen',
  lede='Katteen uusiminen, kattoremontit ja huoltotyöt. Katto katsotaan paikan '
       'päällä ennen tarjousta.',
  hero='katto-hero',
  facts=[('Katteet','Pelti, tiili ja huopa.'),
         ('Tarkastus','Katto käydään läpi ennen tarjousta.'),
         ('Toimialue','<span class="tbd">toimialue</span>')],
  services=[
    ('Katteen uusiminen','katto-tiili',
     'Vanhan katteen purku ja uuden asennus. Aluskate, ruoteet ja läpiviennit '
     'käydään läpi ja uusitaan tarvittaessa samalla.',
     ['Vanhan katteen purku ja jätehuolto','Aluskate ja ruoteet','Tiilikatteen asennus',
      'Huopakatteen asennus','Läpiviennit ja tiivistykset']),
    ('Peltikatot','katto-pelti',
     'Konesaumatut ja profiilipeltikatot uudiskohteisiin ja saneeraukseen. '
     'Työhön kuuluvat saumat, kiinnitykset ja pellitykset.',
     ['Profiilipeltikatot','Konesaumakatot','Pellitykset ja listat',
      'Peltikaton huoltomaalaus','Lumiesteet ja kattosillat']),
    ('Räystäät ja sadevedet','katto-raystas',
     'Räystäskourut, syöksytorvet ja niiden korjaus. Sadevedet ohjataan katolta '
     'maahan ja pois perustusten vierestä.',
     ['Räystäskourut ja syöksytorvet','Kourujen puhdistus ja korjaus',
      'Otsalaudat ja räystäslaudoitus','Sadevesien ohjaus maahan']),
    ('Kattoturvatuotteet','lista',
     'Lumiesteet, kattosillat, tikkaat ja kattoluukut. Nämä tarvitaan, jotta '
     'katolle pääsee huoltamaan ja nuohoamaan turvallisesti.',
     ['Lumiesteet','Kattosillat ja tikkaat','Turvakiskot ja kiinnityspisteet',
      'Kattoluukut ja huoltoluukut']),
  ],
  customers=[
    ('Kotitaloudet','Omakotitalojen kattoremontit, katteen uusiminen ja vuotojen korjaus.'),
    ('Taloyhtiöt','Taloyhtiöiden kattourakat, räystäät ja kattoturvatuotteet.'),
    ('Yritykset','Toimitilojen ja hallien katteet ja kattojen huolto.'),
    ('Aliurakointi','Kattotyöt osana toisen urakoitsijan kokonaisuutta.'),
  ],
  faq=[
    ('Kuinka usein katto pitää tarkastaa?',
     'Katon kunto kannattaa katsoa säännöllisesti ja aina rajujen sääilmiöiden jälkeen. '
     'Kourut kannattaa puhdistaa vähintään kerran vuodessa, koska tukkeutunut kouru ohjaa '
     'veden seinälle.'),
    ('Mistä vuoto yleensä alkaa?',
     'Harvoin katteen keskeltä. Tavallisimpia paikkoja ovat läpiviennit, jiirit, '
     'piipun juuri ja räystäs. Siksi ne katsotaan ensin.'),
    ('Tarvitaanko kattoremonttiin lupa?',
     'Katteen vaihto samaan materiaaliin ei yleensä vaadi lupaa, mutta materiaalin tai '
     'värin vaihto voi vaatia toimenpideluvan. Lupaehdot vahvistaa aina kunnan '
     'rakennusvalvonta.'),
    ('Saako kattotyöstä kotitalousvähennystä?',
     'Asunnon kattotyön työosuudesta voi tietyin edellytyksin saada kotitalousvähennystä. '
     'Uudisrakentaminen ei oikeuta vähennykseen. Ehdot löytyvät osoitteesta '
     '<a href="https://www.vero.fi" rel="noopener">vero.fi</a>.'),
  ],
  promises=[
    ('Katto katsotaan ensin','Hinta annetaan vasta kun katto on käyty läpi paikan päällä.'),
    ('Aluskate ja ruoteet','Alusrakenteen kunto tarkastetaan ja uusitaan tarvittaessa.'),
    ('Työ eritellään','Tarjouksesta näkee purun, alusrakenteen ja katteen hinnat erikseen.'),
  ],
  about='tekee kattoremontit, katteen uusimiset ja kattojen huoltotyöt.',
),

'lattia': dict(
  slug='lattia', glyph='talo', cta='Pyydä tarjous', hue=26, sat=0.46, dark_sat=0.32,
  brand1='Lattia', brand2='asennus',
  name='Lattia-asennus',
  title='Parketit, laminaatit ja laatoitus',
  desc='Parketti- ja laminaattiasennukset, laatoitus ja lattian tasoitus.',
  h1='Parketti-, laminaatti- ja laatoitustyöt',
  lede='Parketit, laminaatit, vinyylit ja laatoitukset. Alusta tasoitetaan ja '
       'kosteus mitataan ennen asennusta.',
  hero='lattia-hero',
  facts=[('Materiaalit','Parketti, laminaatti, vinyyli ja laatta.'),
         ('Alusta','Tasoitus ja kosteusmittaus ennen asennusta.'),
         ('Toimialue','<span class="tbd">toimialue</span>')],
  services=[
    ('Parketti ja laminaatti','ruudukko',
     'Parketti-, laminaatti- ja vinyylilattioiden asennus. Alusta tasoitetaan ja '
     'kosteus mitataan ennen asennusta, ja materiaali saa tasaantua tilassa.',
     ['Parkettiasennukset','Laminaatti ja vinyyli','Alustan tasoitus',
      'Jalkalistat ja siirtymälistat','Vanhan lattian purku']),
    ('Laatoitus','lattia-laatta',
     'Lattia- ja seinälaatoitus märkätiloihin ja kuiviin tiloihin. Märkätilaan '
     'tehdään vedeneristys ennen laatoitusta.',
     ['Kylpyhuoneiden laatoitus','Vedeneristys','Keittiön välitilat',
      'Lattialaatoitukset','Saumaukset ja silikonit']),
    ('Lattian tasoitus','aallot',
     'Lattian oikaisu tasoitteella ennen pintamateriaalin asennusta. Tasoituksen '
     'jälkeen alusta on suora ja kuiva.',
     ['Pumpputasoitus','Käsintasoitus','Kaadot märkätiloihin',
      'Vanhan liiman ja tasoitteen poisto','Kosteusmittaukset']),
    ('Lattialämmitys','kehat',
     'Vesikiertoisen ja sähköisen lattialämmityksen asennus pintamateriaalin alle. '
     'Kytkennät jäävät sähköurakoitsijalle.',
     ['Lattialämmityskaapelit ja -matot','Vesikiertoiset putkistot',
      'Tasoitus lämmityksen päälle','Yhteensovitus muiden urakoitsijoiden kanssa']),
  ],
  customers=[
    ('Kotitaloudet','Asuntojen lattiaremontit, kylpyhuoneet ja keittiöt.'),
    ('Taloyhtiöt','Porraskäytävät, yhteiset tilat ja märkätilaremontit.'),
    ('Yritykset','Toimitilojen lattiat ja pintojen uusiminen.'),
    ('Rakennusliikkeet','Lattia- ja laatoitustyöt osana urakkaa.'),
  ],
  faq=[
    ('Miksi lattia kupruilee?',
     'Lähes aina siksi, että alusta ei ollut suora tai kuiva, tai liikuntavaraa ei jätetty '
     'reunoille. Siksi alusta mitataan ja tasoitetaan ennen asennusta.'),
    ('Kauanko lattiaremontti kestää?',
     'Riippuu pinta-alasta ja siitä, paljonko tasoitusta ja kuivumisaikaa tarvitaan. '
     'Tasoite ja vedeneristys vaativat oman kuivumisaikansa, eikä sitä voi ohittaa.'),
    ('Kuka saa tehdä märkätilan vedeneristyksen?',
     'Märkätilan vedeneristys edellyttää henkilösertifikaattia. Sen voi pyytää '
     'nähtäväksi ennen työn tilaamista.'),
    ('Saako lattiatyöstä kotitalousvähennystä?',
     'Asunnossa tehdyn työn työosuudesta voi tietyin edellytyksin saada kotitalousvähennystä. '
     'Ehdot löytyvät osoitteesta <a href="https://www.vero.fi" rel="noopener">vero.fi</a>.'),
  ],
  promises=[
    ('Alusta mitataan','Suoruus ja kosteus mitataan ennen asennusta.'),
    ('Kuivumisajat','Tasoite ja vedeneristys kuivuvat valmistajan ilmoittaman ajan.'),
    ('Työ eritellään','Tarjouksesta näkee purun, tasoituksen ja asennuksen hinnat erikseen.'),
  ],
  about='tekee parketti-, laminaatti- ja laatoitustyöt sekä lattioiden tasoitukset.',
),

'kiinteisto': dict(
  slug='kiinteisto', glyph='avain', cta='Pyydä tarjous', hue=228, sat=0.50, dark_sat=0.52,
  brand1='Kiinteistö', brand2='huolto',
  name='Kiinteistöhuolto',
  title='Kiinteistöhuolto ja kunnossapito',
  desc='Kiinteistöjen huolto, kunnossapito, piha-alueet ja päivystys.',
  h1='Kiinteistöjen huolto ja kunnossapito',
  lede='Kiinteistöjen huolto ja kunnossapito taloyhtiöille ja kiinteistön'
       'omistajille. Sovitut työt kirjataan huoltokirjaan.',
  hero='kiinteisto-hero',
  facts=[('Huoltosopimus','Sovittu huolto sovituin väliajoin.'),
         ('Palvelut','Tekniset tilat, piha-alueet ja pienet korjaukset.'),
         ('Päivystys','<span class="tbd">päivystyksen ajat ja ehdot</span>')],
  services=[
    ('Kiinteistön huolto','lista',
     'Sovittu säännöllinen huolto: tekniset tilat, ilmanvaihto, lämmitys ja '
     'yleiset tilat. Huollosta jää merkintä, joten tiedetään mitä on tehty ja milloin.',
     ['Tekniset tilat ja lämmönjako','Ilmanvaihdon suodattimet','Yleisten tilojen tarkastukset',
      'Lamppujen ja pienosien vaihdot','Huoltokirjan ylläpito']),
    ('Piha-alueet','ruudukko',
     'Piha-alueiden hoito ympäri vuoden: talvikunnossapito, nurmikot ja '
     'istutukset. Talvikunnossapidon laajuus sovitaan sopimuksessa.',
     ['Lumityöt ja liukkaudentorjunta','Nurmikon leikkuu','Istutusten hoito',
      'Piha-alueiden siisteys','Hiekoitushiekan poisto']),
    ('Korjaus- ja pientyöt','tyokalut',
     'Pienet korjaukset ilman erillistä urakkaa: lukot, ovet, hanat, kalusteet. '
     'Kerromme suoraan, jos työ vaatii erikoisurakoitsijan.',
     ['Lukot ja ovipumput','Vesikalusteiden pienkorjaukset','Kalusteiden korjaukset',
      'Kiinnitykset ja asennukset','Vikailmoitusten käsittely']),
    ('Päivystys','kello',
     'Päivystys sovittuina aikoina kiireellisiä vikoja varten. '
     'Päivystyksen ajat ja hinnoittelu sovitaan huoltosopimuksessa.',
     ['Kiireelliset vikailmoitukset','Vahinkojen rajaaminen',
      'Yhteydenpito urakoitsijoihin','Raportointi isännöitsijälle']),
  ],
  customers=[
    ('Taloyhtiöt','Sovittu huolto, piha-alueet, talvikunnossapito ja pienet korjaukset.'),
    ('Kiinteistönomistajat','Yksittäisten kiinteistöjen huolto ja kunnossapito.'),
    ('Yritykset','Toimitilojen huolto ja piha-alueiden hoito.'),
    ('Isännöitsijät','Huoltokumppani, joka raportoi tehdyt työt.'),
  ],
  faq=[
    ('Mitä huoltosopimukseen kuuluu?',
     'Se sovitaan kiinteistökohtaisesti ja kirjataan sopimukseen. Tavallisesti mukana ovat '
     'säännölliset tarkastuskäynnit, piha-alueet ja pienet korjaustyöt; erikoisurakat '
     'sovitaan erikseen.'),
    ('Kuinka nopeasti tulette vikailmoituksen jälkeen?',
     'Vasteajat sovitaan sopimuksessa ja ne riippuvat vian kiireellisyydestä.'),
    ('Hoidatteko myös talvikunnossapidon?',
     'Kyllä, jos se sisällytetään sopimukseen. Talvikunnossapito on myös vastuukysymys: '
     'liukastumisesta vastaa kiinteistön haltija.'),
    ('Voiko yksittäisen työn tilata ilman sopimusta?',
     'Kysy erikseen. Yksittäiset työt tehdään työtilanteen mukaan.'),
  ],
  promises=[
    ('Tehdyt työt kirjataan','Huoltokirjasta näkee mitä on tehty ja milloin.'),
    ('Vasteajat sopimuksessa','Vikailmoitusten vasteajat kirjataan huoltosopimukseen.'),
    ('Erikoisurakat erikseen','Erikoisurakoitsijaa vaativat työt kerrotaan ja sovitaan erikseen.'),
  ],
  about='hoitaa kiinteistöjen huollon, kunnossapidon ja piha-alueet.',
),

'siivous': dict(
  slug='siivous', glyph='pisara', cta='Pyydä tarjous', hue=186, sat=0.50, dark_sat=0.50,
  brand1='Siivous', brand2='palvelu',
  name='Siivouspalvelu',
  title='Siivouspalvelut koteihin ja toimitiloihin',
  desc='Kotisiivous, toimitilasiivous, muutto- ja rakennussiivoukset.',
  h1='Koti- ja toimitilasiivoukset',
  lede='Kotisiivoukset, toimitilojen siivous sekä muutto- ja rakennussiivoukset. '
       'Työlista ja siivousväli sovitaan kirjallisesti.',
  hero='siivous-hero',
  facts=[('Sovittu lista','Työn sisältö kirjataan, ei sovita suullisesti.'),
         ('Siivousväli','Säännöllinen tai kertaluonteinen siivous.'),
         ('Toimialue','<span class="tbd">toimialue</span>')],
  services=[
    ('Kotisiivous','kehat',
     'Säännöllinen tai kertaluonteinen kotisiivous sovitun työlistan mukaan. '
     'Lista käydään läpi ensimmäisellä kerralla, jotta molemmat tietävät mitä tehdään.',
     ['Säännöllinen viikko- tai kuukausisiivous','Kertasiivoukset',
      'Ikkunanpesut','Kodinkoneiden puhdistus','Sovittu työlista kirjallisena']),
    ('Toimitilasiivous','liiketila',
     'Toimistojen, liiketilojen ja yhteisten tilojen siivous sovittuina aikoina. '
     'Käyntiajat sovitaan tilan oman toiminnan mukaan.',
     ['Toimistot ja neuvottelutilat','Liiketilat','Yhteiset tilat ja porraskäytävät',
      'Sosiaalitilat','Siivousaikataulu sovitaan erikseen']),
    ('Muuttosiivous','pinot',
     'Muuttosiivous asunnon luovutusta varten. Työhön kuuluvat kaapistot sisältä, '
     'kodinkoneiden taustat ja kylpyhuone.',
     ['Kaapistot sisältä','Kodinkoneet ja niiden taustat','Kylpyhuone ja saunatilat',
      'Ikkunat ja karmit','Lattioiden peruspesu']),
    ('Rakennussiivous','tyokalut',
     'Remontin tai rakennustyön jälkeinen siivous. Rakennuspölyn poistoon '
     'käytetään omia välineitä ja menetelmiä.',
     ['Rakennuspölyn poisto','Suojausten purku','Pintojen ensipesu',
      'Ikkunat ja karmit','Loppusiivous luovutusta varten']),
  ],
  customers=[
    ('Kotitaloudet','Säännöllinen kotisiivous, kertasiivoukset ja muuttosiivoukset.'),
    ('Taloyhtiöt','Porraskäytävät ja yhteiset tilat sovitun aikataulun mukaan.'),
    ('Yritykset','Toimistot ja liiketilat, siivous omien aukioloaikojen ulkopuolella.'),
    ('Rakennusliikkeet','Rakennus- ja loppusiivoukset kohteen luovutusta varten.'),
  ],
  faq=[
    ('Saako siivouksesta kotitalousvähennystä?',
     'Kotona teetetyn siivoustyön työosuudesta voi tietyin edellytyksin saada '
     'kotitalousvähennystä. Voimassa olevat ehdot ja enimmäismäärät löytyvät osoitteesta '
     '<a href="https://www.vero.fi" rel="noopener">vero.fi</a>.'),
    ('Tuotteko omat välineet ja aineet?',
     'Sovitaan erikseen ja kirjataan sopimukseen. Kerro, jos kotona on allergioita tai '
     'toiveita aineiden suhteen.'),
    ('Pitääkö minun olla paikalla?',
     'Ei tarvitse, jos avainten käytöstä on sovittu kirjallisesti. Ensimmäisellä kerralla '
     'on hyvä olla paikalla, jotta työlista käydään yhdessä läpi.'),
    ('Mitä jos jokin jää tekemättä?',
     'Kerro siitä, niin asia käydään läpi. Työlista on kirjallinen, joten sovittu '
     'sisältö on tarkistettavissa.'),
  ],
  promises=[
    ('Työlista on kirjallinen','Sovitut työt ja niiden tiheys kirjataan ennen aloitusta.'),
    ('Käyntiajat sovitaan','Siivousväli ja käyntiajat sovitaan etukäteen.'),
    ('Avaimista sovitaan','Avainten käytöstä sovitaan kirjallisesti ennen aloitusta.'),
  ],
  about='tekee kotisiivoukset, toimitilasiivoukset sekä muutto- ja rakennussiivoukset.',
),

'kuljetus': dict(
  slug='kuljetus', glyph='auto', cta='Pyydä tarjous', hue=340, sat=0.48, dark_sat=0.46,
  brand1='Kuljetus', brand2='ja muutot',
  name='Kuljetus ja muutot',
  title='Muutot ja kuljetuspalvelut',
  desc='Muuttopalvelut, tavarankuljetukset ja jätteiden ajot.',
  h1='Muutot ja tavarankuljetukset',
  lede='Muutot, tavarankuljetukset ja poisvientipalvelut. Hinta-arvio annetaan '
       'sen perusteella, mitä ja mistä muutetaan.',
  hero='auto-hero',
  facts=[('Muutot','Koti- ja toimistomuutot.'),
         ('Kuljetukset','Tavarankuljetukset ja poisvienti.'),
         ('Kalusto','<span class="tbd">kaluston koko ja kantavuus</span>')],
  services=[
    ('Kotimuutot','ruudukko',
     'Asuntomuutot pakkauksineen tai ilman. Muuton sisältö käydään läpi etukäteen, '
     'koska se määrää auton koon ja tarvittavan ajan.',
     ['Muuton suunnittelu ja arviointi','Pakkaus ja purku','Huonekalujen purku ja kokoaminen',
      'Kuljetus ja kantoapu','Pakkausmateriaalit']),
    ('Toimistomuutot','liiketila',
     'Toimistojen ja liiketilojen muutot sovittuna ajankohtana, tarvittaessa '
     'työajan ulkopuolella.',
     ['Toimistokalusteet','Arkistot ja laitteet','Muutto työajan ulkopuolella',
      'Merkintä ja purkujärjestys','Vanhan tilan tyhjennys']),
    ('Tavarankuljetukset','auto-nosturi',
     'Yksittäisten tavaroiden ja kuormien kuljetukset. Kerro mitä, mistä ja minne, '
     'niin sanomme onnistuuko se ja mitä se maksaa.',
     ['Yksittäiset kuljetukset','Huonekalujen noudot','Rakennustarvikkeiden ajot',
      'Nouto- ja toimituspalvelu']),
    ('Poisvienti ja tyhjennykset','pinot',
     'Vanhojen huonekalujen ja tavaroiden poisvienti sekä tilojen tyhjennykset. '
     'Kerromme, mitkä jätteet voidaan viedä ja mitkä vaativat erillisen käsittelyn.',
     ['Huonekalujen poisvienti','Varastojen ja kellareiden tyhjennys',
      'Kuolinpesien tyhjennykset','Jätteiden lajittelu ja toimitus']),
  ],
  customers=[
    ('Kotitaloudet','Asuntomuutot, yksittäiset kuljetukset ja poisviennit.'),
    ('Yritykset','Toimisto- ja liiketilamuutot sekä säännölliset kuljetukset.'),
    ('Taloyhtiöt','Yhteisten tilojen tyhjennykset ja poisviennit.'),
    ('Isännöitsijät ja pesänhoitajat','Tilojen tyhjennykset ja kuolinpesien muutot.'),
  ],
  faq=[
    ('Saako muutosta kotitalousvähennystä?',
     'Muuttopalvelun työosuudesta voi tietyin edellytyksin saada kotitalousvähennystä. '
     'Ehdot löytyvät osoitteesta <a href="https://www.vero.fi" rel="noopener">vero.fi</a>.'),
    ('Miten hinta määräytyy?',
     'Tavallisesti kuutioiden, matkan ja työajan mukaan. Siksi kysymme etukäteen, '
     'mitä ja mistä muutetaan.'),
    ('Onko tavara vakuutettu kuljetuksen aikana?',
     'Kysy tämä aina jokaiselta muuttoyritykseltä ja pyydä vastaus kirjallisena. '
     'Vakuutusturvan laajuus vaihtelee yrityksittäin.'),
    ('Pitääkö minun pakata itse?',
     'Ei tarvitse. Pakkaus voidaan sisällyttää työhön, tai voit pakata itse ja säästää '
     'siltä osin. Sovitaan etukäteen.'),
  ],
  promises=[
    ('Arvio perustuu tietoihin','Muuton sisältö kysytään ennen hinta-arvion antamista.'),
    ('Tavarat suojataan','Huonekalut suojataan kuljetuksen ajaksi.'),
    ('Aikataulu','Nouto- ja toimitusaika sovitaan etukäteen. Muutoksista kerrotaan heti.'),
  ],
  about='tekee koti- ja toimistomuutot, tavarankuljetukset ja poisvientipalvelut.',
),

'autokorjaamo': dict(
  slug='autokorjaamo', glyph='avain', cta='Varaa huolto', hue=250, sat=0.46, dark_sat=0.50,
  brand1='Auto', brand2='korjaamo',
  name='Autokorjaamo',
  title='Autohuollot ja korjaukset',
  desc='Määräaikaishuollot, korjaukset, rengastyöt ja katsastuspalvelu.',
  h1='Autojen huollot, korjaukset ja rengastyöt',
  lede='Määräaikaishuollot, korjaukset ja rengastyöt. Sovitun ulkopuolisista '
       'töistä kysytään aina ennen niiden tekemistä.',
  hero='auto-nosturi',
  facts=[('Huollot','Määräaikaishuollot ja korjaukset.'),
         ('Hinta etukäteen','Sovitusta työstä annetaan arvio ennen aloitusta.'),
         ('Merkit','<span class="tbd">merkit ja erikoisosaaminen</span>')],
  services=[
    ('Määräaikaishuollot','kello',
     'Huolto-ohjelman mukaiset huollot. Tehty huolto merkitään huoltokirjaan.',
     ['Öljyn- ja suodattimenvaihdot','Huolto-ohjelman mukaiset työt',
      'Jarrujen tarkastus','Nesteiden tarkastus ja lisäys','Merkintä huoltokirjaan']),
    ('Korjaukset','tyokalut',
     'Vikadiagnoosi ja korjaus. Vika ja korjauksen hinta kerrotaan ennen työn '
     'aloittamista.',
     ['Vikadiagnostiikka','Jarrutyöt','Jakopään ja hihnojen vaihdot',
      'Jousitus ja iskunvaimentimet','Pakoputkistot']),
    ('Rengastyöt','auto-hero',
     'Rengastyöt ja renkaiden säilytys. Kausivaihdon yhteydessä tarkistetaan '
     'renkaiden kunto ja urasyvyys.',
     ['Rengaskausivaihdot','Rengaspaikkaukset','Tasapainotukset',
      'Renkaiden kunnon tarkastus','Renkaiden säilytys']),
    ('Katsastuspalvelu','lista',
     'Katsastustarkastus ennen katsastusta ja jälkitarkastukseen johtavien vikojen '
     'korjaus samalla käynnillä.',
     ['Katsastustarkastus etukäteen','Vikojen korjaus','Jälkitarkastuksen valmistelu',
      'Päästömittaukset']),
  ],
  customers=[
    ('Yksityisasiakkaat','Henkilöautojen huollot, korjaukset ja rengastyöt.'),
    ('Yritykset','Työsuhdeautot ja pakettiautot sovituin huoltoväliajoin.'),
    ('Taloyhtiöt ja yhdistykset','Yhteiskäytössä olevien ajoneuvojen huolto.'),
    ('Autoilijat matkalla','Yksittäiset korjaukset ja tarkastukset.'),
  ],
  faq=[
    ('Menettääkö auto takuun, jos huollatan muualla kuin merkkiliikkeessä?',
     'Ei menetä, jos huolto tehdään valmistajan huolto-ohjelman mukaisesti ja se '
     'dokumentoidaan. Säilytä kuitit ja huoltomerkinnät.'),
    ('Saanko hinta-arvion etukäteen?',
     'Kyllä. Jos työn aikana löytyy jotain muuta, soitamme ennen kuin teemme sen. '
     'Emme korjaa sovitun ulkopuolisia asioita ilman lupaa.'),
    ('Kuinka kauan huolto kestää?',
     'Määräaikaishuolto yleensä saman päivän aikana, korjaus riippuu osien saatavuudesta. '
     'Kerromme arvion, kun tiedämme mitä tarvitaan.'),
    ('Saanko vanhat osat takaisin?',
     'Saat, jos pyydät sitä työn tilaamisen yhteydessä.'),
  ],
  promises=[
    ('Lisätöistä kysytään','Sovitun ulkopuolisista töistä soitetaan ennen tekemistä.'),
    ('Vika kerrotaan','Kerromme mikä vikana oli ja mitä sille tehtiin.'),
    ('Työ eritellään','Tehdyt työt ja vaihdetut osat näkyvät laskussa eriteltyinä.'),
  ],
  about='tekee autojen määräaikaishuollot, korjaukset ja rengastyöt.',

  # Oletusvaiheet puhuvat kohteessa kaymisesta ja urakkatarjouksesta.
  # Korjaamolla asiakas tuo auton — vaiheet ovat toiset.
  steps=[
    ('Varaa aika',
     'Soita ja kerro auton merkki, vuosimalli ja mikä vaivaa. Kerromme '
     'milloin pääset ja mitä huolto suunnilleen maksaa.'),
    ('Auto tarkastetaan',
     'Vika etsitään ennen kuin mitään vaihdetaan. Kerromme mitä löytyi ja '
     'mitä korjaus maksaa.'),
    ('Hyväksyntä ja työ',
     'Työ tehdään vasta kun hinta on hyväksytty. Jos matkalla löytyy muuta, '
     'siitä soitetaan ennen jatkamista.'),
    ('Auto luovutetaan',
     'Luovutuksen yhteydessä kerrotaan, mitä tehtiin. Vaihdetut osat saa '
     'nähdä pyydettäessä.'),
  ],
  steps_eyebrow='NÄIN HUOLTO MENEE',
  services_lede='Määräaikaishuollot, korjaukset, rengastyöt ja '
                'katsastuspalvelu. Kaikkiin varataan aika etukäteen.',
  cta_title='Varaa huoltoaika',
  cta_text='Soita ja kerro auton merkki, vuosimalli ja mikä vaivaa. '
           'Kerromme hinta-arvion ja vapaan ajan heti puhelimessa.',
  contact_lede='Kerro auton merkki, vuosimalli ja mikä vaivaa, niin osaamme '
               'varata oikean määrän aikaa.',
  way_title='Miten korjaamme',
  way_text='Vika etsitään ennen kuin osia vaihdetaan, ja hinta kerrotaan '
           'ennen kuin työ aloitetaan. Jos työn aikana löytyy jotain muuta, '
           'siitä soitetaan ennen jatkamista.',
  way=[
    ('Vika etsitään ensin',
     'Vika paikannetaan ennen kuin osia vaihdetaan.'),
    ('Hinta ennen työtä',
     'Arvio kerrotaan ennen aloitusta. Työ tehdään vasta hyväksynnän jälkeen.'),
    ('Muutoksista soitetaan',
     'Jos korjauksen aikana löytyy muuta, siitä kysytään ennen tekemistä.'),
    ('Vanhat osat näytetään',
     'Vaihdetut osat saa nähdä pyydettäessä.'),
  ],
),

'kampaamo': dict(
  slug='kampaamo', glyph='sakset', cta='Varaa aika', hue=330, sat=0.44, dark_sat=0.44,
  brand1='Parturi', brand2='kampaamo',
  name='Parturi-kampaamo',
  title='Hiustenleikkaukset ja värjäykset',
  desc='Leikkaukset, värjäykset ja hoidot. Ajanvaraus puhelimitse.',
  h1='Leikkaukset, värjäykset ja hoidot',
  lede='Leikkaukset, värjäykset ja hoidot. Ajanvaraus puhelimitse, ja hinta-arvio '
       'kerrotaan jo varauksen yhteydessä.',
  hero='kampaamo-hero',
  facts=[('Ajanvaraus','<span class="tbd">puhelinnumero ja varaustapa</span>'),
         ('Aukioloajat','<span class="tbd">aukioloajat</span>'),
         ('Hinnasto','<span class="tbd">hinnasto</span>')],
  services=[
    ('Leikkaukset','lista',
     'Leikkaukset kaikenikäisille. Ennen leikkausta käydään läpi hiusten rakenne '
     'ja se, paljonko muotoiluun on aikaa arkena.',
     ['Parturileikkaukset','Kampaamoleikkaukset','Lasten leikkaukset',
      'Partakoneleikkaukset','Muotoilu ja viimeistely']),
    ('Värjäykset','aallot',
     'Värjäykset, raidoitukset ja sävytykset. Isoissa värinmuutoksissa hiusten '
     'kunto katsotaan ensin ja muutos tehdään tarvittaessa useammalla kerralla.',
     ['Kokovärjäykset','Raidat ja balayage','Sävytykset ja kirkastukset',
      'Tyvivärjäykset','Värinpoistot']),
    ('Hoidot','kehat',
     'Hiuspohjan ja hiusten hoidot. Lähtötilanne käydään läpi ennen hoidon '
     'valintaa.',
     ['Tehohoidot','Hiuspohjan hoidot','Hoitoaineet ja naamiot',
      'Kotihoito-ohjeet']),
    ('Kampaukset','ruudukko',
     'Juhlakampaukset ja muotoilut. Häihin ja isoihin juhliin kannattaa varata '
     'koekampaus etukäteen.',
     ['Juhlakampaukset','Hääkampaukset ja koekampaus','Föönaukset',
      'Kiharrus ja suoristus']),
  ],
  customers=[
    ('Aikuiset','Leikkaukset, värjäykset ja hoidot.'),
    ('Lapset ja nuoret','Leikkaukset rauhallisessa tahdissa.'),
    ('Juhlat ja häät','Kampaukset ja koekampaukset sovittuna aikana.'),
    ('Yritykset','Sovitut ajat ryhmille tai henkilöstölle.'),
  ],
  faq=[
    ('Miten varaan ajan?',
     'Soittamalla. Ajanvarausnumero ja aukioloajat löytyvät yhteystiedoista.'),
    ('Paljonko leikkaus maksaa?',
     'Hinta riippuu työstä ja hiusten pituudesta. Hinnasto löytyy yhteystiedoista, ja '
     'kerromme hinnan myös puhelimessa ennen varausta.'),
    ('Kuinka kauan värjäys kestää?',
     'Vaihtelee paljon: tyvivärjäys on nopea, iso värinmuutos voi viedä useita tunteja. '
     'Kerromme arvion varauksen yhteydessä, jotta voit varata aikaa riittävästi.'),
    ('Voinko peruuttaa ajan?',
     'Voit. Ilmoita mahdollisimman ajoissa, niin aika voidaan antaa jollekin toiselle.'),
  ],
  promises=[
    ('Hiusten kunto katsotaan','Lähtötilanne ja toiveet käydään läpi ennen aloitusta.'),
    ('Hinta ennen aloitusta','Hinta kerrotaan ennen työn aloittamista.'),
    ('Kotihoito-ohjeet','Kotihoidon ohjeet käydään läpi käynnin lopuksi.'),
  ],
  about='tekee leikkaukset, värjäykset, hoidot ja juhlakampaukset.',

  # Kampaamokaynti on yksi kaynti, ei nelivaiheinen urakka.
  steps=[
    ('Ajanvaraus',
     'Soitat ja kerrot mitä olet ajatellut. Kerromme arvion ajasta ja hinnasta '
     'jo puhelimessa.'),
    ('Lähtötilanne katsotaan',
     'Ennen aloitusta käydään läpi hiusten kunto ja se, mitä olet toivonut.'),
    ('Työ ja kotihoito-ohjeet',
     'Leikkauksen tai värjäyksen jälkeen kerromme, miten kampaus pysyy hyvänä '
     'kotona.'),
  ],
  steps_eyebrow='NÄIN KÄYNTI MENEE',
  services_title='Mitä teemme',
  customers_title='Kenelle teemme',
  services_lede='Leikkaukset, värjäykset, hoidot ja juhlakampaukset. '
                'Kaikkiin varataan aika puhelimitse.',
  cta_title='Varaa aika',
  cta_text='Soita ja kerro mitä olet ajatellut, niin katsotaan sopiva aika. '
           'Kerromme hinta-arvion jo puhelimessa.',
  contact_lede='Ajanvaraus käy puhelimitse. Kerro mitä olet ajatellut, niin '
               'osaamme varata riittävästi aikaa.',
  way_title='Miten työskentelemme',
  way_text='Jokainen käynti alkaa siitä, että katsotaan hiusten kunto ja '
           'kuullaan mitä haluat. Hinta kerrotaan ennen aloitusta, eikä '
           'mitään tehdä sopimatta.',
  way=[
    ('Toive käydään läpi ennen aloitusta',
     'Jos toivottu tyyli ei toimi hiustyypillä, se kerrotaan ennen aloitusta.'),
    ('Hinta ennen aloitusta',
     'Hinta kerrotaan ennen aloitusta. Jos työ laajenee, siitä kysytään erikseen.'),
    ('Iso värinmuutos jaetaan',
     'Isoa värinmuutosta ei tehdä yhdellä kerralla, jos hius ei kestä sitä.'),
    ('Kotihoito-ohjeet',
     'Ohjeet lopputuloksen hoitoon käydään läpi käynnin lopuksi.'),
  ],
),

'ravintola': dict(
  slug='ravintola', glyph='lautanen', cta='Ota yhteyttä', hue=45, sat=0.44, dark_sat=0.32,
  brand1='Lounas', brand2='ravintola',
  name='Ravintola',
  title='Lounasravintola ja tilausruoat',
  desc='Lounas, tilausruoat ja kokoustarjoilut.',
  h1='Lounas, tilausruoat ja kokoustarjoilut',
  lede='Lounas, tilausruoat ja kokoustarjoilut. Ruokalista julkaistaan viikoksi '
       'kerrallaan.',
  hero='ravintola-hero',
  facts=[('Lounas','<span class="tbd">lounasajat</span>'),
         ('Aukioloajat','<span class="tbd">aukioloajat</span>'),
         ('Hinnasto','<span class="tbd">hinnasto</span>')],
  services=[
    ('Lounas','ruudukko',
     'Lounas paikan päällä tai mukaan. Ruokalista julkaistaan viikoksi '
     'kerrallaan.',
     ['Lämmin ruoka ja kasvisvaihtoehto','Salaattipöytä','Leipä ja juomat',
      'Viikon ruokalista etukäteen','Erityisruokavaliot huomioidaan']),
    ('Tilausruoat','pinot',
     'Tilausruoat noudettuna tai toimitettuna. Määrä ja ajankohta sovitaan '
     'etukäteen.',
     ['Juhlat ja perhetilaisuudet','Muistotilaisuudet','Noutopöydät',
      'Toimitus tai nouto','Erityisruokavaliot']),
    ('Kokoustarjoilut','kello',
     'Kahvitukset ja kokouslounaat yrityksille. Toimitus sovittuna kellonaikana '
     'suoraan kokoustilaan.',
     ['Kokouskahvitukset','Kokouslounaat','Aamiaistarjoilut',
      'Toimitus sovittuna aikana']),
    ('Tilat','liiketila',
     'Tila yksityistilaisuuksiin sovittaessa. Tilaisuuden koko ja ajankohta '
     'sovitaan etukäteen.',
     ['Yksityistilaisuudet','Ryhmävaraukset','Tilan koko ja varustus: '
      '<span class="tbd">tarkennettava</span>']),
  ],
  customers=[
    ('Lounasasiakkaat','Lounas paikan päällä tai mukaan.'),
    ('Yritykset','Kokoustarjoilut ja henkilöstön lounaat.'),
    ('Perheet ja juhlat','Tilausruoat juhliin ja muistotilaisuuksiin.'),
    ('Ryhmät','Ryhmävaraukset sovittaessa.'),
  ],
  faq=[
    ('Mihin aikaan lounas on tarjolla?',
     'Lounasajat löytyvät yhteystiedoista. Kerromme ne myös puhelimessa.'),
    ('Huomioitteko erityisruokavaliot?',
     'Kyllä. Kerro ruokavaliosta tilauksen yhteydessä tai kysy paikan päällä, mitä '
     'ruoka sisältää.'),
    ('Kuinka aikaisin tilausruoka pitää tilata?',
     'Mitä isompi tilaus, sitä aikaisemmin. Soita ja kysy — pienet tilaukset onnistuvat '
     'usein lyhyemmälläkin varoitusajalla.'),
    ('Saako ruokaa mukaan?',
     'Saa. Kerro se tilatessa, niin pakkaamme sen valmiiksi.'),
  ],
  promises=[
    ('Ruokalista','Viikon ruokalista julkaistaan etukäteen.'),
    ('Kasvisvaihtoehto','Listalla on kasvisvaihtoehto.'),
    ('Tilausruoat','Määrä ja noutoaika sovitaan etukäteen.'),
  ],
  about='tarjoaa lounaan sekä tilausruoat ja kokoustarjoilut.',

  # Ravintolassa ei ole vaiheita: asiakas tulee, syo ja maksaa. Sen
  # selittaminen neljana vaiheena olisi asiakkaan aliarviointia.
  steps=None,
  services_title='Mitä tarjoamme',
  services_link='Katso mitä tarjoamme',
  customers_title='Kenelle tarjoamme',
  services_lede='Lounas, tilausruoat, kokoustarjoilut ja tila '
                'yksityistilaisuuksiin.',
  cta_title='Tilaukset ja yhteydenotot',
  cta_text='Tilausruoat, kokoustarjoilut ja ryhmävaraukset sovitaan '
           'puhelimessa.',
  contact_lede='Kysy lounaslistaa, varaa pöytä ryhmälle tai tilaa ruoat.',
  way_title='Miten toimimme',
  way_text='Ruokalista suunnitellaan viikoksi kerrallaan ja julkaistaan '
           'etukäteen. Tilausruoista sovitaan puhelimessa, jotta määrä ja '
           'ajankohta ovat selvät.',
  way=[
    ('Ruokalista viikoksi etukäteen',
     'Ruokalista julkaistaan viikon alussa.'),
    ('Ruoan sisältö kerrotaan',
     'Ruoan raaka-aineet kerrotaan pyydettäessä.'),
    ('Erityisruokavaliot',
     'Ruokavaliosta voi kertoa tilatessa tai kysyä paikan päällä.'),
    ('Tilausten ajankohta',
     'Tilausruoan noutoaika tai toimitusaika sovitaan etukäteen.'),
  ],
),

}
