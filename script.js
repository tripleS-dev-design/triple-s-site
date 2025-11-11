// Année dynamique
document.getElementById('year').textContent = new Date().getFullYear();

// Formulaire (démo locale)
function submitContact(e){
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  console.log('Contact', data);
  const status = document.getElementById('contact-status');
  status.textContent = "Merci ! Votre message a été envoyé (démo).";
  form.reset();
  return false;
}
