const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const card = document.getElementById("card")
const cardScore = document.getElementById("card-score")

function drawBackgroundLine() {
	ctx.beginPath()
	ctx.moveTo(0, 400)
	ctx.lineTo(600, 400)
	ctx.lineWidth = 1.9
	ctx.strokeStyle = "black"
	ctx.stroke()
}

function startGame() {
	player = new Player(150, 350, 50, "black")
	arrayBlocks = []
	presetTime = 1000 //block spawn timer in ms
	blockSpeed = 6
	score = 0
	scoreIncrement = 0
	canScore = true
}

function restartGame(button) {
	card.style.display = "none"
	button.blur()
	startGame()
	requestAnimationFrame(animate)
}

class Player {
	constructor (x, y, size, color) {
		this.x = x
		this.y = y
		this.size = size
		this.color = color

		//jump configuration
		this.jumpHeight = 12
		this.shouldJump = false
		this.jumpCounter = 0 //frame counter

		//spin animation
		this.spin = 0
		this.spinIncrement = 90/32 //rotation of 90 degrees over 32 frames
	}

	rotation() {
		let offsetXPosition = this.x + (this.size / 2) //store the position of
		let offsetYPosition = this.y + (this.size / 2)// the player square
		
		//because the canvas rotation point is by default the top left corner (0,0)
		//to get the rotation movement, need to move the canvas origin to the
		//center point of the square to get a correct rotation animation
		//need to move the canvas back to the original position after rotating 
		//the square and before drawing onto the canvas

		ctx.translate(offsetXPosition, offsetYPosition)

		//Division to convert degrees into radiant
		ctx.rotate(this.spin * Math.PI / 180)
		ctx.rotate(this.spinIncrement * Math.PI / 180)
		ctx.translate(-offsetXPosition, -offsetYPosition)

		//4.5 because 90/20 (number of iteration in jump, frames)
		this.spin += this.spinIncrement
	}

	counterRotation() {
		//this rotate the cube back to its origin so it can be moved up properly
		let offsetXPosition = this.x + (this.size / 2)
		let offsetYPosition = this.y + (this.size / 2)
		ctx.translate(offsetXPosition, offsetYPosition)
		ctx.rotate(-this.spin * Math.PI / 180)
		ctx.translate(-offsetXPosition, -offsetYPosition)
	}

	jump() {
		if (this.shouldJump) {
			this.jumpCounter++
			if (this.jumpCounter < 15) {
				this.y -= this.jumpHeight //go up
			} else if (this.jumpCounter > 14 && this.jumpCounter < 19) {
				this.y += 0
			} else if (this.jumpCounter < 33 ) {
				this.y += this.jumpHeight; //go down
			}
			this.rotation()
			//end cycle
			if (this.jumpCounter >= 32) {
				this.counterRotation()
				this.spin = 0
				this.shouldJump = false
			}
		}
	}

	draw() {
		this.jump()
		ctx.fillStyle = this.color
		ctx.fillRect(this.x, this.y, this.size, this.size)
		
		//reset the rotation so the rotation of the other elements is not changed
		if (this.shouldJump) this.counterRotation()
	}


}

class Block {
	constructor (size, speed) {
		this.x = canvas.width + size
		this.y = 400 - size
		this.size = size
		this.color = "red"
		this.slideSpeed = speed
	}
	
	draw() {
		ctx.fillStyle = this.color
		ctx.fillRect(this.x, this.y, this.size, this.size)
	}
	
	slide() {
		this.draw()
		this.x -= this.slideSpeed
	}
}

let player = new Player(150, 350, 50, "black")
let arrayBlocks = []
let presetTime = 1000 //block spawn timer in ms
let blockSpeed = 6
let score = 0
let scoreIncrement = 0
let canScore = true

let animationId = null

function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomNumberInterval(timeInterval) {
	let returnTime = timeInterval
	if (Math.random () < 0.5) {
		returnTime += getRandomNumber(presetTime / 3, presetTime * 1.5)
	} else {
		returnTime -= getRandomNumber(presetTime / 5, presetTime / 2)
	}
	return returnTime
}

function generateBlocks() {
	let timeDelay = randomNumberInterval(presetTime)
	arrayBlocks.push(new Block(50, blockSpeed))

	setTimeout(generateBlocks, timeDelay)
}

function blockCollision(player, block) {
	//getting a copy to the object, and be able to modify some values
	let s1 = Object.assign(Object.create(Object.getPrototypeOf(player)), player)
	let s2 = Object.assign(Object.create(Object.getPrototypeOf(block)), block)

	s2.size = s2.size - 10
	s2.x = s2.x + 10
	s2.y = s2.y + 10

	return !(
		s1.x > s2.x + s2.size || //R1 is to the right of R2
		s1.x + s1.size < s2.x || //R1 is to the left of R2
		s1.y > s2.y + s2.size || //R1 is below R2
		s1.y + s1.size < s2.y	 //R1 is above R2
	)

}

function drawScore() {
	ctx.font = "80px Arial"
	ctx.fillStyle = "black"
	let scoreString = score.toString()
	let xOffset = ((scoreString.length - 1) * 20)
	ctx.fillText(scoreString, 280 - xOffset, 100)
}

function isPastBlock(player, block) {
	return( 
		player.x + (player.size / 2) > block.x + (block.size / 4) &&
		player.x + (player.size / 2) < block.x + (block.size / 4) * 3
	)
}

function increaseSpeed() {
	if (scoreIncrement + 10 == score) {
		scoreIncrement = score
		blockSpeed++
		//increase the blocks spawn
		presetTime >= 100 ? presetTime -= 100 : presetTime = presetTime / 2
		//update speed of existing blocks
		arrayBlocks.forEach(block => {
			block.slideSpeed = blockSpeed
		})
	}
}

function animate() {
	animationId = requestAnimationFrame(animate)
	ctx.clearRect(0,0, canvas.width, canvas.height)

	drawBackgroundLine()
	drawScore()
	player.draw()
	increaseSpeed()

	arrayBlocks.forEach((arrayBlock, index) => {
		arrayBlock.slide()

		//end game is player collides with a block
		if (blockCollision(player, arrayBlock)) {
			cardScore.textContent = score
			card.style.display = "block"
			cancelAnimationFrame(animationId)
		}
		//check if player is over the block to score
		if (isPastBlock(player, arrayBlock) && canScore){
			canScore = false
			score++
		}
		//delete block after he exit the canvas
		if ((arrayBlock.x + arrayBlock.size) <= 0) {
			setTimeout(() => {
				arrayBlock.splice(index, 1) // splice method remove 1 object at the index
			}, 0)
		}
	})
}

animate()
setTimeout(() => {generateBlocks()}, randomNumberInterval(presetTime))

//Event
addEventListener("keydown", e => {
	if (e.code == "Space" || e.key == "32" || e.key == " " ) {
		if (!player.shouldJump) {
			player.jumpCounter = 0
			player.shouldJump = true
			canScore = true  
		}
	}
})


//video link cube games https://www.youtube.com/watch?v=gnPekEXhkys
//video link chat box https://www.youtube.com/watch?v=vZnBFZNozlc