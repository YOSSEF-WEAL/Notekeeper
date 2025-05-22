"use strict";

const addEventOnElements = function (elements, eventType, callback) {
  elements.forEach((element) => element.addEventListener(eventType, callback));
};

const getGreetingMsg = function (currentHour) {
  const greeting =
    currentHour < 5
      ? "Night"
      : currentHour < 12
      ? "Morning"
      : currentHour < 15
      ? "Noon"
      : currentHour < 17
      ? "Afternoon"
      : currentHour < 20
      ? "Evening"
      : "Night";

  return `Good ${greeting}`;
};

let lastActiveItem;

const activeNoteBook = function () {
  lastActiveItem?.classList.remove("active");
  this.classList.add("active"); // this: navitem
  lastActiveItem = this; // this: navitem
};

const makeElemEditable = function (element) {
  element.setAttribute("contenteditable", true);
  element.focus();
};

// generets a uniqe ID dased on the current timestamp.
const generatID = function () {
  const id = new Date().getTime().toString();
  return id;
};

// finds a noteBook in database by it's ID.
const fundNotebook = function (db, notebookId) {
  return db.notebooks.find((notebook) => notebook.id === notebookId);
};

// Finds the index of a notebook in a array of noteBooks dasad on it's id

const findNotebookIndex = function (db, notebookId) {
  return db.notebooks.findIndex((item) => item.id === notebookId);
};

// convirts a timestamp in milliseconds to a human-readadle relative time string
const getRelativeTime = function (milliseconds) {
  const currentTime = new Date().getTime();
  let minute = Math.floor((currentTime - milliseconds) / 1000 / 60);
  const hour = Math.floor(minute / 60);
  const day = Math.floor(hour / 24);
  return minute < 1
    ? "Just now"
    : minute < 60
    ? `${minute} min ago`
    : hour < 24
    ? `${hour} hour ago`
    : `${day} day ago`;
};

// find a specofic note by its ID within a database of notebooks and their notes.
const fundNote = (db, noteId) => {
  let note;
  for (const notebook of db.notebooks) {
    note = notebook.notes.find((note) => note.id === noteId);
    if (note) break;
  }
  return note;
};

const findNoteIndex = function (notebook, noteId) {
  return notebook.notes.findIndex((note) => note.id === noteId);
};

export {
  addEventOnElements,
  getGreetingMsg,
  activeNoteBook,
  makeElemEditable,
  generatID,
  fundNotebook,
  findNotebookIndex,
  getRelativeTime,
  fundNote,
  findNoteIndex,
};
