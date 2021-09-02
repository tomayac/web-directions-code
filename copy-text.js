const button = document.querySelector('.copy-twitter');
const link = document.querySelector('.twitter-link');

button.hidden = false;
button.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(link.href);

    const before = link.style.boxShadow;
    link.style.boxShadow = '0px 0px 0px var(--border) var(--accent-color)';
    setTimeout(() => {
      link.style.boxShadow = before;
    }, 1000);
  } catch (err) {
    console.error(err.name, err.message);
  }
});
