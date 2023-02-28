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

for (s of sentences) {
    tokenList.push(DB.parseSentence(s)); 
    DB.insert(s);
}
DB.remove("practice.ticTacToe.table1.whoseMove");
// How should we handle setting all things in unify to a certain value? Should parse sentence take care of logic saying ex: unify remove practice.ticTacToe.T.players.P
// Answer: keep functions as they are. Have a second layer of wrapper functions that combine the two.
console.log(DB.unify("practice.ticTacToe.T.players.P"));
// console.log(DB.query("EQ practice.ticTacToe.T.board.top.l.P1 practice.ticTacToe.T.board.bottom.l.P2")); // next step
console.log(DB.query("EQ practice.ticTacToe.table1.board.top.l.P1 practice.ticTacToe.table1.board.center.l.P2 practice.ticTacToe.table1.board.bottom.l.P3"));
// console.log(DB.query("EQ practice.ticTacToe.T.players.P1 practice.ticTacToe.T.players.P2"));

// console.log(JSON.stringify(DB.DB,null,4));

//console.log(tokenList);


// function parseJson(file) {
//     let response = JSON.parse(fs.readFileSync(`./data/${file}.json`));
// }

// parseJson("coffeedate");