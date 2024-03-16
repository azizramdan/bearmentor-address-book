/**
 * Seeder for labels and contacts
 * Reset seeder if version changes
 */
(() => {
  const VERSION = '0.0.1'

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

      labels: [1],

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

      labels: [2],

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
  if (!localStorage.getItem('labels') || localStorage.getItem('VERSION') !== VERSION) {
    localStorage.setItem('labels', JSON.stringify(labels))
  }
  if (!localStorage.getItem('contacts') || localStorage.getItem('VERSION') !== VERSION) {
    localStorage.setItem('contacts', JSON.stringify(contacts))
  }

  localStorage.setItem('VERSION', VERSION)
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

  indexWithTotalContacts() {
    const labels = this.#get()
    const contacts = (new Contact()).index()

    labels.forEach((label) => {
      label.total_contacts = contacts.filter(contact => contact.labels.map(label => label.id).includes(label.id)).length
    })

    return labels
  }

  store(name) {
    const labels = this.#get()
    const id = new Date().getTime()
    labels.push({ id, name })
    this.#set(labels)
  }

  show(id) {
    return this.#get().find(label => label.id === Number.parseInt(id))
  }

  update(id, name) {
    id = Number.parseInt(id)
    const labels = this.#get()
    const index = labels.findIndex(label => label.id === id)

    if (index !== -1) {
      labels[index] = {
        id,
        name,
      }
      this.#set(labels)
    }
  }

  destroy(id, keepContacts = true) {
    const labels = this.#get()
    const index = labels.findIndex(label => label.id === Number.parseInt(id))

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
    const contacts = this.#get().filter(contact => !contact.deleted_at)
    const labels = (new Label()).index()

    return contacts.map((contact) => {
      contact.labels = contact.labels.map((id) => {
        return {
          id,
          name: labels.find(label => label.id === id).name,
        }
      })

      return contact
    })
  }

  show(id) {
    return this.#get().find(contact => contact.id === Number.parseInt(id))
  }

  update(id, data) {
    const contacts = this.#get()
    const index = contacts.findIndex(contact => contact.id === Number.parseInt(id))

    if (index !== -1) {
      contacts[index] = data
      this.#set(contacts)
    }
  }

  destroy(id) {
    const contacts = this.#get()
    const index = contacts.findIndex(contact => contact.id === Number.parseInt(id))

    if (index !== -1) {
      contacts[index].deleted_at = Date.now()
      this.#set(contacts)
    }
  }

  restore() {
    const contacts = this.#get()
    const index = contacts.findIndex(contact => contact.id === Number.parseInt(id))

    if (index !== -1) {
      contacts[index].deleted_at = null
      this.#set(contacts)
    }
  }

  addToFavorites(id) {
    const contact = this.show(id)

    contact.is_favorite = true
    this.update(id, contact)
  }

  removeFromFavorites(id) {
    const contact = this.show(id)

    contact.is_favorite = false
    this.update(id, contact)
  }
}

window.Label = Label
window.Contact = Contact
