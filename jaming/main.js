
window.onload = function(){
    document.getElementById('canvas').focus();// convenience

    document.getElementById('canvas').style = "position:absolute;left:" + ((window.innerWidth-640)/2) + "px";
}


var sketchProc = function(processingInstance) {
    with (processingInstance) {
       size(640, 360);
       frameRate(60);

        var ainput = [];// continuous input
        var binput = [];// non-continuous input

        keyPressed = function(){
            binput[keyCode] = true;
            ainput[keyCode] = true;
        };
        keyReleased = function(){
            ainput[keyCode] = false;
            // binput[keyCode] = false;
        };

        const groundHeight = 360;

        const pBMR = 0.2;//player ball mass ratio (0.2 = player moves 20% the required distance, ball moves 80%)
        const pMT = 0.1;//player momentum transfer

        var pD = 0;// point differential (red +, yellow -)

        var Player = function(id, respawnLoc, getInputs){
            return {
                w: false,
                a: false,
                s: false,
                d: false,
                e: false,
                hx: respawnLoc.x,
                hy: respawnLoc.y,
                self: id,
                x: 320,
                y: 180,
                r: 15,
                vx: 0,
                vy: 0,
                isGrounded: false,
                airTimer: 0,
                update: function(){
                    this.x+=this.vx;
                    this.y+=this.vy;
                    if(this.x > 660){this.x=-20;}
                    if(this.x < -20){this.x=660;}
                    const dragFactor = 0.97;
                    this.vx*=dragFactor;
                    this.vy*=dragFactor;
                    this.vy+=0.4;
    
                    if(this.y+this.r>groundHeight){
                        //within 25px of ground and going down is enough for ball slam (allowing for chained)
                        if(this.isGrounded==false&&this.vy > 11.5 && abs(by-(groundHeight-br))<25 && bvy>=-0.5){bvy*=10;bvy+=max(0,144-(abs(this.x-bx)));}//pushed down so it bounces, and if its already going down it goes muy fast

                        this.y=groundHeight-this.r;
                        this.vy=0;
                        this.isGrounded = true;
                        this.airTimer = 0;
                    }

                    this.airTimer++;
                    if(this.airTimer>60){this.isGrounded=false;}
    
                    var horizontalFactor = !!(this.d)-!!(this.a);//scuffed type manipulation
                    
                    if(this.isGrounded){
                        this.vx*=0.9*min((abs(0.3*this.vx)+0.7),1-atan(abs(this.vx)/500));
                        const speed = 0.7;
                        this.vx+=horizontalFactor*speed;
                        if(this.w){if(this.y+this.r!=groundHeight){this.isGrounded=false;this.vx+=horizontalFactor*(abs(this.vx)+2);}this.vy-=9;this.y-=1;}
                    }
                    if(this.s){
                        this.vy+=10.5;// why not
                        this.isGrounded=false;
                    }

                    // if(ainput[this.e]){this.x = this.hx;this.y = this.hy;}
                    
    
                },
                doCollisions: function(){
                    var bdist2p = sqrt((bx-this.x)*(bx-this.x) + (by-this.y)*(by-this.y));// b dist to player
                    if(bdist2p < br+this.r){
                        var bang2p = atan2(by-this.y, bx-this.x);//b angle
                        var dx = cos(bang2p) * -(bdist2p-(br + this.r));
                        var dy = sin(bang2p) * -(bdist2p-(br + this.r));
                        
                        this.vx+=dx*-pBMR;this.x+=dx*-pBMR;
                        this.vy+=dy*-pBMR;this.y+=dy*-pBMR;

                        bvx += dx * (1-pBMR);bx+=dx * (1-pBMR);
                        bvy += dy * (1-pBMR);by+=dy * (1-pBMR);
                        bcol++;
                        bvx += this.vx*0.2;
                        bvy += this.vy*0.2;
                        
                    }
                },
                decideInputs: getInputs

            };
        }

        var bx,by,bvx,bvy;
        var br = 12;
        var bcol = 0;

        var players = [
        Player(0, {x:40,y:250}, function(){// player one, uses wasde
            this.w = binput[87];
            this.a = ainput[65];
            this.d = ainput[68];
            this.s = binput[83];
            this.e = ainput[69];// unused
        }), 
        Player(1, {x:600,y:250}, function(){// player two, ai
            this.w=false;this.a=false;this.s=false;this.d=false;this.e=false;
            // code to decide whether w,a,s,d should be pressed
            //e is deprecated

            const isRight = this.hx > 640/2;// true if ai defending to the right, false otherwise
                
            var desiredx = bx + (isRight? br-5 : -br+5);
            // console.log((isRight && players[0].x > bx));
            if((abs(bx-this.hx) > 150)||// if the ball is away from home, attack
                ((isRight && players[0].x > bx)||// or if the player is not on the right side of the ball, attack
                (!isRight && players[0].x < bx))||
                ((isRight && players[0].x + players[0].vx * 20 + 300 < this.x)||// or if the player is 300px away from this in the attacking direction
                (!isRight && players[0].x + players[0].vx * 20 - 300 > this.x))//false
            ){
                // if attacking and player further from ball than 100px in attacking direction
                // jump to initiate pinch
                if(
                    (isRight && abs(players[0].x-(bx-50))>100)||(!isRight && abs(players[0].x-(bx+50)>100))
                ){
                    if(abs(this.x-desiredx)<100 && by+br==groundHeight){// if close enough to justify a jump, and the ball is grounded
                        if(this.y+this.r==groundHeight){// jump
                            this.w=true;
                        }
                    }   
                }
                
            }else{// defending

                if(isRight){
                    desiredx = min(max(this.hx, bx+10),640);
                }else{
                    desiredx = max(min(this.hx, bx-10),0);
                }
                if(abs(this.hx-this.x)<100){// if in position ish
                    if(by < this.y && bvy < -2){// jump if ball is up, and going up
                        if(this.y+this.r==groundHeight){// jump
                            this.w=true;
                        }
                        if(by < this.y - 30 && by + bvy*10 < this.y + this.vy*10){
                            desiredx=this.x;// prevent sideways motion
                            this.w = true;// if ball is above and moving upwards faster
                        }
                    }
    
                    if(abs(players[0].x - this.x) > 200){// if player is away
                        desiredx = bx + (isRight? 40 : -40);
                    }
                }
                

                
            }

            // if above ball, line xs
            if(this.y < by - 20){
                desiredx = bx + (isRight? br-5 : -br+5)// + (this.y-by)*0.1*(isRight?1:-1); // adjust desiredx to account for travel time during slam
                
                if(// if the linear extension of current x according to vx is within a tolerance of a quarter radius of the target point
                    abs((bx + bvx*((this.y-by)/14) + (isRight? br : -br))-(// if vx 3 in that direction would hit well
                        this.x + (this.vx < 0? -4:4)*((this.y-by)/14)
                    ))<br/4 &&
                    ((isRight && bx < this.x)||(!isRight && bx > this.x))// ball is on attacking side
                ){
                    if(this.vy < 12){// avoid tripleslam or whatever
                    this.s=true;// slam
                    }
                }
            }
            
            // if in air, and ball is diagonally to the up-attack dir, double jump into ball
            if((this.y + this.r != groundHeight)&&this.isGrounded&&// is in air (double jump)
                ((isRight && bx < this.x)||(!isRight && bx > this.x))&&// ball is in attacking direction
                (this.y+this.vy*5 > by+bvy*5)&&// ball is above
                (abs((0.7)-abs((this.y+this.vy*5 - by - bvy*5)/(this.x+this.vx*5 - bx - bvx*5)))<0.05)&&// slope between this and ball is around 0.7, given that vx is 3
                (abs(this.vx) > 2)// and already has sizeable momentum (doesnt account for directino but shhhhhhhh)
            ){
                this.w=true;if(isRight){this.a=true;}else{this.d=true;}
            }
            // console.log((isRight && bx < this.x)||(!isRight && bx > this.x)) // checking if attack direction code is correct
            // if on ground, and ball is real high
            if((this.y + this.r == groundHeight)&&// is on ground
            ((isRight && bx < this.x)||(!isRight && bx > this.x))&&// ball is in attacking direction
            (this.y+this.vy*5 > by+bvy*5 + 30)&&// ball is above
            (abs((2*abs(this.vx)/3)-abs((this.y+this.vy*5 - by - bvy*5)/(this.x+this.vx*5 - bx - bvx*5)))<1)&&// slope between this and ball is around 2, given that vx is 3 (high tolerance)
            (abs(this.vx) > 1)){// and already has some momentum (doesnt account for directino but shhhhhhhh
                this.w=true;// hawk jump
                desiredx=bx;// seek on that thang
            }
            
            // if ball is directly above, air dribble
            if((this.y+this.vy*5 > by+bvy*5)&&// ball is above
            (by + 40 > this.y)&&(// but not by that much
                (isRight && bx < this.x)||(!isRight && bx > this.x))&&// in attacking direction
                (this.y < groundHeight - 50)&&// and above ground
                (abs(this.vy)<3&&abs(bvy)<3)// and both are not doing crazy vy
            ){
                this.w = true;// jump and dribble
                desiredx=bx;
            }

            if(// if its joever, attempt screenwrap
                (abs(players[0].x-bx) < abs(this.x -  bx))&&// if the player is closer to the ball and youre not in the way to defend
                ((isRight && players[0].x > this.x) ||
                (!isRight && players[0].x < this.x))
            ){// do a 180 to screenwrap
                desiredx = (isRight? -100 : 800)
            }


            if(abs(this.x-desiredx)>5){// only go if not within 5 px, to avoid jittering
                if(desiredx < this.x){
                    this.a=true;
                }
                if(desiredx > this.x){
                    this.d=true;
                }
            }

            

            if(abs(this.y-by)<25&&// if ys are within 25px and the ball is within the 20px away to the defensive side
                ((isRight&&abs(this.x-(bx+10))<20)||(!isRight&&abs(this.x-(bx-10))<20))
            ){
                if(isRight){d=false;}else{a=false;}// cancel back to defense movement
                // console.log("cancelled to safety")
            }

            if(// jump if would otherwise push the ball backwards
                (isRight && bx > this.x && bx + 10*bvx < this.x + 100 && by+br > groundHeight-10) ||
                (!isRight && bx < this.x && bx + 10*bvx < this.x - 100 && by+br > groundHeight-10)
            ){
                if(this.y+this.r==groundHeight){// jump
                    this.w=true;
                }
            }

        }
    )
        /*Player(0, {x:600,y:250}, function(){// player two, uses arrow keys
            this.w = binput[38];
            this.a = ainput[37];
            this.d = ainput[39];
            this.s = binput[40];
            this.e = ainput[69];// unused
        })*/];

    // players.pop();// get rid of ai for testing


        // init code (not much)

        var init = function(){
            textAlign(CENTER);
            textSize(70);
            for(var i = 0; i < players.length;i++){
                players[i].x = players[i].hx;
                players[i].y = players[i].hy;
                players[i].vx = 0;
                players[i].vy = 0;
            }
            bvx = 0;bvy = -5;bx=320;by=250;
        }
        init();


        draw = function(){
            background(25);

            bx+=bvx;by+=bvy;
            bvy+=0.3;
            if(by+br>groundHeight){by=groundHeight-br;bvy = min(0, max(-0.5*bvy + 0.4,-sqrt(max(0,bvy))));}
            bvx*=0.97;
            bvy*=0.97;

            for(var i = 0;i<players.length;i++){
                players[i].doCollisions();
            }

            for(var i = 0;i<players.length;i++){

                players[i].decideInputs();
                players[i].update();

                // var bdist2p = sqrt((bx-players[i].x)*(bx-players[i].x) + (by-players[i].y)*(by-players[i].y));// b dist to player
                // if(bdist2p < br+players[i].r){
                //     var bang2p = atan2(by-players[i].y, bx-players[i].x);//b angle
                //     var dx = cos(bang2p) * -(bdist2p-(br + players[i].r));
                //     var dy = sin(bang2p) * -(bdist2p-(br + players[i].r));
                //     dx*=(1-pBMR);dy*=(1-pBMR);
                //     bvx+=dx;bx+=dx;
                //     bvy+=dy;by+=dy;
                //     bvx += players[i].vx * pMT;
                //     bvy += players[i].vy * pMT;
                // }

                fill((i+1)*255, i*255, (i-2)*255);
                ellipse(players[i].x, players[i].y, players[i].r*2, players[i].r*2);

            }

            if(bcol==players.length&&bcol!=1){bvy=-5;bvx=(320-bx)*0.02;}

            fill(255);
            ellipse(bx,by,br*2,br*2);

            if(bx < 0){pD--;init();}
            if(bx > 640){pD++;init();}

            text(pD, 0, 20, 640, 100);


            binput = [];//reset
            bcol = 0;

        };
       
    }};

   // Get the canvas that Processing-js will use
var canvas = document.getElementById("canvas");
   // Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
var processingInstance = new Processing(canvas, sketchProc);