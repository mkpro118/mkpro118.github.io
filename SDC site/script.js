const home_section = document.querySelector('section.home')
const home_tab = document.querySelector('[data-tab="home"]')
const projects_section = document.querySelector('section.projects')
const projects_tab = document.querySelector('[data-tab="projects"]')
const about_section = document.querySelector('section.about')
const about_tab = document.querySelector('[data-tab="about"]')

document.querySelectorAll('.tabs-list > li').forEach(e => {
    console.log('yooo')
    e.addEventListener('click', function() {
        const active_section = this.dataset.tab
        console.log(active_section)
        home_section.classList.toggle('active-section', active_section === 'home')
        projects_section.classList.toggle('active-section', active_section === 'projects')
        about_section.classList.toggle('active-section', active_section === 'about')
        home_tab.classList.toggle('active-tab', home_tab === this)
        projects_tab.classList.toggle('active-tab', projects_tab === this)
        about_tab.classList.toggle('active-tab', about_tab === this)
    })
})
