(() => {

    const scrollTop = () => {
        $('section[data-detail]').each(e => {
            e.get().scrollTop = 0
        })
    }

    const ANIMATION_DURATION = 400
    let delay = 0
    $('ul.apollo-stats > li').each(e => {
        e.css('--stats-animation-duration', `${ANIMATION_DURATION}ms`)
        e.css('--stats-animation-delay', `${delay}ms`)
        delay += ANIMATION_DURATION
    })
    $('ul.apollo-stats > li').addClass('active')

    $('section[data-feature]').each(e => {
        e.on('click', (event) => {
            $('section[data-role="darken-bg"]').addClass('active')
            const feature = e.attr('feature')
            $(`section[data-detail="${feature}"]`).addClass('active')
        })
    })

    $('button.references-btn').on('click', event => {
        $('section[data-role="darken-bg"]').addClass('active')
        $(`section[data-references]`).addClass('active')
    })

    $('button.close-delphi-temple').on('click', event => {
        scrollTop()
        $('section[data-detail="delphi-temple"]').removeClass('active')
        $('section[data-role="darken-bg"]').removeClass('active')
    })

    $('button.close-myth-of-agamemnon').on('click', event => {
        scrollTop()
        $('section[data-detail="myth-of-agamemnon"]').removeClass('active')
        $('section[data-role="darken-bg"]').removeClass('active')
    })

    $('button.close-pythian-games').on('click', event => {
        scrollTop()
        $('section[data-detail="pythian-games"]').removeClass('active')
        $('section[data-role="darken-bg"]').removeClass('active')
    })

    $('button.close-references').on('click', event => {
            scrollTop()
        $('section[data-references]').removeClass('active')
        $('section[data-role="darken-bg"]').removeClass('active')
    })

    $(event => {
        console.log(event)
        if (event.key === 'Escape') {
            scrollTop()
            $('section[data-role="darken-bg"]').removeClass('active')
            $('section[data-detail]').removeClass('active')
            $('section[data-references]').removeClass('active')
        }
    }, {on: 'keydown'})
})();
