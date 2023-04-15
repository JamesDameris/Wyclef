/* Example Structure of sentence for a practice
 *                        practice
 *                           | 
 *                       ticTacToe
 *                     /          \
 *               table 1          table 2
 *             /      \          /      \
 *        players    board    players    board
 *       /     \              /    \
 *      joe    bob         anne   mary
*/

const fs = require('fs');
const DB = require("./logicDB.js");
const C = require("./data/characters.js");
// Practice Parser File
let sentences = [];
let tokenList = [];
sentences.push("practice.ticTacToe.table1.players.bob");
sentences.push("practice.ticTacToe.table1.players.joe");
sentences.push("practice.ticTacToe.table1.whoseMove!joe");

sentences.push("practice.ticTacToe.table1.board.top.l!x");
sentences.push("practice.ticTacToe.table1.board.center.l!x");
sentences.push("practice.ticTacToe.table1.board.bottom.l!x");

sentences.push("practice.ticTacToe.table2.players.mary");
sentences.push("practice.ticTacToe.table2.players.anne");

sentences.push("practice.ticTacToe.table2.board.top.l!x");
sentences.push("practice.ticTacToe.table2.board.center.l!x");
sentences.push("practice.ticTacToe.table2.board.bottom.l!x");

sentences.push("practice.ticTacToe.table1.board.winner!bob");
sentences.push("practice.ticTacToe.table2.board.winner!mary");
sentences.push("foo.bar.baz");
sentences.push("foo.bar.woof");
sentences.push("foo.meow.woof");
sentences.push("fizz.buzz.foo");
sentences.push("some.other.woof");
sentences.push("some.other.meow");

sentences.push("practice.ticTacToe.joe.bob.board.top.l!x");
sentences.push("practice.ticTacToe.joe.bob.board.middle.l!x");
sentences.push("practice.ticTacToe.joe.bob.board.bottom.l!x");
sentences.push("practice.ticTacToe.joe.bob.board.top.c!o");
sentences.push("practice.ticTacToe.joe.bob.board.middle.c!o");
sentences.push("practice.ticTacToe.joe.bob.board.bottom.c!empty");
sentences.push("practice.ticTacToe.joe.bob.board.top.r!x");
sentences.push("practice.ticTacToe.joe.bob.board.middle.r!empty");
sentences.push("practice.ticTacToe.joe.bob.board.bottom.r!o");
sentences.push("practice.ticTacToe.joe.bob.player.joe.piece!x");
sentences.push("practice.ticTacToe.joe.bob.player.bob.piece!o");

sentences.push("practice.ticTacToe.joe.bill.board.top.l!x");
sentences.push("practice.ticTacToe.joe.bill.board.middle.l!x");
sentences.push("practice.ticTacToe.joe.bill.board.bottom.l!x");
sentences.push("practice.ticTacToe.joe.bill.board.top.c!o");
sentences.push("practice.ticTacToe.joe.bill.board.middle.c!o");
sentences.push("practice.ticTacToe.joe.bill.board.bottom.c!empty");
sentences.push("practice.ticTacToe.joe.bill.board.top.r!x");
sentences.push("practice.ticTacToe.joe.bill.board.middle.r!empty");
sentences.push("practice.ticTacToe.joe.bill.board.bottom.r!o");
sentences.push("practice.ticTacToe.joe.bill.player.joe.piece!x");
sentences.push("practice.ticTacToe.joe.bill.player.bill.piece!o");


/* x o x
 * x o e
 * x e o
*/

// for (s of sentences) {
//     tokenList.push(DB.parseSentence(s)); 
//     DB.insert(s);
// }
insertSentences(sentences);

DB.remove("practice.ticTacToe.table1.whoseMove");
// How should we handle setting all things in unify to a certain value? Should parse sentence take care of logic saying ex: unify remove practice.ticTacToe.T.players.P
// Answer: keep functions as they are. Have a second layer of wrapper functions that combine the two.
// console.log(DB.unify("practice.ticTacToe.T.players.P"));
// console.log(DB.query("EQ practice.ticTacToe.T.board.top.l.P1 practice.ticTacToe.T.board.bottom.l.P2")); // next step
// console.log(DB.query("EQ practice.ticTacToe.table1.board.top.l.P1 practice.ticTacToe.table1.board.center.l.P2 practice.ticTacToe.table1.board.bottom.l.P3"));
console.log(DB.unorderedQuery(["practice.ticTacToe.Player1.Player2.board.top.Col!Piece",
                      "practice.ticTacToe.Player1.Player2.board.middle.Col!Piece",
                      "practice.ticTacToe.Player1.Player2.board.bottom.Col!Piece",
                      "practice.ticTacToe.Player1.Player2.player.Winner.piece!Piece",
                      // Grab the loser so we can mark them as having lost
                      "practice.ticTacToe.Player1.Player2.player.Loser",
                      "NOT practice.ticTacToe.Player1.Player2.player.bill",
                      "EQ Bartender bill",
                      "NEQ Winner Loser"]));

// console.log(DB.unifyAll(["fizz.buzz.X" ,"some.other.Y",  "X.Y.woof" ]))
// console.log(JSON.stringify(DB.DB,null,4));

//console.log(tokenList);


// function parseJson(file) {
//     let response = JSON.parse(fs.readFileSync(`./data/${file}.json`));
// }

// parseJson("coffeedate");


function insertSentences (sentences) {
    for (let sentence of sentences) {
        DB.insert(sentence);
    }
}

function removeSentences (sentences) {
    for (let sentence of sentences) {
        DB.remove(sentence);
    }
}

let adrienne = new C.character("Adrienne");

adrienne.printInfo();
let joe = new C.character("Joe");
let morgan = new C.character("morgan");
joe.printInfo();

