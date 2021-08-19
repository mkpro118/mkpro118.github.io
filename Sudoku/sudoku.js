class Square extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.style = `
        display: flex;
        justify-content: center;
        align-items: center;
        background: hsl(206, 55%, 11%);
        font-size: 1.9rem;
        height: 100%;
        width: 100%;
        z-index: 2000;
        `
        this.innerHTML = `
        <svg width="100%" height="100%" viewBox="0 0 100 100" style="position:relative;z-index:1100;">
            <circle cx="50" cy="50" r="40%" style="fill:hsl(208 40% 22%);position:absolute;z-index:1200;"/>
        </svg>
        `
    }
}

customElements.define('game-square', Square)

class SubGrid extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.style = `
        display: grid;
        grid-template-rows: 1fr 1fr 1fr;
        grid-template-columns: 1fr 1fr 1fr;
        z-index: 1000;
        grid-gap: 1.1%;
        height: 100%;
        width: 100%;
        position: relative;
        `
        for (let i = 1; i <= 9; i++) {
            this.appendChild(document.createElement('game-square'))
        }
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
            grid-gap: 0.5%;
            position: relative;
        `


        for (let i = 1; i <= 9; i++) {
            this.appendChild(document.createElement('sub-grid'))
        }
    }
}

customElements.define('sudoku-board', SudokuBoard)


class GameNumbers extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.style = `
        height: 100%;
        width: 100%;
        display: flex;

        `
    }
}

class GameTools extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.style = `
        height: 100%;
        width: 100%;
        display: flex;

        `
    }
}

customElements.define('game-numbers', GameNumbers)
customElements.define('game-tools', GameTools)
