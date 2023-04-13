
class character {
    constructor (name, dob, height, weight, eyeColor) {
        this.name = name;
        this.dob = new Date(dob); // month day year
        this.height = height; // in centimeters
        this.weight = weight; // in kilograms
        this.eyeColor = eyeColor;
        // calculations for getting age
        let date2 = new Date();
        let elapsedMS = date2.getTime() - this.dob.getTime();
        this.age = Math.trunc(elapsedMS * 3.17098E-11);
        
        this.happy = 0;
        this.angry = 0;
        this.sad = 0;
        this.hunger = 0;
        this.thirst = 0;
        this.anxiety = 0;
        this.hobbies = [];
        
        // character affinity list
        this.affinity = {};
    }

    printInfo () {
        console.log("My name is",this.name+".");
        console.log("I am",this.age,"years old.");
        console.log("I weight",this.weight,"kilograms and I am",this.height,"centimeters tall.");
        console.log("I have",this.eyeColor,"eyes.");
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
        console.log(this.happiness);
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




module.exports = {character}