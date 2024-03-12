const navToggleEl = document.getElementById('nav-toggle')
const navEl = document.getElementById('nav')

navToggleEl.addEventListener('click', () => {
  navEl.classList.toggle('nav-closed')
  navEl.classList.toggle('nav-open')
})
