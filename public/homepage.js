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
        PracInstances = window.unorderedQuery([`practice.${practice.id}.${practice.roles.join('.')}`]);
        for (let inst of PracInstances) {
            for (let action of practice.actions) {
                // set Role bindings
                let actorBinding = `EQ Actor ${play_as.toLowerCase()}`;
                let roleBindings = Object.entries(inst).map(i => `EQ ${i[0]} ${i[1]}`);
                let initialBindings = [actorBinding,...roleBindings];
                let bindingSets = window.unorderedQuery(initialBindings.concat(action.conditions));
                console.log("Binding:",bindingSets);
                for (let bs of bindingSets) {
                    let formattedName = action.name;
                    for (In of Object.entries(bs)) {
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

function initPracticesSelected() {
    // let initializers = [];
    for (let practice of window.practiceDefs) { 
        if (practice.roles.length > 1) {
            for (let char of character_list) {
                if (char == play_as) { continue; }
                window.insert(`practice.${practice.id}.${play_as.toLowerCase()}.${char.toLowerCase()}`);
            }
        } else {
            window.insert(`practice.${practice.id}.${play_as.toLowerCase()}`);
        }
        let pracData = practice.data ? practice.data : null;
        if (pracData) {
            var theData = pracData.map(pd => "practiceData."+practice.id+"."+pd); // set up the data for the query 
            for (let d of theData) {
                window.insert(d);
            }
        }
        if (practice.init) { // specifically here, do practice instances
            for (let i of practice.init) {
                let iSent = i.split(" ");
                window.insert(iSent[1]);
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
    charList.style.display = "flex";
    charList.style.listStyle = "none";
    charList.style.position = "relative";
    charList.style.justifyContent = "space-around";
    charList.style.padding = "0px";
    charList.style.bottom = "-500px";
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
        document.getElementById("actions").appendChild(button);
    }
}
function take_action(eventTarget, instance) { // also perform the outcomes !!!! TODO
    // add so that on action taken, add to character list action
    console.log(instance);
    display(instance.action, play_as);
   
    document.getElementById("actions").removeChild(eventTarget); // use query
    current_id = current_id + 1;
    play_as = character_list[current_id%charnum];
    // document.getElementById('my-char').innerText = "Playing as: " + play_as; // replace with bolding the next character to perform an action
}

function display(textToShow, charac){ // change to be on each action (when character is added, say "Character: Added to the Stage (maybe even stage direction)", When action taken say "Character: Took said action")
    
    var charItem = document.createElement('p');
    charItem.id = 'char';
    charItem.classList.add('typewriter');
    var def = document.createElement('p');

    def.innerText = textToShow;

    charItem.innerHTML = `<i><b style='font-size: 150%;'>${charac}<b><i>`;
    charItem.appendChild(def);
    document.getElementById('script').appendChild(charItem); 
    def.scrollIntoView();

}

