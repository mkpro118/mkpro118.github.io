// Script to define custom elements starts here

const svg_link = "http://www.w3.org/2000/svg"

class OMarker extends HTMLElement{
    constructor() {
        super()
    }

    connectedCallback() {
        this.style = `
            display: block;
            width: 100%;
            height: 100%;
            background: inherit;
            `
        const svg_container = document.createElementNS(svg_link, 'svg')
        // set width and height
        svg_container.setAttribute('width', '100%')
        svg_container.setAttribute('height', '100%')
        svg_container.setAttribute('data-marker', 'O')

        // create a circle
        const mark = document.createElementNS(svg_link,'circle',)
        mark.setAttribute('cx', '50%')
        mark.setAttribute('cy', '50%')
        mark.setAttribute('r', '30%')
        mark.setAttribute('fill', 'none')
        mark.setAttribute('stroke', `#2eff2e`)
        mark.setAttribute('stroke-width', '4%')

        svg_container.appendChild(mark)
        this.appendChild(svg_container)
    }
}

class XMarker extends HTMLElement{
    constructor() {
        super()
    }

    connectedCallback() {
        this.style = `
            display: inline-block;
            width: 100%;
            height: 100%;
            background: inherit;
            `

        const svg_container = document.createElementNS(svg_link, 'svg')
        // set width and height
        svg_container.setAttribute('width', '100%')
        svg_container.setAttribute('height', '100%')
        svg_container.setAttribute('data-marker', 'X')

        // create a cross
        const line1 = document.createElementNS(svg_link,'line')
        line1.setAttribute('x1', '20%')
        line1.setAttribute('y1', '20%')
        line1.setAttribute('x2', '80%')
        line1.setAttribute('y2', '80%')
        line1.setAttribute('stroke', `#0069FF`)
        line1.setAttribute('stroke-width', '4%')

        const line2 = document.createElementNS(svg_link,'line')
        line2.setAttribute('x1', '80%')
        line2.setAttribute('y1', '20%')
        line2.setAttribute('x2', '20%')
        line2.setAttribute('y2', '80%')
        line2.setAttribute('stroke', `#0069FF`)
        line2.setAttribute('stroke-width', '4%')

        svg_container.appendChild(line1)
        svg_container.appendChild(line2)
        this.appendChild(svg_container)
    }
}

class Square extends HTMLElement{
    constructor() {
        super()
    }

    connectedCallback() {
        this.style = `
        display: block;
        background: rgba(85, 85, 85, 0.8);
        position: relative;
        width: 100%;
        height: 100%;
        z-index: 2;
        `
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'id') {
            if(! (oldVal === newVal)) {
                this.style += `
                grid-column: ${newVal[0]} / span 1;
                grid-row: ${newVal[1]} / span 1;
                `
            }
        }
    }
}

class GameBoard extends HTMLElement{
    constructor() {
        super()
    }

    connectedCallback() {
        this.style = `
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        grid-gap: 5px;
        z-index: 1;
        width: 100%;
        height: 100%;
        `
        for (let x = 1; x <= 3; x+=1) {
            for (let y = 1; y <= 3; y+=1) {
                const square = document.createElement('game-square')
                square.setAttribute('id', `${x}${y}`)
                this.appendChild(square)
            }
        }
    }
}

// Script to define player behaviours starts here

class Human {}

class AI {
    // Script to allow a person to play against the computer starts here
    constructor(ai) {
        this.ai = `${ai}`
        this.opponent = (this.ai === 'X') ? 'O' : 'X'
        this.board = [['','',''],
        ['','',''],
        ['','','']]
    }

    findBestMove() {
        let best_move
        let best_score = -Infinity

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] === '') {
                    this.board[i][j] = this.ai
                    let score = this.minimax(false)
                    this.board[i][j] = ''
                    if (score > best_score) {
                        best_score = score
                        best_move = `${i+1}${j+1}`
                    }
                }
            }
        }

        return best_move
    }

    minimax(is_max){
        let result = this.simulated_winner()
        if (result) {
            if (result === this.ai) {
                return 1
            }
            else if (result === this.opponent) {
                return -1
            }
            else {
                return 0
            }
        }

        let best_score = is_max ? -Infinity : Infinity

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] === '') {
                    this.board[i][j] = is_max ? this.ai : this.opponent
                    let score = this.minimax(!is_max)
                    this.board[i][j] = ''
                    best_score = is_max ? Math.max(score, best_score) : Math.min(score, best_score)
                }
            }
        }

        return best_score
    }

    makeMove(target_id) {
        let move = this.findBestMove()
        const square = document.querySelector(`game-square[id='${move}']`)
        setTimeout(() => {
            square.click()
        }, 1500);
    }

    simulated_winner() {
        const lines = [['00', '11', '22'],
        ['02', '11', '20'],
        ['00', '01', '02'],
        ['10', '11', '12'],
        ['20', '21', '22'],
        ['00', '10', '20'],
        ['01', '11', '21'],
        ['02', '12', '22']]

        let empty = 0

        for (let i = lines.length - 1; i >= 0; i--) {
            const counters = {'X':0, 'O':0, '':0}
            for (let j = lines[i].length - 1; j >= 0; j--) {
                const x = parseInt(lines[i][j][0])
                const y = parseInt(lines[i][j][1])
                counters[this.board[x][y]] += 1
                if (this.board[x][y] === '') {
                    empty += 1
                }
            }

            if (counters['X'] === 3) {
                return 'X'
            }

            if (counters['O'] === 3) {
                return 'O'
            }
        }
        return (empty === 0) ? 'Draw' : null
    }
}

function checkWinner(draw=false) {
    const lines = [[11, 22, 33],
    [13, 22, 31],
    [11, 12, 13],
    [21, 22, 23],
    [31, 32, 33],
    [11, 21, 31],
    [12, 22, 32],
    [13, 23, 33]]

    for (let i = lines.length - 1; i >= 0; i--) {
        const counters = {
            'X': 0,
            'O': 0,
        }
        for (let j = lines[i].length - 1; j >= 0; j--) {
            const sq = document.querySelector(`game-square[id='${lines[i][j]}']`)
            if(sq.firstElementChild) {
                counters[sq.firstElementChild.firstElementChild.dataset.marker]+=1
            }
        }

        if (counters['X'] === 3) {
            return { winner: 'X', direction: lines[i]}
        }
        if (counters['O'] === 3) {
            return { winner: 'O', direction: lines[i]}
        }
    }

    if (draw) {
        return { winner: 'Draw', direction: null}
    }
    else {
        return null
    }
}


// Script to render the game starts here

customElements.define('game-board', GameBoard)
customElements.define('game-square', Square)
customElements.define('o-marker', OMarker)
customElements.define('x-marker', XMarker)

let turn
let player1
let player2
let opponent_option_selected
let marker_option_selected

document.addEventListener('DOMContentLoaded', (e) => {
    opponent_option_selected = 'AI'
    marker_option_selected = 'X'
    player1 = new Human()
    player2 = opponent_option_selected === 'AI' ? new AI('O') : new Human()
    turn = 'player1'
    document.querySelector('.main').appendChild(document.createElement('game-board'))
    document.querySelector('a').addEventListener('click', reset)
    document.querySelector('#choice-ai-svg').addEventListener('click', ai_chosen)
    document.querySelector('#choice-pvp-svg').addEventListener('click', pvp_chosen)
    prerequisites()
})

function prerequisites() {
    if ((!(player1 instanceof AI) || !(player2 instanceof AI))) {
        const squares = document.querySelectorAll('game-square')
        squares.forEach(square => {
            square.addEventListener('click', move)
        })
        if (opponent_option_selected === 'AI') {
            document.querySelector('#choice-x svg').addEventListener('click', x_chosen)
            document.querySelector('#choice-o svg').addEventListener('click', o_chosen)
        } else {
            document.querySelector('#choice-x svg').removeEventListener('click', x_chosen)
            document.querySelector('#choice-o svg').removeEventListener('click', o_chosen)
        }
    }
}

function reset() {
    document.querySelector('.main').replaceChild(document.createElement('game-board'),
        document.querySelector('game-board'))
    prerequisites()
    turn = 'player1'

    if (opponent_option_selected === 'AI') {
        if (marker_option_selected === 'X') {
            player1 = new Human()
            player2 = new AI('O')
        }
        else {
            player1 = new AI('X')
            player2 = new Human()
            player1.makeMove()
        }
    }
    else {
        player1 = new Human()
        player2 = new Human()
    }

    document.querySelector('.result p').innerText = ''
    document.querySelector('.result').style.transform = 'translate(-50%, -50%) rotateX(90deg)'
}

function move(event) {
    const target = event.target
    if (target.firstElementChild) return
    if (turn === 'player1') {
        target.appendChild(document.createElement('x-marker'))
        if (player1 instanceof AI) {
            const i = parseInt(target.id[0]) - 1
            const j = parseInt(target.id[1]) - 1
            player1.board[i][j] = 'X'
        }
        if (player2 instanceof AI) {
            const i = parseInt(target.id[0]) - 1
            const j = parseInt(target.id[1]) - 1
            player2.board[i][j] = 'X'
        }
        turn = 'player2'
    } else {
        target.appendChild(document.createElement('o-marker'))

        if (player1 instanceof AI) {
            const i = parseInt(target.id[0]) - 1
            const j = parseInt(target.id[1]) - 1
            player1.board[i][j] = 'O'
        }
        if (player2 instanceof AI) {
            const i = parseInt(target.id[0]) - 1
            const j = parseInt(target.id[1]) - 1
            player2.board[i][j] = 'O'
        }
        turn = 'player1'
    }
    check_draw = true
    const squares = document.querySelectorAll('game-square')
    for (let i = squares.length - 1; i >= 0; i--) {
        if(!(squares[i].firstElementChild)) {
            check_draw = false
            break
        }
    }
    result = checkWinner(check_draw)
    if (result) {
        declareWinner(result.winner, result.direction)
    }
    else {
        if ((player1 instanceof AI) && turn === 'player1') {
            player1.makeMove()
        }
        if ((player2 instanceof AI) && turn === 'player2') {
            player2.makeMove()
        }
    }
}

function declareWinner(winner, direction) {
    document.querySelectorAll('game-square').forEach(sq => {
        sq.removeEventListener('click', move)
    })

    let msg

    if (winner === 'X') {
        msg = 'X Wins!'
    }
    else if (winner === 'O') {
        msg = 'O Wins!'
    }
    else {
        msg = "It's a Draw"
    }

    document.querySelector('.result p').innerText = msg
    document.querySelector('.result').style.transform = 'translate(-50%, -50%) rotateX(0deg)'
}

function ai_chosen() {
    opponent_option_selected = 'AI'

    const rect1 = document.querySelector('#choice-ai-svg').querySelector('#choice-ai-rect')
    rect1.style.strokeWidth = '10%'
    const text1 = rect1.nextElementSibling.nextElementSibling
    text1.style.fill = '#1EF'

    const rect2 = document.querySelector('#choice-pvp-svg').querySelector('#choice-pvp-rect')
    rect2.style.strokeWidth = '2%'
    const text2 = rect2.nextElementSibling.nextElementSibling
    text2.style.fill = 'none'


    reset()
}

function pvp_chosen() {
    opponent_option_selected = 'Human'

    const rect1 = document.querySelector('#choice-pvp-svg').querySelector('#choice-pvp-rect')
    rect1.style.strokeWidth = '10%'
    const text1 = rect1.nextElementSibling.nextElementSibling
    text1.style.fill = '#1EF'

    const rect2 = document.querySelector('#choice-ai-svg').querySelector('#choice-ai-rect')
    rect2.style.strokeWidth = '2%'
    const text2 = rect2.nextElementSibling.nextElementSibling
    text2.style.fill = 'none'

    reset()
}

function x_chosen(e) {
    marker_option_selected = 'X'

    const marker_x = document.querySelector('#choice-x')
    marker_x.style.transform = 'scale(1.4)'

    const marker_o = document.querySelector('#choice-o')
    marker_o.style.transform = 'scale(1)'

    reset()
}

function o_chosen(e) {
    marker_option_selected = 'O'

    const marker_o = document.querySelector('#choice-o')
    marker_o.style.transform = 'scale(1.4)'

    const marker_x = document.querySelector('#choice-x')
    marker_x.style.transform = 'scale(1)'

    reset()
}
