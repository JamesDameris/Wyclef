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


const DB = require("./logicDB.js");
// Practice Parser File
let sentences = [];
let tokenList = [];
sentences.push("practice.ticTacToe.table1.players.bob");
sentences.push("practice.ticTacToe.table1.players.joe");
sentences.push("practice.ticTacToe.table1.whoseMove!joe");
sentences.push("practice.ticTacToe.table1.board");
sentences.push("practice.ticTacToe.table2.players.mary");
sentences.push("practice.ticTacToe.table2.players.anne");

for (s of sentences) {
    tokenList.push(DB.ParseSentence(s)); 
    DB.insert(s);
}
DB.remove("practice.ticTacToe.table1.whoseMove");
console.log(DB.unify("practice.ticTacToe.T.players.P"));
console.log(JSON.stringify(DB.DB,null,4));

//console.log(tokenList);