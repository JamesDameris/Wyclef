
DB = {};

function isUppercase(char) {
    return /[A-Z]/.test(char);
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function ParseSentence (sentence) {
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

function insert (sentence) {
    let tokens = ParseSentence(sentence);
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
    let tokens = ParseSentence(sentence);
    
    let node = DB;
    // iterate through tokens
    for (token of tokens.slice(0,-1)) {
        node = node[token[0]];
    }
    let last = tokens[tokens.length-1];
    delete node[last[0]];
}

function unify (sentence) {
    let unified = [{binding: {}, subtree: DB}];
    let tokens = ParseSentence(sentence);

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
                        console.log("No Instance of", token[0], "here!");
                    }
                }
            }
        } 
        unified = nextUnified;  
    }
    return unified.map(uni=>uni.binding);
}

module.exports = { ParseSentence, insert, remove, unify, DB } 