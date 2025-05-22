"use strict";
import { Card } from "./components/Card.js";
import { NavItem } from "./components/NavItem.js";
import { activeNoteBook } from "./utils.js";

const sidebarList = document.querySelector("[data-sidebar-list]");

const notePanelTitle = document.querySelector("[data-note-panel-title]");

const notePanel = document.querySelector("[data-note-panel]");

const noteCreateBtns = document.querySelectorAll("[data-note-create-btn]");

const emptyNotesTemplate = `
  <div class="empty-notes">
    <span class="material-symbols-rounded" aria-hidden="true">note_stack</span>
    <div class="text-headline-small">No notes</div>
  </div>
`;
// Enables ar disables 'Create note' buttons dased on whther there are any notebooks
const disableNoteCreateBtns = function (isThereAnyNotebook) {
  noteCreateBtns.forEach((item) => {
    item[isThereAnyNotebook ? "removeAttribute" : "setAttribute"](
      "disabled",
      ""
    );
  });
};

export const clinet = {
  noteBook: {
    // Create a new notebook in the UI, based on provided nootebook data.

    create(noteBookData) {
      const navItem = NavItem(noteBookData.id, noteBookData.name);
      sidebarList.appendChild(navItem);
      activeNoteBook.call(navItem);
      notePanelTitle.textContent = noteBookData.name;
      notePanel.innerHTML = emptyNotesTemplate;
      disableNoteCreateBtns(true);
    },
    // Reads and displays a list os notebooks in the UI.
    read(noteBookList) {
      disableNoteCreateBtns(noteBookList.length);
      noteBookList.forEach((noteBookData, index) => {
        const navItem = NavItem(noteBookData.id, noteBookData.name);

        if (index === 0) {
          activeNoteBook.call(navItem);
          notePanelTitle.textContent = noteBookData.name;
        }

        sidebarList.appendChild(navItem);
      });
    },
    // Update the UI reflect Changes in a notebook.
    update(notebookId, noteBookData) {
      const oldNoteBook = document.querySelector(
        `[data-notebook="${notebookId}"]`
      );

      const newNotebook = NavItem(noteBookData.id, noteBookData.name);

      notePanelTitle.textContent = newNotebook.name;
      sidebarList.replaceChild(newNotebook, oldNoteBook);
    },

    // Delete a notebook from UI
    delete(notebookId) {
      const deleteNotebook = document.querySelector(
        `[data-notebook="${notebookId}"]`
      );

      const activeNavItem =
        deleteNotebook.nextElementSibling ??
        deleteNotebook.previousElementSibling;
      if (activeNavItem) {
        activeNavItem.click();
      } else {
        notePanelTitle.innerHTML = "";
        notePanel.innerHTML = "";
        disableNoteCreateBtns(false);
      }
      deleteNotebook.remove();
    },
  },
  note: {
    // Creates a new note card in the UI based on provided note data.
    create(noteData) {
      // Remove the "No notes" template if it exists
      const emptyElem = notePanel.querySelector(".empty-notes");
      if (emptyElem) emptyElem.remove();

      // Add the new card
      const card = Card(noteData);
      notePanel.prepend(card);
    },

    // Reads and displays a list of notes in the UI.
    read(noteList) {
      if (noteList.length) {
        notePanel.innerHTML = "";

        noteList.forEach((noteData) => {
          const card = Card(noteData);
          notePanel.appendChild(card);
        });
      } else {
        notePanel.innerHTML = emptyNotesTemplate;
      }
    },

    // Update a note card in the UI based on provided note data.
    update(noteId, noteData) {
      const oldCard = document.querySelector(`[data-note="${noteId}"]`);
      const newCard = Card(noteData);
      notePanel.replaceChild(newCard, oldCard);
    },

    // Delete a note card from the UI.
    delete(noteId, isExistedNotes) {
      document.querySelector(`[data-note='${noteId}']`).remove();
      if (!isExistedNotes) notePanel.innerHTML = emptyNotesTemplate;
    },
  },
};
