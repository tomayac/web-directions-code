const button = document.querySelector('.copy-avatar');
const img = document.querySelector('.avatar');

button.hidden = !('showOpenFilePicker' in window);
button.addEventListener('click', async () => {
  try {
    const blob = await fetch(img.src).then((response) => response.blob());
    const data = [new window.ClipboardItem({ [blob.type]: blob })];
    await navigator.clipboard.write(data);

    const before = img.style.boxShadow;
    img.style.boxShadow = '0px 0px 0px var(--border) var(--accent-color)';
    setTimeout(() => {
      img.style.boxShadow = before;
    }, 1000);
  } catch (err) {
    console.error(err.name, err.message);
  }
});
