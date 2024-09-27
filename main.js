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

    // async function checkFlag(){// recursive recursion - might balloon quickly, but 100 used ids * 100 seconds = only roughly 2.5k calls (and this is very large scale)
    //     if(establishFlag==false){
    //         // console.log("flag ping");
    //         return await setTimeout(checkFlag, 2000);// arbitrary delay
    //     }else{
    //         if(selfpeer.id.replace(mainID, "") == `${index}`){// such that this connection is only used once (running .on multiple times just stacks the functions)
    //             console.log("yuh - initialized");
    //             selfpeer.on('connection', function(c){
    //                 console.log('connection gotten');
                    
    //                 for(var i = 0;i<conns.length;i++){// no repeat connections in conns
    //                     if(conns[i].peer == c.peer){
    //                         return;
    //                     }
    //                 }
    //                 newConnIndex = conns.push(c) - 1;// add it to the list
    //                 conns[newConnIndex].on('data', function(data){
    //                     console.log("rec: " + data);// temp
    //                 });
            
    //             });
    //             _index = index;
    //         }
    //         return;
    //     }
    // }
    // return await checkFlag();

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

        });
        _index = index;
    }

    return;

}

function delay(ms){return new Promise(resolve => setTimeout(resolve, ms));}

function receiveMessage(msg){
    console.log("rec: " + msg);
    // alert(msg);
}

var conns = [];

async function init(){

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
        }
    }
}


init();
