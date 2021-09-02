const img = document.querySelector('.avatar');
const icon = document.querySelector('link[rel=icon]');

document.addEventListener('paste', async (e) => {
  e.preventDefault();
  if (!e.clipboardData.files.length) {
    return;
  }
  const file = e.clipboardData.files[0];
  if (file.type.startsWith('image/')) {
    const src = URL.createObjectURL(file);
    img.src = src;
    icon.href = src;
    const before = img.style.boxShadow;
    img.style.boxShadow = '0px 0px 0px var(--border) var(--accent-color)';
    setTimeout(() => {
      img.style.boxShadow = before;
    }, 1000);
    return;
  }
});
