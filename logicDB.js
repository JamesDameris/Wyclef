
DB = {};

function isUppercase(char) {
    return /[A-Z]/.test(char);
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function parseSentence (sentence) {
    let currentTerm = "";
    let tokens = [];
    
    for (let char of sentence) {
     
        if (char == '!' || char == '.') {
            tokens.push([currentTerm, char, isUppercase(currentTerm[0]) ? "var" : "const" ]);
            currentTerm = ""; 
        }
        else {
            currentTerm += char;
        }
    }
    tokens.push([currentTerm, null, isUppercase(currentTerm[0]) ? "var" : "const" ]);
    return tokens;
}

function parseStatement (statement) {
    // "EQ practice.ticTacToe.T.board.top.l.P1 practice.ticTacToe.T.board.bottom.l.P2"
    return statement.split(" ");
}

function insert (sentence) {
    let tokens = parseSentence(sentence);
    let node = DB;
    // iterate through tokens
    for (token of tokens) {
        // determine if db doesn't have the key or it does and should be replaced
        if (!node[token[0]] || node[token[1]] == '!' ) {
            node[token[0]] = {}
        }
        node = node[token[0]];
    }
}

function remove (sentence) {
    let tokens = parseSentence(sentence);
    
    let node = DB;
    // iterate through tokens
    for (token of tokens.slice(0,-1)) {
        node = node[token[0]];
    }
    let last = tokens[tokens.length-1];
    delete node[last[0]];
}
// to further implement functionality of unify, use a wrapper function that allows multiple layers of sentences to be unified
function unify (sentence) {
    console.log("Unifying: " + sentence);
    let unified = [{binding: {}, subtree: DB}];
    let tokens = parseSentence(sentence);

    for (token of tokens) {
        let nextUnified = [];
        for (uni of unified) { 
            for (key of Object.keys(uni.subtree)) {
                if (token[2] == "var") {  
                    let nextUni = {binding: clone(uni.binding), subtree: uni.subtree[key]};
                    nextUni.binding[token[0]] = key;
                    nextUnified.push(nextUni);
                } else {
                    if (token[0] == key) {
                        let nextUni = { binding: uni.binding, subtree: uni.subtree[key] };
                        nextUnified.push(nextUni);
                    } else {
                        // console.log("No Instance of", token[0], "here!");
                    }
                }
            }
        } 
        unified = nextUnified;  
    }
    return unified.map(uni=>uni.binding);
}

function query(statement) {
    console.log("Querying: " + statement);
    let pStatement = parseStatement(statement);
    if (pStatement[0] == "EQ") {
        return equivQuery(pStatement);
    } else if (pStatement[0] == "NEQ") {
        return !equivQuery(pStatement);
    }
}

/* current implementation compares entire objects, not individual sub-objects for example: 
 * table 1's top row isnt being compared against table 2's top row,  
 * rather all of the top rows in all the tables are being compared 
 * against all the bottom rows in all the tables
 */
function equivQuery(pStatement) {
    let unis = [];
    unis.push(unify(pStatement[1]));
    for (let i = 2; i < pStatement.length; i++) {
        let newUni = unify(pStatement[i]);
        let newUniValues = [];
        let prevUniValues = [];
        console.log(newUni);
        for (let j = 0; j < newUni.length; j++) {
            newUniValues.push(Object.values(newUni[j]));
            prevUniValues.push(Object.values(unis[i-2][j]));
        }
        console.log(prevUniValues);
        console.log(newUniValues);
        if (newUniValues.toString() == prevUniValues.toString()) {
            unis.push(newUni);
        } else {
            return false;
        }
    }
    return true;
}

module.exports = { parseSentence, insert, remove, unify, parseStatement, query, DB } 