(() => {
  $eventBus.on(EVENT_LABELS_UPDATED, renderLabelOptions)

  renderLabelOptions()
  addEmailForm()
  addPhoneForm()
  initEvents()
  renderLabelDatalists()

  document.getElementById('add-email-form').addEventListener('click', addEmailForm)
  document.getElementById('add-phone-form').addEventListener('click', addPhoneForm)
  document.getElementById('add-address-form').addEventListener('click', addAddressForm)
  document.getElementById('new-contact-form').addEventListener('submit', submitForm)

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

  function addEmailForm() {
    const formContainerElement = document.getElementById('emails-form-container')
    const id = Date.now()

    formContainerElement.insertAdjacentHTML('beforeend', /* html */`
      <div class="email-form grid grid-cols-6">
        <div class="col-span-5 flex flex-col sm:flex-row gap-4">
          <div class="grow bg-white rounded-lg text-left">
            <div class="relative bg-inherit">
              <input
                type="email"
                id="emails[${id}][mail]"
                name="emails[${id}][mail]"
                class="peer bg-transparent h-10 w-full rounded-sm placeholder-transparent ring-1 focus:ring-2 px-2 ring-gray-500 focus:ring-blue-600 focus:outline-none focus:border-rose-600"
                placeholder="Type inside me"
              />
              <label
                for="emails[${id}][mail]"
                class="absolute cursor-text left-0 -top-3 text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-blue-600 transition-all"
              >
                Email
              </label>
            </div>
          </div>
          <div class="bg-white rounded-lg text-left">
            <div class="relative bg-inherit">
              <input
                type="text"
                id="emails[${id}][label]"
                name="emails[${id}][label]"
                list="default-labels-list"
                class="peer bg-transparent h-10 w-full rounded-sm placeholder-transparent ring-1 focus:ring-2 px-2 ring-gray-500 focus:ring-blue-600 focus:outline-none focus:border-rose-600"
                placeholder="Type inside me"
              />
              <label
                for="emails[${id}][label]"
                class="absolute cursor-text left-0 -top-3 text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-blue-600 transition-all"
              >
                Label
              </label>
            </div>
          </div>
        </div>
        <div class="text-left ml-2">
          <button
            type="button"
            class="remove-email-form p-2 rounded-full hover:bg-gray-100"
            title="Remove"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-x"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M18 6l-12 12" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    `)

    formContainerElement.classList.remove('hidden')
    formContainerElement.classList.add('flex')
    document.getElementById('emails-form-icon').classList.remove('hidden')
  }

  function addPhoneForm() {
    const formContainerElement = document.getElementById('phones-form-container')
    const id = Date.now()

    formContainerElement.insertAdjacentHTML('beforeend', /* html */`
      <div class="phone-form grid grid-cols-6">
        <div class="col-span-5 flex flex-col sm:flex-row gap-4">
          <div class="grow bg-white rounded-lg text-left">
            <div class="relative bg-inherit">
              <input
                type="text"
                id="phones[${id}][number]"
                name="phones[${id}][number]"
                class="peer bg-transparent h-10 w-full rounded-sm placeholder-transparent ring-1 focus:ring-2 px-2 ring-gray-500 focus:ring-blue-600 focus:outline-none focus:border-rose-600"
                placeholder="Type inside me"
              />
              <label
                for="phones[${id}][number]"
                class="absolute cursor-text left-0 -top-3 text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-blue-600 transition-all"
              >
                Phone
              </label>
            </div>
          </div>
          <div class="bg-white rounded-lg text-left">
            <div class="relative bg-inherit">
              <input
                type="text"
                id="phones[${id}][label]"
                name="phones[${id}][label]"
                list="phone-labels-list"
                class="peer bg-transparent h-10 w-full rounded-sm placeholder-transparent ring-1 focus:ring-2 px-2 ring-gray-500 focus:ring-blue-600 focus:outline-none focus:border-rose-600"
                placeholder="Type inside me"
              />
              <label
                for="phones[${id}][label]"
                class="absolute cursor-text left-0 -top-3 text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-blue-600 transition-all"
              >
                Label
              </label>
            </div>
          </div>
        </div>
        <div class="text-left ml-2">
          <button
            type="button"
            class="remove-phone-form p-2 rounded-full hover:bg-gray-100"
            title="Remove"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-x"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M18 6l-12 12" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    `)

    formContainerElement.classList.remove('hidden')
    formContainerElement.classList.add('flex')
    document.getElementById('phones-form-icon').classList.remove('hidden')
  }

  function addAddressForm() {
    const id = Date.now()

    const formContainerElement = document.getElementById('addresses-form-container')
    formContainerElement.insertAdjacentHTML('beforeend', /* html */`
      <div class="address-form grid grid-cols-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon icon-tabler icons-tabler-outline icon-tabler-map-pin"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
          <path
            d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"
          />
        </svg>
        <div class="col-span-11 grid grid-cols-6">
          <div class="col-span-5 flex flex-col gap-4">
            <div class="bg-white rounded-lg text-left">
              <div class="relative bg-inherit">
                <select
                  id="addresses[${id}][country]"
                  name="addresses[${id}][country]"
                  class="peer bg-transparent h-10 w-full rounded-sm placeholder-transparent ring-1 focus:ring-2 px-2 ring-gray-500 focus:ring-blue-600 focus:outline-none focus:border-rose-600"
                >
                  ${window.COUNTRIES.map(country => `<option value="${country}">${country}</option>`).join('')}
                </select>
                <label
                  for="addresses[${id}][country]"
                  class="absolute cursor-text left-0 -top-3 text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-blue-600 transition-all"
                >
                  Country / Region
                </label>
              </div>
            </div>
            <div class="bg-white rounded-lg text-left">
              <div class="relative bg-inherit">
                <input
                  type="text"
                  id="addresses[${id}][street]"
                  name="addresses[${id}][street]"
                  class="peer bg-transparent h-10 w-full rounded-sm placeholder-transparent ring-1 focus:ring-2 px-2 ring-gray-500 focus:ring-blue-600 focus:outline-none focus:border-rose-600"
                  placeholder="Type inside me"
                />
                <label
                  for="addresses[${id}][street]"
                  class="absolute cursor-text left-0 -top-3 text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-blue-600 transition-all"
                >
                  Street address
                </label>
              </div>
            </div>
            <div class="bg-white rounded-lg text-left">
              <div class="relative bg-inherit">
                <input
                  type="text"
                  id="addresses[${id}][city]"
                  name="addresses[${id}][city]"
                  class="peer bg-transparent h-10 w-full rounded-sm placeholder-transparent ring-1 focus:ring-2 px-2 ring-gray-500 focus:ring-blue-600 focus:outline-none focus:border-rose-600"
                  placeholder="Type inside me"
                />
                <label
                  for="addresses[${id}][city]"
                  class="absolute cursor-text left-0 -top-3 text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-blue-600 transition-all"
                >
                  City
                </label>
              </div>
            </div>
            <div class="bg-white rounded-lg text-left">
              <div class="relative bg-inherit">
                <input
                  type="text"
                  id="addresses[${id}][postalCode]"
                  name="addresses[${id}][postalCode]"
                  class="peer bg-transparent h-10 w-full rounded-sm placeholder-transparent ring-1 focus:ring-2 px-2 ring-gray-500 focus:ring-blue-600 focus:outline-none focus:border-rose-600"
                  placeholder="Type inside me"
                  pattern="[0-9]{5}"
                />
                <label
                  for="addresses[${id}][postalCode]"
                  class="absolute cursor-text left-0 -top-3 text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-blue-600 transition-all"
                >
                  Postal code
                </label>
              </div>
            </div>
            <div class="bg-white rounded-lg text-left">
              <div class="relative bg-inherit">
                <input
                  type="text"
                  id="addresses[${id}][label]"
                  name="addresses[${id}][label]"
                  list="default-labels-list"
                  class="peer bg-transparent h-10 w-full rounded-sm placeholder-transparent ring-1 focus:ring-2 px-2 ring-gray-500 focus:ring-blue-600 focus:outline-none focus:border-rose-600"
                  placeholder="Type inside me"
                />
                <label
                  for="addresses[${id}][label]"
                  class="absolute cursor-text left-0 -top-3 text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-blue-600 transition-all"
                >
                  Label
                </label>
              </div>
            </div>
          </div>
          <div class="text-left ml-2">
            <button
              type="button"
              class="remove-address-form p-2 rounded-full hover:bg-gray-100"
              title="Remove"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-x"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M18 6l-12 12" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    `)

    formContainerElement.classList.remove('hidden')
    formContainerElement.classList.add('flex')
  }

  function initEvents() {
    ['emails-form-container', 'phones-form-container', 'addresses-form-container'].forEach((section) => {
      document.getElementById(section).addEventListener('click', (event) => {
        const removeEmailButton = event.target.closest('.remove-email-form')
        if (removeEmailButton) {
          removeEmailButton.closest('.email-form').remove()

          const formContainerElement = document.getElementById(section)

          if (!formContainerElement.children.length) {
            formContainerElement.classList.add('hidden')
            formContainerElement.classList.remove('flex')
            document.getElementById('emails-form-icon').classList.add('hidden')
          }

          return
        }

        const removePhoneButton = event.target.closest('.remove-phone-form')
        if (removePhoneButton) {
          removePhoneButton.closest('.phone-form').remove()

          const formContainerElement = document.getElementById(section)

          if (!formContainerElement.children.length) {
            formContainerElement.classList.add('hidden')
            formContainerElement.classList.remove('flex')
            document.getElementById('phones-form-icon').classList.add('hidden')
          }

          return
        }

        const removeAddressButton = event.target.closest('.remove-address-form')
        if (removeAddressButton) {
          removeAddressButton.closest('.address-form').remove()

          const formContainerElement = document.getElementById(section)

          if (!formContainerElement.children.length) {
            formContainerElement.classList.add('hidden')
            formContainerElement.classList.remove('flex')
          }
        }
      })
    })
  }

  function submitForm(event) {
    event.preventDefault()

    const contactModel = new Contact()
    const form = new FormData(event.target)

    let emails = {}
    let phones = {}
    let addresses = {}
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

    emails = Object.values(emails).filter(email => email.mail)
    phones = Object.values(phones).filter(phone => phone.number)
    addresses = Object.values(addresses).filter(address => address.country || address.city || address.postalCode || address.street)

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
    window.location.href = `/person/?id=${contact.id}`
  }

  function renderLabelDatalists() {
    document.body.insertAdjacentHTML('beforeend', /* html */`
      <datalist id="default-labels-list">
        ${window.DEFAULT_LABELS_LIST.map(label => `<option value="${label}"></option>`).join('')}
      </datalist>
      <datalist id="phone-labels-list">
        ${window.PHONE_LABELS_LIST.map(label => `<option value="${label}"></option>`).join('')}
      </datalist>
    `)
  }
})()
