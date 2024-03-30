(() => {
  $eventBus.on(EVENT_LABELS_UPDATED, renderLabels)
  $eventBus.on(EVENT_CONTACTS_UPDATED, () => {
    renderContactsCounter()
    renderLabels()
  })

  const navToggleElement = document.getElementById('nav-toggle')
  const navElement = document.getElementById('nav')

  if (window.innerWidth < 1280) {
    toggle()
  }

  navToggleElement.addEventListener('click', toggle)
  renderContactsCounter()
  renderLabels()
  renderLabelDialogs()
  initCreateLabelsModal()
  initRenameLabelsModal()
  initDeleteLabelsModal()

  function toggle() {
    navElement.classList.toggle('nav-closed')
    navElement.classList.toggle('nav-open')
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
    const modalElement = document.getElementById('create-label-modal')

    document.getElementById('create-label-button').addEventListener('click', () => {
      modalElement.showModal()
    })

    document.getElementById('create-label-close-modal-button').addEventListener('click', () => {
      modalElement.close()
    })

    document.getElementById('create-label-form').addEventListener('submit', (event) => {
      event.preventDefault()
      const form = new FormData(event.target);

      (new Label()).store(form.get('name'))

      modalElement.close()
      event.target.reset()
      $eventBus.emit(EVENT_LABELS_UPDATED)
    })
  }

  function initRenameLabelsModal() {
    const modalElement = document.getElementById('rename-label-modal')

    document.getElementById('nav-labels').addEventListener('click', (event) => {
      const button = event.target.closest('.rename-label-button')

      if (button) {
        event.preventDefault()

        const label = (new Label()).show(button.dataset.id)
        document.getElementById('rename-label-id').value = label.id
        document.getElementById('rename-label-input').value = label.name

        modalElement.showModal()
      }
    })

    document.getElementById('rename-label-close-modal-button').addEventListener('click', () => {
      modalElement.close()
    })

    document.getElementById('rename-label-form').addEventListener('submit', (event) => {
      event.preventDefault()
      const form = new FormData(event.target);

      (new Label()).update(form.get('id'), form.get('name'))

      modalElement.close()
      event.target.reset()
      $eventBus.emit(EVENT_LABELS_UPDATED)
    })
  }

  function initDeleteLabelsModal() {
    const modalElement = document.getElementById('delete-label-modal')

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

        modalElement.showModal()
      }
    })

    document.getElementById('delete-label-close-modal-button').addEventListener('click', () => {
      modalElement.close()
    })

    document.getElementById('delete-label-form').addEventListener('submit', (event) => {
      event.preventDefault()
      const form = new FormData(event.target);

      (new Label()).destroy(form.get('id'), Number.parseInt(form.get('keep-contacts')) === 1)

      modalElement.close()
      event.target.reset()
      $eventBus.emit(EVENT_LABELS_UPDATED)
    })
  }

  function renderLabelDialogs() {
    document.body.insertAdjacentHTML('beforeend', /* html */`
      <dialog
        id="create-label-modal"
        class="bg-white-50 p-8 rounded-3xl w-[27rem]"
      >
        <form id="create-label-form">
          <h1 class="text-3xl">Create label</h1>
          <input
            id="create-label-input"
            name="name"
            type="text"
            placeholder="New label"
            class="p-3 mt-4 w-full border border-gray-700 outline outline-0 focus:outline-1 focus:outline-blue-700 focus:ring-blue-700 focus:border-blue-700 rounded"
            required
          />
          <div class="flex justify-end gap-3 mt-12">
            <button
              type="button"
              id="create-label-close-modal-button"
              class="text-blue-700 hover:bg-blue-100 rounded-full p-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="text-blue-700 hover:bg-blue-100 rounded-full p-3"
            >
              Save
            </button>
          </div>
        </form>
      </dialog>
      <dialog
        id="rename-label-modal"
        class="bg-white-50 p-8 rounded-3xl w-[27rem]"
      >
        <form id="rename-label-form">
          <h1 class="text-3xl">Rename label</h1>
          <input id="rename-label-id" name="id" type="hidden" required />
          <input
            id="rename-label-input"
            name="name"
            type="text"
            placeholder="New label"
            class="p-3 mt-4 w-full border border-gray-700 outline outline-0 focus:outline-1 focus:outline-blue-700 focus:ring-blue-700 focus:border-blue-700 rounded"
            required
          />
          <div class="flex justify-end gap-3 mt-12">
            <button
              type="button"
              id="rename-label-close-modal-button"
              class="text-blue-700 hover:bg-blue-100 rounded-full p-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="text-blue-700 hover:bg-blue-100 rounded-full p-3"
            >
              Save
            </button>
          </div>
        </form>
      </dialog>
      <dialog
        id="delete-label-modal"
        class="bg-white-50 p-8 rounded-3xl w-[39rem]"
      >
        <form id="delete-label-form">
          <h1 class="text-3xl">Delete this label</h1>
          <div class="mt-5 text-gray-600">
            This label has <span id="delete-label-contact-count"></span> contact.
            Choose what to do with it.
          </div>
          <input id="delete-label-id" name="id" type="hidden" required />
          <div class="mt-7 pl-6">
            <div class="flex items-center mb-4">
              <input
                checked
                id="delete-label-keep-contacts"
                type="radio"
                value="1"
                name="keep-contacts"
                class="w-5 h-5"
              />
              <label
                for="delete-label-keep-contacts"
                class="ms-2 text-lg text-gray-800"
                >Keep all contacts and delete this label</label
              >
            </div>
            <div class="flex items-center">
              <input
                id="delete-label-delete-contacts"
                type="radio"
                value="0"
                name="keep-contacts"
                class="w-5 h-5"
              />
              <label
                for="delete-label-delete-contacts"
                class="ms-2 text-lg text-gray-800"
                >Delete all contacts and delete this label</label
              >
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-12">
            <button
              type="button"
              id="delete-label-close-modal-button"
              class="text-blue-700 hover:bg-blue-100 rounded-full p-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="text-blue-700 hover:bg-blue-100 rounded-full p-3"
            >
              Delete
            </button>
          </div>
        </form>
      </dialog>
    `)
  }
})()
