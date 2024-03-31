(() => {
  const contactModel = new Contact()
  const id = new URLSearchParams(window.location.search).get('id')
  const currentContact = contactModel.show(id)

  if (!currentContact) {
    document.getElementById('main').innerHTML = /* html */`<div class="p-8 h-[88dvh]">Contact not found</div>`
    return
  }

  const deleteModalElement = document.getElementById('delete-contact-modal')

  initIsFavoriteEvent()
  initDeleteEvent()

  renderFullName()
  renderJobTitleCompany()
  renderLabels()
  renderEmails()
  renderPhones()
  renderAddresses()
  renderNotes()
  renderUpdatedAt()
  renderCreatedAt()

  document.getElementById('isFavorite').checked = currentContact.isFavorite
  document.getElementById('edit-button').setAttribute('href', `/person/edit/?id=${currentContact.id}`)

  function renderFullName() {
    document.getElementById('full-name').textContent = `${currentContact.firstName} ${currentContact.middleName} ${currentContact.lastName}`
  }

  function renderJobTitleCompany() {
    document.getElementById('job-title-company').textContent = `${currentContact.jobTitle} ${currentContact.jobTitle && currentContact.company ? '•' : ''} ${currentContact.company}`
  }

  function renderLabels() {
    document.getElementById('labels-container').innerHTML = currentContact.labels
      .map(label => /* html */`<a href="/label/?id=${label.id}" class="rounded-lg border border-slate-300 px-3 py-2 hover:bg-slate-200">${label.name}</a>`)
      .join('')
  }

  function renderEmails() {
    const containerElement = document.getElementById('emails-container')

    if (!currentContact.emails.length) {
      containerElement.innerHTML = parseEmptyItem('Add email')
      return
    }

    containerElement.innerHTML = currentContact.emails
      .map(email => /* html */`
        <li>
          <a
            href="mailto:${email.mail}"
            class="hover:text-blue-600"
          >
            ${email.mail}
          </a>
          ${email.label ? '•' : ''}
          <span class="text-gray-600 text-sm">${email.label}</span>
        </li>
      `)
      .join('')
  }

  function renderPhones() {
    const containerElement = document.getElementById('phones-container')

    if (!currentContact.phones.length) {
      containerElement.innerHTML = parseEmptyItem('Add phone number')
      return
    }

    containerElement.innerHTML = currentContact.phones
      .map(phone => /* html */`
        <li>
          <a
            href="tel:${phone.number}"
            class="hover:text-blue-600"
          >
            ${phone.number}
          </a>
          ${phone.label ? '•' : ''}
          <span class="text-gray-600 text-sm">${phone.label}</span>
        </li>
      `)
      .join('')
  }

  function renderAddresses() {
    if (!currentContact.addresses.length) {
      document.getElementById('addresses-section').classList.add('hidden')
      return
    }

    document.getElementById('addresses-container').innerHTML = currentContact.addresses
      .map(address => /* html */`
        <li>
          <a
            href="https://maps.google.com/maps?q=${address.street}+${address.city}+${address.postalCode}+${address.country}&hl=en&authuser=0"
            target="_blank"
            class="hover:text-blue-600"
          >
            ${address.street} <br>
            ${address.city} ${address.postalCode} <br>
            ${address.country}
          </a>
          ${address.label ? '•' : ''}
          <span class="text-gray-600 text-sm">${address.label}</span>
        </li>
      `)
      .join('')
  }

  function renderNotes() {
    if (!currentContact.notes) {
      document.getElementById('notes-section').classList.add('hidden')
      return
    }

    document.getElementById('notes-container').textContent = currentContact.notes
  }

  function renderUpdatedAt() {
    document.getElementById('updated-at-container').textContent = new Date(currentContact.updatedAt).toLocaleString()
  }

  function renderCreatedAt() {
    document.getElementById('created-at-container').textContent = new Date(currentContact.createdAt).toLocaleString()
  }

  function initIsFavoriteEvent() {
    document.getElementById('isFavorite').addEventListener('change', (event) => {
      if (event.target.checked) {
        contactModel.addToFavorites(currentContact.id)
      } else {
        contactModel.removeFromFavorites(currentContact.id)
      }
    })
  }

  function initDeleteEvent() {
    document.getElementById('delete-button').addEventListener('click', () => {
      deleteModalElement.showModal()
    })

    document.getElementById('delete-contact-close-modal-button').addEventListener('click', () => {
      deleteModalElement.close()
    })

    document.getElementById('delete-contact-form').addEventListener('submit', (event) => {
      event.preventDefault()
      contactModel.destroy(currentContact.id)

      deleteModalElement.close()
      $eventBus.emit(EVENT_CONTACTS_UPDATED)

      window.location = '/'
    })
  }

  function parseEmptyItem(text) {
    return /* html */`
      <li>
        <a
          href="/person/edit/?id=${currentContact.id}"
          class="text-blue-600"
        >
          ${text}
        </a>
      </li>`
  }
})()
