const img = document.querySelector('.avatar');
const icon = document.querySelector('link[rel=icon]');

img.hidden = false;

window.launchQueue.setConsumer(async (launchParams) => {
  if (!launchParams.files.length) {
    return;
  }
  for (const handle of launchParams.files) {
    const file = await handle.getFile();
    if (file.type.startsWith('image/')) {
      const src = URL.createObjectURL(file);
      img.src = src;
      icon.href = src;
      return;
    }
  }
});
