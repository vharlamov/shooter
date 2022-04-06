const start = document.querySelector('#start')
const screens = document.querySelectorAll('.screen')
const timeList = document.querySelector('#time-list')
const levelList = document.querySelector('#level-list')
const levelBtns = document.querySelectorAll('.level-btn')
const timeBtns = document.querySelectorAll('.time-btn')
const timeCounter = document.querySelector('#time')
const board = document.querySelector('#board')
const startGameBtn = document.querySelector('#startgame')

let score = 0
let level = 'middle'
let intStop = []

let options = {
	speed: 0,
	time: 10,
	size: [20, 30],
	sat: [60, 80],
	br: [50, 80],
}

start.addEventListener('click', toStart)
timeList.addEventListener('click', choiceTime)
startGameBtn.addEventListener('click', startGame)
levelList.addEventListener('click', choiceLevel)
board.addEventListener('click', onHit)

function choiceLevel(event) {
	levelBtns.forEach((el) => el.classList.remove('active'))
	event.target.classList.add('active')
	level = event.target.dataset.level
}

function choiceTime(event) {
	event.preventDefault()
	timeBtns.forEach((el) => el.classList.remove('active'))
	event.target.classList.add('active')

	if (event.target.classList.contains('time-btn')) {
		options.time = +event.target.dataset.time
	}
}

function toStart(event) {
	event.preventDefault()
	screens[0].classList.add('up')
	timeBtns[1].classList.add('active')
	levelBtns[1].classList.add('active')
}

function onHit(event) {
	if (event.target.className === 'circle') {
		score++
		removeCircle()
		stopInterval()
		createCircle()
	}
}

function stopInterval() {
	intStop.forEach((int) => clearInterval(int))
	intStop = []
}

function timeCount() {
	--options.time
	let time = options.time
	let timeStr = ''

	if (String(time).length < 2) {
		timeStr = `00:0${time}`
	} else {
		timeStr = `00:${time}`
	}

	timeCounter.innerHTML = timeStr
}

function startGame() {
	setLevel()
	setTime()

	const time = options.time

	screens[1].classList.add('up')

	const timer = setInterval(timeCount, 1000)

	setTimeout(() => finishGame(timer), time * 1000)

	createCircle()
}

function setLevel() {
	switch (level) {
		case 'easy':
			;(options.speed = 2), (options.size = [30, 50])
			options.sat = [90, 100]
			options.br = [70, 90]
			break
		case 'middle':
			;(options.speed = 3), (options.size = [25, 40])
			options.sat = [60, 80]
			options.br = [50, 80]
			break
		case 'hard':
			;(options.speed = 4), (options.size = [18, 25])
			options.sat = [50, 60]
			options.br = [40, 60]
			break
		default:
			return
	}
}

function setTime() {
	timeBtns.forEach((el) => {
		if (el.classList.contains('active')) {
			options.time = +el.dataset.time
		}
	})
}

function startNewGame() {
	options.time = 10
	score = 0
	screens[1].classList.remove('up')
	board.innerHTML = ''
}

const finishGame = (timer) => {
	clearInterval(timer)
	stopInterval()

	board.innerHTML = `
    <h2>Ваш счёт: ${score}</h2>
    <br/>
    <h3 class="new" id="new">Начать новую игру</h3>
    `
	const newGameBtn = document.querySelector('#new')

	newGameBtn.addEventListener('click', startNewGame)
}

function removeCircle() {
	document.querySelector('.circle').remove()
}

function createCircle() {
	const size = getRandom(options.size)

	let reDirTime = getRandom([500, 2000])

	const speed = options.speed
	let dir = getRandom([0, 360]) / (2 * Math.PI)

	let incH = Math.cos(dir)
	let incV = Math.sin(dir)

	const { height, width } = board.getBoundingClientRect()
	let x = getRandom([0, width - size])
	let y = getRandom([0, height - size])

	const circle = document.createElement('div')
	circle.className = 'circle'
	board.append(circle)

	circle.style.top = y + 'px'
	circle.style.left = x + 'px'

	circle.style.height = circle.style.width = size + 'px'

	circle.style.background = `hsl(
    ${getRandom([0, 360])}, 
    ${getRandom(options.sat)}%, 
    ${getRandom(options.br)}%)`

	move()

	function move() {
		const moveInterval = setInterval(() => {
			x += speed * incH
			y += speed * incV

			circle.style.top = Math.round(y) + 'px'
			circle.style.left = Math.round(x) + 'px'

			if (x < 0 || x > width - size) incH *= -1
			if (y < 0 || y > height - size) incV *= -1
		}, 40)

		intStop.push(moveInterval)
	}
}

function getRandom([min, max]) {
	return Math.floor(Math.random() * (max - min) + min)
}
