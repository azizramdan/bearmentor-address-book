/**
 * Seeder for labels and contacts
 * Reset seeder if version changes
 */
(() => {
  const VERSION = '0.0.4'

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

      isFavorite: true,

      firstName: 'Aziz',
      middleName: 'Ramdan',
      lastName: 'Kurniawan',

      company: 'ARLab',
      jobTitle: 'Software Engineer',

      emails: [
        {
          mail: 'aziz@arlab.dev',
          label: 'Work',
        },
      ],

      phones: [
        {
          number: '6281234567890',
          label: 'Personal',
        },
      ],

      addresses: [
        {
          country: 'Indonesia',
          city: 'Bandung',
          postalCode: '12345',
          street: 'Jl. Cihampelas',
          label: 'Home',
        },
      ],

      notes: '',

      createdAt: 1710325745518,
      updatedAt: 1710325745518,
      deletedAt: null,
    },
    {
      id: 2,

      labels: [2],

      isFavorite: false,

      firstName: 'Azizah',
      middleName: 'Ramdani',
      lastName: 'Kurniawati',

      company: 'ARLab',
      jobTitle: 'Tech Writer',

      emails: [
        {
          mail: 'azizah@arlab.dev',
          label: 'Work',
        },
      ],

      phones: [
        {
          number: '6281234567890',
          label: 'Personal',
        },
      ],

      addresses: [
        {
          country: 'Indonesia',
          city: 'Bandung',
          postalCode: '12345',
          street: 'Jl. Cihampelas',
          label: 'Home',
        },
      ],

      notes: '',

      createdAt: 1710325745518,
      updatedAt: 1710325745518,
      deletedAt: null,
    },
  ]

  // set default values
  if ((!localStorage.getItem('labels') && localStorage.getItem('VERSION') !== VERSION) || localStorage.getItem('VERSION') !== VERSION) {
    localStorage.setItem('labels', JSON.stringify(labels))
  }
  if ((!localStorage.getItem('contacts') && localStorage.getItem('VERSION') !== VERSION) || localStorage.getItem('VERSION') !== VERSION) {
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
      label.totalContacts = contacts.filter(contact => contact.labels.map(label => label.id).includes(label.id)).length
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

  totalContacts(id) {
    return (new Contact()).index().filter(contact => contact.labels.map(label => label.id).includes(Number.parseInt(id))).length
  }

  destroy(id, keepContacts) {
    const labels = this.#get()
    const index = labels.findIndex(label => label.id === Number.parseInt(id))

    if (index !== -1) {
      const contactModel = new Contact()

      if (keepContacts) {
        contactModel.removeLabel(id)
      } else {
        contactModel.destroyByLabel(id)
      }

      labels.splice(index, 1)
      this.#set(labels)
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
    const contacts = this.#get().filter(contact => !contact.deletedAt)
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
      contacts[index].deletedAt = Date.now()
      this.#set(contacts)
    }
  }

  destroyByLabel(labelId) {
    this.#set(this.#get()
      .map((contact) => {
        if (contact.deletedAt) {
          return contact
        }

        contact.deletedAt = contact.labels.includes(Number.parseInt(labelId))
          ? Date.now()
          : null

        contact.labels = contact.labels.filter(id => id !== Number.parseInt(labelId))

        return contact
      }),
    )
  }

  removeLabel(labelId) {
    this.#set(this.#get()
      .map((contact) => {
        contact.labels = contact.labels.filter(id => id !== Number.parseInt(labelId))

        return contact
      }),
    )
  }

  restore() {
    const contacts = this.#get()
    const index = contacts.findIndex(contact => contact.id === Number.parseInt(id))

    if (index !== -1) {
      contacts[index].deletedAt = null
      this.#set(contacts)
    }
  }

  addToFavorites(id) {
    const contact = this.show(id)

    contact.isFavorite = true
    this.update(id, contact)
  }

  removeFromFavorites(id) {
    const contact = this.show(id)

    contact.isFavorite = false
    this.update(id, contact)
  }
}

window.Label = Label
window.Contact = Contact
