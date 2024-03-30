(() => {
  $eventBus.on(EVENT_LABELS_UPDATED, refresh)
  $eventBus.on(EVENT_CONTACTS_UPDATED, refresh)

  const contactModel = new Contact()
  let contacts = []
  let favorites = []
  const deleteModalElement = document.getElementById('delete-contact-modal')

  refresh()
  initEvents()

  function refresh() {
    contacts = contactModel.index()
    favorites = contacts.filter(contact => contact.isFavorite)
    renderContactsCounter()
    renderFavoritesSection()
    renderContactsSection()
  }

  function initEvents() {
    ['favorites-section', 'contacts-section'].forEach((section) => {
      document.getElementById(section).addEventListener('click', (event) => {
        const removeFromFavoritesButton = event.target.closest('.remove-from-favorites')
        if (removeFromFavoritesButton) {
          contactModel.removeFromFavorites(removeFromFavoritesButton.dataset.id)
          $eventBus.emit(EVENT_CONTACTS_UPDATED)
          return
        }

        const addToFavoritesButton = event.target.closest('.add-to-favorites')
        if (addToFavoritesButton) {
          contactModel.addToFavorites(addToFavoritesButton.dataset.id)
          $eventBus.emit(EVENT_CONTACTS_UPDATED)
          return
        }

        const deleteButton = event.target.closest('.delete-contact')
        if (deleteButton) {
          const modalElement = document.getElementById('delete-contact-modal')
          document.getElementById('delete-contact-id').value = deleteButton.dataset.id

          modalElement.showModal()

          return
        }

        const contactItem = event.target.closest('.contact-item')
        if (contactItem) {
          window.location = `/person/?id=${contactItem.dataset.id}`
        }
      })
    })

    document.getElementById('delete-contact-close-modal-button').addEventListener('click', () => {
      deleteModalElement.close()
    })

    document.getElementById('delete-contact-form').addEventListener('submit', (event) => {
      event.preventDefault()
      const form = new FormData(event.target);

      (new Contact()).destroy(form.get('id'))

      deleteModalElement.close()
      event.target.reset()
      $eventBus.emit(EVENT_CONTACTS_UPDATED)
    })
  }

  function renderContactsCounter() {
    document.getElementById('contacts-count').textContent = contacts.length
  }

  function renderFavoritesSection() {
    const favoritesSection = document.getElementById('favorites-section')

    if (favorites.length) {
      favoritesSection.classList.remove('hidden')

      document.getElementById('favorites-count').textContent = favorites.length
      document.getElementById('favorites-container').innerHTML = favorites.map(favorite => parseContactTemplate(favorite)).join('')
    } else {
      favoritesSection.classList.add('hidden')
    }
  }

  function renderContactsSection() {
    document.getElementById('contacts-container').innerHTML = contacts.map(contact => parseContactTemplate(contact)).join('')
  }

  function parseContactTemplate(contact) {
    return /* html */ `
      <div class="contact-item group flex justify-between hover:cursor-pointer" data-id="${contact.id}">
        <div
          class="grow pl-3 grid items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 hover:bg-sky-50 peer"
        >
          <div>${contact.firstName} ${contact.middleName} ${contact.lastName}</div>
          <a
            onclick="event.stopPropagation()"
            href="mailto:${contact.emails[0]?.mail || ''}"
            class="hidden sm:block w-fit hover:text-blue-600"
          >
            ${contact.emails[0]?.mail || ''}
          </a>
          <div class="hidden md:block">${contact.phones[0]?.number || ''}</div>
          <div class="hidden lg:block">${contact.jobTitle ? `${contact.jobTitle},` : ''} ${contact.company}</div>
          <div class="hidden xl:flex gap-1">
            ${
              contact.labels.map(label => /* html */`
                <a
                  href="/label/?id=${label.id}"
                  onclick="event.stopPropagation()"
                  class="rounded-lg border border-slate-300 px-3 py-2 hover:bg-slate-200"
                >
                  ${label.name}
                </a>
              `).join('')
            }
          </div>
        </div>
        <div
          class="invisible group-hover:visible flex justify-end peer-hover:bg-sky-50 w-32"
        >
          ${
            contact.isFavorite
              ? /* html */`
                <button
                  class="remove-from-favorites rounded-full hover:bg-gray-200 p-3"
                  title="Remove from favorites"
                  data-id="${contact.id}"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="icon icon-tabler icons-tabler-filled icon-tabler-star text-blue-700"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"
                    />
                  </svg>
                </button>
              `
              : /* html */`
                <button
                  class="add-to-favorites rounded-full hover:bg-gray-200 p-3"
                  title="Add to favorites"
                  data-id="${contact.id}"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon icon-tabler icons-tabler-outline icon-tabler-star"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"
                    />
                  </svg>
                </button>
            `
          }
          <a
            href="/person/edit/?id=${contact.id}"
            onclick="event.stopPropagation()"
            class="rounded-full hover:bg-gray-200 p-3"
            title="Edit contact"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
          </a>
          <button
            class="delete-contact rounded-full hover:bg-gray-200 p-3"
            title="Delete contact"
            data-id="${contact.id}"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
              <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
              <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
            </svg>
          </button>
        </div>
      </div>
      `
  }
})()
