var play_as;
var current_id = 0;
// var actions_to_take = ["Order a beverage", "Drink your beverage", "Ask 'How 'bout the weather?'", "Critique other's beverage choice", "Talk about job", "Ask about hobby", "Spill beverage"];
var character_list = new Array();
var info = {};
var charnum = 0;
var practices_active = [];

function capitalize(str) {
    let string = str.charAt(0).toUpperCase();
    return string += str.substring(1);
}

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
                    let formattedReadable = action.human_readable;
                    for (let In of Object.entries(bs)) {
                        // let In1 = In[1].charAt(0).toUpperCase();
                        // In1 += In[1].substring(1);
                        let In1 = capitalize(In[1]);
                        if (songMapping[In1]) {
                            In1 = songMapping[In1];
                        }
                        formattedName = formattedName.replaceAll(`[${In[0]}]`,In1);
                        formattedReadable = formattedReadable.replaceAll(In[0],In1);
                    }
                    bs["practice"] = practice.id;
                    bs["action"] = formattedName;  
                    bs["human_readable"] = formattedReadable;
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
            let pracData = practice.data ? practice.data : null; 
            if (pracData) {// initializing constant practiceData, which is independent
                var theData = pracData.map(pd => "practiceData."+practice.id+"."+pd); // set up the data for the query 
                for (let d of theData) {
                    window.insert(d);
                }
            }
            if (window.practicesActive[practice.id] == "All" || window.practicesActive[practice.id].includes(ch)) {
                if (practice.roles.length > 1) {
                    for (let char of character_list) {
                        if (char == ch) { continue; }
                        window.insert(`practice.${practice.id}.${ch.toLowerCase()}.${char.toLowerCase()}`);
                    }
                } else if (practice.id == "jukebox") {
                    window.insert(`practice.jukebox.thejukebox`);
                } else if (practice.roles.length == 1) {
                    if (ch == play_as) { 
                        window.insert(`practice.${practice.id}.${ch.toLowerCase()}`); 
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
    //document.getElementById("left-section").appendChild("<h1>Choose an action:</h1><div id='action-container'><ul id='actions'></ul></div>");
    document.getElementById("left-section").appendChild(charList);
    initPracticesSelected();
    possibleActions();
}
function possibleActions(){
    let posActs = getAllActions();
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
    let tempInst = {Actor: `${play_as.toLowerCase()}`, action: "Do Nothing",human_readable: "Does nothing", outcomes: ["insert characters.Actor.endurance!normal"]};
    button.onclick = function(event){
        var action_to_take = event.target;
        take_action(action_to_take, tempInst);
    };
    document.getElementById("actions").appendChild(button);
}
function take_action(eventTarget, instance) { // also perform the outcomes !!!! TODO
    // add so that on action taken, add to character list action
    display(instance.human_readable, play_as);
   
    document.getElementById("actions").removeChild(eventTarget); // use query
    for (out of instance.outcomes) {
        let o = out.split(" ");
        let formattedEntry = o[1];
        let shouldBePractice = o[1].split(/[.!]/)[1];
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
            if (!character_list.includes(capitalize(formattedEntry.split(/[.!]/)[1]))) { // talk about in paper how insert and spawning a practice need to be different and having separate logic can be cleaner
                if (window.practicesActive[`${shouldBePractice}`][0] != "All" && !window.practicesActive[`${shouldBePractice}`].includes(formattedEntry.split(/[.!]/)[2])) {
                    window.practicesActive[`${shouldBePractice}`].push(formattedEntry.split(/[.!]/)[2]);
                }
            }
        }
    }
    // document.getElementById('char-list').innerText = "Playing as: " + play_as; // replace with bolding the next character to perform an action
    let charList = document.getElementById('char-list');
    let next_id = (current_id + 1)%charnum;
    for (let ch of charList.children) {
        if (ch.innerText == character_list[next_id]) {
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
    charItem.classList.add('typewriter');
    charItem.innerHTML = `<i><b style='font-size: 110%;'>${charac}:</b></i>  ${textToShow}`;
    document.getElementById('script').appendChild(charItem); 
    charItem.scrollIntoView();

}

