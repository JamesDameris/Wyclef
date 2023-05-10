// const DB = rEQuire("./logicDB.js");

/// Test basic DB functionality. Does insertion, querying, and deletion work?

// function dbBaseTest() {
//   DB.insert("foo.bar.baz");
//   DB.insert("foo.bar.woof");
//   DB.insert("foo.meow.woof");
//   DB.insert("fizz.buzz.foo");
//   DB.insert("some.other.woof");
//   //console.log(dbToSentences(DB));
//   console.log(unifyAll(["X.Y.woof", "fizz.buzz.X"]));
//   DB.remove("foo.bar");
//   //console.log(dbToSentences(DB));
// }


// template for quickly making more test cases
const template = {
  id: "template",
  name: "[Role] doing something",
  data: ["optional list of static data regardless of practice instance"],
  init: ["list of data specific to this practice instance to be initialized"],
  roles: ["list of roles"], // must be start with uppercase for each role
  actions: [
    {
      name: "[Actor]: Do something",
      human_readable: "Does something (an actual sentence",
      conditions: [
        "list of conditions"
      ],
      outcomes: [
        "list of outcomes"
      ]
    }
  ]
}

/// Define some practices for testing Praxish proper.

const spill = {
  id: "spill",
  name: "[Spiller] spills their drink",
  /*init: "insert practice.spill.Spiller.beverageType",*/
  roles: ["Spiller"],
  actions: [
    {
      name: "[Actor]: teases [Spiller]",
      human_readable: "Spiller, go home you're drunk.",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "NEQ Actor Spiller",
        "EQ Actor Teaser"
      ],
      outcomes: [
       // "insert practice.spill.Spiller.angryat.Actor" // change to be on character
        "insert characters.Spiller.angryat.Actor"
      ]
    },
    {
      name: "[Actor]: Cleans up spill caused by [Spiller]",
      human_readable: "Cleans up Spiller's spilt drink",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "NEQ Actor Spiller",     
        "NOT practice.fight.Actor.Teaser"
      ],
      outcomes: [
        "delete practice.spill.Spiller"
      ]
    },
    {
      name: "[Actor]: Cleans up their own spill",
      human_readable: "Cleans up their spilt drink",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "NOT practice.fight.Actor.Teaser",
        "EQ Actor Spiller"
      ],
      outcomes: [
        "delete practice.spill.Spiller"
      ]
    }
  ] 
}

const jukebox = {
  id: "jukebox",
  name: "[Player] uses the jukebox",
  data: [
          "song.Piano Man by Billy Joel",
          "song.American Pie by Don McLean",
          "song.Starman by David Bowie",
          "song.Material Girl by Madonna",
          "song.Come Together by The Beatles",
          "song.Jump by Van Halen",
          "song.Separate Ways (Worlds Apart) by Journey",
          "song.What's Up by 4 Non Blondes",
          "song.Closing Time by Semisonic"
        ],
  roles: ["Player"], // must be start with uppercase for each role
  actions: [
    {
      name: "[Actor]: Insert 25 cents to play a song",
      human_readable: "Puts 25 cents into the jukebox",
      conditions: [
        "EQ Actor Player",
        "NOT practice.jukebox.Actor!paid"
      ],
      outcomes: [
        "insert practice.jukebox.Actor!paid"
      ]
    },
    {
      name: "[Actor]: Pick Song",
      human_readable: "Puts on Song",
      conditions: [
        "EQ Actor Player",
        "practice.jukebox.Actor!paid",
        "practiceData.jukebox.song.Song"
      ],
      outcomes: [
        "delete practice.jukebox.Actor!paid",
        "insert practice.jukebox.Actor.playing"
      ]
    },
  ]
}

const fight = {
  id: "fight",
  name: "[Attacker] starts a bar fight with [Attacked]",
  roles: ["Attacker","Attacked"], // must be start with uppercase for each role
  actions: [
    {
      name: "[Actor]: Punches [Attacked]",
      human_readable: "Swings at Attacked",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "EQ Actor Attacker",
        "NOT characters.Attacked.endurance!weakened"
      ],
      outcomes: [
        "insert characters.Attacked.endurance!weakened"
      ]
    },
    {
      name: "[Actor]: Punches [Attacked]",
      human_readable: "Swings at Attacked, knocking them out",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "EQ Actor Attacker",
        "characters.Attacked.endurance!weakened"
      ],
      outcomes: [
        "delete practice.fight.Attacker.Attacked",
        "insert characters.Attacked.endurance!ko",
        "insert characters.Attacker.wonfight.Attacked",
        "insert characters.Attacked.lostfight.Attacker"
      ]
    },
    {
      name: "[Actor]: Punches [Attacker]",
      human_readable: "Swings at Attacker",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "EQ Actor Attacked",
        "NOT characters.Attacker.endurance!weakened"
      ],
      outcomes: [
        "insert characters.Attacker.endurance!weakened"
      ]
    },
    {
      name: "[Actor]: Attempts to diffuse fight with [Attacker]",
      human_readable: "Hey Attacker, I meant no harm",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "EQ Actor Attacked",
        "NOT characters.Attacker.endurance!weakened"
      ],
      outcomes: [
        "insert practice.fight.Attacker.Attacked.diffuse!attempted"
      ]
    },
    {
      name: "[Actor]: Settles dispute with [Attacked]",
      human_readable: "Fine, but watch what you say next time",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "EQ Actor Attacker",
        "NOT characters.Attacker.endurance!weakened",
        "practice.fight.Attacker.Attacked.diffuse!attempted"
      ],
      outcomes: [
        "delete characters.Attacker.angryat.Attacked",
        "delete practice.fight.Attacker.Attacked"
      ]
    },
    {
      name: "[Actor]: Punches [Attacker]",
      human_readable: "Swings at Attacker, knocking them out",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "EQ Actor Attacked",
        "characters.Attacker.endurance!weakened"
      ],
      outcomes: [
        "delete practice.fight.Attacker",
        "insert characters.Attacker.endurance!ko",
        "insert characters.Attacked.wonfight.Attacker",
        "insert characters.Attacker.lostfight.Attacked",
        "insert characters.Attacker.scaredof.Attacked"
      ]
    }
  ]
}

const greetPractice = {
  id: "greet",
  name: "[Greeter] is greeting [Greeted]",
  roles: ["Greeter", "Greeted"],
  actions: [
    {
      name: "[Actor]: Greet [Other]",
      human_readable: "Says hello to Other",
      conditions: [
        "NOT characters.Actor.scaredof.Other",
        "NOT characters.Actor.endurance!ko",
        "EQ Actor Greeter",
        "EQ Other Greeted"
      ],
      outcomes: [
        //"insert practice.respondToGreeting.Other.Actor",
        "delete practice.greet.Actor.Other"
      ]
    }
  ]
};

const tendBarPractice = {
  id: "tendBar",
  name: "[Bartender] is tending bar",
  data: [
    "beverageType.beer!alcoholic",
    "beverageType.cider!alcoholic",
    "beverageType.soda!nonalcoholic",
    "beverageType.water!nonalcoholic"
  ],
  roles: ["Bartender"],
  actions: [
    // Not sure how I feel about these join/leave actions,
    // but they seem useful for these kinds of group situations.
    {
      name: "[Actor]: Walk up to bar",
      human_readable: "Walks up to the bar",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "NEQ Actor Bartender",
        "NOT practice.tendBar.Bartender.customer.Actor"
      ],
      outcomes: [
        "insert practice.tendBar.Bartender.customer.Actor"
      ]
    },
    {
      name: "[Actor]: Walk away from bar",
      human_readable: "Walks away from the bar",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "practice.tendBar.Bartender.customer.Actor"
      ],
      outcomes: [
        "delete practice.tendBar.Bartender.customer.Actor"
      ]
    },
    {
      name: "[Actor]: Order [Beverage]",
      human_readable: "Orders a Beverage",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "practice.tendBar.Bartender.customer.Actor",
        "NOT practice.tendBar.Bartender.customer.Actor!beverage",
        "NOT practice.tendBar.Bartender.customer.Actor!order",
        "practiceData.tendBar.beverageType.Beverage"
      ],
      outcomes: [
        "insert practice.tendBar.Bartender.customer.Actor!order!Beverage"
        // TODO insert an obligation-to-act on the part of the bartender?
      ]
    },
    {
      name: "[Actor]: Fulfill [Customer]'s order",
      human_readable: "Gets Customer a Beverage",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "EQ Actor Bartender",
        "practice.tendBar.Bartender.customer.Customer!order!Beverage"
      ],
      outcomes: [
        "delete practice.tendBar.Bartender.customer.Customer!order",
        "insert practice.tendBar.Bartender.customer.Customer!beverage!Beverage"
      ]
    },
    {
      name: "[Actor]: Drink [Beverage]",
      human_readable: "Drinks their Beverage",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "practice.tendBar.Bartender.customer.Actor!beverage!Beverage"
      ],
      outcomes: [
        "delete practice.tendBar.Bartender.customer.Actor!beverage"
        // TODO increase drunkenness if Beverage is alcoholic?
      ]
    },
    {
      name: "[Actor]: Spill [Beverage]",
      human_readable: "Spills their Beverage",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "practice.tendBar.Bartender.customer.Actor!beverage!Beverage"
      ],
      outcomes: [
        "delete practice.tendBar.Bartender.customer.Actor!beverage",
        // "insert practice.tendBar.Bartender.customer.Actor!spill"
        "insert practice.spill.Actor"
        // FIXME maybe spawn a separate spill practice like James D was playing with?
      ]
    },
    {
      name: "[Actor]: pick fight with [Teaser]", 
      human_readable: "Fight me Teaser, you buffoon",
      conditions: [
        "NOT characters.Actor.scaredof.Teaser",
        "NOT characters.Actor.endurance!ko",
        "NEQ Actor Teaser",
        "NOT practice.fight.Actor.Teaser",
        "characters.Actor.angryat.Teaser"
      ],
      outcomes: [
        "insert practice.fight.Actor.Teaser"
      ]
    }
    // {
    //   name: "[Actor]: "
    // }
    // ,{
    //   name: "[Actor]: Clean up spill near [Customer]",
    //   human_readable: "Cleans up Customer's spilt drink",
    //   conditions: [
    //     "practice.tendBar.Bartender.customer.Customer!spill"
    //   ],
    //   outcomes: [
    //     "delete practice.tendBar.Bartender.customer.Customer!spill"
    //     // FIXME mark politeness stuff for bartender vs spiller vs other customer cleaning it up?
    //     // make the bartender more annoyed?
    //   ]
    // }
  ]
};

const ticTacToePractice = {
  id: "ticTacToe",
  name: "[Player1] and [Player2] are playing tic-tac-toe",
  roles: ["Player1", "Player2"],
  init: [
    // Who goes first?
    "insert practice.ticTacToe.Player1.Player2.whoseTurn!Player1!Player2",
    // Who plays which piece?
    "insert practice.ticTacToe.Player1.Player2.player.Player1.piece!o",
    "insert practice.ticTacToe.Player1.Player2.player.Player2.piece!x",
    // Initial board state
    "insert practice.ticTacToe.Player1.Player2.board.top.left!empty",
    "insert practice.ticTacToe.Player1.Player2.board.top.center!empty",
    "insert practice.ticTacToe.Player1.Player2.board.top.right!empty",
    "insert practice.ticTacToe.Player1.Player2.board.middle.left!empty",
    "insert practice.ticTacToe.Player1.Player2.board.middle.center!empty",
    "insert practice.ticTacToe.Player1.Player2.board.middle.right!empty",
    "insert practice.ticTacToe.Player1.Player2.board.bottom.left!empty",
    "insert practice.ticTacToe.Player1.Player2.board.bottom.center!empty",
    "insert practice.ticTacToe.Player1.Player2.board.bottom.right!empty"
  ],
  actions: [
    {
      name: "[Actor]: Play [Piece] at [Row] [Col]",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        // Check whether this move should be possible
        "practice.ticTacToe.Player1.Player2.whoseTurn!Actor!Other",
        "practice.ticTacToe.Player1.Player2.player.Actor.piece!Piece",
        "practice.ticTacToe.Player1.Player2.board.Row.Col!empty"
      ],
      outcomes: [
        "insert practice.ticTacToe.Player1.Player2.board.Row.Col!Piece",
        "insert practice.ticTacToe.Player1.Player2.whoseTurn!Other!Actor"
      ]
    },
    // Declare-winner actions. These are super hacky and wrong: they were
    // originally conceived as a workaround for not having `if`/`call` yet,
    // and there's nothing in the practice's current definition that will keep
    // the players from *continuing* to play after the game is already decided
    // but before one of these actions is performed.
    // However, I kind of like the idea of "calling the game" being an action
    // that different characters can perform: it opens the door to storyful
    // interpretations like "conceding gracefully" and "being a sore winner".
    {
      name: "[Actor]: Declare [Winner] as the winner",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "practice.ticTacToe.Player1.Player2.board.top.Col!Piece",
        "practice.ticTacToe.Player1.Player2.board.middle.Col!Piece",
        "practice.ticTacToe.Player1.Player2.board.bottom.Col!Piece",
        "practice.ticTacToe.Player1.Player2.player.Winner.piece!Piece",
        // Grab the loser so we can mark them as having lost
        "practice.ticTacToe.Player1.Player2.player.Loser",
        "NEQ Winner Loser"
      ],
      outcomes: [
        "insert Winner.ship.Loser.ticTacToeMemory!won",
        "insert Loser.ship.Winner.ticTacToeMemory!lost",
        "delete practice.ticTacToe.Player1.Player2"
      ]
    },
    {
      name: "[Actor]: Declare [Winner] as the winner",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "practice.ticTacToe.Player1.Player2.board.Row.left!Piece",
        "practice.ticTacToe.Player1.Player2.board.Row.center!Piece",
        "practice.ticTacToe.Player1.Player2.board.Row.right!Piece",
        "practice.ticTacToe.Player1.Player2.player.Winner.piece!Piece",
        // Grab the loser so we can mark them as having lost
        "practice.ticTacToe.Player1.Player2.player.Loser",
        "NEQ Winner Loser"
      ],
      outcomes: [
        "insert Winner.ship.Loser.ticTacToeMemory!won",
        "insert Loser.ship.Winner.ticTacToeMemory!lost",
        "delete practice.ticTacToe.Player1.Player2"
      ]
    },
    {
      name: "[Actor]: Declare [Winner] as the winner",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "practice.ticTacToe.Player1.Player2.board.top.left!Piece",
        "practice.ticTacToe.Player1.Player2.board.middle.center!Piece",
        "practice.ticTacToe.Player1.Player2.board.bottom.right!Piece",
        "practice.ticTacToe.Player1.Player2.player.Winner.piece!Piece",
        // Grab the loser so we can mark them as having lost
        "practice.ticTacToe.Player1.Player2.player.Loser",
        "NEQ Winner Loser"
      ],
      outcomes: [
        "insert Winner.ship.Loser.ticTacToeMemory!won",
        "insert Loser.ship.Winner.ticTacToeMemory!lost",
        "delete practice.ticTacToe.Player1.Player2"
      ]
    },
    {
      name: "[Actor]: Declare [Winner] as the winner",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "practice.ticTacToe.Player1.Player2.board.top.right!Piece",
        "practice.ticTacToe.Player1.Player2.board.middle.center!Piece",
        "practice.ticTacToe.Player1.Player2.board.bottom.left!Piece",
        "practice.ticTacToe.Player1.Player2.player.Winner.piece!Piece",
        // Grab the loser so we can mark them as having lost
        "practice.ticTacToe.Player1.Player2.player.Loser",
        "NEQ Winner Loser"
      ],
      outcomes: [
        "insert Winner.ship.Loser.ticTacToeMemory!won",
        "insert Loser.ship.Winner.ticTacToeMemory!lost",
        "delete practice.ticTacToe.Player1.Player2"
      ]
    },
    // Declare-tie actions. These are actually even worse.
    {
      name: "[Actor]: Declare the game tied",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        // Check that every row has both piece types in it
        "practice.ticTacToe.Player1.Player2.board.top.C1!x",
        "practice.ticTacToe.Player1.Player2.board.top.C2!o",
        "practice.ticTacToe.Player1.Player2.board.middle.C3!x",
        "practice.ticTacToe.Player1.Player2.board.middle.C4!o",
        "practice.ticTacToe.Player1.Player2.board.bottom.C5!x",
        "practice.ticTacToe.Player1.Player2.board.bottom.C6!o",
        // Check that every column has both piece types in it
        "practice.ticTacToe.Player1.Player2.board.R1.left!x",
        "practice.ticTacToe.Player1.Player2.board.R2.left!o",
        "practice.ticTacToe.Player1.Player2.board.R3.center!x",
        "practice.ticTacToe.Player1.Player2.board.R4.center!o",
        "practice.ticTacToe.Player1.Player2.board.R5.right!x",
        "practice.ticTacToe.Player1.Player2.board.R6.right!o",
        // Check that both *diagonals* have both piece types in 'em
        // (two corners per tie-game action)
        "practice.ticTacToe.Player1.Player2.board.top.left!P1",
        "practice.ticTacToe.Player1.Player2.board.middle.center!P2",
        "NEQ P1 P2", "NEQ P1 empty", "NEQ P2 empty",
        "practice.ticTacToe.Player1.Player2.board.top.right!P3",
        "practice.ticTacToe.Player1.Player2.board.middle.center!P4",
        "NEQ P3 P4", "NEQ P3 empty", "NEQ P4 empty",
      ],
      outcomes: [
        "insert Player1.ship.Player2.ticTacToeMemory!tied",
        "insert Player2.ship.Player1.ticTacToeMemory!tied",
        "delete practice.ticTacToe.Player1.Player2"
      ]
    },
    {
      name: "[Actor]: Declare the game tied",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        // Check that every row has both piece types in it
        "practice.ticTacToe.Player1.Player2.board.top.C1!x",
        "practice.ticTacToe.Player1.Player2.board.top.C2!o",
        "practice.ticTacToe.Player1.Player2.board.middle.C3!x",
        "practice.ticTacToe.Player1.Player2.board.middle.C4!o",
        "practice.ticTacToe.Player1.Player2.board.bottom.C5!x",
        "practice.ticTacToe.Player1.Player2.board.bottom.C6!o",
        // Check that every column has both piece types in it
        "practice.ticTacToe.Player1.Player2.board.R1.left!x",
        "practice.ticTacToe.Player1.Player2.board.R2.left!o",
        "practice.ticTacToe.Player1.Player2.board.R3.center!x",
        "practice.ticTacToe.Player1.Player2.board.R4.center!o",
        "practice.ticTacToe.Player1.Player2.board.R5.right!x",
        "practice.ticTacToe.Player1.Player2.board.R6.right!o",
        // Check that both *diagonals* have both piece types in 'em
        // (two corners per tie-game action)
        "practice.ticTacToe.Player1.Player2.board.top.right!P1",
        "practice.ticTacToe.Player1.Player2.board.middle.center!P2",
        "NEQ P1 P2", "NEQ P1 empty", "NEQ P2 empty",
        "practice.ticTacToe.Player1.Player2.board.bottom.right!P3",
        "practice.ticTacToe.Player1.Player2.board.middle.center!P4",
        "NEQ P3 P4", "NEQ P3 empty", "NEQ P4 empty",
      ],
      outcomes: [
        "insert Player1.ship.Player2.ticTacToeMemory!tied",
        "insert Player2.ship.Player1.ticTacToeMemory!tied",
        "delete practice.ticTacToe.Player1.Player2"
      ]
    },
    {
      name: "[Actor]: Declare the game tied",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        // Check that every row has both piece types in it
        "practice.ticTacToe.Player1.Player2.board.top.C1!x",
        "practice.ticTacToe.Player1.Player2.board.top.C2!o",
        "practice.ticTacToe.Player1.Player2.board.middle.C3!x",
        "practice.ticTacToe.Player1.Player2.board.middle.C4!o",
        "practice.ticTacToe.Player1.Player2.board.bottom.C5!x",
        "practice.ticTacToe.Player1.Player2.board.bottom.C6!o",
        // Check that every column has both piece types in it
        "practice.ticTacToe.Player1.Player2.board.R1.left!x",
        "practice.ticTacToe.Player1.Player2.board.R2.left!o",
        "practice.ticTacToe.Player1.Player2.board.R3.center!x",
        "practice.ticTacToe.Player1.Player2.board.R4.center!o",
        "practice.ticTacToe.Player1.Player2.board.R5.right!x",
        "practice.ticTacToe.Player1.Player2.board.R6.right!o",
        // Check that both *diagonals* have both piece types in 'em
        // (two corners per tie-game action)
        "practice.ticTacToe.Player1.Player2.board.bottom.right!P1",
        "practice.ticTacToe.Player1.Player2.board.middle.center!P2",
        "NEQ P1 P2", "NEQ P1 empty", "NEQ P2 empty",
        "practice.ticTacToe.Player1.Player2.board.bottom.left!P3",
        "practice.ticTacToe.Player1.Player2.board.middle.center!P4",
        "NEQ P3 P4", "NEQ P3 empty", "NEQ P4 empty",
      ],
      outcomes: [
        "insert Player1.ship.Player2.ticTacToeMemory!tied",
        "insert Player2.ship.Player1.ticTacToeMemory!tied",
        "delete practice.ticTacToe.Player1.Player2"
      ]
    },
    {
      name: "[Actor]: Declare the game tied",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        // Check that every row has both piece types in it
        "practice.ticTacToe.Player1.Player2.board.top.C1!x",
        "practice.ticTacToe.Player1.Player2.board.top.C2!o",
        "practice.ticTacToe.Player1.Player2.board.middle.C3!x",
        "practice.ticTacToe.Player1.Player2.board.middle.C4!o",
        "practice.ticTacToe.Player1.Player2.board.bottom.C5!x",
        "practice.ticTacToe.Player1.Player2.board.bottom.C6!o",
        // Check that every column has both piece types in it
        "practice.ticTacToe.Player1.Player2.board.R1.left!x",
        "practice.ticTacToe.Player1.Player2.board.R2.left!o",
        "practice.ticTacToe.Player1.Player2.board.R3.center!x",
        "practice.ticTacToe.Player1.Player2.board.R4.center!o",
        "practice.ticTacToe.Player1.Player2.board.R5.right!x",
        "practice.ticTacToe.Player1.Player2.board.R6.right!o",
        // Check that both *diagonals* have both piece types in 'em
        // (two corners per tie-game action)
        "practice.ticTacToe.Player1.Player2.board.bottom.left!P1",
        "practice.ticTacToe.Player1.Player2.board.middle.center!P2",
        "NEQ P1 P2", "NEQ P1 empty", "NEQ P2 empty",
        "practice.ticTacToe.Player1.Player2.board.top.left!P3",
        "practice.ticTacToe.Player1.Player2.board.middle.center!P4",
        "NEQ P3 P4", "NEQ P3 empty", "NEQ P4 empty",
      ],
      outcomes: [
        "insert Player1.ship.Player2.ticTacToeMemory!tied",
        "insert Player2.ship.Player1.ticTacToeMemory!tied",
        "delete practice.ticTacToe.Player1.Player2"
      ]
    }
  ]
};

// TODO Implement more practices:
// - jukebox
// - knowitalls
// - darthVader

const coffeePractice = { 
  id: "coffee",
  name: "[Barista] serving beverages",
  data: [
    "beverageType.cappucino!coffee",
    "beverageType.latte!coffee",
    "beverageType.matcha!notcoffee",
    "beverageType.water!notcoffee",
    "beverageType.coldbrew!coffee",
    "beverageType.americano!coffee",
    "beverageType.hottea!notcoffee"
  ],
  roles: ["Barista"],
  actions: [
    {
      name: "[Actor]: Walk up to counter",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "NEQ Actor Barista",
        "NOT practice.coffee.Barista.customer.Actor"
      ],
      outcomes: [
        "insert practice.coffee.Barista.customer.Actor"
      ]
    },
    {
      name: "[Actor]: Walk away from counter",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "practice.coffee.Barista.customer.Actor"
      ],
      outcomes: [
        "delete practice.coffee.Barista.customer.Actor"
      ]
    },
    {
      name: "[Actor]: Order [Beverage]",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "practice.coffee.Barista.customer.Actor",
        "NOT practice.coffee.Barista.customer.Actor!beverage",
        "practiceData.coffee.beverageType.Beverage"
      ],
      outcomes: [
        "insert practice.coffee.Barista.customer.Actor!order!Beverage"
        // TODO insert an obligation-to-act on the part of the Barista?
      ]
    },
    {
      name: "[Actor]: Fulfill [Customer]'s order",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "EQ Actor Barista",
        "practice.coffee.Barista.customer.Customer!order!Beverage"
      ],
      outcomes: [
        "delete practice.coffee.Barista.customer.Customer!order",
        "insert practice.coffee.Barista.customer.Customer!beverage!Beverage"
      ]
    },
    {
      name: "[Actor]: Drink [Beverage]",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "practice.coffee.Barista.customer.Actor!beverage!Beverage"
      ],
      outcomes: [
        "delete practice.coffee.Barista.customer.Actor!beverage"
      ]
    },
    {
      name: "[Actor]: Spill [Beverage]",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "practice.coffee.Barista.customer.Actor!beverage!Beverage"
      ],
      outcomes: [
        "delete practice.coffee.Barista.customer.Actor!beverage",
        "insert practice.coffee.Barista.customer.Actor!spill"
      ]
    },
    {
      name: "[Actor]: Clean up spill near [Customer]",
      conditions: [
        "NOT characters.Actor.endurance!ko",
        "practice.coffee.Barista.customer.Customer!spill"
      ],
      outcomes: [
        "delete practice.coffee.Barista.customer.Customer!spill"
      ]
    }
  ]
};


/// meetup 
/// 




window.practiceDefs = [greetPractice, tendBarPractice, spill, fight/*, coffeePractice , ticTacToePractice */];

window.practicesActive = {spill: [], fight: [], coffee: [], ticTacToe: [], tendBar: ["All"], greet: ["All"]}





/// Test Praxish: initialize a `testPraxishState`,
/// yeet a practice instance in there, and start ticking.

// function doTicks(praxishState, n) {
//   for (let i = 0; i < n; i++) {
//     tick(praxishState);
//   }
// }

// const testPraxishState = createPraxishState();
// testPraxishState.allChars = ["max", "nic", "isaac"];
// // First test with just the `greet` practice
// console.log("PRACTICE TEST: greet");
// definePractice(testPraxishState, greetPractice);
// performOutcome(testPraxishState, "insert practice.greet.max.isaac");
// performOutcome(testPraxishState, "insert practice.greet.nic.max");
// doTicks(testPraxishState, 3);
// // Then introduce and test with the `tendBar` practice
// console.log("PRACTICE TEST: tendBar");
// definePractice(testPraxishState, tendBarPractice);
// performOutcome(testPraxishState, "insert practice.tendBar.isaac");
// doTicks(testPraxishState, 12);
// // And now test `ticTacToe` concurrently with the bar practice
// console.log("PRACTICE TEST: ticTacToe");
// definePractice(testPraxishState, ticTacToePractice);
// performOutcome(testPraxishState, "insert practice.ticTacToe.max.nic");
// doTicks(testPraxishState, 24);
