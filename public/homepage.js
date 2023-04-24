
var play_as;
var actionsto_take = ["Order", "Drink your beverage", "Ask 'How 'bout the weather?'", "Critique other's beverage choice", "Talk about job", "Ask about hobby", "Spill beverage"];
var character_list = new Array();
var info = {};
var charnum = 0;

function addChar(){
    let newchar = document.getElementById("newname").value;
    if (newchar) {
        newcharClass = new window.character.MyCharacter(newchar);
        character_list.push(newchar);
        info[newchar] = [JSON.stringify(newcharClass)];
        console.log(newcharClass);
        display();
    }
    document.getElementById("newname").value = "";
}
function doneWCharac(){
    play_as = character_list[0];
    document.getElementById("test").innerHTML = play_as;
}
function actionButtons(){
    for(var i = 0; i<actionsto_take.length; i++){
        var button = document.createElement("button");
        var action = document.createTextNode(actionsto_take[i]);
        button.appendChild(action);
        button.onclick = function(event){
            var action_totake = event.target.innerText;
            add_action(action_totake);
        };
        document.body.appendChild(button);
    }
}
function add_action(action){
    document.getElementById("action").innerHTML = action;
    let newArray = new Array;
    newArray.push(info[play_as]);
    newArray.push(action);
    info[play_as] = newArray;
    charnum = (charnum++) % character_list.length;
    play_as = character_list[charnum];
}

// setInterval(display,1000);
function display(){
    var list = document.createElement('ul');
    var charItem = document.createElement('li');
    list.id = 'infoList';
    document.getElementById("info").appendChild(list);
    var def = document.createElement('li');
    def.innerHTML = "No Actions";
    for (let char of Object.keys(info)) {
        charItem.innerHTML = `${char}`;
        var charList = document.createElement('ul');
        charList.id = `${char} Actions`;
        charList.appendChild(def);
        charItem.appendChild(charList);
        
        document.getElementById('infoList').appendChild(charItem); 
    }
                 
}

