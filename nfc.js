const button = document.querySelector('.write-card');
const card = document.querySelector('.card_inner');

button.hidden = false;
button.addEventListener('click', async () => {
  const ndef = new window.NDEFReader();
  const text = card.innerText.replaceAll('Copy', '');
  try {
    await ndef.write(text);
    const before = button.style.boxShadow;
    button.style.boxShadow = '0px 0px 0px var(--border) var(--accent-color)';
    setTimeout(() => {
      button.style.boxShadow = before;
    }, 1000);
  } catch (err) {
    console.error(err.name, err.message);
  }
});
