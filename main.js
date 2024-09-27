var username = "bogo binte";

var mainID = "zxcmasldkfnsdfvblxk";

var index = 0; // iterate until free

var self = new Peer(mainID);

var conn;

console.log(self);


self.on('open', function(id) {

    console.log("id: " + id);
    
    console.log("in self open");

    conn = self.connect(mainID);
    conn.on('open', function(){
        
        console.log("conn:");
        console.log(conn);
        conn.on('data', function(data){
            console.log("in conn data");
            console.log("rec: " + data);
        });

    });

});


self.on('connection', function(c){
    conn = c;
    // console.log("WOAHdsf");
    console.log("selfconn (in self connection):");
    console.log(conn);
    conn.on('data', function(data){
        console.log("in conn data");
        console.log("rec: " + data);
    });

});


function jerry(){
    console.log("sent jerry");
    conn.send("jerry");
}