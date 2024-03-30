document.getElementById('create-contact-form').addEventListener('submit', (event) => {
  event.preventDefault()
  const form = new FormData(event.target)

  console.log(form)
})
