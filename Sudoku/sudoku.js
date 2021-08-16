class SubGrid extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.style = `
        z-index: 1000;
        background: green;
        `
    }
}

customElements.define('sub-grid', SubGrid)

class SudokuBoard extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.style = `
            display: grid;
            grid-template-rows: 1fr 1fr 1fr;
            grid-template-columns: 1fr 1fr 1fr;
            height: 100%;
            width: 100%;
            grid-gap: 1.2%;
            position: relative;
        `


        for (let i = 1; i <= 9; i++) {
            this.appendChild(document.createElement('sub-grid'))
        }
    }
}



customElements.define('sudoku-board', SudokuBoard)

