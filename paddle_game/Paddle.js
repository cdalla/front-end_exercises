import { getInputDirection } from "./input.js"

const VELOCITY_INCREASE = .001
const SPEED = 0.02

export default class Paddle {
	
	constructor(paddleElem) {
		this.paddleElem = paddleElem
		this.reset()
	}
	
	get position() {
		return parseFloat(getComputedStyle(this.paddleElem).getPropertyValue("--position"))
	}
	
	set position (value) {
		this.paddleElem.style.setProperty("--position", value)
	}
	
	rect () {
		return this.paddleElem.getBoundingClientRect()
	}
	
	reset () {
		this.position = 50
		this.velocity = 1
	}
	
	update_player1() {
		const inputDirection = getInputDirection().player1
		const rect = this.rect()
		let pressed = inputDirection!= 0
		if (pressed == true) {
			if ((rect.bottom >= window.innerHeight && inputDirection <= 0) || (rect.top <= 0 && inputDirection >= 0) 
				|| (rect.bottom < window.innerHeight && rect.top > 0))
				this.position += inputDirection * this.velocity
		}
		this.velocity += VELOCITY_INCREASE
	}
	
	update_player2() {
		const inputDirection = getInputDirection().player2
		const rect = this.rect()
		let pressed = inputDirection!= 0
		if (pressed == true) {
			if ((rect.bottom >= window.innerHeight && inputDirection <= 0) || (rect.top <= 0 && inputDirection >= 0) 
				|| (rect.bottom < window.innerHeight && rect.top > 0))
				this.position += inputDirection * this.velocity
		}
		this.velocity += VELOCITY_INCREASE
	}
	
	update_computer (delta, ballHeight) {
		this.position += SPEED * delta * (ballHeight - this.position)
	}
}
