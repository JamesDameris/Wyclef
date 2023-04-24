
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

function unorderedQuery(statements) {
    console.log("Querying: " + statements);
    let possibleBindings = [ {} ];

    for (let i = 0; i < statements.length; i++) {
        let parts = statements[i].split(" ");
        if (parts.length > 1) {
            if (parts[0] != "EQ" && parts[0] != "NEQ" && parts[0] != "NOT") {
                console.log("Error: Invalid operator");
            }
            continue;
        }
        let iterativeBindings = [];
        let newBinding = unify(statements[i]);
        // console.log("New Binding", newBinding);
        for (let uni of possibleBindings) {
            for (let binding of newBinding) {
                let newKeys = Object.keys(binding).filter(k=>!Object.keys(uni).includes(k)); // returns all the keys that are not in uni
                let oldKeys = Object.keys(binding).filter(k=>Object.keys(uni).includes(k)); //  returns all the keys that are in uni
                let thereExistsAnIncompatibileKey = oldKeys.some(k=>binding[k]!=uni[k]); // if there isnt at any key in binding that doesn't matches the same key in uni
                if (thereExistsAnIncompatibileKey) {
                    continue;
                } else {
                    let nextUni = clone(uni); // clone the current compatible bindings 
                    for (newKey of newKeys) { // and add the new compatible bindings to the set of bindings
                        nextUni[newKey] = binding[newKey];
                    }
                    iterativeBindings.push(nextUni); // then update iterativeBindings (which is reset to empty every unify)
                }
            }
        }
        console.log("iterartive", iterativeBindings);
        possibleBindings = iterativeBindings;
    }
    for (let i = 0; i < statements.length; i++) {
        if (statements[i].split(" ")[0] == "EQ") {
            EQStatement = statements[i].split(" ");
            let isVar1 = isUppercase(EQStatement[1][0]);
            let isVar2 = isUppercase(EQStatement[2][0]);
            console.log("Checking Equality on:", EQStatement[1], "and", EQStatement[2]);
            let iterativeBindings = [];
            for (let uni of possibleBindings) {
                concreteVal1 = isVar1 ? uni[EQStatement[1]] : EQStatement[1];
                concreteVal2 = isVar2 ? uni[EQStatement[2]] : EQStatement[2];
                if (concreteVal1 && concreteVal2) { // If both arguments are bound variables or constants, we compare their values and discard the uni if they're not equal.
                    if (concreteVal1 != concreteVal2) {
                        continue; // if not equal, discard the uni
                    } else {
                        iterativeBindings.push(uni); 
                    }
                } else if (concreteVal1 && !concreteVal2) { // If one of the two arguments is an unbound variable and one of them is a bound variable or constant, we establish a new binding for the unbound variable so that it's now bound to the same thing as the other argument.
                    let nextUni = clone(uni);
                    nextUni[EQStatement[2]] = concreteVal1;
                    iterativeBindings.push(nextUni);
                    
                } else if (!concreteVal1 && concreteVal2) { // inverse case
                    let nextUni = clone(uni);
                    nextUni[EQStatement[1]] = concreteVal2;
                    iterativeBindings.push(nextUni);
                
                } else { // If both arguments are unbound variables, that's an error case – we can print an error message to warn the user that they've done something invalid.
                    console.log("Error: Neither arguments bound");
                }
                possibleBindings = iterativeBindings;
            }
        
        } else if (statements[i].split(" ")[0] == "NEQ") { // NEQ is basically a combination of the NOT and EQ logic, but it doesn't ever add any new bindings (since the user should only specify arguments that are either constants or previously-bound variables to compare – you can't compare the value of an unbound variable to anything, since it doesn't have one).
            NEQStatement = statements[i].split(" ");
            console.log("Checking Unequality on:", NEQStatement[1], "and", NEQStatement[2]);
            let iterativeBindings = [];
            for (let uni of possibleBindings) {
                if ((NEQStatement[1] in uni) && (NEQStatement[2] in uni) ) { // If both arguments are bound variables or constants, we compare their values and discard the uni if they're equal.
                    console.log("Winner:", uni[NEQStatement[1]], "Loser:", uni[NEQStatement[2]]);
                    if (uni[NEQStatement[1]] == uni[NEQStatement[2]]) {
                        continue; // if equal, discard the uni
                    } else {
                        iterativeBindings.push(uni); 
                    }
                } else {
                    // If either argument is unbound variables, that's an error case – we can print an error message to warn the user that they've done something invalid.
                    console.log("Error:", (NEQStatement[1] in uni) ? NEQStatement[1] + " bound" : NEQStatement[1] + " unbound", (NEQStatement[2] in uni) ? NEQStatement[2] + " bound" : NEQStatement[2] + " unbound");
                    iterativeBindings.push(uni); 
                }
                possibleBindings = iterativeBindings;
            }
        } else if (statements[i].split(" ")[0] == "NOT") {
            // NOT basically drops every uni in possibleBindings for which the operator sentence successfully unifies with the previously bound values (and keeps the rest)
            let iterativeBindings = [];
            let newBinding = unify(statements[i].split(" ")[1]);
            console.log("Checking that binding:", newBinding, "is NOT in Query");
            for (let uni of possibleBindings) {
                for (let binding of newBinding) {
                    let newKeys = Object.keys(binding).filter(k=>!Object.keys(uni).includes(k)); // returns all the keys that are not in uni
                    let oldKeys = Object.keys(binding).filter(k=>Object.keys(uni).includes(k)); //  returns all the keys that are in uni
                    let allKeysMatch = !oldKeys.some(k=>binding[k]!=uni[k]); // if all keys in binding match the same key in uni
                    if (allKeysMatch) {
                        continue; // remove if all keys matched
                    } else {
                        iterativeBindings.push(uni);
                    }
                }
            }
            possibleBindings = iterativeBindings;
        } else {
            continue;
        }
    }
    return possibleBindings; 
}

function unifyAll(sentenceSet) { // next step return list of key value pair sets like in unify
    console.log("Unifying Sentences: ", sentenceSet);
    let possibleBindings = [ {} ];

    for (let i = 0; i < sentenceSet.length; i++) {
        let iterativeBindings = [];
        let newBinding = unify(sentenceSet[i]);
        for (let uni of possibleBindings) {
            for (let binding of newBinding) {
                let newKeys = Object.keys(binding).filter(k=>!Object.keys(uni).includes(k)); // returns all the keys that are not in uni
                let oldKeys = Object.keys(binding).filter(k=>Object.keys(uni).includes(k)); //  returns all the keys that are in uni
                let thereExistsAnIncompatibileKey = oldKeys.some(k=>binding[k]!=uni[k]); // if there isnt at any key in binding that doesn't matches the same key in uni
                if (thereExistsAnIncompatibileKey) {
                    continue;
                } else {
                    let nextUni = clone(uni); // clone the current compatible bindings 
                    for (newKey of newKeys) { // and add the new compatible bindings to the set of bindings
                        nextUni[newKey] = binding[newKey];
                    }
                    iterativeBindings.push(nextUni); // then update iterativeBindings (which is reset to empty every unify)
                }
            }
        }
        possibleBindings = iterativeBindings;
    }
    return possibleBindings;
}

// in the database, have locations and in locations have a move function to move characters between different location

window.db = {
    DB, isUppercase, unifyAll, remove, unorderedQuery, unify, insert, clone, parseSentence
};


// module.exports = { parseSentence, insert, remove, unify, unorderedQuery, unifyAll, DB } 

