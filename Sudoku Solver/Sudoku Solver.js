(() => {
    const board = document.querySelector('section.board-container')
    for (let i = 0; i < 81; i ++) {
        let sq = document.createElement('div')
        sq.classList.add('square')
        sq.contentEditable = true
        sq.id = `${Math.floor(i / 9)}${i % 9}`
        board.appendChild(sq)
    }
})();


function read_board() {
    const board = []
    for (let i = 0; i < 9; i++) {
        board.push([])
        for (let j = 0; j < 9; j++) {
            let content = document.querySelector(`div[id="${i}${j}"]`).innerText.trim()
            if (content === '') {
                board[i].push(0)
                continue
            }
            content = parseInt(content)
            if (content == NaN || content < 1 || content > 9) {
                return false
            }


            board[i].push(content)
        }
    }

    return board
}

function set(iterable) {
    const s = new Set()
    for (const item of iterable) {
        s.add(item)
    }
    return s
}

function check_appearance(arr) {
    if (arr.length !== set(arr).size) {
        return false
    }

    if (arr.length == 9) {
        arr.sort()
        for (let i = 0; i < 9; i++) {
            if (arr[i] !== (i + 1)) {
                return false
            }
        }
    }

    return true
}

function validate(board) {
    for (let row of board) {
        row = row.filter(x => x !== 0)

        if (!check_appearance(row)) {
            console.log('row')
            return false
        }
    }

    for (let i = 0; i < 9; i++) {
        let col = []
        for (let j = 0; j < 9; j++) {
            col.push(board[j][i])
        }

        col = col.filter(x => x !== 0)

        if (!check_appearance(col)) {
            console.log('col')
            return false
        }
    }

    for (let i = 0; i < 9; i += 3) {
        for (let j = 0; j < 9; j += 3) {
            let sq = [
                ...board[i].slice(j, j + 3),
                ...board[i + 1].slice(j, j + 3),
                ...board[i + 2].slice(j, j + 3),
            ]

            sq = sq.filter(x => x !== 0)

            if (!check_appearance(sq)) {
                console.log('sq')
                return false
            }
        }
    }

    return true
}

function find_open_spot(board) {
    for (let i = 0; i < 9; i++)
        for (let j = 0; j < 9; j++)
            if (board[i][j] === 0)
                return [i, j]
    return null
}


function find_trial_values(board, row, col) {
    let no_no_list = board[row].filter(x => x !== 0)
    console.log('no_no_list', no_no_list);

    for (let i = 0; i < 9; i++) {
        if (board[i][col] !== 0) {
            no_no_list.push(board[i][col])
        }
    }
    console.log('no_no_list', no_no_list);

    const y = row - (row % 3)
    const x = col - (col % 3)

    sq = [
        ...board[y].slice(x, x + 3),
        ...board[y + 1].slice(x, x + 3),
        ...board[y + 2].slice(x, x + 3),
    ]

    no_no_list = [...sq.filter(x => x !== 0), ...no_no_list]

    console.log('no_no_list', no_no_list);

    no_no_list = set(no_no_list)

    const ret = []

    for (let i = 1; i < 10; i++) {
        if (!no_no_list.has(i)) {
            ret.push(i)
        }
    }

    return ret
}


function solve(board) {
    const spot = find_open_spot(board)

    if (spot === null) {
        return validate(board)
    }

    const trial_values = find_trial_values(board, spot[0], spot[1])

    if (trial_values.length === 0) {
        return false
    }

    for (const trial of trial_values) {
        board[spot[0]][spot[1]] = trial

        if (solve(board)) {
            return true
        }

        board[spot[0]][spot[1]] = 0
    }

    return false
}


async function display_solution(board) {
    function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          await sleep(50)
          document.querySelector(`div[id="${i}${j}"]`).innerText = board[i][j]
        }
    }
}


document.querySelector('.solve-btn').addEventListener('click', async event => {
    const board = read_board()
    if (!board) {
        alert('Sudoku boards have numbers 1-9 only.')
        return
    }

    console.log(board);

    if (!validate(board)) {
        alert('Both you and I know this is not a valid board.')
        return
    }

    const solved = solve(board)

    if (solved) {
        await display_solution(board)
    } else {
        alert("Sorry, I couldn't solve this board.")
    }
})
