import promisePool from '../src/utils/database.js';

async function seedMenuItems() {
  const connection = await promisePool.getConnection();

  const Games = [
    // English Versions
    {
      name: 'Monopoly',
      description: 'A classic property trading game.',
      lang: 'en',
      category_ids: [7, 11, 12],
      img_name: 'images/monopoly.jpg',
    },
    {
      name: 'Catan',
      description: 'A game of resource management and trading.',
      lang: 'en',
      category_ids: [10, 11],
      img_name: 'images/catan.jpg',
    },
    {
      name: 'Carcassone',
      description:
        'A tile-placement game where players build cities, roads, and fields.',
      lang: 'en',
      category_ids: [10, 11],
      img_name: 'images/carcassonne.jpg',
    },
    {
      name: 'Chess',
      description:
        'A classic strategy game played on a square board with 64 squares.',
      lang: 'en',
      category_ids: [10],
      img_name: 'images/chess.jpg',
    },
    {
      name: 'Backgammon',
      description:
        'A two-player game where players move pieces according to dice rolls.',
      lang: 'en',
      category_ids: [7, 10],
      img_name: 'images/backgammon.jpg',
    },
    {
      name: 'Dominoes',
      description:
        'A tile-based game where players match pieces with the same number of dots.',
      lang: 'en',
      category_ids: [10, 11],
      img_name: 'images/dominoes.jpg',
    },
    {
      name: 'Snakes and Ladders',
      description:
        'A race game where players navigate a board with ladders and snakes.',
      lang: 'en',
      category_ids: [7, 11],
      img_name: 'images/snakes_and_ladders.jpg',
    },
    {
      name: 'Pictionary',
      description:
        'A party game where players draw clues for their team to guess.',
      lang: 'en',
      category_ids: [12, 11],
      img_name: 'images/pictionary.jpg',
    },
    {
      name: 'Clue',
      description:
        'A murder mystery game where players try to deduce the culprit.',
      lang: 'en',
      category_ids: [8, 9],
      img_name: 'images/clue.jpg',
    },
    {
      name: 'Alias',
      description:
        'A word-guessing game where players describe words to their team.',
      lang: 'en',
      category_ids: [12, 11],
      img_name: 'images/alias.jpg',
    },
    {
      name: 'Battleship',
      description:
        'A two-player strategy game where players try to sink each other’s ships.',
      lang: 'en',
      category_ids: [10, 11],
      img_name: 'images/battleship.jpg',
    },
    {
      name: 'Guess Who',
      description:
        "A guessing game where players ask yes/no questions to figure out the opponent's character.",
      lang: 'en',
      category_ids: [9, 11],
      img_name: 'images/guess_who.jpg',
    },
    {
      name: 'Scrabble',
      description:
        'A word game where players use letter tiles to create words on a board.',
      lang: 'en',
      category_ids: [9, 11],
      img_name: 'images/scrabble.jpg',
    },

    {
      name: 'Yahtzee',
      description:
        'A dice game where players try to get specific combinations of dice.',
      lang: 'en',
      category_ids: [7, 12],
      img_name: 'images/yahtzee.jpg',
    },
    {
      name: '7 Wonders',
      description:
        'A card drafting game where players build structures and wonders in ancient civilizations.',
      lang: 'en',
      category_ids: [10],
      img_name: 'images/7_wonders.jpg',
    },
    {
      name: 'Afrikan tähti',
      description:
        'A Finnish board game where players navigate Africa looking for treasures.',
      lang: 'en',
      category_ids: [7, 8],
      img_name: 'images/afrikantahti.jpg',
    },
    {
      name: 'Azul',
      description:
        'A tile-laying game where players aim to decorate a wall with colorful tiles.',
      lang: 'en',
      category_ids: [10, 11],
      img_name: 'images/azul.jpg',
    },
    {
      name: 'Blokus',
      description:
        'A strategy game where players take turns placing pieces on a board.',
      lang: 'en',
      category_ids: [10, 11],
      img_name: 'images/blokus.jpg',
    },
    {
      name: 'Cranium',
      description:
        'A party game that involves activities like word puzzles, charades, and trivia.',
      lang: 'en',
      category_ids: [12, 11],
      img_name: 'images/cranium.jpg',
    },
    {
      name: 'Labyrinth',
      description:
        'A maze game where players try to collect treasures by shifting the maze.',
      lang: 'en',
      category_ids: [8, 9],
      img_name: 'images/labyrinth.jpg',
    },
    {
      name: 'Operation',
      description:
        'A game where players try to remove parts from a patient’s body without touching the sides.',
      lang: 'en',
      category_ids: [7, 12],
      img_name: 'images/operation.jpg',
    },
    {
      name: 'Skip-Bo',
      description:
        'A card game where players try to be the first to play all their cards.',
      lang: 'en',
      category_ids: [7, 11],
      img_name: 'images/skip_bo.jpg',
    },
    {
      name: 'Go',
      description:
        'A strategic board game where two players take turns placing black or white stones on a grid, aiming to surround more territory than the opponent.',
      lang: 'en',
      category_ids: [10],
      img_name: 'images/go.jpg',
    },
    {
      name: 'Pandemic',
      description:
        'A cooperative game where players work together to stop four deadly diseases from spreading across the globe.',
      lang: 'en',
      category_ids: [10, 11],
      img_name: 'images/pandemic.jpg',
    },
    {
      name: 'Forbidden Island',
      description:
        'A cooperative adventure game where players work to collect four treasures from a sinking island.',
      lang: 'en',
      category_ids: [8, 11],
      img_name: 'images/forbidden_island.jpg',
    },

    // Finnish Versions
    {
      name: 'Monopoli',
      description: 'Klassinen kiinteistökauppapeli.',
      lang: 'fi',
      category_ids: [1, 5, 6],
      img_name: 'images/monopoly.jpg',
    },
    {
      name: 'Catan',
      description: 'Resurssien hallintaan ja kaupankäyntiin perustuva peli.',
      lang: 'fi',
      category_ids: [4, 5],
      img_name: 'images/catan.jpg',
    },
    {
      name: 'Carcassone',
      description:
        'Pelilaattojen asettelupeli, jossa pelaajat rakentavat kaupunkeja, teitä ja peltoja.',
      lang: 'fi',
      category_ids: [4, 5],
      img_name: 'images/carcassonne.jpg',
    },
    {
      name: 'Shakki',
      description:
        'Klassinen strategiapeli, jota pelataan 64 ruudun ruutuvuoressa.',
      lang: 'fi',
      category_ids: [4],
      img_name: 'images/chess.jpg',
    },
    {
      name: 'Backgammon',
      description:
        'Kahden pelaajan peli, jossa siirretään nappuloita noppatulosten mukaan.',
      lang: 'fi',
      category_ids: [1, 4],
      img_name: 'images/backgammon.jpg',
    },
    {
      name: 'Domino',
      description:
        'Peli, jossa pelaajat yhdistävät saman määrän pisteitä olevia paloja.',
      lang: 'fi',
      category_ids: [4, 5],
      img_name: 'images/dominoes.jpg',
    },
    {
      name: 'Käärmeet ja tikapuut',
      description:
        'Kilpailupeli, jossa pelaajat kulkevat laudalla tikapuiden ja käärmeiden avulla.',
      lang: 'fi',
      category_ids: [1, 5],
      img_name: 'images/snakes_and_ladders.jpg',
    },
    {
      name: 'Piirrä ja arvaa',
      description:
        'Peli, jossa pelaajat piirtävät vihjeitä tiimilleen arvatakseen vastaukset.',
      lang: 'fi',
      category_ids: [6, 5],
      img_name: 'images/pictionary.jpg',
    },
    {
      name: 'Cluedo',
      description:
        'Mysteeri-peli, jossa pelaajat yrittävät selvittää murhaajan.',
      lang: 'fi',
      category_ids: [2, 3],
      img_name: 'images/clue.jpg',
    },
    {
      name: 'Alias',
      description: 'Sanapelissä pelaajat selittävät sanoja tiimilleen.',
      lang: 'fi',
      category_ids: [6, 5],
      img_name: 'images/alias.jpg',
    },
    {
      name: 'Laivanupotus',
      description:
        'Kahden pelaajan strategiapeli, jossa yritetään upottaa toisen laivat.',
      lang: 'fi',
      category_ids: [4, 5],
      img_name: 'images/battleship.jpg',
    },
    {
      name: 'Arvaa kuka',
      description:
        'Arvuuttelupeli, jossa pelaajat kysyvät kyllä/ei-kysymyksiä selvittääkseen toisen hahmon.',
      lang: 'fi',
      category_ids: [3, 5],
      img_name: 'images/guess_who.jpg',
    },
    {
      name: 'Alfapet',
      description:
        'Sanapeli, jossa pelaajat käyttävät kirjaintunnuksia muodostaakseen sanoja laudalla.',
      lang: 'fi',
      category_ids: [3, 5],
      img_name: 'images/scrabble.jpg',
    },
    {
      name: 'Yatzy',
      description:
        'Noppapeli, jossa pelaajat yrittävät saada tiettyjä noppayhdistelmiä.',
      lang: 'fi',
      category_ids: [1, 6],
      img_name: 'images/yahtzee.jpg',
    },
    {
      name: '7 Wonders',
      description:
        'Korttipelin valmistelupeli, jossa pelaajat rakentavat rakennuksia ja ihmeitä muinaisessa sivilisaatiossa.',
      lang: 'fi',
      category_ids: [4],
      img_name: 'images/7_wonders.jpg',
    },
    {
      name: 'Afrikan tähti',
      description:
        'Suomalainen lautapeli, jossa pelaajat etsivät aarteita Afrikassa.',
      lang: 'fi',
      category_ids: [1, 2],
      img_name: 'images/afrikantahti.jpg',
    },
    {
      name: 'Azul',
      description:
        'Pelinappuloiden asettelupeli, jossa pelaajat koristelevat seinää värikkäillä laatoilla.',
      lang: 'fi',
      category_ids: [4, 5],
      img_name: 'images/azul.jpg',
    },
    {
      name: 'Blokus',
      description:
        'Strategiapeli, jossa pelaajat asettavat vuorotellen nappuloita laudalle.',
      lang: 'fi',
      category_ids: [4, 5],
      img_name: 'images/blokus.jpg',
    },
    {
      name: 'Cranium',
      description:
        'Juhla-peli, jossa on sanatehtäviä, ilmeilyä ja tietovisoja.',
      lang: 'fi',
      category_ids: [6, 5],
      img_name: 'images/cranium.jpg',
    },
    {
      name: 'Labyrintti',
      description:
        'Labyrinttipeli, jossa pelaajat yrittävät kerätä aarteita siirtämällä labyrinttiä.',
      lang: 'fi',
      category_ids: [2, 3],
      img_name: 'images/labyrinth.jpg',
    },
    {
      name: 'Operaatio',
      description:
        'Peli, jossa pelaajat yrittävät poistaa osia potilaan kehosta koskematta reunoihin.',
      lang: 'fi',
      category_ids: [1, 6],
      img_name: 'images/operation.jpg',
    },
    {
      name: 'Skip-Bo',
      description:
        'Korttipeli, jossa pelaajat yrittävät olla ensimmäiset, jotka pelaavat kaikki korttinsa.',
      lang: 'fi',
      category_ids: [1, 5],
      img_name: 'images/skip_bo.jpg',
    },
    {
      name: 'Go',
      description:
        'Strateginen lautapeli, jossa kaksi pelaajaa vuorotellen asettavat mustia tai valkoisia kiviä ruudukkoon, pyrkien ympäröimään enemmän aluetta kuin vastustaja.',
      lang: 'fi',
      category_ids: [4],
      img_name: 'images/go.jpg',
    },
    {
      name: 'Pandemic',
      description:
        'Yhteistyöpeli, jossa pelaajat työskentelevät yhdessä estääkseen neljää kuolettavaa tautia leviämästä ympäri maailmaa.',
      lang: 'fi',
      category_ids: [4, 5],
      img_name: 'images/pandemic.jpg',
    },
    {
      name: 'Forbidden Island',
      description:
        'Yhteistyöseikkailupeli, jossa pelaajat keräävät neljä aarretta uppoavalta saarelta ennen kuin se katoaa kokonaan.',
      lang: 'fi',
      category_ids: [2, 5],
      img_name: 'images/forbidden_island.jpg',
    },
  ];

  try {
    await connection.beginTransaction();

    for (const item of Games) {
      const [gameResult] = await connection.execute(
        'INSERT IGNORE INTO boardgames (name, description, lang, img_name) VALUES (?, ?, ?, ?)',
        [item.name, item.description, item.lang, item.img_name]
      );
      const gameItemId = gameResult.insertId;

      // Insert the category link into the game_category_table
      for (const categoryId of item.category_ids) {
        await connection.execute(
          'INSERT INTO game_category_table (game_category_id, game_id) VALUES (?, ?)',
          [categoryId, gameItemId]
        );
      }
    }

    await connection.commit();
    console.log('Game items seeded successfully!');
  } catch (error) {
    await connection.rollback(); // Roll back if something goes wrong
    console.error('Error seeding game items:', error);
  } finally {
    connection.release();
  }
}

seedMenuItems();
