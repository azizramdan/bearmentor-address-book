(() => {
  const labels = [
    {
      id: 1,
      name: 'Personal',
    },
    {
      id: 2,
      name: 'Work',
    },
  ]

  const contacts = [
    {
      id: 1,

      labels: [
        {
          id: 1,
          name: 'Personal',
        },
      ],

      is_favorite: true,

      first_name: 'Aziz',
      middle_name: 'Ramdan',
      last_name: 'Kurniawan',

      company: 'ARLab',
      job_title: 'Software Engineer',

      emails: [
        {
          mail: 'aziz@arlab.dev',
          label: 'Work',
        },
      ],

      phone_numbers: [
        {
          number: '6281234567890',
          label: 'Personal',
        },
      ],

      addresses: [
        {
          country: 'Indonesia',
          city: 'Bandung',
          postal_code: '12345',
          street: 'Jl. Cihampelas',
          label: 'Home',
        },
      ],

      notes: '',

      created_at: 1710325745518,
      updated_at: 1710325745518,
      deleted_at: null,
    },
    {
      id: 2,

      labels: [
        {
          id: 2,
          name: 'Work',
        },
      ],

      is_favorite: false,

      first_name: 'Azizah',
      middle_name: 'Ramdani',
      last_name: 'Kurniawati',

      company: 'ARLab',
      job_title: 'Tech Writer',

      emails: [
        {
          mail: 'azizah@arlab.dev',
          label: 'Work',
        },
      ],

      phone_numbers: [
        {
          number: '6281234567890',
          label: 'Personal',
        },
      ],

      addresses: [
        {
          country: 'Indonesia',
          city: 'Bandung',
          postal_code: '12345',
          street: 'Jl. Cihampelas',
          label: 'Home',
        },
      ],

      notes: '',

      created_at: 1710325745518,
      updated_at: 1710325745518,
      deleted_at: null,
    },
  ]

  // set default values
  if (!localStorage.getItem('labels')) {
    localStorage.setItem('labels', JSON.stringify(labels))
  }
  if (!localStorage.getItem('contacts')) {
    localStorage.setItem('contacts', JSON.stringify(contacts))
  }
})()

class Label {
  #STORAGE_KEY = 'labels'

  #set(labels) {
    localStorage.setItem(this.#STORAGE_KEY, JSON.stringify(labels))
  }

  #get() {
    return JSON.parse(localStorage.getItem(this.#STORAGE_KEY))
  }

  index() {
    return this.#get()
  }

  update(id, data) {
    const labels = this.#get()
    const index = labels.findIndex(label => label.id === id)

    if (index !== -1) {
      labels[index] = data
      this.#set(labels)
    }
  }

  destroy(id, keepContacts = true) {
    const labels = this.#get()
    const index = labels.findIndex(label => label.id === id)

    if (index !== -1) {
      labels.splice(index, 1)
      this.#set(labels)

      if (keepContacts) {
        // TODO: remove label from contacts
      } else {
        // TODO: remove contacts with this label
      }
    }
  }
}

class Contact {
  #STORAGE_KEY = 'contacts'

  #set(contacts) {
    localStorage.setItem(this.#STORAGE_KEY, JSON.stringify(contacts))
  }

  #get() {
    return JSON.parse(localStorage.getItem(this.#STORAGE_KEY))
  }

  index() {
    return this.#get().filter(contact => !contact.deleted_at)
  }

  show(id) {
    return this.#get().find(contact => contact.id === id)
  }

  update(id, data) {
    const contacts = this.#get()
    const index = contacts.findIndex(contact => contact.id === id)

    if (index !== -1) {
      contacts[index] = data
      this.#set(contacts)
    }
  }

  destroy(id) {
    const contacts = this.#get()
    const index = contacts.findIndex(contact => contact.id === id)

    if (index !== -1) {
      contacts[index].deleted_at = Date.now()
      this.#set(contacts)
    }
  }

  restore() {
    const contacts = this.#get()
    const index = contacts.findIndex(contact => contact.id === id)

    if (index !== -1) {
      contacts[index].deleted_at = null
      this.#set(contacts)
    }
  }
}

window.Label = Label
window.Contact = Contact
