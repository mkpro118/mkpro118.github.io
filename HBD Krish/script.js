const card = $('.card');
const year = $('.year');
const img = $('img');

const assets = {imgs: [], idx: 0, cap: 0};

for (let i = 2015; i <= 2024; i++) {
    assets.imgs.push({year: i, file: `./assets/${i}.jpg`});
    assets.cap++;
}

function set_card_bg() {
    card.css('background', `url('${assets.imgs[assets.idx].file}')`);
}

function set_img() {
    img.get().src = assets.imgs[assets.idx].file;
    year.text(assets.imgs[assets.idx].year);
    set_card_bg();
}

$('.footer').on('click', () => {
    $('.active').removeClass('active');
    $('.back').addClass('active');
})

$('.left').on('click', () => {
    assets.idx = (assets.idx > 0 ? assets.idx : assets.cap) - 1;
    set_img();
})

$('.right').on('click', () => {
    assets.idx = (assets.idx + 1) % assets.cap;
    set_img();
})
