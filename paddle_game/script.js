import Ball from "./Ball.js"
import Paddle from "./Paddle.js"

let computer_opponent = false
//variable to change in case of computer or player opponent

const ball = new Ball(document.getElementById("ball"))
const player1Paddle = new Paddle(document.getElementById("player1-paddle"))
const player2Paddle = new Paddle(document.getElementById("player2-paddle"))
const playerScoreElem = document.getElementById("player-score")
const computerScoreElem = document.getElementById("computer-score")

let lastTime
function update(time) {
	if (lastTime != null) {
		
		const delta = time -lastTime
		ball.update(delta, [player1Paddle.rect(), player2Paddle.rect()])
		//computerPaddle.update_computer(delta, ball.y)
		player1Paddle.update_player1()
		if (computer_opponent == true)
			player2Paddle.update_computer(delta, ball.y)
		else 
			player2Paddle.update_player2()
		//change color by getting the element value and change it using delta
		const hue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hue"))
		document.documentElement.style.setProperty("--hue", hue + delta * 0.01)
		
		if (isLose()) handleLose()
	}
		lastTime = time
		window.requestAnimationFrame(update)
}

function isLose() {
	const rect = ball.rect()
	return rect.right >= window.innerWidth || rect.left <= 0
}

function handleLose() {
	const rect = ball.rect()
	if (rect.right >= window.innerWidth) {
		playerScoreElem.textContent = parseInt(playerScoreElem.textContent) + 1
	} else {
		computerScoreElem.textContent = parseInt(computerScoreElem.textContent) + 1
	}
		
	ball.reset()	
	player1Paddle.reset()
	player2Paddle.reset()
}


//THIS IS FOR PADDLE MOUSE MOVEMENT
// document.addEventListener("mousemove", e => {
// 	playerPaddle.position = (e.y / window.innerHeight) * 100
// })

window.requestAnimationFrame(update)