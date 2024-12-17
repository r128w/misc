
var thirst = 0.2;
var hunger = 0.2;
var energy = 0.8;
var wantedness = 0;


// event key
	// -1: generic driving
	// 0: starting
	// 1: starting, refused (points to itself)
	// 2: leaving house
	// 3: stopping driving, side of road
	// 4: police encounter (chill)
	// 5: police encounter (not chill)
	// 6: police encounter end (chill)
	// 7: police encounter end (not chill)
	// 8: car chase
	// 9: game over (arrested)
	// 10: game over (dead)
	// 11: game over (crash)

var lasttext = "";
var currenttext = "";

var curEvent = 0;

function next(){

    var factor = Math.random();
    energy*=0.95;energy-=0.03*factor;
    energy=Math.max(0, energy);
    thirst+=0.05*factor;
    hunger+=0.03*factor;
    wantedness-=0.01*factor;
    wantedness=Math.max(0, wantedness);

    if(thirst>1||hunger>1){
        if(curEvent == 1){
            lasttext+=" Your indecision gets the better of you."
        }else{
            if(thirst>1){lasttext+=" You've been thirsty for a while."}
            if(hunger>1){lasttext+=" You've been hungry for a while."}
            lasttext+=" Suddenly, it gets the better of you, and you pass out. You will not get to Cleveland."
        }
        curEvent = 10;
    }

    act(curEvent);


}

function showOptions(options, outcomes){
    document.getElementById('story').innerText=currenttext;
    document.getElementById('options').innerHTML="";
    for(var i = 0; i < options.length;i++){
        var newElement = document.getElementById('sampleOption').cloneNode(true);
        newElement.className="";//remove hidden
        newElement.id="";// remove this
        newElement.innerHTML=newElement.innerHTML.replace("[[[JS]]]", outcomes[i]);
        newElement.innerHTML=newElement.innerHTML.replace("[[[TEXT]]]", options[i]);
        document.getElementById('options').appendChild(newElement);
        // newElement=undefined;
    }
}

function act(event){
    switch(event){
        case 0:
            currenttext="What do you do?"
            showOptions(["I decide to go. Why not?", "I stay. I don't think this is a good idea."],["curEvent=2","curEvent=1"])
            break;
        case 1:
            currenttext="You can't shake the thought of leaving off your mind."
            if(		 Math.random()<0.3) {		 currenttext += " A car passes outside, and you wish you were in it.";
			}else if(Math.random()<0.3) {currenttext += " You hear talking in the street outside. Maybe those people are talking about leaving Falls Church, VA.";}
            showOptions(["I decide to go. Why not?", "I stay. I don't think this is a good idea."],["curEvent=2","curEvent=1"]);
            break;
        case 2:
            break;
    }
}

next()