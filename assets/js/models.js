/**
 * Seeder for labels and contacts
 * Reset seeder if version changes
 */
(() => {
  const now = new Date()

  const VERSION = '0.0.7'

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

      createdAt: now,
      updatedAt: now,
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

      createdAt: now,
      updatedAt: now,
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
    const id = Date.now()
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

  index(filters = {}) {
    let contacts = this.#get().filter(contact => !contact.deletedAt)

    if (filters.search) {
      const search = filters.search.toLowerCase()

      contacts = contacts
        .filter(contact =>
          contact.firstName.toLowerCase().includes(search)
          || contact.middleName.toLowerCase().includes(search)
          || contact.lastName.toLowerCase().includes(search)
          || contact.emails.some(email => email.mail.toLowerCase().includes(search))
          || contact.phones.some(phone => phone.number.toLowerCase().includes(search))
          || contact.company.toLowerCase().includes(search)
          || contact.jobTitle.toLowerCase().includes(search),
        )
    }

    if (filters.labelId) {
      contacts = contacts.filter(contact => contact.labels.includes(filters.labelId))
    }

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

  trashed(filters = {}) {
    let contacts = this.#get().filter(contact => contact.deletedAt)

    if (filters.search) {
      const search = filters.search.toLowerCase()

      contacts = contacts
        .filter(contact =>
          contact.firstName.toLowerCase().includes(search)
          || contact.middleName.toLowerCase().includes(search)
          || contact.lastName.toLowerCase().includes(search)
          || contact.emails.some(email => email.mail.toLowerCase().includes(search))
          || contact.phones.some(phone => phone.number.toLowerCase().includes(search))
          || contact.company.toLowerCase().includes(search)
          || contact.jobTitle.toLowerCase().includes(search),
        )
    }

    return contacts
  }

  store(contact) {
    const now = new Date()
    contact.id = now.getTime()
    contact.createdAt = now
    contact.updatedAt = now
    contact.deletedAt = null

    const contacts = this.#get()

    contacts.push(contact)
    this.#set(contacts)

    return contact
  }

  /**
   * Find contact and return it without label relationships
   */
  find(id, includeTrash = false) {
    return this.#get().find(contact =>
      contact.id === Number.parseInt(id)
      && (includeTrash
        ? true
        : contact.deletedAt === null),
    )
  }

  /**
   * Find contact and return it with label relationships
   */
  show(id, includeTrash = false) {
    const contact = this.find(id, includeTrash)

    if (!contact) {
      return undefined
    }

    const labels = (new Label()).index()

    return {
      ...contact,
      labels: contact.labels.map((id) => {
        return {
          id,
          name: labels.find(label => label.id === id).name,
        }
      }),
    }
  }

  update(id, data) {
    const contacts = this.#get()
    const index = contacts.findIndex(contact => contact.id === Number.parseInt(id))

    if (index !== -1) {
      data.updatedAt = new Date()

      contacts[index] = {
        ...contacts[index],
        ...data,
      }

      this.#set(contacts)
    }
  }

  destroy(id) {
    const contacts = this.#get()
    const index = contacts.findIndex(contact => contact.id === Number.parseInt(id))

    if (index !== -1) {
      contacts[index].deletedAt = new Date()
      this.#set(contacts)
    }
  }

  forceDelete(id) {
    this.#set(this.#get().filter(contact => contact.id !== Number.parseInt(id)))
  }

  destroyByLabel(labelId) {
    this.#set(this.#get()
      .map((contact) => {
        if (contact.deletedAt) {
          return contact
        }

        contact.deletedAt = contact.labels.includes(Number.parseInt(labelId))
          ? new Date()
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

  destroyTrash() {
    this.#set(this.#get()
      .filter(contact => !contact.deletedAt),
    )
  }

  recover(id) {
    const contacts = this.#get()
    const index = contacts.findIndex(contact => contact.id === Number.parseInt(id))

    if (index !== -1) {
      contacts[index].deletedAt = null
      this.#set(contacts)
    }
  }

  addToFavorites(id) {
    const contact = this.find(id)

    contact.isFavorite = true
    this.update(id, contact)
  }

  removeFromFavorites(id) {
    const contact = this.find(id)

    contact.isFavorite = false
    this.update(id, contact)
  }
}

window.Label = Label
window.Contact = Contact
