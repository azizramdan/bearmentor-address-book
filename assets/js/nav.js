(() => {
  const navToggleEl = document.getElementById('nav-toggle')
  const navEl = document.getElementById('nav')

  if (window.innerWidth < 1280) {
    toggle()
  }

  navToggleEl.addEventListener('click', toggle)
  renderContactsCount()
  renderLabels()

  function toggle() {
    navEl.classList.toggle('nav-closed')
    navEl.classList.toggle('nav-open')
  }

  function renderContactsCount() {
    document.getElementById('nav-contacts-count').textContent = (new Contact()).index().length
  }

  function renderLabels() {
    const labels = (new Label()).indexWithTotalContacts()

    html = ''

    labels.forEach((label) => {
      html += parseLabelMenu(label)
    })

    document.getElementById('nav-labels').innerHTML = html
  }

  function parseLabelMenu(label) {
    return /* html */ `
      <a
        href="#"
        class="flex items-center justify-between rounded-full hover:bg-slate-200 w-full py-1 pl-5 font-semibold group h-14"
      >
        <span class="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="icon icon-tabler icons-tabler-filled icon-tabler-bookmark rotate-90"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M14 2a5 5 0 0 1 5 5v14a1 1 0 0 1 -1.555 .832l-5.445 -3.63l-5.444 3.63a1 1 0 0 1 -1.55 -.72l-.006 -.112v-14a5 5 0 0 1 5 -5h4z"
            />
          </svg>
          ${label.name}
        </span>
        <div>
          <div class="hidden group-hover:flex">
            <button
              class="rounded-full hover:bg-gray-300 p-3"
              title="Rename label"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"
                />
                <path d="M13.5 6.5l4 4" />
              </svg>
            </button>
            <button
              class="rounded-full hover:bg-gray-300 p-3"
              title="Delete label"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-trash"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 7l16 0" />
                <path d="M10 11l0 6" />
                <path d="M14 11l0 6" />
                <path
                  d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"
                />
                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
              </svg>
            </button>
          </div>
          <small class="group-hover:hidden mr-5">${label.total_contacts}</small>
        </div>
      </a>
    `
  }
})()
