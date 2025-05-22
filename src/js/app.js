"use strict";

import {
  addEventOnElements,
  getGreetingMsg,
  activeNoteBook,
  makeElemEditable,
} from "./utils.js";

import { Tooltip } from "./components/Tooltip.js";
import { db } from "./db.js";
import { clinet } from "./client.js";
import { NoteModal } from "./components/Modal.js";

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector("[data-sidebar]");
  const sidebarTogglers = document.querySelectorAll("[data-sidabar-toggler]");
  const overlay = document.querySelector("[data-sidebar-overlay]");

  // Initialize tooltip behavior for all DOM elements with 'data-tooltip' attribute.

  const tooltipElem = document.querySelectorAll("[data-tooltip]");
  tooltipElem.forEach((elem) => Tooltip(elem));

  addEventOnElements(sidebarTogglers, "click", function () {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
  });
});

// Show greeting message on homepage
const greetElem = document.querySelector("[data-greeting]");
const currentHour = new Date().getHours();
greetElem.textContent = getGreetingMsg(currentHour);

// Show Current date on homepage

const currentDateElem = document.querySelector("[data-current-date]");
currentDateElem.textContent = new Date().toDateString().replace(" ", ", ");

// Notebook Create Field

const sidebarList = document.querySelector("[data-sidebar-list]");
const addNoteBookBtn = document.querySelector("[data-add-notebook]");

const showNoteBookField = function () {
  const navitem = document.createElement("div");
  navitem.classList.add("nav-item");
  navitem.innerHTML = `
    <span class="text text-label-large" data-notebook-field=""></span>
    <div class="state-layer"></div>
  `;
  sidebarList.appendChild(navitem);

  const navitemField = navitem.querySelector("[data-notebook-field]");

  // Activate new created notebook and deactivate the last one.
  activeNoteBook.call(navitem);

  // Make notebook field content editable and focus
  makeElemEditable(navitemField);

  // When user presses 'Enter' then create notebook
  navitem.addEventListener("keydown", createNotebook);

  // When user clicks outside (blur), also create notebook
  navitemField.addEventListener("blur", function () {
    // Prevent creating empty notebook if nothing was typed
    if (!navitemField.textContent.trim() && !navitemField.isContentEditable)
      return;
    createNotebook.call(navitem, { key: "Enter" });
  });
};

addNoteBookBtn.addEventListener("click", showNoteBookField);

const createNotebook = function (event) {
  if (event.key === "Enter") {
    const notebookField = this.querySelector("[data-notebook-field]");
    const name = notebookField.textContent.trim() || "Untitled";
    const noteBookData = db.post.notebook(name);
    clinet.noteBook.create(noteBookData);
    this.remove();
  }
};

// Renders the existing motebook list by retrieving data from the databae and passing it to thr clinet

const renderExistedNoteBook = function () {
  const noteBookList = db.get.notebook();
  clinet.noteBook.read(noteBookList);
};

renderExistedNoteBook();

/*
-- Create new note
- Attaches event listeners to a collection of DOM elements representing "Create Note" Buttins.
- When a button is clickes, it opens a modal for creating a new note and handles the submission 
- Of the new note to the database and client 
*/

const noteCreateBtns = document.querySelectorAll("[data-note-create-btn]");

addEventOnElements(noteCreateBtns, "click", function () {
  // Create and open a new modal
  const modal = NoteModal();
  modal.open();

  // handle the submission of the new note to the database and clinet

  modal.onSubmit((noteObj) => {
    const activeNotebookElem = document.querySelector("[data-notebook].active");
    if (!activeNotebookElem) {
      // يمكنك هنا عرض رسالة للمستخدم أو تجاهل العملية
      return;
    }
    const activeNotebookId = activeNotebookElem.dataset.notebook;

    const noteData = db.post.note(activeNotebookId, noteObj);
    clinet.note.create(noteData);
    modal.close();
  });
});

/*
- Renders existing notes in the active notebook. Retrieves note data from the database based on the active notebook's ID
- and uses the client to display the notes.
*/

const renderExistedNote = function () {
  const activeNotebookId = document.querySelector("[data-notebook].active")
    ?.dataset.notebook;

  if (activeNotebookId) {
    const noteList = db.get.note(activeNotebookId);

    // display existing note
    clinet.note.read(noteList);
  }
};
renderExistedNote();

// 4:6:02
