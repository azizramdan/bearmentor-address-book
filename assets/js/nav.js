const navToggleEl = document.getElementById('nav-toggle')
const navEl = document.getElementById('nav')

if (window.innerWidth < 1280) {
  toggle()
}

navToggleEl.addEventListener('click', toggle)

function toggle() {
  navEl.classList.toggle('nav-closed')
  navEl.classList.toggle('nav-open')
}
