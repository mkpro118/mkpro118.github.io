let turn = 'white'
let is_under_check = false
let check_path = []
let double_check = false

let has_white_king_moved = false
let has_black_king_moved = false
let has_white_rook1_moved = false
let has_white_rook2_moved = false
let has_black_rook1_moved = false
let has_black_rook2_moved = false

let move_counter = 0
let last_move_container = null
let for_en_passant = null
let prev_move = null
let is_en_passant_allowed = false
let is_promoting = false

let selected_piece = null

let white_queen_count = 1
let black_queen_count = 1

let pieceStyle = 'chesscom'

let time_white = 600
let time_black = 600

let has_white_started = false
let has_black_started = false

let timer = null

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

const files = Object.freeze({
    'a': 0,
    'b': 1,
    'c': 2,
    'd': 3,
    'e': 4,
    'f': 5,
    'g': 6,
    'h': 7,
})

const ranks = Object.freeze({
    '1': 7,
    '2': 6,
    '3': 5,
    '4': 4,
    '5': 3,
    '6': 2,
    '7': 1,
    '8': 0,
})

const files_rev = Object.freeze({
    0: 'a',
    1: 'b',
    2: 'c',
    3: 'd',
    4: 'e',
    5: 'f',
    6: 'g',
    7: 'h',
})

const ranks_rev = Object.freeze({
    7: '1',
    6: '2',
    5: '3',
    4: '4',
    3: '5',
    2: '6',
    1: '7',
    0: '8',
})

const customize_light_square = document.getElementById('light-square')
const customize_dark_square = document.getElementById('dark-square')
const rematch = document.querySelector('#rematch-button')

window.onload = () => {
    const preffered_light_color = localStorage.getItem('preferredLightColor')
    if (preffered_light_color) {
        document.documentElement.style.setProperty('--squarelight-background', preffered_light_color)
    }
    const preffered_dark_color = localStorage.getItem('preferredDarkColor')
    if (preffered_dark_color) {
        document.documentElement.style.setProperty('--squaredark-background', preffered_dark_color)
    }
    const preffered_piece_style = localStorage.getItem('preferredPieceStyle')
    if (preffered_piece_style) {
        changePieceStyle(preffered_piece_style)
    }
    disable()
}

window.addEventListener('contextmenu', e => {
  e.preventDefault()
  e.stopPropagation()
}, false)


customize_light_square.addEventListener('input', () => {
    document.documentElement.style.setProperty('--squarelight-background', customize_light_square.value)
    computeShadow()
    computeTimerTextColor('top', customize_light_square.value)
    localStorage.setItem('preferredLightColor', customize_light_square.value)
})
customize_dark_square.addEventListener('input', () => {
    document.documentElement.style.setProperty('--squaredark-background', customize_dark_square.value)
    computeShadow()
    computeTimerTextColor('bottom', customize_dark_square.value)
    localStorage.setItem('preferredDarkColor', customize_dark_square.value)
})


rematch.addEventListener('click', e => {
    squares = document.querySelectorAll('div[class^=square]')
    squares.forEach(s => {
        s.classList.remove('highlight-light')
        s.classList.remove('highlight-dark')
        s.classList.remove('check')
        s.classList.remove('check-light')
        s.classList.remove('check-dark')
        s.classList.remove('highlight-light-unfriendly')
        s.classList.remove('highlight-dark-unfriendly')
        const kid = s.firstElementChild
        if (kid) {
            s.removeChild(kid)
        }
    })
    letters.forEach( l => {
        const sq_b = document.querySelector(`#${l}7`)
        const pawn_img_b = document.createElement('img')
        pawn_img_b.src = pieceStyle === 'lichess' ? 'images/black-pawn.png' : 'images/black-pawn-alt.png'
        pawn_img_b.id = `black-pawn-${letters.indexOf(l)+1}`
        sq_b.appendChild(pawn_img_b)
        const sq_w = document.querySelector(`#${l}2`)
        const pawn_img_w = document.createElement('img')
        pawn_img_w.src = pieceStyle === 'lichess' ? 'images/white-pawn.png' : 'images/white-pawn-alt.png'
        pawn_img_w.id = `white-pawn-${letters.indexOf(l)+1}`
        sq_w.appendChild(pawn_img_w)
    })

    const black_knights_list = ['b8', 'g8']
    black_knights_list.forEach( l => {
        const sq = document.querySelector(`#${l}`)
        const knight_img = document.createElement('img')
        knight_img.src = pieceStyle === 'lichess' ? 'images/black-knight.png' : 'images/black-knight-alt.png'
        knight_img.id = `black-knight-${black_knights_list.indexOf(l)+1}`
        sq.appendChild(knight_img)
    })
    const white_knights_list = ['b1', 'g1']
    white_knights_list.forEach( l => {
        const sq = document.querySelector(`#${l}`)
        const knight_img = document.createElement('img')
        knight_img.src = pieceStyle === 'lichess' ? 'images/white-knight.png' : 'images/white-knight-alt.png'
        knight_img.id = `white-knight-${white_knights_list.indexOf(l)+1}`
        sq.appendChild(knight_img)
    })

    const black_bishops_list = ['c8', 'f8']
    black_bishops_list.forEach( l => {
        const sq = document.querySelector(`#${l}`)
        const bishop_img = document.createElement('img')
        bishop_img.src = pieceStyle === 'lichess' ? 'images/black-bishop.png' : 'images/black-bishop-alt.png'
        bishop_img.id = `black-bishop-${black_bishops_list.indexOf(l)+1}`
        sq.appendChild(bishop_img)
    })
    const white_bishops_list = ['c1', 'f1']
    white_bishops_list.forEach( l => {
        const sq = document.querySelector(`#${l}`)
        const bishop_img = document.createElement('img')
        bishop_img.src = pieceStyle === 'lichess' ? 'images/white-bishop.png' : 'images/white-bishop-alt.png'
        bishop_img.id = `white-bishop-${white_bishops_list.indexOf(l)+1}`
        sq.appendChild(bishop_img)
    })

    const black_rooks_list = ['a8', 'h8']
    black_rooks_list.forEach( l => {
        const sq = document.querySelector(`#${l}`)
        const rook_img = document.createElement('img')
        rook_img.src = pieceStyle === 'lichess' ? 'images/black-rook.png' : 'images/black-rook-alt.png'
        rook_img.id = `black-rook-${black_rooks_list.indexOf(l)+1}`
        sq.appendChild(rook_img)
    })
    const white_rooks_list = ['a1', 'h1']
    white_rooks_list.forEach( l => {
        const sq = document.querySelector(`#${l}`)
        const rook_img = document.createElement('img')
        rook_img.src = pieceStyle === 'lichess' ? 'images/white-rook.png' : 'images/white-rook-alt.png'
        rook_img.id = `white-rook-${white_rooks_list.indexOf(l)+1}`
        sq.appendChild(rook_img)
    })

    const wk = document.querySelector(`#e1`)
    const king_img_w = document.createElement('img')
    king_img_w.src = pieceStyle === 'lichess' ? 'images/white-king.png' : 'images/white-king-alt.png'
    king_img_w.id = `white-king`
    wk.appendChild(king_img_w)

    const bk = document.querySelector(`#e8`)
    const king_img_b = document.createElement('img')
    king_img_b.src = pieceStyle === 'lichess' ? 'images/black-king.png' : 'images/black-king-alt.png'
    king_img_b.id = 'black-king'
    bk.appendChild(king_img_b)

    const wq = document.querySelector(`#d1`)
    const queen_img_w = document.createElement('img')
    queen_img_w.src = pieceStyle === 'lichess' ? 'images/white-queen.png' : 'images/white-queen-alt.png'
    queen_img_w.id = 'white-queen'
    wq.appendChild(queen_img_w)

    const bq = document.querySelector(`#d8`)
    const queen_img_b = document.createElement('img')
    queen_img_b.src = pieceStyle === 'lichess' ? 'images/black-queen.png' : 'images/black-queen-alt.png'
    queen_img_b.id = 'black-queen'
    bq.appendChild(queen_img_b)

    const pieces = document.querySelectorAll('img')
    pieces.forEach(p => {
        p.classList.add('grabbable')
        p.ondrop = drop
        p.ondragover = allowDrop
        p.ondragstart = drag
        p.onclick = highlight
        p.draggable = true
    })

    const moves_list = document.querySelector('#moves-list')
    moves_list.innerHTML = ''

    const timer_white = document.querySelector('#timer-white')
    timer_white.innerText = '10:00'
    const timer_black = document.querySelector('#timer-black')
    timer_black.innerText = '10:00'

    turn = 'white'
    is_under_check = false
    check_path = []
    double_check = false

    has_white_king_moved = false
    has_black_king_moved = false
    has_white_rook1_moved = false
    has_white_rook2_moved = false
    has_black_rook1_moved = false
    has_black_rook2_moved = false

    move_counter = 0
    last_move_container = null
    for_en_passant = null
    prev_move = null
    is_en_passant_allowed = false
    is_promoting = false

    selected_piece = null

    white_queen_count = 1
    black_queen_count = 1

    pieceStyle = 'chesscom'

    time_white = 600
    time_black = 600

    has_white_started = false
    has_black_started = false

    timer = null

    document.querySelector('#winner').style.display = 'none'
    const progress_bars = document.querySelectorAll('#black-timer-progress, #white-timer-progress')
    progress_bars.forEach(e => {
        e.style.width = '100%'
    })
    disable()
})


function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}


function isColorTooDark(which) {
    let current_color = window.getComputedStyle(document.getElementById(which + '-timer-container'),null)['background'].trim()
    current_color = current_color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/)

    r = current_color[1]
    g = current_color[2]
    b = current_color[3]

    let hsp = Math.sqrt((0.299 * (r * r) )+ (0.587 * (g * g) )+ (0.114 * (b * b)))
    return (hsp < 127.5)
}


function computeTimerTextColor(which, og_color) {
    if (isColorTooDark(which)) {
        let text_color_container = document.getElementById(which+'-timer-container')
        text_color_container.firstElementChild.style.color = 'white'
        if (which === 'bottom') {
            const flip_button = document.getElementById('flip-button')
            let size = flip_button.style.backgroundSize
            flip_button.style.background = 'url("images/flip.png")'
            flip_button.style.backgroundSize = size
            const container = document.getElementById('chesscom')
            size = container.style.backgroundSize
            container.style.background = 'url("images/white-king-alt.png")'
            container.style.backgroundColor = og_color
            container.style.backgroundSize = size
        }
        if (which === 'top') {
            const container = document.getElementById('lichess')
            let size = container.style.backgroundSize
            container.style.background = 'url("images/white-king.png")'
            container.style.backgroundColor = og_color
            container.style.backgroundSize = size
        }
    } else {
        let text_color_container = document.getElementById(which+'-timer-container')
        text_color_container.firstElementChild.style.color = 'black'
        if (which === 'bottom') {
            const flip_button = document.getElementById('flip-button')
            let size = flip_button.style.backgroundSize
            flip_button.style.background = 'url("images/flip-alt.png")'
            flip_button.style.backgroundSize = size
            const container = document.getElementById('chesscom')
            size = container.style.backgroundSize
            container.style.background = 'url("images/black-king-alt.png")'
            container.style.backgroundColor = og_color
            container.style.backgroundSize = size
        }
        if (which === 'top') {
            const container = document.getElementById('lichess')
            let size = container.style.backgroundSize
            container.style.background = 'url("images/black-king.png")'
            container.style.backgroundColor = og_color
            container.style.backgroundSize = size
        }
    }
}


function computeShadow() {
    const computed_style = window.getComputedStyle(document.documentElement)

    const light_color = computed_style.getPropertyValue('--squarelight-background').trim()
    const dark_color = computed_style.getPropertyValue('--squaredark-background').trim()

    const lc = hexToRgb(light_color)
    const s1 = Math.sqrt((0.299 * (lc.r * lc.r)) + (0.587 * (lc.g * lc.g)) + (0.114 * (lc.b * lc.b)))

    const dc = hexToRgb(dark_color)
    const s2 = Math.sqrt((0.299 * (dc.r * dc.r)) + (0.587 * (dc.g * dc.g)) + (0.114 * (dc.b * dc.b)))

    if (s1 > s2) {
        document.documentElement.style.setProperty('--boardshadow-box-shadow-color', light_color)
    }
    else {
        document.documentElement.style.setProperty('--boardshadow-box-shadow-color', dark_color)
    }
}


function revert() {
    const all_squares = document.getElementsByTagName('div')
    for (sq of all_squares) {
        if (sq.className.includes('style')) {
            continue
        }
        if (sq.className.includes('highlight')) {
            sq.className = sq.className.split(' ')[0]
            sq.onclick = e => false
        }
    }
}


function highlight(event) {
    revert()
    let _moves = null
    if (typeof(event) === 'string') {
        selected_piece = event
        _moves = possibleMoves(event, true)
    }
    else {
        selected_piece = event.target.id
        _moves = possibleMoves(event.target.id, true)
    }
    selected_piece_parent = document.getElementById(selected_piece).parentNode.id
    for (let _move of _moves) {
        let square = document.getElementById(_move)
        square.className = square.className + " highlight-" + square.className.slice(7).trim()
        if (square.firstElementChild) {
            square.className = square.className + "-unfriendly"
        }
        square.onclick = e => {
            let raw_data = selected_piece + ' ' + selected_piece_parent
                           + ' ' + e.target.id
            drop(raw_data)
        }
    }
}


function allowDrop(event) {
    event.preventDefault()
}


function drag(event) {
    event.dataTransfer.setData("text", event.target.id + ' ' + event.target.parentNode.id)
    highlight(event.target.id)
}


function drop(event) {
    let data = null
    let parent = null
    let target = null
    let to = null
    if (typeof(event) === 'string') {
        let raw_data = event.split(' ')
        data = raw_data[0].trim()
        parent = raw_data[1].trim()
        to = raw_data[2]
        target = document.getElementById(to)
    }
    else {
        event.preventDefault()
        let raw_data = event.dataTransfer.getData("text")
        data = raw_data.slice(0,raw_data.indexOf(' '))
        parent = raw_data.slice(raw_data.indexOf(' ')+1)
        target = event.target
        to = target.id
    }
    if (to == data) {
        return
    }

    if (!is_under_check) {
        // White King Castle
        whiteKingCastle(data, to)

        // Black King Castle
        blackKingCastle(data, to)
    }

    if (!((possibleMoves(data, true).includes(to)) || (possibleMoves(data, true).includes(target.parentNode.id)))) {
        return
    }

    // moving to a square occupied by friendly pieces
    // Note: this part has been placed after the castles logic to
    // allow users to drag the king over near the rook and still
    // be able to castle on either direction
    if (to.startsWith(data.slice(0, 5))){
        return
    }

    // moving to an empty square
    if (target.className.startsWith('square')) {
        moveToEmptySquare(data, to, target, parent)
    }

    // moving to a square occupied by an unfriendly piece
    else if ((data.slice(0, 5) != to.slice(0, 5))) {
        moveToUnfriendlySquare(data, to, target)
    }

    if (turn === 'black') {
        has_white_started = true
    }
    if (turn === 'white') {
        has_black_started = true
    }
    if (timer) {
        clearInterval(timer)
    }
    timer = setInterval(() => {
        if (has_white_started && has_black_started) {
            countdown(turn)
        }
    }, 1000)
    const squares = document.querySelectorAll('div[class^=square]')
    squares.forEach(e => {
        const square_type = e.className.split(' ')[0].split('-')[1]
        if (e.className.includes('check')) {
            e.classList.remove(`check-${square_type}`)
            is_under_check = false

        }
    })
    is_opponent_king_under_attack()
    setTimeout(null, 1000)
    checkmate(turn)
}

function whiteKingCastle(data, to) {
    if (data === 'white-king' && !has_white_king_moved) {
        if ((to === 'g1') || (to === 'white-rook-2') ) {

            if (!(has_white_king_moved) && !(has_white_rook2_moved)) {

                let conditions =  [!(document.getElementById('f1').firstElementChild),
                                   (document.getElementById('h1').firstElementChild.id === 'white-rook-2')]

                if (conditions.every( c => c == true)) {
                    const parent1 = document.getElementById('e1')
                    const parent2 = document.getElementById('f1')
                    const parent3 = document.getElementById('g1')
                    const parent4 = document.getElementById('h1')
                    const king = document.getElementById('white-king')
                    const rook = document.getElementById('white-rook-2')
                    parent4.removeChild(rook)
                    parent1.removeChild(king)
                    parent2.appendChild(rook)
                    parent3.appendChild(king)
                    writeMoves('O-O', turn)
                    has_white_king_moved = true
                    has_white_rook2_moved = true
                    turn = (turn == 'white') ? 'black' : 'white'
                    disable()
                    revert()
                    return
                }
            }

            else {
                return
            }
        }
        else if ((to === 'c1') || (to === 'white-rook-1') || to === 'b1') {
            if (!(has_white_king_moved) && !(has_white_rook1_moved)) {
                let conditions =  [!(document.getElementById('c1').firstElementChild),
                                   !(document.getElementById('b1').firstElementChild),
                                   !(document.getElementById('d1').firstElementChild),
                                   (document.getElementById('a1').firstElementChild.id === 'white-rook-1')]
                if (conditions.every( c => c == true)) {
                    let parent1 = document.getElementById('e1')
                    let parent2 = document.getElementById('d1')
                    let parent3 = document.getElementById('c1')
                    let parent4 = document.getElementById('a1')
                    let king = document.getElementById('white-king')
                    let rook = document.getElementById('white-rook-1')
                    parent1.removeChild(king)
                    parent4.removeChild(rook)
                    parent3.appendChild(king)
                    parent2.appendChild(rook)
                    writeMoves('O-O-O', turn)
                    has_white_king_moved = true
                    has_white_rook1_moved = true
                    turn = (turn == 'white') ? 'black' : 'white'
                    disable()
                    revert()
                    return
                }
            }
            else {
                return
            }
        }
    }
}


function blackKingCastle(data, to) {
    if (data === 'black-king' && !has_black_king_moved) {

        if ((to === 'g8') || (to === 'black-rook-2') ) {

            if (!(has_black_king_moved) && !(has_black_rook2_moved)) {

                let conditions =  [!(document.getElementById('f8').firstElementChild),
                                   (document.getElementById('h8').firstElementChild.id === 'black-rook-2')]

                if (conditions.every( c => c == true)) {
                    let parent1 = document.getElementById('e8')
                    let parent2 = document.getElementById('f8')
                    let parent3 = document.getElementById('g8')
                    let parent4 = document.getElementById('h8')
                    let king = document.getElementById('black-king')
                    let rook = document.getElementById('black-rook-2')
                    parent4.removeChild(rook)
                    parent1.removeChild(king)
                    parent2.appendChild(rook)
                    parent3.appendChild(king)
                    writeMoves('O-O', turn)
                    has_black_king_moved = true
                    has_black_rook2_moved = true
                    turn = (turn == 'white') ? 'black' : 'white'
                    disable()
                    revert()
                    return
                }
            }

            else {
                return
            }
        }
        else if ((to === 'c8') || (to === 'black-rook-1') || to === 'b8') {
            if (!(has_black_king_moved) && !(has_black_rook1_moved)) {
                let conditions =  [!(document.getElementById('c8').firstElementChild),
                                   !(document.getElementById('b8').firstElementChild),
                                   !(document.getElementById('d8').firstElementChild),
                                   (document.getElementById('a8').firstElementChild.id === 'black-rook-1')]
                if (conditions.every( c => c == true)) {
                    let parent1 = document.getElementById('e8')
                    let parent2 = document.getElementById('d8')
                    let parent3 = document.getElementById('c8')
                    let parent4 = document.getElementById('a8')
                    let king = document.getElementById('black-king')
                    let rook = document.getElementById('black-rook-1')
                    parent1.removeChild(king)
                    parent4.removeChild(rook)
                    parent3.appendChild(king)
                    parent2.appendChild(rook)
                    writeMoves('O-O-O', turn)
                    has_black_king_moved = true
                    has_black_rook1_moved = true
                    turn = (turn == 'white') ? 'black' : 'white'
                    disable()
                    revert()
                    return
                }
            }
            else {
                return
            }
        }
    }
}


function moveToEmptySquare(data, to, target, parent) {
    let _move_ = ''
    if (data.includes('king')) {
        _move_ = 'K' + to
        for_en_passant = null
    }
    else if(data.includes('queen')) {
        _move_ = 'Q' + to
        for_en_passant = null
    }
    else if(data.includes('rook')) {
        _move_ = 'R' + to
        for_en_passant = null
    }
    else if(data.includes('bishop')) {
        _move_ = 'B' + to
        for_en_passant = null
    }
    else if(data.includes('knight')) {
        _move_ = 'N' + to
        for_en_passant = null
    }
    else if(data.includes('pawn')) {
        is_promoting = false
        promotion = null
        _move_ = to
        if (((_move_[1] === '5') && (turn === 'black') && (parent[0] === _move_[0]))) {
            for_en_passant = _move_
        }
        else if (_move_[1] === '4' && turn === 'white' && (parent[0] === _move_[0])) {
            for_en_passant = _move_
        }
        else if ((_move_[1] === '3' || _move_[1] === '6') && (parent[0] != _move_[0]) && (prev_move === for_en_passant)) {
            _move_ = parent[0] + 'x' + to
            if (to[1] === '3' && turn === 'black' && (prev_move === for_en_passant)) {
                document.getElementById(to[0]+'4').removeChild(document.getElementById(to[0]+'4').firstElementChild)
            }
            else if (to[1] === '6' && turn === 'white'  && (prev_move === for_en_passant)) {
                document.getElementById(to[0]+'5').removeChild(document.getElementById(to[0]+'5').firstElementChild)
            }
        }
        else {
                for_en_passant = null
        }
        if (turn === 'white' && _move_.includes('8')) {
            is_promoting = true
            promotion = document.createElement('img')
            promotion.src = (pieceStyle === 'lichess') ? 'images/white-queen.png' : 'images/white-queen-alt.png'
            promotion.id = 'white-queen-' + (++white_queen_count)
            promotion.className = 'grabbable'
            promotion.onclick = highlight
            promotion.ondragstart = drag
            promotion.draggable = true
            promotion.alt = 'black-queen'

        }
        if (turn === 'black' && _move_.includes('1')) {
            is_promoting = true
            promotion = document.createElement('img')
            promotion.src = (pieceStyle === 'lichess') ? 'images/black-queen.png' : 'images/black-queen-alt.png'
            promotion.id = 'black-queen-' + (++black_queen_count)
            promotion.className = 'grabbable'
            promotion.onclick = highlight
            promotion.ondragstart = drag
            promotion.draggable = true
            promotion.alt = 'black-queen'
        }
    }
    if (is_promoting) {
        target.appendChild(promotion)
        _move_ = _move_+'=Q'
        document.getElementById(parent).removeChild(document.getElementById(data))
        is_promoting = false
    } else {
        target.appendChild(document.getElementById(data))
    }
    prev_move = _move_
    if (data === 'white-rook-1') {
        has_white_rook1_moved = true
    }
    else if (data === 'white-rook-2') {
        has_white_rook2_moved = true
    }
    else if (data === 'black-rook-1') {
        has_black_rook1_moved = true
    }
    else if (data === 'black-rook-2') {
        has_black_rook2_moved = true
    }
    else if (data === 'white-king') {
        has_white_king_moved = true
    }
    else if (data === 'black-king') {
        has_black_king_moved = true
    }
    writeMoves(_move_, turn)
    turn = (turn == 'white') ? 'black' : 'white'
    disable()
    revert()
    return [_move_, (turn == 'white') ? 'black' : 'white']
}


function moveToUnfriendlySquare(data, to, target) {
    let __move = ''
    let parent1 = target.parentNode
    let og_kid = parent1.firstElementChild
    parent1.removeChild(og_kid)
    child = document.getElementById(data)
    let parent2 = child.parentNode
    parent2.removeChild(child)
    parent1.appendChild(child)
    if (data.includes('king')) {
        __move = 'Kx' + parent1.id
    }
    else if(data.includes('queen')) {
        __move = 'Qx' + parent1.id
    }
    else if(data.includes('rook')) {
        __move = 'Rx' + parent1.id
    }
    else if(data.includes('bishop')) {
        __move = 'Bx' + parent1.id
    }
    else if(data.includes('knight')) {
        __move = 'Nx' + parent1.id
    }
    else if(data.includes('pawn')) {
        __move = parent2.id[0] + 'x' + parent1.id
    }
    if (data === 'white-rook-1') {
        has_white_rook1_moved = true
    }
    else if (data === 'white-rook-2') {
        has_white_rook2_moved = true
    }
    else if (data === 'black-rook-1') {
        has_black_rook1_moved = true
    }
    else if (data === 'black-rook-2') {
        has_black_rook2_moved = true
    }
    else if (data === 'white-king') {
        has_white_king_moved = true
    }
    else if (data === 'black-king') {
        has_black_king_moved = true
    }
    if (!has_white_started && turn === 'white') {
    has_white_started = true
    }
    if (!has_black_started && turn === 'black') {
        has_black_started = true
    }
    writeMoves(__move, turn)
    turn = (turn == 'white') ? 'black' : 'white'
    disable()
    revert()
    return [parent1, parent2, og_kid, child, __move, (turn == 'white') ? 'black' : 'white']
}


function writeMoves(_move__, turn) {
    if (turn === 'white') {
        move_counter++
        let ol = document.getElementById('moves-list')
        let li = document.createElement('li')
        li.id = move_counter.toString()
        let move_white = document.createElement('div')
        let move_black = document.createElement('div')
        move_white.className = 'move-white'
        move_white.innerText = _move__
        last_move_container = move_white
        move_white.id = 'move-white-' + move_counter.toString()
        move_black.className = 'move-black'
        move_black.innerText = '    '
        move_black.id = 'move-black-' + move_counter.toString()
        li.appendChild(move_white)
        li.appendChild(move_black)
        ol.appendChild(li)
    }
    else if(turn === 'black') {
        let move_black = document.getElementById('move-black-' + move_counter.toString())
        move_black.innerText = _move__
        last_move_container = move_black
    }
    document.getElementById("moves-list").scrollTop = document.getElementById("moves-list").scrollHeight
}


function disable() {
    let pieces = document.getElementsByTagName('img')
    for (piece of pieces) {
        if (!piece.id.startsWith(turn)) {
            piece.ondragstart = e => false
            piece.onclick = e => false
        }
        else {
            piece.ondragstart = drag
            piece.onclick = highlight
        }
    }
}


function possibleMoves(id, check_pin = false, for_checkmate = false) {
    let offsets = null
    if (id.includes('king')) {
        offsets = king(id)
    }
    else if (id.includes('queen')) {
        offsets = queen(id)
    }
    else if (id.includes('rook')) {
        offsets = rook(id)
    }
    else if (id.includes('bishop')) {
        offsets = bishop(id)
    }
    else if (id.includes('knight')) {
        offsets = knight(id)
    }
    else if (id.includes('pawn')) {
        offsets = pawn(id)
    }
    let moves = []
    const rejected_moves = new Set()
    outer: for (offset of offsets) {
        let position = document.getElementById(id).parentNode.id
        let rank = ranks[position[1]]
        let file = files[position[0]]
        inner: while(true) {
            let rank_offset = offset[0]
            let file_offset = offset[1]
            let rank_possible = rank + rank_offset
            let file_possible = file + file_offset
            try {
                if (!(rank_possible >= 0 && rank_possible <= 7)) throw 'error'
                if (!(file_possible >= 0 && file_possible <= 7)) throw 'error'
            }
            catch (err) {
                break inner
            }
            const move = files_rev[file_possible] + ranks_rev[rank_possible]
            if (id.includes('king') && id.startsWith(turn)) {
                const opponent = turn === 'white' ? 'black' : 'white'
                const opponent_pieces = document.querySelectorAll(`img[id^=${opponent}]`)
                let is_king_safe = true
                opponent_pieces.forEach(e => {
                    if (!(e.id.includes('king'))) {
                        let opponent_moves = allPossibleMoves(e.id)
                        if (e.id.includes('white-pawn')) {
                            opponent_moves = []
                            const side1 = letters.indexOf(e.parentNode.id[0]) + 1
                            const side2 = letters.indexOf(e.parentNode.id[0]) - 1
                            if (side1 <= 7) {
                                const up_right = files_rev[side1] + ranks_rev[ranks[e.parentNode.id[1]] - 1]
                                opponent_moves.push(up_right)
                            }
                            if (side2 >= 0) {
                                let up_left = files_rev[side2] + ranks_rev[ranks[e.parentNode.id[1]] - 1]
                                opponent_moves.push(up_left)
                            }
                        }
                        if (e.id.includes('black-pawn')) {
                            opponent_moves = []
                            const side1 = letters.indexOf(e.parentNode.id[0]) + 1
                            const side2 = letters.indexOf(e.parentNode.id[0]) - 1
                            if (side1 <= 7) {
                                const low_right = files_rev[side1] + ranks_rev[ranks[e.parentNode.id[1]] + 1]
                                opponent_moves.push(low_right)
                            }
                            if (side2 >= 0) {
                                const low_left = files_rev[side2] + ranks_rev[ranks[e.parentNode.id[1]] + 1]
                                opponent_moves.push(low_left)
                            }
                        }
                        if (opponent_moves.includes(move)) {
                            rejected_moves.add(move)
                        }
                    }
                })
                if (!rejected_moves.has(move)) {
                    moves.push(move)
                }
            }
            else {
                moves.push(move)
            }
            let kid = document.getElementById(move).firstElementChild
            if (kid) {
                if (kid.id.slice(0, 5) != id.slice(0, 5)) {
                    break
                }
                else if (kid.id.slice(0, 5) == id.slice(0, 5)) {
                    if (id.startsWith(turn)) {
                        moves = moves.filter( m => m !== move)
                    }
                    break
                }
            }
            rank = rank_possible
            file = file_possible
            if (id.includes('king') || id.includes('knight') || id.includes('pawn')) {
                break inner
            }
        }
    }

    if(is_under_check && !(id.includes('king')) &&  id.startsWith(turn)) {
        moves = moves.filter( e => check_path.includes(e))
    }
    if(is_under_check && (id.includes('king')) &&  id.startsWith(turn)) {
        moves = moves.filter( e => !check_path.includes(e))
    }
    if (id.startsWith(turn) && check_pin && !for_checkmate && !id.includes('king')) {
        const a = isPiecePinned(id)
        const pin = a[0], pin_path = a[1]
        if (pin) {
            moves = moves.filter( e => pin_path.includes(e))
        }
    }
    return moves
}



function king(id) {
    let offsets = [[-1, 0],
                   [1, 0],
                   [0, -1],
                   [0, 1],
                   [1, 1],
                   [1, -1],
                   [-1, 1],
                   [-1, -1]]

    if (id === 'white-king') {
        if ((!(has_white_king_moved)) && (!(has_white_rook2_moved))) {
            let conditions = [!(document.getElementById('f1').firstElementChild),
                              !(document.getElementById('g1').firstElementChild),
                              !is_under_check]
            if (conditions.every(e => e == true)) {
                offsets.push([0, 2])
            }
        }
        if ((!(has_white_king_moved)) && (!(has_white_rook1_moved))) {
            let conditions = [!(document.getElementById('d1').firstElementChild),
                              !(document.getElementById('c1').firstElementChild),
                              !(document.getElementById('b1').firstElementChild),
                              !is_under_check]
            if (conditions.every(e => e == true)) {
                offsets.push([0, -2])
            }
        }
    }
    else if (id === 'black-king') {
        if ((!(has_black_king_moved)) && (!(has_black_rook2_moved))) {
            let conditions = [!(document.getElementById('f8').firstElementChild),
                              !(document.getElementById('g8').firstElementChild),
                              !is_under_check]
            if (conditions.every(e => e == true)) {
                offsets.push([0, 2])
            }
        }
        if ((!(has_black_king_moved)) && (!(has_black_rook1_moved))) {
            let conditions = [!(document.getElementById('d8').firstElementChild),
                              !(document.getElementById('c8').firstElementChild),
                              !(document.getElementById('b8').firstElementChild),
                              !is_under_check]
            if (conditions.every(e => e == true)) {
                offsets.push([0, -2])
            }
        }
    }
    return offsets
}


function queen(id) {
    let offsets = [[-1, 0],
                   [1, 0],
                   [0, -1],
                   [0, 1],
                   [1, 1],
                   [1, -1],
                   [-1, 1],
                   [-1, -1]]
    return offsets
}


function rook(id) {
    let offsets = [[-1, 0],
                   [1, 0],
                   [0, -1],
                   [0, 1]]
    return offsets
}


function bishop(id) {
    let offsets = [[1, 1],
                   [-1, 1],
                   [1, -1],
                   [-1, -1]]
    return offsets
}


function knight(id) {
    let offsets = [[1, 2],
                   [2, 1],
                   [-1, 2],
                   [-2, -1],
                   [-1, -2],
                   [-2, 1],
                   [1, -2],
                   [2, -1]]
    return offsets
}


function pawn(id) {
    let child = document.getElementById(id)
    let parent = child.parentNode
    let offsets = []
    let position = [ranks[parent.id[1]], files[parent.id[0]]]
    let possible = []
    if (child.id.startsWith('white')) {
        let up = parent.id[0] + ranks_rev[ranks[parent.id[1]] - 1]
        if (!(document.getElementById(up).firstElementChild)) {
            offsets.push([-1, 0])
            if (parent.id.endsWith('2')) {
                let up_up = up[0] + ranks_rev[ranks[up[1]] - 1]
                up_up = document.getElementById(up_up)
                if (!up_up.firstElementChild) {
                    offsets.push([-2, 0])
                }
            }
        }
        if (for_en_passant === prev_move) {
            if (parent.id.endsWith('5')) {
                let side1 = letters.indexOf(parent.id[0]) + 1
                let side2 = letters.indexOf(parent.id[0]) - 1
                if (for_en_passant[0] === files_rev[side1]) {
                    offsets.push([-1, 1])
                }
                if (for_en_passant[0] === files_rev[side2]) {
                    offsets.push([-1, -1])
                }
            }
        }
        if (ranks[parent.id[1]] > 0) {
            let side1 = letters.indexOf(parent.id[0]) + 1
            let side2 = letters.indexOf(parent.id[0]) - 1
            if (side1 <= 7) {
                let upper_right = files_rev[side1] + ranks_rev[ranks[parent.id[1]] - 1]
                let kid = document.getElementById(upper_right).firstElementChild
                if (kid) {
                    offsets.push([-1, 1])
                }
            }
            if (side2 >= 0) {
                let upper_left = files_rev[side2] + ranks_rev[ranks[parent.id[1]] - 1]
                let kid = document.getElementById(upper_left).firstElementChild
                if (kid) {
                    offsets.push([-1, -1])
                }
            }
        }
    }
    else if (child.id.startsWith('black')) {
        let down = parent.id[0] + ranks_rev[ranks[parent.id[1]] + 1]
        if (!(document.getElementById(down).firstElementChild)) {
            offsets.push([1, 0])
            if (parent.id.endsWith('7')) {
                let down_down = down[0] + ranks_rev[ranks[down[1]] + 1]
                down_down = document.getElementById(down_down)
                if (!down_down.firstElementChild) {
                    offsets.push([2, 0])
                }
            }
        }
        if (for_en_passant === prev_move) {
            if (parent.id.endsWith('4')) {
                if (turn != for_en_passant.slice(2)) {
                    let side1 = letters.indexOf(parent.id[0]) + 1
                    let side2 = letters.indexOf(parent.id[0]) - 1
                    if (for_en_passant[0] === files_rev[side1]) {
                        offsets.push([1, 1])
                    }
                    if (for_en_passant[0] === files_rev[side2]) {
                        offsets.push([1, -1])
                    }
                }
            }
        }
        if (ranks[parent.id[1]] < 7) {
            let side1 = letters.indexOf(parent.id[0]) + 1
            let side2 = letters.indexOf(parent.id[0]) - 1
            if (side1 <= 7) {
                let lower_right = files_rev[side1] + ranks_rev[ranks[parent.id[1]] + 1]
                let kid = document.getElementById(lower_right).firstElementChild
                if (kid) {
                    offsets.push([1, 1])
                }
            }
            if (side2 >= 0) {
                let lower_left = files_rev[side2] + ranks_rev[ranks[parent.id[1]] + 1]
                let kid = document.getElementById(lower_left).firstElementChild
                if (kid) {
                    offsets.push([1, -1])
                }
            }
        }
    }
    return offsets
}


function countdown(count_for) {

    if (count_for === 'white') {
        --time_white
        let minutes = (Math.floor(time_white / 60)).toString()
        let seconds = (time_white % 60).toString()
        if (minutes.length < 2) {
            minutes = '0' + minutes
        }
        if (seconds.length < 2) {
            seconds = '0' + seconds
        }
        if (minutes == '-1' && seconds === '-1'){
            clearInterval(timer)
            const display_message = document.querySelector('#message')
            display_message.innerText = `Black wins on Time!`
            const display = document.querySelector('#winner')
            display.style.display = 'flex'
            display.classList.add('win')
            disable('white')
            disable('black')
        } else {
            document.querySelector('#timer-white').innerText = minutes + ':' + seconds
            let progress = Math.floor(time_white/6)
            document.querySelector('#white-timer-progress').style.width = progress+'%'
        }
    }
    else {
        --time_black
        let minutes = (Math.floor(time_black / 60)).toString()
        let seconds = (time_black % 60).toString()
        if (minutes.length < 2) {
            minutes = '0' + minutes
        }
        if (seconds.length < 2) {
            seconds = '0' + seconds
        }
        if (minutes == '-1' && seconds === '-1'){
            clearInterval(timer)
            const display_message = document.querySelector('#message')
            display_message.innerText = `White wins on Time!`
            const display = document.querySelector('#winner')
            display.style.display = 'flex'
            display.classList.add('win')
            disable('white')
            disable('black')
        } else {
            document.querySelector('#timer-black').innerText = minutes + ':' + seconds
            let progress = Math.floor(time_black/6)
            document.querySelector('#black-timer-progress').style.width = progress+'%'
        }
    }
}


function flip() {
    const element = document.getElementById('flip-button')
    element.classList.remove('flipper')
    void element.offsetWidth
    element.classList.add('flipper')
    setTimeout(() => { element.classList.remove('flipper')}, 400)
    let ranks_div = document.getElementById('ranks')
    if (!ranks_div.className.includes('reverse')) {
        ranks_div.className = 'ranks-reverse'
        let black_timer_container = document.getElementById('top-timer-container')
        let white_timer_container = document.getElementById('bottom-timer-container')
        let black_timer = document.getElementById('timer-black')
        let white_timer = document.getElementById('timer-white')
        let black_timer_progress = document.getElementById('black-timer-progress')
        let white_timer_progress = document.getElementById('white-timer-progress')
        black_timer_container.removeChild(black_timer)
        black_timer_container.removeChild(black_timer_progress)
        white_timer_container.removeChild(white_timer)
        white_timer_container.removeChild(white_timer_progress)
        white_timer_container.appendChild(black_timer)
        white_timer_container.appendChild(black_timer_progress)
        black_timer_container.appendChild(white_timer)
        black_timer_container.appendChild(white_timer_progress)
        let temp = window.getComputedStyle(white_timer_container, null)['background']
        white_timer_container.style.background = window.getComputedStyle(black_timer_container, null)['background']
        black_timer_container.style.background = temp
        temp = window.getComputedStyle(white_timer_container, null)['background']
        white_timer_container.style.background = window.getComputedStyle(black_timer_container, null)['background']
        black_timer_container.style.background = temp
        temp = window.getComputedStyle(white_timer_container, null)['background-color']
        white_timer_container.style.backgroundColor = window.getComputedStyle(black_timer_container, null)['background-color']
        black_timer_container.style.backgroundColor = temp
    }
    else {
        ranks_div.className = 'ranks'
        let black_timer_container = document.querySelector('#top-timer-container')
        let white_timer_container = document.querySelector('#bottom-timer-container')
        let black_timer = document.querySelector('#timer-black')
        let white_timer = document.querySelector('#timer-white')
        let black_timer_progress = document.querySelector('#black-timer-progress')
        let white_timer_progress = document.querySelector('#white-timer-progress')
        black_timer_container.removeChild(white_timer)
        black_timer_container.removeChild(white_timer_progress)
        white_timer_container.removeChild(black_timer)
        white_timer_container.removeChild(black_timer_progress)
        white_timer_container.appendChild(white_timer)
        white_timer_container.appendChild(white_timer_progress)
        black_timer_container.appendChild(black_timer)
        black_timer_container.appendChild(black_timer_progress)
        let temp = window.getComputedStyle(white_timer_container, null)['background']
        white_timer_container.style.background = window.getComputedStyle(black_timer_container, null)['background']
        black_timer_container.style.background = temp
        temp = window.getComputedStyle(white_timer_container, null)['background']
        white_timer_container.style.background = window.getComputedStyle(black_timer_container, null)['background']
        black_timer_container.style.background = temp
        temp = window.getComputedStyle(white_timer_container, null)['background-color']
        white_timer_container.style.backgroundColor = window.getComputedStyle(black_timer_container, null)['background-color']
        black_timer_container.style.backgroundColor = temp
    }
    if (ranks_div.firstElementChild.className === 'files') {
        let files_div = document.querySelectorAll('.files')
        files_div.forEach(e => {e.className = 'files-reverse'})
    }
    else {
        let files_div = document.querySelectorAll('.files-reverse')
        files_div.forEach(e => {e.className = 'files'})
    }

    let ranks_coord = document.getElementById('coordinates-container-ranks')
    if (ranks_coord.className.includes('reverse')) {
        ranks_coord.className = 'coordinates-container-ranks'
    }
    else {
        ranks_coord.className = 'coordinates-container-ranks-reverse'
    }
    let files_coord = document.getElementById('coordinates-container-files')
    if (files_coord.className.includes('reverse')) {
        files_coord.className = 'coordinates-container-files'
    }
    else {
        files_coord.className = 'coordinates-container-files-reverse'
    }
}


function changePieceStyle(id) {
    pieceStyle = id
    localStorage.setItem('preferredPieceStyle', id)
    let lichess = document.getElementById('lichess')
    let chesscom = document.getElementById('chesscom')
    const pieces = document.querySelectorAll('img')
    pieces.forEach(e => {
        if (id === 'lichess') {
            if (e.src.includes('-alt')) {
                let img = e.src.indexOf('-alt')
                e.src = e.src.slice(0,img) + '.png'
            }
        }
        else if (id === 'chesscom') {
            if (!e.src.includes('-alt')) {
                let img = e.src.indexOf('.png')
                e.src = e.src.slice(0,img) + '-alt.png'
            }
        }
    })
    if (id === 'lichess') {
        if (!lichess.className.includes('-highlight')) {
            lichess.className = lichess.className + '-highlight'
            if (chesscom.className.includes('-highlight')){
                chesscom.className = chesscom.className.slice(0, chesscom.className.indexOf('-highlight'))
            }
        }
    }
    if (id === 'chesscom') {
        if (!chesscom.className.includes('-highlight')) {
            chesscom.className = chesscom.className + '-highlight'
            if (lichess.className.includes('-highlight')){
                lichess.className = lichess.className.slice(0, lichess.className.indexOf('-highlight'))
            }
        }
    }
}


function is_opponent_king_under_attack() {
    const opponent = turn === 'white' ? 'black' : 'white'
    const my_king = document.querySelector(`#${turn}-king`)
    const opponent_pieces = document.querySelectorAll(`img[id^=${opponent}]`)
    let check_counter = 0
    opponent_pieces.forEach(e => {
        if (!e.id.includes('king')) {
            const __moves = allPossibleMoves(e.id)
            if (__moves.includes(my_king.parentNode.id)) {
                check_counter++
                is_under_check = true
                my_king.parentNode.classList.add('check-'+my_king.parentNode.className.split('-')[1])
                if (check_counter === 1) {
                    calculate_check_path(e, my_king)
                }
                if (check_counter === 2) {
                    double_check = true
                }
                if (!(last_move_container.innerText.includes('+'))) {
                    last_move_container.innerText += '+'
                }
            }
        }
    })
}

function calculate_check_path(piece, my_king) {
    check_path = [piece.parentNode.id]
    const piece_id = piece.id
    const piece_position = piece.parentNode.id
    const piece_position_arr = [ranks[piece_position[1]], files[piece_position[0]]]
    const king_position = my_king.parentNode.id
    const king_position_arr = [ranks[king_position[1]], files[king_position[0]]]


    if (piece_id.includes('knight')) {
        return
    }

    // This is for Horizontal checks only
    if ((king_position_arr[0] - piece_position_arr[0]) === 0) {
        const offset  = (king_position_arr[1] > piece_position_arr[1]) ? 1 : -1
        let file_possible = piece_position_arr[1] + offset
        while (file_possible != king_position_arr[1]) {
            check_path.push(files_rev[file_possible] + ranks_rev[king_position_arr[0]])
            file_possible = file_possible + offset
        }
        file_possible = file_possible + offset
        if ((file_possible < 8) && (file_possible >= 0)) {
            const last_move = files_rev[file_possible] + ranks_rev[king_position_arr[0]]
            check_path.push(last_move)
        }
        return
    }


    // This is for Vertical checks only
    else if ((king_position_arr[1] - piece_position_arr[1]) === 0) {
        const offset  = (king_position_arr[0] > piece_position_arr[0]) ? 1 : -1
        let rank_possible = piece_position_arr[0] + offset
        while (rank_possible != king_position_arr[0]) {
            check_path.push(files_rev[king_position_arr[1]] + ranks_rev[rank_possible])
            rank_possible = rank_possible + offset
        }
        rank_possible = rank_possible + offset
        if ((rank_possible < 8) && (rank_possible >= 0)) {
            check_path.push(files_rev[king_position_arr[1]] + ranks_rev[rank_possible])
        }
        return
    }


    // This is for Diagonal Checks only
    // along the a8 => h1 diagonal
    // NORTH WEST : KARR[1] < PARR[1]
    // SOUTH EAST : KARR[1] > PARR[1]
    else if (((king_position_arr[1] - piece_position_arr[1]) / (king_position_arr[0] - piece_position_arr[0])) === 1) {
        if ((king_position_arr[0] < piece_position_arr[0])) {
            const offset  = -1
            let file_possible = piece_position_arr[1] + offset
            let rank_possible = piece_position_arr[0] + offset
            while (file_possible != king_position_arr[1]) {
                check_path.push(files_rev[file_possible] + ranks_rev[rank_possible])
                rank_possible = rank_possible + offset
                file_possible = file_possible + offset
            }
            rank_possible = rank_possible + offset
            file_possible = file_possible + offset
            if (((rank_possible < 8) && (rank_possible >= 0)) && ((file_possible < 8) && (file_possible >= 0))) {
                check_path.push(files_rev[file_possible] + ranks_rev[rank_possible])
            }
            return
        }
        else if ((king_position_arr[0] > piece_position_arr[0])) {
            const offset = 1
            let file_possible = piece_position_arr[1] + offset
            let rank_possible = piece_position_arr[0] + offset
            while (file_possible != king_position_arr[1]) {
                check_path.push(files_rev[file_possible] + ranks_rev[rank_possible])
                rank_possible = rank_possible + offset
                file_possible = file_possible + offset
            }
            rank_possible = rank_possible + offset
            file_possible = file_possible + offset
            if (((rank_possible < 8) && (rank_possible >= 0)) && ((file_possible < 8) && (file_possible >= 0))) {
                check_path.push(files_rev[file_possible] + ranks_rev[rank_possible])
            }
            return
        }
    }

    // This is for Diagonal Checks only
    // along the a1 => h8 diagonal
    // NORTH EAST : KARR[1] < PARR[1]
    // SOUTH WEST : KARR[1] > PARR[1]
    else if (((king_position_arr[1] - piece_position_arr[1]) / (king_position_arr[0] - piece_position_arr[0])) === -1) {
        // North East Check
        if ((king_position_arr[0] < piece_position_arr[0])) {
            const rank_offset = -1
            const file_offset  = 1
            let file_possible = piece_position_arr[1] + file_offset
            let rank_possible = piece_position_arr[0] + rank_offset
            while (file_possible != king_position_arr[1]) {
                check_path.push(files_rev[file_possible] + ranks_rev[rank_possible])
                rank_possible = rank_possible + rank_offset
                file_possible = file_possible + file_offset
            }
            rank_possible = rank_possible + rank_offset
            file_possible = file_possible + file_offset
            if (((rank_possible < 8) && (rank_possible >= 0)) && ((file_possible < 8) && (file_possible >= 0))) {
                check_path.push(files_rev[file_possible] + ranks_rev[rank_possible])
            }
            return
        }
        // South West Check
        else if ((king_position_arr[0] > piece_position_arr[0])) {
            const rank_offset = 1
            const file_offset  = -1
            let file_possible = piece_position_arr[1] + file_offset
            let rank_possible = piece_position_arr[0] + rank_offset
            while (file_possible != king_position_arr[1]) {
                check_path.push(files_rev[file_possible] + ranks_rev[rank_possible])
                rank_possible = rank_possible + rank_offset
                file_possible = file_possible + file_offset
            }
            rank_possible = rank_possible + rank_offset
            file_possible = file_possible + file_offset
            if (((rank_possible < 8) && (rank_possible >= 0)) && ((file_possible < 8) && (file_possible >= 0))) {
                check_path.push(files_rev[file_possible] + ranks_rev[rank_possible])
            }
            return
        }
    }
}

function calculatePinPath(piece, my_king) {
    const pin_path = [piece.parentNode.id]
    const piece_id = piece.id
    const piece_position = piece.parentNode.id
    const piece_position_arr = [ranks[piece_position[1]], files[piece_position[0]]]
    const king_position = my_king.parentNode.id
    const king_position_arr = [ranks[king_position[1]], files[king_position[0]]]


    if (piece_id.includes('knight')) {
        return pin_path
    }

    if ((king_position_arr[0] - piece_position_arr[0]) === 0) {
        const offsets  = [1,-1]
        for (offset of offsets) {
            let file_possible = piece_position_arr[1] + offset
            while (file_possible != king_position_arr[1] && ((file_possible < 8) && (file_possible >= 0))) {
                pin_path.push(files_rev[file_possible] + ranks_rev[king_position_arr[0]])
                file_possible = file_possible + offset
            }
            file_possible = file_possible + offset
        }
        return pin_path
    }

    else if ((king_position_arr[1] - piece_position_arr[1]) === 0) {
        const offsets  = [1, -1]
        for (offset of offsets) {
            let rank_possible = piece_position_arr[0] + offset
            while (rank_possible != king_position_arr[0] && ((rank_possible < 8) && (rank_possible >= 0))) {
                pin_path.push(files_rev[king_position_arr[1]] + ranks_rev[rank_possible])
                rank_possible = rank_possible + offset
            }
            rank_possible = rank_possible + offset
        }
        return pin_path
    }

    else if (((king_position_arr[1] - piece_position_arr[1]) / (king_position_arr[0] - piece_position_arr[0])) === 1) {
        const offsets  = [-1, 1]
        for (offset of offsets) {
            let file_possible = piece_position_arr[1] + offset
            let rank_possible = piece_position_arr[0] + offset
            while (file_possible != king_position_arr[1] && ((rank_possible < 8) && (rank_possible >= 0)) && ((file_possible < 8) && (file_possible >= 0))) {
                pin_path.push(files_rev[file_possible] + ranks_rev[rank_possible])
                rank_possible = rank_possible + offset
                file_possible = file_possible + offset
            }
            rank_possible = rank_possible + offset
            file_possible = file_possible + offset
        }
        return pin_path
    }

    else if (((king_position_arr[1] - piece_position_arr[1]) / (king_position_arr[0] - piece_position_arr[0])) === -1) {
        if ((king_position_arr[0] < piece_position_arr[0])) {
            const offsets = [[-1,1],[1,-1]]
            for(offset of offsets) {
                const rank_offset = offset[0]
                const file_offset  = offset[1]
                let file_possible = piece_position_arr[1] + file_offset
                let rank_possible = piece_position_arr[0] + rank_offset
                while (file_possible != king_position_arr[1] && ((rank_possible < 8) && (rank_possible >= 0)) && ((file_possible < 8) && (file_possible >= 0))) {
                    pin_path.push(files_rev[file_possible] + ranks_rev[rank_possible])
                    rank_possible = rank_possible + rank_offset
                    file_possible = file_possible + file_offset
                }
                rank_possible = rank_possible + rank_offset
                file_possible = file_possible + file_offset
            }
            return pin_path
        }
    }
}


function checkmate(player) {
    const opponent = player === 'white' ? 'Black' : 'White'
    const pieces = document.querySelectorAll(`img[id^=${player}]`)
    const possible_moves_set = new Set()
    pieces.forEach(e => {
        const possible_moves_per_piece = possibleMoves(e.id, true, true)
        for (var i = 0; i < possible_moves_per_piece.length; i++) {
            possible_moves_set.add(possible_moves_per_piece[i])
        }
    })
    if ( is_under_check && possible_moves_set.size === 0) {
        last_move_container.innerText = last_move_container.innerText.slice(0,-1) + '#'
        clearInterval(timer)
        const display_message = document.querySelector('#message')
        display_message.innerText = `${opponent} wins by Checkmate!`
        const display = document.querySelector('#winner')
        display.style.display = 'flex'
        display.classList.add('win')
    }
    else if (!is_under_check && possible_moves_set.size === 0) {
        clearInterval(timer)
        const display_message = document.querySelector('#message')
        display_message.innerText = "Draw by Stalemate!"
        const display = document.querySelector('#winner')
        display.style.display = 'flex'
        display.classList.add('win')
    }
}


function isPiecePinned(p) {
    let pin_path = null
    const piece_to_check = document.querySelector('#'+p)
    const piece_to_check_parent = piece_to_check.parentNode
    piece_to_check_parent.removeChild(piece_to_check)
    const opponent = turn === 'white' ? 'black' : 'white'
    if (p.startsWith(opponent)) return false
    const opponent_pieces = document.querySelectorAll(`img[id^=${opponent}-rook], img[id^=${opponent}-bishop], img[id^=${opponent}-queen]`)
    const my_king = document.querySelector(`#${p.split('-')[0]}-king`)
    try {
        opponent_pieces.forEach(e => {
            const __moves = allPossibleMoves(e.id)
            if (__moves.includes(my_king.parentNode.id)) {
                pin_path = calculatePinPath(e, my_king)
                throw 'BreakException'
            }
        })
    }
    catch (e) {
        if (e === 'BreakException') {
            return [true, pin_path]
        }
        else{
            throw e
        }
    }
    finally {
        piece_to_check_parent.appendChild(piece_to_check)
    }
    return [false, pin_path]
}

function allPossibleMoves(id) {
    let offsets = null
    if (id.includes('king')) {
        offsets = king(id)
    }
    else if (id.includes('queen')) {
        offsets = queen(id)
    }
    else if (id.includes('rook')) {
        offsets = rook(id)
    }
    else if (id.includes('bishop')) {
        offsets = bishop(id)
    }
    else if (id.includes('knight')) {
        offsets = knight(id)
    }
    else if (id.includes('pawn')) {
        offsets = pawn(id)
    }
    let moves = []
    const rejected_moves = new Set()
    outer: for (offset of offsets) {
        let position = document.getElementById(id).parentNode.id
        let rank = ranks[position[1]]
        let file = files[position[0]]
        inner: while(true) {
            let rank_offset = offset[0]
            let file_offset = offset[1]
            let rank_possible = rank + rank_offset
            let file_possible = file + file_offset
            try {
                if (!(rank_possible >= 0 && rank_possible <= 7)) throw 'error'
                if (!(file_possible >= 0 && file_possible <= 7)) throw 'error'
            }
            catch (err) {
                break inner
            }
            const move = files_rev[file_possible] + ranks_rev[rank_possible]
            moves.push(move)
            let kid = document.getElementById(move).firstElementChild
            if (kid) {
                if (kid.id.slice(0, 5) != id.slice(0, 5)) {
                    break
                }
                else if (kid.id.slice(0, 5) == id.slice(0, 5)) {
                    break
                }
            }
            rank = rank_possible
            file = file_possible
            if (id.includes('king') || id.includes('knight') || id.includes('pawn')) {
                break inner
            }
        }
    }
    return moves
}
