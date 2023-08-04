const grid_size = 28
const total_pixels = grid_size ** 2

const dark_colors = []
const light_colors = []

let last_cell = undefined

for (let i = 0; i < 5; i++) {
    dark_colors.push(`#${i}${i}${i}`)
}

for (let i = 5; i < 8; i++) {
    light_colors.push(`#${i}${i}${i}`)
}


function randint(low, high) {
    const low_ = Math.floor(Math.max(low, high))
    const high_ = Math.floor(Math.min(low, high))

    return Math.floor(Math.random() * (high_ - low_)) + low_;
}


function get_surrounding(cell) {
    if (cell == null || cell == undefined) {
        console.error(`Invalid argument (cell=${cell})`)
        return []
    }

    if (!cell.attr('loc')) {
        console.error(`Invalid argument (cell=${cell})`)
        return []
    }

    const loc = cell.attr('loc')

    const sp = loc.split('-')

    const i = parseInt(sp[0])
    const j = parseInt(sp[1])

    const neighbors = []

    for (let x = i - 1; x <= i + 1; x++) {
        for (let y = j - 1; y <= j + 1; y++) {
            if (x >= 0 && x < grid_size && y >= 0 && y < grid_size && !(x === i && y === j)) {
                const neighbor = $(`div[data-loc='${x}-${y}']`)
                neighbors.push(neighbor.get());
            }
        }
    }

    return neighbors
}

function color(cell) {
    const rand = randint(0, 2);

    cell.css('background-color', dark_colors[rand])
    cell.attr('ncolored', 1 + parseInt(cell.attr('ncolored')))
    cell.attr('fullycolored')

    if (last_cell && last_cell.attr('loc') === cell.attr('loc')) {
        return
    }

    last_cell = cell

    for (const neighbor of get_surrounding(cell)) {
        if (randint(0, 10) < 7.5) continue

        if (neighbor.dataset.fullycolored) continue
        let idx = parseInt(neighbor.dataset.ncolored)

        if (idx === 0) {
            neighbor.style.backgroundColor = light_colors[randint(0, light_colors.length)]
        } else {
            let rand = randint(0, Math.max(0, dark_colors.length - idx))
            neighbor.style.backgroundColor = dark_colors[rand]
            if ((rand === 0) || (rand === 1)) {
                neighbor.dataset.fullycolored = true
            }
        }

        neighbor.dataset.ncolored = `${idx + 1}`
    }
}

function reset_cell(cell) {
    cell.attr('ncolored', '0')
    cell.css('background-color', '#FFF')
}

function clear_grid() {
    for (const cell of $('div[data-loc]')) {
        reset_cell(cell)
    }
}


function get_feature_vector() {
    const feature_vector = Array.from({length: total_pixels});

    const pixels = $('div[data-loc]')

    if (pixels.length !== feature_vector.length) {
        throw "# pixels != 784"
    }

    for (const pixel of pixels) {
        const loc = pixel.attr('loc').split('-')
        const i = parseInt(loc[0])
        const j = parseInt(loc[1])

        let col = pixel.css().backgroundColor
        col = col.split(',')

        col = parseInt(col[1])

        feature_vector[i * grid_size + j] = 255 - col
    }

    return feature_vector
}

function classify() {
    const feature_vector = get_feature_vector()

    prediction = model.predict(feature_vector)

    $('div[data-name="prediction"]').text(`${prediction}`)
}

document.addEventListener("DOMContentLoaded", () => {
    const drawingGrid = $(".grid")

    // Create the cells in the grid
    for (let i = 0; i < grid_size; i++) {
        for (let j = 0; j < grid_size; j++) {
            const cell = $("<div>")
            cell.attr('loc', `${i}-${j}`)
            reset_cell(cell)
            drawingGrid.append(cell)
        }
    }

    let isDrawing = false

    // Add event listeners to draw on the grid
    drawingGrid.on("mousedown", () => { isDrawing = true })

    drawingGrid.on("mouseup", () => { isDrawing = false })

    drawingGrid.on("mouseleave", () => { isDrawing = false })

    drawingGrid.on("mousemove", (event) => {
        if (isDrawing) {
            const cell = event.target
            color($(cell))
        }
    })

    // Prevent default touch actions for mobile devices
    drawingGrid.on("touchstart", (event) => {
        event.preventDefault()
        isDrawing = true
    })

    drawingGrid.on("touchend", (event) => {
        event.preventDefault()
        isDrawing = false
    })

    drawingGrid.on("touchcancel", (event) => {
        event.preventDefault()
        isDrawing = false
    })

    drawingGrid.on("touchmove", (event) => {
        event.preventDefault()
        if (isDrawing) {
            const touch = event.touches[0]
            const cell = document.elementFromPoint(touch.clientX, touch.clientY)
            color($(cell))
        }
    })

    $('[data-name="clear-grid"]').on('click', clear_grid)
    $('[data-name="classify"]').on('click', classify)
})
