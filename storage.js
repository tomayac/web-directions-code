import { blobToDataURL } from './script.js';

const button = document.querySelector('.store-card');
const main = document.querySelector('main');
const img = document.querySelector('.avatar');
const link = document.querySelector('.twitter-link');
const table = document.querySelector('table');
const tableBody = document.querySelector('tbody');

button.hidden = false;
button.addEventListener('click', async () => {
  const suggestedName = `${new URL(link.href).pathname.substr(1)}`;
  try {
    const blob = await fetch(img.src).then((response) => response.blob());
    const dataURL = await blobToDataURL(blob);
    const css = await fetch('./style.css').then((response) => response.text());
    const html = `<style>${css}</style>${main.outerHTML
      .replace(/<button[^>]+.*?<\/button>/g, '')
      .replace(/\s+contenteditable=""/g, '')
      .replace(/src="[^"]+"/g, `src="${dataURL}"`)}`;

    const file = await window.storageFoundation.open(suggestedName);
    await window.storageFoundation.requestCapacity(html.length);
    const buffer = new TextEncoder().encode(html);
    await file.setLength(0);
    await file.write(buffer, 0);
    await file.flush();
    await file.close();
    await listFiles();
  } catch (err) {
    console.error(err.name, err.message);
  }
});

const listFiles = async () => {
  const names = (await window.storageFoundation.getAll()).sort();
  tableBody.innerHTML = '';
  if (names.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    tr.append(td);
    tableBody.append(tr);
    td.colSpan = 3;
    td.textContent = 'No files created yet.';
    return;
  }
  for await (const name of names) {
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    const td3 = document.createElement('td');
    tr.append(td1);
    tr.append(td2);
    tr.append(td3);

    tableBody.append(tr);

    td1.textContent = name;
    td1.classList.add('file-name');

    const file = await window.storageFoundation.open(name);
    const length = await file.getLength();
    await file.close();
    td2.textContent = length;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', async () => deleteFile(name));
    td3.append(deleteButton);        

    const readContentButton = document.createElement('button');
    readContentButton.type = 'button';
    readContentButton.textContent = 'Read Content';
    readContentButton.addEventListener('click', async () => readContent(name));
    td3.append(readContentButton);
  }
};

const readContent = async (name) => {
  const file = await window.storageFoundation.open(name);
  const buffer = new Uint8Array(await file.getLength());
  const read = await file.read(buffer, 0);
  await file.close();
  alert(new TextDecoder().decode(read.buffer));
};

const deleteFile = async (fileName) => {
  if (!fileName) {
    return;
  }
  try {
    await window.storageFoundation.delete(fileName);
    await listFiles();
    
  } catch (err) {
    console.error(err.name, err.message);    
  }
};

table.hidden = false;
listFiles();