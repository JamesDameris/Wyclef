var play_as;
var current_id = 0;
// var actions_to_take = ["Order a beverage", "Drink your beverage", "Ask 'How 'bout the weather?'", "Critique other's beverage choice", "Talk about job", "Ask about hobby", "Spill beverage"];
var character_list = new Array();
var info = {};
var charnum = 0;
var practices_active = [];

function getAllActions() { // Possible Actions for each time a character has a turn
    let actions = []; 
    for (let practice of window.practiceDefs) {
        let PracInstances = window.unorderedQuery([`practice.${practice.id}.${practice.roles.join('.')}`]);
        for (let inst of PracInstances) {
            for (let action of practice.actions) { 
                // set Role bindings
                let actorBinding = `EQ Actor ${play_as.toLowerCase()}`;
                let roleBindings = Object.entries(inst).map(i => `EQ ${i[0]} ${i[1]}`);
                let initialBindings = [actorBinding,...roleBindings];
                let bindingSets = window.unorderedQuery(initialBindings.concat(action.conditions));     
                for (let bs of bindingSets) {
                    let formattedName = action.name;
                    for (let In of Object.entries(bs)) {
                        formattedName = formattedName.replaceAll(`[${In[0]}]`,In[1]);
                    }
                    bs["practice"] = practice.id;
                    bs["action"] = formattedName;    
                    bs["outcomes"] = action.outcomes;
                    actions.push(bs);
                }
            }
        }
    }
    
    return actions;
}

function initPracticesSelected() { // initialize all characters at beginning (for example only let one person be bartender)
    // let initializers = [];
    for (let ch of character_list) {
        for (let practice of window.practiceDefs) { 
            if (practice.roles.length > 1) {
                for (let char of character_list) {
                    if (char == ch) { continue; }
                    window.insert(`practice.${practice.id}.${ch.toLowerCase()}.${char.toLowerCase()}`);
                }
            } else {
                if (ch == play_as) { 
                    window.insert(`practice.${practice.id}.${ch.toLowerCase()}`); 
                }
            }
            let pracData = practice.data ? practice.data : null;
            if (pracData) {
                var theData = pracData.map(pd => "practiceData."+practice.id+"."+pd); // set up the data for the query 
                for (let d of theData) {
                    window.insert(d);
                }
            }
            let PracInstances = window.unorderedQuery([`practice.${practice.id}.${practice.roles.join('.')}`]);
            for (let inst of PracInstances) {
                if (inst.init) { // specifically here, do practice instances
                    for (let i of inst.init) {
                        console.log("Inst",inst);
                        let iSent = i.split(" ");
                        window.insert(iSent[1]);
                    }
                }
            }
        } 
    }
}



function addChar(){
    let newchar = document.getElementById("newname").value;
    if (newchar) {
        newcharClass = new window.character.MyCharacter(newchar);
        character_list.push(newchar);
        info[newchar] = [JSON.stringify(newcharClass)];

        let direction = ['stage left', 'stage right', 'center stage'];
        let ranNum = Math.trunc(Math.random()*3);
        let dir = direction[ranNum];
        let textToShow = `has entered from ${dir}`;

        display(textToShow, newchar);
        charnum++;
        window.insert(`characters.${newchar.toLowerCase()}`);
    }
    document.getElementById("newname").value = "";
}
function doneWCharac(){
    play_as = character_list[0];
    document.getElementById("left-section").removeChild(document.getElementById("start"));
    // var done = document.createElement("h1");
    // done.id = 'my-char';
    // done.innerText = "Playing as: " + play_as;
    // done.classList.add('fade-in-scene');
    var charList = document.createElement("ul");
    charList.id = 'char-list';
    charList.style.display = "flex"
    charList.style.textAlign = "center";
    charList.style.listStyle = "none";
    charList.style.position = "relative";
    charList.style.justifyContent = "space-around";
    charList.style.padding = "0px";
    charList.style.bottom = "0px";
    charList.classList.add('fade-in-scene');
    for (let charIt of character_list) {
        let charI = document.createElement("p");
        charI.id = charIt;
        charI.style.marginRight = "10px";
        charI.style.fontSize = "150%";
        charI.innerText = charIt;
        if (charIt == character_list[0]) { charI.style.fontWeight = "bold"; }
        charList.appendChild(charI);
    }
    // document.getElementById("left-section").appendChild(done);
    document.getElementById("left-section").appendChild(charList);
    initPracticesSelected();
    possibleActions();
}
function possibleActions(){
    let posActs = getAllActions();
    console.log("Possible Actions:",posActs);
    document.getElementById("actions").innerHTML = "";
    for(var i = 0; i<posActs.length; i++){
        var button = document.createElement("button");
        var action = document.createTextNode(posActs[i].action);
        action.id = posActs.action;
        button.appendChild(action);
        let tempInst = posActs[i]
        button.onclick = function(event){
            var action_to_take = event.target;
            take_action(action_to_take, tempInst);
        };
        let act = document.getElementById("actions");
        act.appendChild(button);
    }
    var button = document.createElement("button");
    var action = document.createTextNode("Do Nothing");
    action.id = "Do Nothing";
    button.appendChild(action);
    let tempInst = {action: "Did Nothing", outcomes: ""};
    button.onclick = function(event){
        var action_to_take = event.target;
        take_action(action_to_take, tempInst);
    };
    document.getElementById("actions").appendChild(button);
}
function take_action(eventTarget, instance) { // also perform the outcomes !!!! TODO
    // add so that on action taken, add to character list action
    console.log(instance);
    display(instance.action, play_as);
   
    document.getElementById("actions").removeChild(eventTarget); // use query
    for (out of instance.outcomes) {
        let o = out.split(" ");
        let formattedEntry = o[1];
        console.log("Original", formattedEntry);
        for (let In of Object.entries(instance)) {
            if (In[0] == "practice" || In[0] == "action" || In[0] == "outcomes") { continue; }
            formattedEntry = formattedEntry.replaceAll(In[0],In[1]);
        }
        if (o[0] == "delete") {
            console.log("Deleting:", formattedEntry);
            window.remove(formattedEntry);
        } else if (o[0] == "insert") {
            console.log("Inserting:", formattedEntry);
            window.insert(formattedEntry);
        }
    }
    // document.getElementById('char-list').innerText = "Playing as: " + play_as; // replace with bolding the next character to perform an action
    let charList = document.getElementById('char-list');
    for (let ch of charList.children) {
        if (ch.innerText == character_list[current_id+1]) {
            ch.style.fontWeight = "bold";
        } else if (ch.innerText == character_list[current_id]) {
            ch.style.fontWeight = "normal";
        }
    } 
    current_id = (current_id + 1) % charnum;
    play_as = character_list[current_id];
    // initPracticesSelected();
    possibleActions();
}

function display(textToShow, charac){ // change to be on each action (when character is added, say "Character: Added to the Stage (maybe even stage direction)", When action taken say "Character: Took said action")
    
    var charItem = document.createElement('p');
    charItem.id = 'char';
    charItem.classList.add('fade-in-scene');
    var def = document.createElement('p');

    def.innerText = textToShow;

    charItem.innerHTML = `<i><b style='font-size: 150%;'>${charac}<b><i>`;
    charItem.appendChild(def);
    document.getElementById('script').appendChild(charItem); 
    def.scrollIntoView();

}

