(() => {
  const navToggleEl = document.getElementById('nav-toggle')
  const navEl = document.getElementById('nav')

  if (window.innerWidth < 1280) {
    toggle()
  }

  navToggleEl.addEventListener('click', toggle)
  renderContactsCount()

  function toggle() {
    navEl.classList.toggle('nav-closed')
    navEl.classList.toggle('nav-open')
  }

  function renderContactsCount() {
    document.getElementById('nav-contacts-count').textContent = (new Contact()).index().length
  }
})()
