(() => {
  $eventBus.on(EVENT_LABELS_UPDATED, renderLabels)

  const navToggleEl = document.getElementById('nav-toggle')
  const navEl = document.getElementById('nav')

  if (window.innerWidth < 1280) {
    toggle()
  }

  navToggleEl.addEventListener('click', toggle)
  renderContactsCounter()
  renderLabels()
  initCreateLabelsModal()
  initRenameLabelsModal()
  initDeleteLabelsModal()

  function toggle() {
    navEl.classList.toggle('nav-closed')
    navEl.classList.toggle('nav-open')
  }

  function renderContactsCounter() {
    document.getElementById('nav-contacts-count').textContent = (new Contact()).index().length
  }

  function renderLabels() {
    document.getElementById('nav-labels').innerHTML = (new Label())
      .indexWithTotalContacts()
      .map(label => /* html */ `
        <a
          href="/label/?id=${label.id}"
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
                class="rename-label-button rounded-full hover:bg-gray-300 p-3"
                title="Rename label"
                data-id="${label.id}"
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
                class="delete-label-button rounded-full hover:bg-gray-300 p-3"
                title="Delete label"
                data-id="${label.id}"
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
            <small class="group-hover:hidden mr-5">${label.totalContacts}</small>
          </div>
        </a>
      `)
      .join('')
  }

  function initCreateLabelsModal() {
    const modal = document.getElementById('create-label-modal')

    document.getElementById('create-label-button').addEventListener('click', () => {
      modal.showModal()
    })

    document.getElementById('create-label-close-modal-button').addEventListener('click', () => {
      modal.close()
    })

    document.getElementById('create-label-form').addEventListener('submit', (event) => {
      event.preventDefault()
      const form = new FormData(event.target);

      (new Label()).store(form.get('name'))

      modal.close()
      event.target.reset()
      $eventBus.emit(EVENT_LABELS_UPDATED)
    })
  }

  function initRenameLabelsModal() {
    const modal = document.getElementById('rename-label-modal')

    document.getElementById('nav-labels').addEventListener('click', (event) => {
      const button = event.target.closest('.rename-label-button')

      if (button) {
        event.preventDefault()

        const label = (new Label()).show(button.dataset.id)
        document.getElementById('rename-label-id').value = label.id
        document.getElementById('rename-label-input').value = label.name

        modal.showModal()
      }
    })

    document.getElementById('rename-label-close-modal-button').addEventListener('click', () => {
      modal.close()
    })

    document.getElementById('rename-label-form').addEventListener('submit', (event) => {
      event.preventDefault()
      const form = new FormData(event.target);

      (new Label()).update(form.get('id'), form.get('name'))

      modal.close()
      event.target.reset()
      $eventBus.emit(EVENT_LABELS_UPDATED)
    })
  }

  function initDeleteLabelsModal() {
    const modal = document.getElementById('delete-label-modal')

    document.getElementById('nav-labels').addEventListener('click', (event) => {
      const button = event.target.closest('.delete-label-button')

      if (button) {
        event.preventDefault()

        const labelModel = new Label()
        const id = button.dataset.id
        const totalContacts = labelModel.totalContacts(id)

        if (!totalContacts) {
          labelModel.destroy(id)

          $eventBus.emit(EVENT_LABELS_UPDATED)
          return
        }

        document.getElementById('delete-label-contact-count').textContent = totalContacts
        document.getElementById('delete-label-id').value = id

        modal.showModal()
      }
    })

    document.getElementById('delete-label-close-modal-button').addEventListener('click', () => {
      modal.close()
    })

    document.getElementById('delete-label-form').addEventListener('submit', (event) => {
      event.preventDefault()
      const form = new FormData(event.target);

      (new Label()).destroy(form.get('id'), Number.parseInt(form.get('keep-contacts')) === 1)

      modal.close()
      event.target.reset()
      $eventBus.emit(EVENT_LABELS_UPDATED)
    })
  }
})()
