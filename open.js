const img = document.querySelector('.avatar');
const icon = document.querySelector('link[rel=icon]');

img.hidden = false;
img.addEventListener('click', async () => {
  try {
    const [handle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'Image files',
          accept: {
            'image/*': [
              '.jpg',
              '.jpeg',
              '.webp',
              '.png',
              '.avif',
              '.gif',
              '.svg',
            ],
          },
        },
      ],
    });
    const file = await handle.getFile();
    const src = URL.createObjectURL(file);
    img.src = src;
    icon.href = src;
  } catch (err) {
    console.error(err.name, err.message);
  }
});
