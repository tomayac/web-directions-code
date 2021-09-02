const body = document.body;
const documentElement = document.documentElement;
const img = document.querySelector('.avatar');
const icon = document.querySelector('link[rel=icon]');
const footer = document.querySelector('footer');

footer.hidden = false;
img.hidden = false;

const before = documentElement.style.outline;

body.addEventListener('dragenter', (e) => {
  e.preventDefault();
  documentElement.style.outline = 'solid var(--border) var(--accent-color)';
});

body.addEventListener('dragleave', (e) => {
  e.preventDefault();
  documentElement.style.outline = before;
});

body.addEventListener('dragover', (e) => {
  e.preventDefault();
});

body.addEventListener('drop', async (e) => {
  e.preventDefault();
  documentElement.style.outline = before;
  for (const item of e.dataTransfer.items) {
    if (item.kind === 'file') {
      const handle = await item.getAsFileSystemHandle();
      if (handle.kind === 'file') {
        const file = await handle.getFile();
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
      }
    }
  }
});
