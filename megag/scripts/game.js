class Player extends PhysicsObject{
    constructor(x, y, r){
        super(x, y, r)
    }
    iterate(){
        super.iterate()

        // this.vr*=0.95// angular drag for the weak
            
        const rspeed = 0.004*Math.max(0, 1 - Math.abs(this.vr - 0.2))
        if(input.a){this.vr-=rspeed}
        if(input.d){this.vr+=rspeed}

        const acc = 0.02
        if(input.w){
            const dx = acc * Math.cos(this.rot)
            const dy = acc * Math.sin(this.rot)
            const speed = (input.space ? 3 : 1)// space to overdrice
            this.vx+=dx*speed
            this.vy+=dy*speed
            addParticle({
                    x: this.x - 150*dx + 3*(Math.random()-0.5),
                    y: this.y - 150*dy + 3*(Math.random()-0.5),
                    vx: this.vx - 10*dx + (Math.random()-0.5),
                    vy: this.vy - 10*dy + (Math.random()-0.5),
                    age: 0
                })
        }
        if(input.s){
            this.vx+= -0.5 * acc * Math.cos(this.rot)
            this.vy+= -0.5 * acc * Math.sin(this.rot)
        }

        if(this.landed != null){
            if(input.w){
                const r2p = Math.atan2(this.y-this.landed.y, this.x-this.landed.x)//rot to planet
                const launchSpeed = ((input.s ? 2 : 10) * config.bigG*this.landed.r/(400) + 1.5);
                // var dir = -(input.a-input.d)
                this.vx+=launchSpeed*Math.cos(r2p)
                this.vy+=launchSpeed*Math.sin(r2p)

                // this.vx+=0.2*launchSpeed*Math.cos(r2p+1.57)*dir
                // this.vy+=0.2*launchSpeed*Math.sin(r2p+1.57)*dir

                this.x+=launchSpeed*2*Math.cos(r2p)// get off the surface
                this.y+=launchSpeed*2*Math.sin(r2p)
                this.landed=null
                // console.log(this.vx)
            }
        }

    }
}

pobjects.push(new Player(-200, -200, 16))
var p = pobjects[0]

var entities = []

function iterateFrame(){

    iterateParticles()
    iteratePhysics()

}