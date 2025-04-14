//message input

const textarea = document.querySelector('.chatbox-message-input')
const chatboxForm = document.querySelector('.chatbox-message-form')

textarea.addEventListener('input', function () {
	let line = textarea.value.split('\n').length

	if (textarea.rows < 6 || line < 6) {
		textarea.rows = line
	}

	if (textarea.rown > 1) {
		chatboxForm.style.alignItems = 'flex-end'
	} else {
		chatboxForm.style.alignItems = 'center'
	}
})

//toggle chatbox

const chatBoxToggle = document.querySelector('.chatbox-toggle')
const chatBoxMessage = document.querySelector('.chatbox-message-wrapper')

chatBoxToggle.addEventListener('click', function () {
	chatBoxMessage.classList.toggle('show')
})


// DROP DOWN TOGGLE

const dropDownToggle = document.querySelector('.chatbox-message-dropdown-toggle')
const dropDownMenu = document.querySelector('.chatbox-message-dropdown-menu')

dropDownToggle.addEventListener('click', function () {
	dropDownMenu.classList.toggle('show')
})

document.addEventListener('click', function (e) {
	if (!e.target.matches('.chatbix-message-dropdown, .chatbox-message-dropdown *')) {
		dropDownMenu.classList.remove('show')
	}
})

//chatbox message

const chatboxMessageWrapper = document.querySelector('.chatbox-message-content')
const chatBoxNoMessage = document.querySelector('.chatbox-message-no-message')

chatboxForm.addEventListener('submit', function (e) {
	e.preventDefault()

	if (isValid(textarea.value)) {
		writeMessage()
		setTimeout(autoReply, 1000)
	}
})

function addZero(num) {
	return num < 10 ? '0'+num : num
}

function writeMessage () {
	const today = new Date()
	let message = `
		<div class="chatbox-message-item sent">
			<span class="chatbox-message-item-text">
				${textarea.value.trim().replace(/\n/g, '<br>\n')}
			</span>
			<span class="chatbox-message-item-time">${addZero(today.getHours())}:${addZero(today.getMinutes())}</span>
		</div>
	`

	chatboxMessageWrapper.insertAdjacentHTML('beforeend', message)
	chatboxForm.style.alignItems = 'center'
	textarea.rows = 1
	textarea.focus()
	textarea.value = ''
	chatBoxNoMessage.style.display = 'none'
	scrollBottom()
}

//auto reply

function autoReply () {
	const today = new Date()
	let message = `
		<div class="chatbox-message-item received">
			<span class="chatbox-message-item-text">
				YO YO You got an answer!
			</span>
			<span class="chatbox-message-item-time">${addZero(today.getHours())}:${addZero(today.getMinutes())}</span>
		</div>
	`

	chatboxMessageWrapper.insertAdjacentHTML('beforeend', message)
	scrollBottom()

}


// scroll bottom on new message

function scrollBottom () {
	chatboxMessageWrapper.scrollTo(0, chatboxMessageWrapper.scrollHeight)
}

function isValid(value) {
	let text = value.replace(/\n/g, '')
	text = text.replace(/\s/g, '')

	return text.length > 0
}