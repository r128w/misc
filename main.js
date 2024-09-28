var username = "bogo binte";

var mainID = "zxcmasldkfnsdfvblxk";

var selfpeer;

var establishFlag = false;

var _index = 0;

async function establishPeer(index){// recursion (lmao)

    selfpeer = new Peer(mainID+index);

    selfpeer.on('open', function(id) {// this function should only be called once a succesful peer has been established

        // console.log("in selfpeer open");
        console.log("id: " + id);
        establishFlag = true;
    
    });

    selfpeer.on('error', async function (err){
        
        // console.log(err.type);
        if(err.type == 'unavailable-id'){

            console.log("index " + index + " taken");
            if(index < 100){// arbitrary limit to prevent inf loop

                return await establishPeer(index+1);

            }else{console.log("peer index failure: no open slot");return;}

        }else{console.log('peer init error: ' + err);}
    });

    while(establishFlag == false){
        await delay(1000)
    }

    if(selfpeer.id.replace(mainID, "") == `${index}`){// such that this connection is only used once (running .on multiple times stacks the functions)

        console.log("initialized peer");
        selfpeer.on('connection', function(c){
            console.log('connection gotten');
            
            for(var i = 0;i<conns.length;i++){// no repeat connections in conns
                if(conns[i].peer == c.peer){
                    return;
                }
            }
            newConnIndex = conns.push(c) - 1;// add it to the list
            conns[newConnIndex].on('data', function(data){receiveMessage(data);});
            conns[newConnIndex].on('close', function(){
                console.log("lost connection");
            });

        });
        _index = index;
    }

    return;

}

function delay(ms){return new Promise(resolve => setTimeout(resolve, ms));}

function receiveMessage(msg){
    if(msg == ""){return;}
    
    console.log("rec: " + msg);
    // alert(msg);
    // var sampleMessageBox = document.getElementById("samplebox");
    var newBox = document.getElementById('samplebox').cloneNode(true);// deep clone (for all internals)
    newBox.classList.remove('hidden');
    newBox.innerHTML = newBox.innerHTML.replace("[[[message]]]", msg["message"]);
    newBox.innerHTML = newBox.innerHTML.replace("[[[username]]]", msg["username"]);
    newBox.innerHTML = newBox.innerHTML.replace("[[[timestamp]]]", "at " + ((Math.floor(msg["timestamp"]/1000))%10000));
    document.getElementById('displaybox').appendChild(newBox);
}

function sendMessage(){
    var toSend = {'message':document.getElementById('messagebox').innerHTML,'username':document.getElementById('usernamebox').innerText,'timestamp':Date.now()}
    for(var i = 0;i<conns.length;i++){conns[i].send(toSend);}
    receiveMessage(toSend);// temp
    document.getElementById('messagebox').innerText = '';
}

var conns = [];

async function init(){

    document.getElementById('messagebox').addEventListener('keydown', function(ev){
        if(ev.key=="Enter"&&ev.shiftKey==false){
            ev.preventDefault();
            sendMessage();
        }
    })

    await establishPeer(0);
    
    await delay(500);// idk why this is needed but it is

    console.log("establishing connections");
    await establishConns();

}

async function establishConns(){

    for(var i = Math.max(0, _index-4);i<_index;i++){

        var alreadyIn = false;
        for(var ii = 0;ii<conns.length;ii++){
            if(conns[ii].peer == mainID+i){
                alreadyIn = true;
            }
        }

        console.log("checked " + i + ", conn preexists: " + alreadyIn);

        if(!alreadyIn){
            console.log("connect to " + i);
            conns.push(selfpeer.connect(mainID + i));
            conns[i].on('data', function(data){receiveMessage(data);});
            conns[i].on('close', function(){
                console.log("lost connection");
            });
        }
    }
}


init();
