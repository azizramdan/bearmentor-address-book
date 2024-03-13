(() => {
  const contactModel = new Contact()
  let contacts = []
  let favorites = []

  refresh()

  function refresh() {
    contacts = contactModel.index()
    favorites = contacts.filter(contact => contact.is_favorite)
    renderCounter()
    renderFavoritesSection()
    renderContacts()

    document.querySelectorAll('.remove-from-favorites').forEach((button) => {
      button.addEventListener('click', (event) => {
        const id = event.currentTarget.dataset.id
        contactModel.removeFromFavorites(id)
        refresh()
      })
    })

    document.querySelectorAll('.add-to-favorites').forEach((button) => {
      button.addEventListener('click', (event) => {
        const id = event.currentTarget.dataset.id
        contactModel.addToFavorites(id)
        refresh()
      })
    })
  }

  function renderCounter() {
    document.getElementById('contacts-count').textContent = contacts.length
  }

  function renderFavoritesSection() {
    const favoritesSection = document.getElementById('favorites-section')

    if (favorites.length) {
      favoritesSection.classList.remove('hidden')

      renderFavoritesCount()
      renderFavorites()
    } else {
      favoritesSection.classList.add('hidden')
    }
  }

  function renderFavoritesCount() {
    document.getElementById('favorites-count').textContent = favorites.length
  }

  function renderFavorites() {
    let html = ''

    favorites.forEach((favorite) => {
      html += parseTemplate(favorite)
    })

    document.getElementById('favorites-container').innerHTML = html
  }

  function renderContacts() {
    let html = ''

    contacts.forEach((favorite) => {
      html += parseTemplate(favorite)
    })

    document.getElementById('contacts-container').innerHTML = html
  }

  function parseTemplate(contact) {
    const favoriteButton = parseFavoriteButton(contact)
    const labelsButton = parseLabelsButton(contact.labels)

    return /* html */ `
    <div class="group flex justify-between hover:cursor-pointer">
      <div
        class="grow pl-3 grid items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 hover:bg-sky-50 peer"
      >
        <div>${contact.first_name} ${contact.middle_name} ${contact.last_name}</div>
        <a
          href="mailto:${contact.emails[0]?.mail}"
          class="hidden sm:block w-fit hover:text-blue-600"
        >
          ${contact.emails[0]?.mail}
        </a>
        <div class="hidden md:block">${contact.phone_numbers[0]?.number}</div>
        <div class="hidden lg:block">${contact.job_title}, ${contact.company}</div>
        <div class="hidden xl:flex gap-1">${labelsButton}</div>
      </div>
      <div
        class="invisible group-hover:visible flex justify-end peer-hover:bg-sky-50 w-32"
      >
        ${favoriteButton}
        <button
          class="rounded-full hover:bg-gray-200 p-3"
          title="Edit content"
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
        </button>
        <button
          class="rounded-full hover:bg-gray-200 p-3"
          title="More actions"
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
            class="icon icon-tabler icons-tabler-outline icon-tabler-dots-vertical"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          </svg>
        </button>
      </div>
    </div>
    `
  }

  function parseFavoriteButton(contact) {
    return contact.is_favorite
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

  function parseLabelsButton(labels) {
    let html = ''

    labels.forEach((label) => {
      html += /* html */`
        <a
          href="#"
          class="rounded-lg border border-slate-300 px-3 py-2 hover:bg-slate-200"
        >
          ${label.name}
        </a>
      `
    })

    return html
  }
})()
