(() => {
  $eventBus.on(EVENT_LABELS_UPDATED, renderLabelOptions)

  renderLabelOptions()

  document.getElementById('new-contact-form').addEventListener('submit', (event) => {
    event.preventDefault()

    const contactModel = new Contact()
    const form = new FormData(event.target)

    let emails = []
    let phones = []
    let addresses = []
    const regex = /(\w+)\[(\d+)\]\[(\w+)\]/

    form.forEach((value, key) => {
      if (key.startsWith('emails') || key.startsWith('phones') || key.startsWith('addresses')) {
        const [_, name, index, item] = key.match(regex)

        switch (name) {
          case 'emails':
            if (!emails[index]) {
              emails[index] = {}
            }

            emails[index][item] = value
            break

          case 'phones':
            if (!phones[index]) {
              phones[index] = {}
            }

            phones[index][item] = value
            break

          case 'addresses':
            if (!addresses[index]) {
              addresses[index] = {}
            }

            addresses[index][item] = value
            break

          default:
            break
        }
      }
    })

    emails = emails.filter(email => email.mail)
    phones = phones.filter(phone => phone.number)
    addresses = addresses.filter(address => address.country || address.city || address.postalCode || address.street)

    const contact = contactModel.store({
      labels: form.getAll('labels[]').map(value => Number.parseInt(value)),

      isFavorite: form.get('isFavorite') === '1',

      firstName: form.get('firstName'),
      middleName: form.get('middleName'),
      lastName: form.get('lastName'),

      company: form.get('company'),
      jobTitle: form.get('jobTitle'),

      emails,
      phones,
      addresses,

      notes: form.get('notes'),
    })

    $eventBus.emit(EVENT_CONTACTS_UPDATED)
    alert('Contact created successfully')
    window.location.href = `/person/?id=${contact.id}`
  })

  function renderLabelOptions() {
    document.getElementById('label-options').innerHTML = (new Label())
      .index()
      .map(label => /* html */`
        <div>
          <input
            id="label-options-${label.id}"
            name="labels[]"
            type="checkbox"
            value="${label.id}"
            class="peer hidden"
          />
          <label
            for="label-options-${label.id}"
            class="block py-1 px-3 border border-gray-300 rounded-lg cursor-pointer peer-checked:bg-blue-200 peer-checked:border-blue-200"
          >
            ${label.name}
          </label>
        </div>
      `)
      .join('')
  }
})()
