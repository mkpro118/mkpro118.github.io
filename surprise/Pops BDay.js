// Random Number Generator
const getRandomNumber = (start, end) => Math.floor(Math.random() * (end - start + 1)) + start

// Sleep
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Shuffle
const shuffle = arr => arr.map(e => ({value: e, key: Math.random()}))
                          .sort((x,y) => x.key - y.key)
                          .map(({value}) => value)

const getImagesFolder = () => './images'
const getImageList = () => Array(21).fill('IMG').map((e, i) => `${e}${i+1}.jpg`)

const imageList = shuffle(getImageList())

// Greeting with confetti effect


function confetti() {
    const confetti_colors = ['red','yellow','blue','orange','purple','green','pink','lightgreen','lightblue',]
    for (let i = 0; i < 200; i++) {
        const isLeft = (i & 1) == 0

        const span = $('<span>')

        span.attr('role', 'confetti')

        const height = Math.floor(getRandomNumber(35, 45))
        span.css('height', `${height}px`)

        const width = Math.floor(getRandomNumber(7, 10))
        span.css('width', `${width}px`)

        const rotation = Math.floor(getRandomNumber(35, 55))
        const transform = `rotateZ(${isLeft ? rotation: -rotation}deg)`
        span.css('transform', transform)
        span.css('--rotate', transform)

        const background = confetti_colors[getRandomNumber(0, confetti_colors.length - 1)]
        span.css('background', background)



        const top = getRandomNumber(65, 125)
        span.css('top', `${top}%`)

        const horizontal = 45
        span.css('--horizontal', isLeft ? 1 : -1)
        if (top < 100)
            span.css(isLeft ? 'left': 'right', `${-horizontal}px`)
        else
            span.css(isLeft ? 'left': 'right', isLeft ? `${getRandomNumber(50, 90)}px` : `${getRandomNumber(10, 50)}px`)

        span.appendTo($('main'))

        const distance = getRandomNumber(50, 300)
        span.css('--distance', `${isLeft ? distance : -distance}px`)

        const delay = getRandomNumber(400, 800)
        span.css('--delay', `${delay}ms`)
    }
    const _confetti =  $('span[data-role="confetti"]')
    _confetti.addClass('move-confetti')
    setTimeout(() => {
        _confetti.each(e => e.get().remove())
    }, 5000)
}


function create_mask() {
    const span_array = []
    for (let i = 0; i < 6; i++) {
        const span_container = $('<div>')
        span_container.addClass('mask-container')
        span_container.appendTo($('span[data-role="mask"]'))
        if (i == 0 || i == 6) continue;
        for (let j = 0; j < 10; j++) {
            const span = $('<span>')
            span.appendTo(span_container)
            span_array.push(span)
        }
    }
    return span_array
}

async function destroy_mask(mask) {
    let size = mask.length - 1
    for (let i = 0; i < mask.length / 5; i++) {
        for (let j = 0; j < 5; j++) {
            const index = getRandomNumber(0, size)
            const rm = mask[index]
            mask[index] = mask[size]
            mask[size--] = null
            rm.css('background', 'transparent')
        }
        await(sleep(200))
    }
    $('span[data-role="mask"]').get().remove()
}

async function create_flipper() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTU'
    for(let e of $('div[data-role="flip-letter-container"]')) {
        let i = 0
        for (const letter of alphabet) {
            const span = $('<span>', {textContent: letter})

            const isFlipping = letter !== e.attr('letter')

            span.css('--delay', `${i++ * 400}ms`)
            span.appendTo(e)

            if (isFlipping) {
                span.addClass('flipping-letter')
            }
            else {
                span.addClass('retained-letter')
                break
            }
        }
        await sleep(100)
    }
}

function destroy_flipper() {
    $('.flipping-letter').each(e => e.get().remove())
}

function create_images() {

    const root = getImagesFolder()
    for(const imageName of imageList) {
        const src = `${root}/${imageName}`
        const img = $('<img>', {src, alt:'Pops'})
        img.appendTo($('section[data-role="images"]'))
        img.attr('role', 'image')
        img.attr('url', src)
        img.attr('name', imageName)
    }
}

function leftTap(event) {
    const element = $('img[data-role="image"].active')
    const imageName = element.attr('name')
    const imageIndex = imageList.indexOf(imageName)
    const newImageIndex = imageIndex !== 0 ? (imageIndex - 1) : imageList.length - 1
    const newName = imageList[newImageIndex]
    element.removeClass('active')
    const newImage = $(`img[data-name="${newName}"]`)
    newImage.addClass('active')
    $('section[data-role="images"]').css('--bg-url', `url("${newImage.attr('url')}")`)
}

function rightTap(event) {
    const element = $('img[data-role="image"].active')
    const imageName = element.attr('name')
    const imageIndex = imageList.indexOf(imageName)
    const newImageIndex = (imageIndex + 1) % imageList.length
    const newName = imageList[newImageIndex]
    element.removeClass('active')
    const newImage = $(`img[data-name="${newName}"]`)
    newImage.addClass('active')
    $('section[data-role="images"]').css('--bg-url', `url("${newImage.attr('url')}")`)
}

$(() => {
    const mask = create_mask()
    setTimeout(() => {
        destroy_mask(mask)
    }, 1000)
    setTimeout(create_flipper, 2000)
    setTimeout(() => {
        confetti()
        destroy_flipper()
    }, 9500)

    create_images()

    $('div[data-role="navigate-left"]').on('click', leftTap)
    $('div[data-role="navigate-right"]').on('click', rightTap)

    $('button[data-role="next-btn"]').on("click", e => {
        $('section[data-role="photos"]').addClass('active')

        const first = $('img[data-role="image"]').first()
        first.addClass('active')
        $('section[data-role="images"]').css('--bg-url', `url("${first.attr('url')}")`)

        const banner = $('<span>', {textContent: 'Tap towards the left or right to view more images'})
        banner.css('position', 'absolute')
        banner.css('top', '5%')
        banner.css('left', '5%')
        banner.css('right', '5%')
        banner.css('background', 'hotpink')
        banner.css('color', 'black')
        banner.css('z-index', '20')
        banner.css('text-align', 'center')
        banner.css('padding', '5px')

        banner.appendTo($('main'))

        setTimeout(async () => {
            for (let i = 0.0; i < 1; i += 0.05) {
                banner.css('opacity', (1 - i))
                await sleep(100)
            }
            banner.get().remove()
        }, 2500)
    })
})
