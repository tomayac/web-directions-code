import {
  get,
  set,
  del,
} from 'https://cdn.jsdelivr.net/npm/idb-keyval@5/+esm';

import { blobToDataURL } from './script.js';

const button = document.querySelector('.save-card');
const reset = document.querySelector('.reset-card');
const main = document.querySelector('main');
const img = document.querySelector('.avatar');
const link = document.querySelector('.twitter-link');

window.businessCard = window.businessCard || {};

(async () => {
  window.businessCard.handle = (await get('file')) || undefined;
})();

button.hidden = false;
button.addEventListener('click', async () => {
  try {
    const suggestedName = `${new URL(link.href).pathname.substr(1)}.html`;
    const handle =
      window.businessCard.handle ||
      (await window.showSaveFilePicker({
        suggestedName,
        types: [
          {
            description: 'HTML document',
            accept: {
              'text/html': '.html',
            },
          },
        ],
        excludeAcceptAllOption: true,
      }));

    const blob = await fetch(img.src).then((response) => response.blob());
    const dataURL = await blobToDataURL(blob);
    const css = await fetch('./style.css').then((response) => response.text());
    const html = `<style>${css}</style>${main.outerHTML
      .replace(/<button[^>]+.*?<\/button>/g, '')
      .replace(/\s+contenteditable=""/g, '')
      .replace(/src="[^"]+"/g, `src="${dataURL}"`)}`;

    const writable = await handle.createWritable();
    await writable.write(html);
    await writable.close();
    window.businessCard.handle = handle;
    await set('file', handle);
  } catch (err) {
    console.error(err.name, err.message);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 's' && e.metaKey) {
    e.preventDefault();
    button.click();
    const before = button.style.boxShadow;
    button.style.boxShadow = '0px 0px 0px var(--border) var(--accent-color)';
    setTimeout(() => {
      button.style.boxShadow = before;
    }, 1000);
  }
});

reset.addEventListener('click', async () => {
  window.businessCard.handle = undefined;
  await del('file');
});
