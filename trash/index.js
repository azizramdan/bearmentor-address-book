(() => {
  $eventBus.on(EVENT_CONTACTS_UPDATED, refresh)

  const contactModel = new Contact()
  let contacts = []

  refresh()
  initEvents()

  function refresh() {
    const search = new URLSearchParams(window.location.search).get('search')
    document.getElementById('search-input').value = search

    contacts = contactModel.trashed({
      search,
    })
    renderContactCounter()
    renderContactsSection()
  }

  function renderContactCounter() {
    document.getElementById('contacts-count').textContent = contacts.length
  }

  function renderContactsSection() {
    document.getElementById('contacts-container').innerHTML = contacts.length
      ? contacts.map(contact => parseContactTemplate(contact)).join('')
      : 'No contacts in Trash'
  }

  function parseContactTemplate(contact) {
    return /* html */ `
      <div
        class="contact-item group flex justify-between hover:cursor-pointer"
        data-id="${contact.id}"
      >
        <div
          class="grow pl-3 grid items-center grid-cols-2 hover:bg-sky-50 peer"
        >
          <div>
            ${contact.firstName} ${contact.middleName}
            ${contact.lastName}
          </div>
          <div>${new Date(contact.deletedAt).toLocaleString()}</div>
        </div>
        <div
          class="hidden md:flex invisible group-hover:visible justify-end peer-hover:bg-sky-50 pr-3 w-32"
        >
          <button
            data-id="${contact.id}"
            class="recover-contact text-blue-700 font-medium py-3 px-4 rounded-full hover:bg-blue-400/10 ml-3"
          >
            Recover
          </button>
        </div>
      </div>
    `
  }

  function initEvents() {
    document.getElementById('contacts-container').addEventListener('click', (event) => {
      const recoverButton = event.target.closest('.recover-contact')
      if (recoverButton) {
        contactModel.recover(recoverButton.dataset.id)
        $eventBus.emit(EVENT_CONTACTS_UPDATED)
        return
      }

      const contactItem = event.target.closest('.contact-item')
      if (contactItem) {
        window.location = `/person/?id=${contactItem.dataset.id}&includeTrash=1`
      }
    })

    const emptyTrashModalElement = document.getElementById('empty-trash-modal')

    document.getElementById('empty-trash-button').addEventListener('click', () => {
      emptyTrashModalElement.showModal()
    })

    document.getElementById('empty-trash-close-modal-button').addEventListener('click', () => {
      emptyTrashModalElement.close()
    })

    document.getElementById('empty-trash-form').addEventListener('submit', (event) => {
      event.preventDefault()

      contactModel.destroyTrash()

      emptyTrashModalElement.close()
      event.target.reset()
      $eventBus.emit(EVENT_CONTACTS_UPDATED)
    })
  }
})()
