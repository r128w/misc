const c = document.getElementById('main-canvas');
const ctx = c.getContext('2d')

window.onresize = function(){
    c.width = c.clientWidth// clientwidth/height is that which is specified by the css on the canvas object
    c.height = c.clientHeight
    canvasClear()
}

var sprites = {
    player: new Image(),
    smoke: new Image(),
    platforms: [// all textures, referred to by id
        new Image()
    ]
}

function loadSprites(){
    sprites.player.src = "./assets/player.png"
    sprites.smoke.src = "./assets/smoke.png"
    sprites.platforms[0].src = "./assets/plat-main.png"
}

var cam = {
    xo:0,
    yo:0,
    sx:1,
    sy:1
}


function canvasClear(){
    ctx.fillStyle="#000000"
    ctx.fillRect(-5000, -5000, 10000, 10000)
    ctx.fillStyle="#dddddd"
    for(var i = p.x-700 - p.x%20; i < p.x+700; i += 20){
        for(var ii =(p.y - 500)-p.y%20; ii < p.y+500; ii+=20){
            if(rand(i + (ii*32435498374%13425))<0.02){
                drawRect(i,ii, 2, 2)
            }
        }
    }
}

function renderFrame(){
    cam.xo=-p.x
    cam.yo=-p.y
    ctx.beginPath()

    ctx.setTransform(1, 0, 0, 1, c.width/2, c.height/2)

    canvasClear()

    renderParticles()
    renderPlanets()
    renderPlatforms()

    drawSpriteRot(sprites.player, p.x, p.y, p.rot)

    renderMinimap()

    ctx.closePath()


}

function renderMinimap(){


    const minimapWidth = (input.tabbed ? Math.min(c.height - 40, c.width/2 - 120) : 250);

    ctx.save()

    ctx.beginPath()
    const xstart = 20 - c.width/2
    const ystart = 20 - c.height/2
    ctx.moveTo(xstart, ystart)
    ctx.lineTo(xstart + minimapWidth, ystart)
    ctx.lineTo(xstart + minimapWidth, ystart + minimapWidth)
    ctx.lineTo(xstart, ystart + minimapWidth)
    ctx.lineTo(xstart, ystart)
    ctx.closePath()
    
    ctx.clip()

    ctx.fillStyle="#333333"+(input.tabbed ? "99" : "")
    var closestPlanet = null
    var dist2p = 10000000
    for(var i = 0; i < planets.length; i ++){
        const d = dist(p.x, p.y, planets[i].x, planets[i].y)
        if(d<dist2p){closestPlanet=planets[i];dist2p=d}
    }
    const worldc = (!closestPlanet ? {x:p.x, y:p.y} : (dist2p < 5000 ? {// if there is no planet (null is truthy, and an object is falsy)
        x:(p.x+closestPlanet.x)/2,
        y:(p.y+closestPlanet.y)/2
    } : {x:p.x, y:p.y}));// world center of minimap

    const minimapScale = Math.min(0.3*minimapWidth/(dist2p+30*Math.sqrt(p.vx*p.vx+p.vy*p.vy)) * (input.tabbed ? 0.5 : 1), 0.3);



    ctx.fillRect(-c.width/2+20, -c.height/2+20, minimapWidth, minimapWidth)

    for(var i = 0; i < planets.length; i++){
        var drawX = xstart
        var drawY = ystart
        drawX += minimapWidth/2
        drawY += minimapWidth/2
        drawX += planets[i].x * minimapScale
        drawY += planets[i].y * minimapScale
        drawX -= worldc.x*minimapScale
        drawY -= worldc.y*minimapScale

        drawCircle(drawX - cam.xo, drawY - cam.yo, planets[i].r * minimapScale, planets[i].col)

        if(config.drawPlanetInfluence){
            drawCircle(drawX - cam.xo, drawY - cam.yo, planets[i].r * config.planetInfluenceFactor * minimapScale, planets[i].col+"11")
        }
        // ctx.beginPath()
        // ctx.moveTo(drawX + gravLimit*minimapScale, drawY)
        // ctx.lineTo(drawX, drawY + gravLimit*minimapScale)
        // ctx.lineTo(drawX - gravLimit*minimapScale, drawY)
        // ctx.lineTo(drawX, drawY - gravLimit*minimapScale)
        // ctx.fillStyle="#ffffff44"
        // ctx.fill()
        // ctx.closePath()

    }


    // orbital path
    const steps = 120
    const factor = 10; // delta factor
    var cur = {x:p.x, y:p.y, vx:p.vx, vy:p.vy}
    // ctx.setTransform(minimapScale, 0, 0, minimapScale, -c.width/2 + 20 + (minimapWidth/2), -c.height/2 + 20 + (minimapWidth/2))
    ctx.setTransform(minimapScale, 0, 0, minimapScale, 20 + minimapWidth/2 - worldc.x*minimapScale, 20 + minimapWidth/2 - worldc.y*minimapScale)

    ctx.closePath()
    ctx.beginPath()
    ctx.strokeStyle='#aaaaaa'
    ctx.lineWidth=2/minimapScale
    ctx.moveTo(cur.x, cur.y)
    for(var i = 0; i < steps; i++){
        cur.x+=cur.vx * factor
        cur.y+=cur.vy * factor
        ctx.lineTo(cur.x, cur.y)
        var hit = false;
        for(var ii = 0; ii < planets.length; ii ++){

            const grav = getGravity(planets[ii].x, planets[ii].y, cur.x, cur.y, planets[ii].r*config.planetInfluenceFactor)

            cur.vx+= grav.x*planets[ii].mass*factor
            cur.vy+= grav.y*planets[ii].mass*factor

            if(grav.dist < planets[ii].r+16){hit=true;break}// landed
        }
        if(hit){break}
    }
    ctx.stroke()
    ctx.closePath()
    ctx.setTransform(1, 0, 0, 1, c.width/2, c.height/2)


    //platforms, physics objects
    for(var i = 0; i < pobjects.length; i++){
        if(pobjects[i] instanceof Player){continue}
        if(!(pobjects[i] instanceof Platform)){continue}
        var drawX = xstart
        var drawY = ystart
        drawX += minimapWidth/2
        drawY += minimapWidth/2
        drawX += pobjects[i].x * minimapScale
        drawY += pobjects[i].y * minimapScale

        drawX -= worldc.x*minimapScale
        drawY -= worldc.y*minimapScale
        drawCircle(drawX - cam.xo, drawY - cam.yo, Math.max(1.5, pobjects[i].r * minimapScale), pobjects[i].col)
    }


    // player
    var drawX = xstart
    var drawY = ystart
    drawX += minimapWidth/2
    drawY += minimapWidth/2
    drawX += p.x * minimapScale
    drawY += p.y * minimapScale

    drawX -= worldc.x*minimapScale
    drawY -= worldc.y*minimapScale

    const drawScale = Math.max(16*minimapScale, 3)

    ctx.beginPath()
    ctx.moveTo(drawX + Math.cos(p.rot)*drawScale*1.5, drawY + Math.sin(p.rot)*drawScale*1.5) // front point is a little extralarge

    ctx.lineTo(drawX + Math.cos(p.rot+2.356)*drawScale*1.414, drawY + Math.sin(p.rot+2.356)*drawScale*1.414)
    ctx.lineTo(drawX + Math.cos(p.rot+3.142)*drawScale*0.8, drawY + Math.sin(p.rot+3.142)*drawScale*0.8)
    ctx.lineTo(drawX + Math.cos(p.rot-2.356)*drawScale*1.414, drawY + Math.sin(p.rot-2.356)*drawScale*1.414)

    ctx.fillStyle="#ffffff"
    ctx.fill()

    ctx.restore()
}


function drawSpriteRot(sprite, x, y, rot){
    ctx.translate(x+cam.xo, y+cam.yo)
    ctx.rotate(rot)
    ctx.drawImage(sprite, -sprite.width/2, -sprite.height/2)
    ctx.rotate(-rot)
    ctx.translate(-x-cam.xo, -y-cam.yo)
}
function drawSprite(sprite, x, y){ctx.drawImage(sprite, x + cam.xo, y + cam.yo)}
function drawRect(x, y, w, h){ctx.fillRect(x + cam.xo, y + cam.yo, w, h)}
function drawRect(x, y, w, h, color){ctx.fillStyle=color;ctx.fillRect(x + cam.xo, y + cam.yo, w, h)}
function drawCircle(x, y, r, color){
    ctx.closePath()
    ctx.beginPath()
    ctx.fillStyle=color
    ctx.ellipse(x + cam.xo, y + cam.yo, r, r, 0, 0, 6.29)
    ctx.fill()
}