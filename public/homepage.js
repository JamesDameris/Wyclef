
var play_as;
var actionsto_take = ["Order a beverage", "Drink your beverage", "Ask 'How 'bout the weather?'", "Critique other's beverage choice", "Talk about job", "Ask about hobby", "Spill beverage"];
var character_list = new Array();
var info = {};
var charnum = 0;

function addChar(){
    let newchar = document.getElementById("newname").value;
    if (newchar) {
        newcharClass = new window.character.MyCharacter(newchar);
        character_list.push(newchar);
        info[newchar] = [JSON.stringify(newcharClass)];
        console.log(newchar," ",newcharClass);
        display();
    }
    document.getElementById("newname").value = "";
}
function doneWCharac(){
    play_as = character_list[0];
    document.getElementById("left-section").removeChild(document.getElementById("start"));
    var done = document.createElement("h1");
    done.id = 'my-char';
    done.innerText = "Playing as: " + play_as;
    document.getElementById("left-section").appendChild(done);
    actionButtons();
}
function actionButtons(){
    for(var i = 0; i<actionsto_take.length; i++){
        var button = document.createElement("button");
        var action = document.createTextNode(actionsto_take[i]);
        action.id = `${actionsto_take[i]}`;
        button.appendChild(action);
        button.onclick = function(event){
            var action_totake = event.target;
            add_action(action_totake);
        };
        document.getElementById("actions").appendChild(button);
    }
}
function add_action(action){
    // add so that on action taken, add to character list action
    char_actions = document.getElementById(`${play_as} Actions`);
    var newAction = document.createElement('li')
    newAction.textContent = action.innerText;
    
    if (char_actions.childNodes[0].innerText == "No Actions Taken") {
        char_actions.removeChild(char_actions.childNodes[0]);
    }
    char_actions.appendChild(newAction);
    document.getElementById("actions").removeChild(action)
}

function display(){

    var charItem = document.createElement('li');
    charItem.id = 'char';
    
    var def = document.createElement('li');
    def.innerText = "No Actions Taken";
    for (let char of Object.keys(info)) {
        charItem.innerHTML = `<i><b style='font-size: 150%;'>${char}<b><i>`;
        var charList = document.createElement('ul');
        charList.id = `${char} Actions`;
        charList.appendChild(def);
        charItem.appendChild(charList);
        document.getElementById('character-list').appendChild(charItem); 
    }        
}

