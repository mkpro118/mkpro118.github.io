var turn = 'white'

var has_white_king_moved = false
var has_black_king_moved = false
var has_white_rook1_moved = false
var has_white_rook2_moved = false
var has_black_rook1_moved = false
var has_black_rook2_moved = false

var move_counter = 0
var for_en_passant = null
var prev_move = null
var is_en_passant_allowed = false

var is_highlighted = false
var selected_piece = null

var white_queen_count = 1
var black_queen_count = 1

var pieceStyle = 'chesscom'

var time_white = 600
var time_black = 600

var has_white_started = false
var has_black_started = false

var timer = null

var files = {
    'a': 0,
    'b': 1,
    'c': 2,
    'd': 3,
    'e': 4,
    'f': 5,
    'g': 6,
    'h': 7,
}

var ranks = {
    '1': 7,
    '2': 6,
    '3': 5,
    '4': 4,
    '5': 3,
    '6': 2,
    '7': 1,
    '8': 0,
}

var files_rev = {
    0: 'a',
    1: 'b',
    2: 'c',
    3: 'd',
    4: 'e',
    5: 'f',
    6: 'g',
    7: 'h',
}

var ranks_rev = {
    7: '1',
    6: '2',
    5: '3',
    4: '4',
    3: '5',
    2: '6',
    1: '7',
    0: '8',
}

var symbols = {
    'king' : 'K',
    'queen' : 'Q',
    'rook' : 'R',
    'bishop' : 'B',
    'knight' : 'N',
}

var coords = new Array(8)
for (var i = 0; i < coords.length; i++) {
    coords[i] = new Array(8)
    for (var j = 0; j < coords[i].length; j++) {
        coords[i][j] = j
    }
}

window.onload = disable

window.addEventListener('contextmenu', function (e) {
  e.preventDefault()
  e.stopPropagation()
}, false);

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function isColorTooDark(which) {
    var current_color = window.getComputedStyle(document.getElementById(which + '-timer-container'),null)['background'].trim()
    current_color = current_color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/)

    r = current_color[1];
    g = current_color[2];
    b = current_color[3];

    var hsp = Math.sqrt((0.299 * (r * r) )+ (0.587 * (g * g) )+ (0.114 * (b * b)))
    return (hsp < 127.5)
}

function computeTimerTextColor(which) {
    if (isColorTooDark(which)) {
        var text_color_container = document.getElementById(which+'-timer-container')
        text_color_container.firstElementChild.style.color = 'white'
        if (which === 'bottom') {
            var size = document.getElementById('flip-button').style.backgroundSize
            document.getElementById('flip-button').style.background = 'url("images/flip.png")'
            document.getElementById('flip-button').style.backgroundSize = size
        }
    } else {
        var text_color_container = document.getElementById(which+'-timer-container')
        text_color_container.firstElementChild.style.color = 'black'
        if (which === 'bottom') {
            var size = document.getElementById('flip-button').style.backgroundSize
            document.getElementById('flip-button').style.background = 'url("images/flip-alt.png")'
            document.getElementById('flip-button').style.backgroundSize = size
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

customize_light_square.addEventListener('input', function() {
    document.documentElement.style.setProperty('--squarelight-background', customize_light_square.value)
    computeShadow()
    computeTimerTextColor('top')
})
customize_dark_square.addEventListener('input', function() {
    document.documentElement.style.setProperty('--squaredark-background', customize_dark_square.value)
    computeShadow()
    computeTimerTextColor('bottom')
})

function revert() {
    all_squares = document.getElementsByTagName('div')
    for (sq of all_squares) {
        if (sq.className.includes('style')) {
            continue
        }
        if (sq.className.includes('highlight')) {
            sq.className = sq.className.split(' ')[0]
            sq.onclick = function (e) { return false }
        }
    }
}

function highlight(event) {
    revert()
    var moves = null
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
        var square = document.getElementById(move)
        square.className = square.className + " highlight-" + square.className.slice(7).trim()
        if (square.firstElementChild) {
            square.className = square.className + "-unfriendly"
        }
        square.onclick = function(e) {
            var raw_data = selected_piece + ' ' + selected_piece_parent
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
    var data = null
    var parent = null
    var target = null
    var to = null
    if (typeof(event) === 'string') {
        var raw_data = event.split(' ')
        data = raw_data[0].trim()
        parent = raw_data[1].trim()
        to = raw_data[2]
        target = document.getElementById(to)
    }
    else {
        event.preventDefault();
        var raw_data = event.dataTransfer.getData("text")
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

                var conditions =  [!(document.getElementById('f1').firstElementChild),
                                   (document.getElementById('h1').firstElementChild.id === 'white-rook-2')]

                if (conditions.every( c => c == true)) {
                    var parent1 = document.getElementById('e1')
                    var parent2 = document.getElementById('f1')
                    var parent3 = document.getElementById('g1')
                    var parent4 = document.getElementById('h1')
                    var king = document.getElementById('white-king')
                    var rook = document.getElementById('white-rook-2')
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
                var conditions =  [!(document.getElementById('c1').firstElementChild),
                                   !(document.getElementById('b1').firstElementChild),
                                   !(document.getElementById('d1').firstElementChild),
                                   (document.getElementById('a1').firstElementChild.id === 'white-rook-1')]
                if (conditions.every( c => c == true)) {
                    var parent1 = document.getElementById('e1')
                    var parent2 = document.getElementById('d1')
                    var parent3 = document.getElementById('c1')
                    var parent4 = document.getElementById('a1')
                    var king = document.getElementById('white-king')
                    var rook = document.getElementById('white-rook-1')
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

                var conditions =  [!(document.getElementById('f8').firstElementChild),
                                   (document.getElementById('h8').firstElementChild.id === 'black-rook-2')]

                if (conditions.every( c => c == true)) {
                    var parent1 = document.getElementById('e8')
                    var parent2 = document.getElementById('f8')
                    var parent3 = document.getElementById('g8')
                    var parent4 = document.getElementById('h8')
                    var king = document.getElementById('black-king')
                    var rook = document.getElementById('black-rook-2')
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
                var conditions =  [!(document.getElementById('c8').firstElementChild),
                                   !(document.getElementById('b8').firstElementChild),
                                   !(document.getElementById('d8').firstElementChild),
                                   (document.getElementById('a8').firstElementChild.id === 'black-rook-1')]
                if (conditions.every( c => c == true)) {
                    var parent1 = document.getElementById('e8')
                    var parent2 = document.getElementById('d8')
                    var parent3 = document.getElementById('c8')
                    var parent4 = document.getElementById('a8')
                    var king = document.getElementById('black-king')
                    var rook = document.getElementById('black-rook-1')
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
        var move = ''
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
            var is_promoting = false
            var promotion = null
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

    // moving to a sqaure occupied by an unfriendly piece
    else if ((data.slice(0, 5) != to.slice(0, 5))) {
        var move = ''
        if (data.includes()) {}
        var parent1 = target.parentNode
        parent1.removeChild(parent1.firstElementChild)
        child = document.getElementById(data)
        var parent2 = child.parentNode
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
    if (turn === 'black') {
        has_white_started = true
    }
    if (turn === 'white') {
        has_black_started = true
    }
    if (timer) {
        clearInterval(timer)
    }
    timer = setInterval(function() {
        if (has_white_started && has_black_started) {
            countdown(turn)
        }
    }, 1000)
}

function writeMoves(move, turn) {
    if (turn === 'white') {
        move_counter++
        var ol = document.getElementById('moves-list')
        var li = document.createElement('li')
        li.id = move_counter.toString()
        var move_white = document.createElement('div')
        var move_black = document.createElement('div')
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
        var move_black = document.getElementById('move-black-' + move_counter.toString())
        move_black.innerHTML = move
    }
    document.getElementById("moves-list").scrollTop = document.getElementById("moves-list").scrollHeight;
}

function disable() {
    var pieces = document.getElementsByTagName('img')
    for (piece of pieces) {
        if (!piece.id.startsWith(turn)) {
            piece.ondragstart = function(event) { return false}
            piece.onclick = function(event) { return false}
        }
        else {
            piece.ondragstart = drag
            piece.onclick = highlight
        }
    }
}

function possibleMoves(id) {
    var offsets = null
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
        var position = document.getElementById(id).parentNode.id
        var rank = ranks[position[1]]
        var file = files[position[0]]
        while(true) {
            var rank_offset = offset[0]
            var file_offset = offset[1]
            var rank_possible = rank + rank_offset
            var file_possible = file + file_offset
            try {
                if (!(rank_possible >= 0 && rank_possible <= 7)) throw 'error'
                if (!(file_possible >= 0 && file_possible <= 7)) throw 'error'
            }
            catch (err) {
                break
            }
            move = files_rev[file_possible] + ranks_rev[rank_possible]
            moves.push(move)
            var kid = document.getElementById(move).firstElementChild
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
    var offsets = [[-1, 0],
                   [1, 0],
                   [0, -1],
                   [0, 1],
                   [1, 1],
                   [1, -1],
                   [-1, 1],
                   [-1, -1]]
    if (id === 'white-king') {
        if ((!(has_white_king_moved)) && (!(has_white_rook2_moved))) {
            var conditions = [!(document.getElementById('f1').firstElementChild),
                              !(document.getElementById('g1').firstElementChild)]
            if (conditions.every(e => e == true)) {
                offsets.push([0, 2])
            }
        }
        if ((!(has_white_king_moved)) && (!(has_white_rook1_moved))) {
            var conditions = [!(document.getElementById('d1').firstElementChild),
                              !(document.getElementById('c1').firstElementChild),
                              !(document.getElementById('b1').firstElementChild)]
            if (conditions.every(e => e == true)) {
                offsets.push([0, -2])
            }
        }
    }
    else if (id === 'black-king') {
        if ((!(has_black_king_moved)) && (!(has_black_rook2_moved))) {
            var conditions = [!(document.getElementById('f8').firstElementChild),
                              !(document.getElementById('g8').firstElementChild)]
            if (conditions.every(e => e == true)) {
                offsets.push([0, 2])
            }
        }
        if ((!(has_black_king_moved)) && (!(has_black_rook1_moved))) {
            var conditions = [!(document.getElementById('d8').firstElementChild),
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
    var offsets = [[-1, 0],
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
    var offsets = [[-1, 0],
                   [1, 0],
                   [0, -1],
                   [0, 1]]
    return offsets
}

function bishop(id) {
    var offsets = [[1, 1],
                   [-1, 1],
                   [1, -1],
                   [-1, -1]]
    return offsets
}

function knight(id) {
    var offsets = [[1, 2],
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
    var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    var child = document.getElementById(id)
    var parent = child.parentNode
    var offsets = []
    var position = [ranks[parent.id[1]], files[parent.id[0]]]
    var possible = []
    if (child.id.startsWith('white')) {
        var up = parent.id[0] + ranks_rev[ranks[parent.id[1]] - 1]
        if (!(document.getElementById(up).firstElementChild)) {
            offsets.push([-1, 0])
            if (parent.id.endsWith('2')) {
                var up_up = up[0] + ranks_rev[ranks[up[1]] - 1]
                up_up = document.getElementById(up_up)
                if (!up_up.firstElementChild) {
                    offsets.push([-2, 0])
                }
            }
        }
        if (for_en_passant === prev_move) {
            if (parent.id.endsWith('5')) {
                var side1 = letters.indexOf(parent.id[0]) + 1
                var side2 = letters.indexOf(parent.id[0]) - 1
                if (for_en_passant[0] === files_rev[side1]) {
                    offsets.push([-1, 1])
                }
                if (for_en_passant[0] === files_rev[side2]) {
                    offsets.push([-1, -1])
                }
            }
        }
        if (ranks[parent.id[1]] > 0) {
            var side1 = letters.indexOf(parent.id[0]) + 1
            var side2 = letters.indexOf(parent.id[0]) - 1
            if (side1 <= 7) {
                var upper_right = files_rev[side1] + ranks_rev[ranks[parent.id[1]] - 1]
                var kid = document.getElementById(upper_right).firstElementChild
                if (kid) {
                    offsets.push([-1, 1])
                }
            }
            if (side2 >= 0) {
                var upper_left = files_rev[side2] + ranks_rev[ranks[parent.id[1]] - 1]
                var kid = document.getElementById(upper_left).firstElementChild
                if (kid) {
                    offsets.push([-1, -1])
                }
            }
        }
    }
    else if (child.id.startsWith('black')) {
        var down = parent.id[0] + ranks_rev[ranks[parent.id[1]] + 1]
        if (!(document.getElementById(down).firstElementChild)) {
            offsets.push([1, 0])
            if (parent.id.endsWith('7')) {
                var down_down = down[0] + ranks_rev[ranks[down[1]] + 1]
                down_down = document.getElementById(down_down)
                if (!down_down.firstElementChild) {
                    offsets.push([2, 0])
                }
            }
        }
        if (for_en_passant === prev_move) {
            if (parent.id.endsWith('4')) {
                if (turn != for_en_passant.slice(2)) {
                    var side1 = letters.indexOf(parent.id[0]) + 1
                    var side2 = letters.indexOf(parent.id[0]) - 1
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
            var side1 = letters.indexOf(parent.id[0]) + 1
            var side2 = letters.indexOf(parent.id[0]) - 1
            if (side1 <= 7) {
                var lower_right = files_rev[side1] + ranks_rev[ranks[parent.id[1]] + 1]
                var kid = document.getElementById(lower_right).firstElementChild
                if (kid) {
                    offsets.push([1, 1])
                }
            }
            if (side2 >= 0) {
                var lower_left = files_rev[side2] + ranks_rev[ranks[parent.id[1]] + 1]
                var kid = document.getElementById(lower_left).firstElementChild
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
        var minutes = (Math.floor(time_white / 60)).toString()
        var seconds = (time_white % 60).toString()
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
            var progress = Math.floor(time_white/6)
            document.querySelector('#white-timer-progress').style.width = progress+'%'
        }
    }
    else {
        --time_black
        var minutes = (Math.floor(time_black / 60)).toString()
        var seconds = (time_black % 60).toString()
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
            var progress = Math.floor(time_black/6)
            document.querySelector('#black-timer-progress').style.width = progress+'%'
        }
    }
}

function flip() {
    const element = document.getElementById('flip-button');
    element.classList.remove('flipper');
    void element.offsetWidth;
    element.classList.add('flipper');
    setTimeout(function() {
        element.classList.remove('flipper');
    }, 400)
    var ranks_div = document.getElementById('ranks')
    if (!ranks_div.className.includes('reverse')) {
        ranks_div.className = 'ranks-reverse'
        var black_timer_container = document.getElementById('top-timer-container')
        var white_timer_container = document.getElementById('bottom-timer-container')
        var black_timer = document.getElementById('timer-black')
        var white_timer = document.getElementById('timer-white')
        var black_timer_progress = document.getElementById('black-timer-progress')
        var white_timer_progress = document.getElementById('white-timer-progress')
        black_timer_container.removeChild(black_timer)
        black_timer_container.removeChild(black_timer_progress)
        white_timer_container.removeChild(white_timer)
        white_timer_container.removeChild(white_timer_progress)
        white_timer_container.appendChild(black_timer)
        white_timer_container.appendChild(black_timer_progress)
        black_timer_container.appendChild(white_timer)
        black_timer_container.appendChild(white_timer_progress)
        var temp = window.getComputedStyle(white_timer_container, null)['background']
        white_timer_container.style.background = window.getComputedStyle(black_timer_container, null)['background']
        black_timer_container.style.background = temp
        var temp = window.getComputedStyle(white_timer_container, null)['background']
        white_timer_container.style.background = window.getComputedStyle(black_timer_container, null)['background']
        black_timer_container.style.background = temp
        var temp = window.getComputedStyle(white_timer_container, null)['background-color']
        white_timer_container.style.backgroundColor = window.getComputedStyle(black_timer_container, null)['background-color']
        black_timer_container.style.backgroundColor = temp
    }
    else {
        ranks_div.className = 'ranks'
        var black_timer_container = document.querySelector('#top-timer-container')
        var white_timer_container = document.querySelector('#bottom-timer-container')
        var black_timer = document.querySelector('#timer-black')
        var white_timer = document.querySelector('#timer-white')
        var black_timer_progress = document.querySelector('#black-timer-progress')
        var white_timer_progress = document.querySelector('#white-timer-progress')
        black_timer_container.removeChild(white_timer)
        black_timer_container.removeChild(white_timer_progress)
        white_timer_container.removeChild(black_timer)
        white_timer_container.removeChild(black_timer_progress)
        white_timer_container.appendChild(white_timer)
        white_timer_container.appendChild(white_timer_progress)
        black_timer_container.appendChild(black_timer)
        black_timer_container.appendChild(black_timer_progress)
        var temp = window.getComputedStyle(white_timer_container, null)['background']
        white_timer_container.style.background = window.getComputedStyle(black_timer_container, null)['background']
        black_timer_container.style.background = temp
        var temp = window.getComputedStyle(white_timer_container, null)['background']
        white_timer_container.style.background = window.getComputedStyle(black_timer_container, null)['background']
        black_timer_container.style.background = temp
        var temp = window.getComputedStyle(white_timer_container, null)['background-color']
        white_timer_container.style.backgroundColor = window.getComputedStyle(black_timer_container, null)['background-color']
        black_timer_container.style.backgroundColor = temp
    }
    if (ranks_div.firstElementChild.className === 'files') {
        var files_div = document.querySelectorAll('.files')
        files_div.forEach(function(e) { e.className = 'files-reverse'})
    }
    else {
        var files_div = document.querySelectorAll('.files-reverse')
        files_div.forEach(function(e) { e.className = 'files'})
    }

    var ranks_coord = document.getElementById('coordinates-container-ranks')
    if (ranks_coord.className.includes('reverse')) {
        ranks_coord.className = 'coordinates-container-ranks'
    }
    else {
        ranks_coord.className = 'coordinates-container-ranks-reverse'
    }
    var files_coord = document.getElementById('coordinates-container-files')
    if (files_coord.className.includes('reverse')) {
        files_coord.className = 'coordinates-container-files'
    }
    else {
        files_coord.className = 'coordinates-container-files-reverse'
    }
}

function changePieceStyle(id) {
    pieceStyle = id
    var lichess = document.getElementById('lichess')
    var chesscom = document.getElementById('chesscom')
    const pieces = document.querySelectorAll('img')
    pieces.forEach(function(e) {
        if (id === 'lichess') {
            if (e.src.includes('-alt')) {
                var img = e.src.indexOf('-alt')
                e.src = e.src.slice(0,img) + '.png'
            }
        }
        else if (id === 'chesscom') {
            if (!e.src.includes('-alt')) {
                var img = e.src.indexOf('.png')
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
