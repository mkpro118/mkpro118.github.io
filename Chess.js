let turn = 'white'

let has_white_king_moved = false
let has_black_king_moved = false
let has_white_rook1_moved = false
let has_white_rook2_moved = false
let has_black_rook1_moved = false
let has_black_rook2_moved = false

let move_counter = 0
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

let files = Object.freeze({
    'a': 0,
    'b': 1,
    'c': 2,
    'd': 3,
    'e': 4,
    'f': 5,
    'g': 6,
    'h': 7,
})

let ranks = Object.freeze({
    '1': 7,
    '2': 6,
    '3': 5,
    '4': 4,
    '5': 3,
    '6': 2,
    '7': 1,
    '8': 0,
})

let files_rev = Object.freeze({
    0: 'a',
    1: 'b',
    2: 'c',
    3: 'd',
    4: 'e',
    5: 'f',
    6: 'g',
    7: 'h',
})

let ranks_rev = Object.freeze({
    7: '1',
    6: '2',
    5: '3',
    4: '4',
    3: '5',
    2: '6',
    1: '7',
    0: '8',
})

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
            let size = document.getElementById('flip-button').style.backgroundSize
            document.getElementById('flip-button').style.background = 'url("images/flip.png")'
            document.getElementById('flip-button').style.backgroundSize = size
            size = document.getElementById('chesscom').style.backgroundSize
            document.getElementById('chesscom').style.background = 'url("images/white-king-alt.png")'
            document.getElementById('chesscom').style.backgroundColor = og_color
            document.getElementById('chesscom').style.backgroundSize = size
        }
        if (which === 'top') {
            let size = document.getElementById('lichess').style.backgroundSize
            document.getElementById('lichess').style.background = 'url("images/white-king.png")'
            document.getElementById('lichess').style.backgroundColor = og_color
            document.getElementById('lichess').style.backgroundSize = size
        }
    } else {
        let text_color_container = document.getElementById(which+'-timer-container')
        text_color_container.firstElementChild.style.color = 'black'
        if (which === 'bottom') {
            let size = document.getElementById('flip-button').style.backgroundSize
            document.getElementById('flip-button').style.background = 'url("images/flip-alt.png")'
            document.getElementById('flip-button').style.backgroundSize = size
            size = document.getElementById('chesscom').style.backgroundSize
            document.getElementById('chesscom').style.background = 'url("images/black-king-alt.png")'
            document.getElementById('chesscom').style.backgroundColor = og_color
            document.getElementById('chesscom').style.backgroundSize = size
        }
        if (which === 'top') {
            let size = document.getElementById('lichess').style.backgroundSize
            document.getElementById('lichess').style.background = 'url("images/black-king.png")'
            document.getElementById('lichess').style.backgroundColor = og_color
            document.getElementById('lichess').style.backgroundSize = size
        }
    }
}


function computeShadow() {
    const computed_style = window.getComputedStyle(document.documentElement)
    const light_color = computed_style.getPropertyValue('--squarelight-background').trim()
    const dark_color = computed_style.getPropertyValue('--squaredark-background').trim()
    const c1 = hexToRgb(light_color).r,
          c2 = hexToRgb(light_color).g,
          c3 = hexToRgb(light_color).b,
          c4 = hexToRgb(dark_color).r,
          c5 = hexToRgb(dark_color).g,
          c6 = hexToRgb(dark_color).b
    const s1 = c1 + c2 + c3,
          s2 = c4 + c5 + c6
    if (s1 > s2) {
        document.documentElement.style.setProperty('--boardshadow-box-shadow-color', light_color)
    }
    else {
        document.documentElement.style.setProperty('--boardshadow-box-shadow-color', dark_color)
    }
}

customize_light_square = document.getElementById('light-square')
customize_dark_square = document.getElementById('dark-square')

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


function revert() {
    all_squares = document.getElementsByTagName('div')
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
    let moves = null
    if (typeof(event) === 'string') {
        selected_piece = event
        moves = possibleMoves(event)
    }
    else {
        selected_piece = event.target.id
        moves = possibleMoves(event.target.id)
    }
    selected_piece_parent = document.getElementById(selected_piece).parentNode.id
    for (move of moves) {
        let square = document.getElementById(move)
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

    // White King Castle
    if (data === 'white-king' && !has_white_king_moved) {
        if ((to === 'g1') || (to === 'white-rook-2') ) {

            if (!(has_white_king_moved) && !(has_white_rook2_moved)) {

                let conditions =  [!(document.getElementById('f1').firstElementChild),
                                   (document.getElementById('h1').firstElementChild.id === 'white-rook-2')]

                if (conditions.every( c => c == true)) {
                    let parent1 = document.getElementById('e1')
                    let parent2 = document.getElementById('f1')
                    let parent3 = document.getElementById('g1')
                    let parent4 = document.getElementById('h1')
                    let king = document.getElementById('white-king')
                    let rook = document.getElementById('white-rook-2')
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

    // Black King Castle
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

    if (!((possibleMoves(data).includes(to)) || (possibleMoves(data).includes(target.parentNode.id)))) {
        return
    }

    // moving to a square occupied by friendly pieces
    // Note: this part has been placed after the castles logic to
    // allow users to click or drag the king over near the rook and still
    // be able to castle on either direction
    if (to.startsWith(data.slice(0, 5))){
        return
    }

    // moving to an empty square
    if (target.className.startsWith('square')) {
        moveToEmptySquare(data, to, target, parent)
    }

    // moving to a sqaure occupied by an unfriendly piece
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
}


function moveToEmptySquare(data, to, target, parent) {
    let move = ''
    if (data.includes('king')) {
        move = 'K' + to
        for_en_passant = null
    }
    else if(data.includes('queen')) {
        move = 'Q' + to
        for_en_passant = null
    }
    else if(data.includes('rook')) {
        move = 'R' + to
        for_en_passant = null
    }
    else if(data.includes('bishop')) {
        move = 'B' + to
        for_en_passant = null
    }
    else if(data.includes('knight')) {
        move = 'N' + to
        for_en_passant = null
    }
    else if(data.includes('pawn')) {
        is_promoting = false
        let promotion = null
        move = to
        if (((move[1] === '5') && (turn === 'black') && (parent[0] === move[0]))) {
            for_en_passant = move
        }
        else if (move[1] === '4' && turn === 'white' && (parent[0] === move[0])) {
            for_en_passant = move
        }
        else if ((move[1] === '3' || move[1] === '6') && (parent[0] != move[0]) && (prev_move === for_en_passant)) {
            move = parent[0] + 'x' + to
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
        if (turn === 'white' && move.includes('8')) {
            is_promoting = true
            promotion = document.createElement('img')
            promotion.src = (pieceStyle === 'lichess') ? 'images/white-queen.png' : 'images/white-queen-alt.png'
            promotion.id = 'white-queen-' + (++white_queen_count)
            promotion.className = 'grabbable'
            promotion.onclick = highlight
            promotion.ondragstart = drag
            promotion.draggable = true
            promotion.alt = 'black-queen'
            console.log(promotion)

        }
        if (turn === 'black' && move.includes('1')) {
            is_promoting = true
            promotion = document.createElement('img')
            promotion.src = (pieceStyle === 'lichess') ? 'images/black-queen.png' : 'images/black-queen-alt.png'
            promotion.id = 'black-queen-' + (++black_queen_count)
            promotion.className = 'grabbable'
            promotion.onclick = highlight
            promotion.ondragstart = drag
            promotion.draggable = true
            promotion.alt = 'black-queen'
            console.log(promotion)
        }
    }
    if (is_promoting) {
        target.appendChild(promotion)
        move = move+'=Q'
        document.getElementById(parent).removeChild(document.getElementById(data))
    } else {
        target.appendChild(document.getElementById(data))
    }
    prev_move = move
    writeMoves(move, turn)
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
    turn = (turn == 'white') ? 'black' : 'white'
    disable(turn)
    revert()
}


function moveToUnfriendlySquare(data, to, target) {
    let move = ''
    if (data.includes()) {}
    let parent1 = target.parentNode
    parent1.removeChild(parent1.firstElementChild)
    child = document.getElementById(data)
    let parent2 = child.parentNode
    parent2.removeChild(child)
    parent1.appendChild(child)
    if (data.includes('king')) {
        move = 'Kx' + parent1.id
    }
    else if(data.includes('queen')) {
        move = 'Qx' + parent1.id
    }
    else if(data.includes('rook')) {
        move = 'Rx' + parent1.id
    }
    else if(data.includes('bishop')) {
        move = 'Bx' + parent1.id
    }
    else if(data.includes('knight')) {
        move = 'Nx' + parent1.id
    }
    else if(data.includes('pawn')) {
        move = parent2.id[0] + 'x' + parent1.id
    }
    writeMoves(move, turn)
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
    turn = (turn == 'white') ? 'black' : 'white'
    disable(turn)
    revert()
}


function writeMoves(move, turn) {
    if (turn === 'white') {
        move_counter++
        let ol = document.getElementById('moves-list')
        let li = document.createElement('li')
        li.id = move_counter.toString()
        let move_white = document.createElement('div')
        let move_black = document.createElement('div')
        move_white.className = 'move-white'
        move_white.innerHTML = move
        move_white.id = 'move-white-' + move_counter.toString()
        move_black.className = 'move-black'
        move_black.innerHTML = '    '
        move_black.id = 'move-black-' + move_counter.toString()
        li.appendChild(move_white)
        li.appendChild(move_black)
        ol.appendChild(li)
    }
    else if(turn === 'black') {
        let move_black = document.getElementById('move-black-' + move_counter.toString())
        move_black.innerHTML = move
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


function possibleMoves(id) {
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
    moves = []
    for (offset of offsets) {
        let position = document.getElementById(id).parentNode.id
        let rank = ranks[position[1]]
        let file = files[position[0]]
        while(true) {
            let rank_offset = offset[0]
            let file_offset = offset[1]
            let rank_possible = rank + rank_offset
            let file_possible = file + file_offset
            try {
                if (!(rank_possible >= 0 && rank_possible <= 7)) throw 'error'
                if (!(file_possible >= 0 && file_possible <= 7)) throw 'error'
            }
            catch (err) {
                break
            }
            move = files_rev[file_possible] + ranks_rev[rank_possible]
            moves.push(move)
            let kid = document.getElementById(move).firstElementChild
            if (kid) {
                if (kid.id.slice(0, 5) != id.slice(0, 5)) {
                    break
                }
                else if (kid.id.slice(0, 5) == id.slice(0, 5)) {
                    _ = moves.pop()
                    break
                }
            }
            rank = rank_possible
            file = file_possible
            if (id.includes('king') || id.includes('knight') || id.includes('pawn')) {
                break
            }
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
                              !(document.getElementById('g1').firstElementChild)]
            if (conditions.every(e => e == true)) {
                offsets.push([0, 2])
            }
        }
        if ((!(has_white_king_moved)) && (!(has_white_rook1_moved))) {
            let conditions = [!(document.getElementById('d1').firstElementChild),
                              !(document.getElementById('c1').firstElementChild),
                              !(document.getElementById('b1').firstElementChild)]
            if (conditions.every(e => e == true)) {
                offsets.push([0, -2])
            }
        }
    }
    else if (id === 'black-king') {
        if ((!(has_black_king_moved)) && (!(has_black_rook2_moved))) {
            let conditions = [!(document.getElementById('f8').firstElementChild),
                              !(document.getElementById('g8').firstElementChild)]
            if (conditions.every(e => e == true)) {
                offsets.push([0, 2])
            }
        }
        if ((!(has_black_king_moved)) && (!(has_black_rook1_moved))) {
            let conditions = [!(document.getElementById('d8').firstElementChild),
                              !(document.getElementById('c8').firstElementChild),
                              !(document.getElementById('b8').firstElementChild)]
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
    let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
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
            alert("Time's up! Black Wins!!!")
            disable('white')
            disable('black')
        } else {
            document.querySelector('#timer-white').innerHTML = minutes + ':' + seconds
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
            alert("Time's up! White Wins!!!")
            disable('white')
            disable('black')
        } else {
            document.querySelector('#timer-black').innerHTML = minutes + ':' + seconds
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
