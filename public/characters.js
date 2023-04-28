class MyCharacter { // change to make only name required, all others are generated
    constructor (name, height = Math.floor(Math.random() * (200-140) + 140)) {
        this.name = name;
        this.dob = new Date(Math.random() * (new Date("Jan 1 2005").valueOf())); // month day year
        
        this.height = height; // in centimeters

        this.weight = Math.floor((((height - 140)/60 ) * 65) + 45) + Math.floor(Math.random() * (6) - 3);; // in kilograms 110-45 with rand deviation of 3 kgs
        
        // randomizing eye_color
        let posShade = ["dark","light",""];
        let posColor = ["brown","blue","green"];
        this.eye_color = posShade[Math.floor(Math.random() * posShade.length)];
        let index = Math.floor(Math.random() * posColor.length)
        if (this.eye_color !== "" ) { 
            this.eye_color = this.eye_color + " " + posColor[index]
        } else { 
            this.eye_color = posColor[index]; 
        }
        // calculations for getting age
        let date2 = new Date();
        let elapsedMS = date2.getTime() - this.dob.getTime();
        this.age = Math.trunc(elapsedMS * 3.17098E-11);
        // randomizing hobbies
        let posHobbies = ["Swim","Watch TV","Sing","Dance","Surf","Golf","Fish","Bike","Play Video Games"];
        let randomizer = Math.floor(Math.random() * 5 + 1);
        this.hobbies = [];
        let range = Math.floor(Math.random()*posHobbies.length);
        for (let i = 0; i < range; i ++) {
            let ii = (i + randomizer)%posHobbies.length;
            this.hobbies.push(posHobbies[ii]);
        }
        
        
        // character affinity list
        this.affinity = {};
    }

    printInfo () {
        console.log("My name is",this.name+".");
        console.log("I am",this.age,"years old.");
        console.log("I weight",this.weight,"kilograms and I am",this.height,"centimeters tall.");
        console.log("I have",this.eye_color,"eyes.");
        let hobbyAmount = 0;
        if (this.hobbies) {hobbyAmount = this.hobbies.length;}
        if (hobbyAmount > 1) {
            console.log("My favorite things to do are:");
            for (let i = 0; i < hobbyAmount-1; i++) {
                console.log(this.hobbies[i]+",");
            }
            console.log("and",this.hobbies[hobbyAmount-1]+".");
        } else if (hobbyAmount === 1) {
            console.log("My favorite thing to do is",this.hobbies[0]);
        } else {
            console.log("I don't like to do anything at the moment.");
        }
    }

    set addhobbies (val) {
        this.hobbies.push(...val);
    }

    get happiness () {
        if (this.happy > 0) {
            return "I am happy.";
        } else if (this.happy === 0) {
            return "I am feeling okay.";
        } else {
            return "I not feeling so well.";
        }
    }

    removeHobbies (...val) {
        this.hobbies = this.hobbies.filter(hobby => !val.includes(hobby)); 
    }

    getAffinityFor (character) {
        if (Object.keys(this.affinity).includes(character.name)) {
            return this.affinity[character.name];
        } else {
            return this.affinity[character.name] = 0;
        }
    }

    setAffinityFor (character,value) {
        this.affinity[character.name] = value;
    }

    get relationshipLevels () {
        for (let ch in this.affinity) {
            if (this.affinity[ch] >= 3 && this.affinity[ch] < 6) {
                console.log(ch+": Friend");
            } else if (this.affinity[ch] >= 6 && this.affinity[ch] < 9) {
                console.log(ch+": Best Friend");
            } else if (this.affinity[ch] <= 3 && this.affinity[ch] < -3) {
                console.log(ch+": Acquaintance");
            } else if (this.affinity[ch] <= -3) {
                console.log(ch+": Enemy");
            }
        }
    }
}

window.character = {
    MyCharacter
};

// module.exports = {MyCharacter}