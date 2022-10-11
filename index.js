const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 568

c.fillRect(0, 0, canvas.width, canvas.height)

const gravidade = 0.7

class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1 }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 1


    }
    draw() {

        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x,
            this.position.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale)

    }

    update() {
        this.draw()
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {

            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }
}

class Fighter {
    constructor({ position, velocidade, cor = 'red', offset }) {
        this.position = position
        this.velocidade = velocidade
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.cor = cor
        this.isAttacking
        this.health = 100
    }
    draw() {
        c.fillStyle = this.cor
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        //attack box
        if (this.isAttacking) {
            c.fillStyle = 'yellow'
            c.fillRect(this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height)
        }

    }

    update() {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocidade.x
        this.position.y += this.velocidade.y

        if (this.position.y + this.height + this.velocidade.y >= canvas.height - 40) {
            this.velocidade.y = 0

        } else this.velocidade.y += gravidade
    }

    attack() {
        this.isAttacking = true

        setTimeout(() => {
            this.isAttacking = false
        }, 100);
    }


    attack2() {
        this.isAttacking = true

        setTimeout(() => {
            this.isAttacking = false
        }, 100);
    }
}



const background = new Sprite({

    position: {
        x: 0,
        y: 0
    },

    imageSrc: './img/Background2.png'

})

const obelisk = new Sprite({

    position: {
        x: 564,
        y: 240
    },

    imageSrc: './img/obelisk.png',
    scale: 0.5,
    framesMax: 13

})

const player = new Fighter({

    position: {
        x: 0,
        y: 0
    },

    velocidade: {
        x: 0,
        y: 10
    },

    offset: {
        x: 0,
        y: 0
    }
})

const enemy = new Fighter({

    position: {
        x: 400,
        y: 100
    },

    velocidade: {
        x: 0,
        y: 0
    },

    offset: {
        x: -50,
        y: 0
    },

    cor: 'blue'
})


console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }




}


function colisaoRetangular({ retangulo1, retangulo2 }) {
    return (
        retangulo1.attackBox.position.x + retangulo1.attackBox.width >= retangulo2.position.x
        && retangulo1.attackBox.position.x <= retangulo2.position.x + retangulo2.width
        && retangulo1.attackBox.position.y + retangulo1.attackBox.height >= retangulo2.position.y
        && retangulo1.attackBox.position.y <= retangulo2.position.y + retangulo2.height
    )
}


function determinarVencedor({ player, enemy, timerID }) {
    clearTimeout(timerID)
    document.querySelector('#displayText').style.display = 'flex'
    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Empate'
    } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 Venceu!'
    } else if (player.health < enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 2 Venceu!'
    }


}

let timer = 60
let timerID

function decraseTimer() {

    if (timer > 0) {
        timerID = setTimeout(decraseTimer, 1000)
        timer--
        document.querySelector("#timer").innerHTML = timer
    }

    if (timer === 0) {
        determinarVencedor({ player, enemy, timerID })
    }


}

decraseTimer()



function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    obelisk.update()
    player.update()
    enemy.update()

    player.velocidade.x = 0
    enemy.velocidade.x = 0

    //player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocidade.x = -5
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocidade.x = 5
    }


    //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocidade.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocidade.x = 5
    }

    //deyecta colisão

    if (
        colisaoRetangular({
            retangulo1: player,
            retangulo2: enemy
        }) &&
        player.isAttacking
    ) {
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (
        colisaoRetangular({
            retangulo1: enemy,
            retangulo2: player
        }) &&
        enemy.isAttacking
    ) {
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'

    }

    if (enemy.health <= 0 || player.health <= 0) {
        determinarVencedor({ player, enemy, timerID })
    }

}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        //player 1
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocidade.y = -15
            break
        case 'g':
            player.attack()
            break
        case 'h':
            player.attack()
            break
    }
    //player 2/enemy
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocidade.y = -15
            break
        case '1':
            enemy.attack()
            break
        case '2':
            enemy.attack()
            break
    }


})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        //player 1
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }
    //player 2/enemy
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break

    }

})

