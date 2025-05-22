"use strict";
// import module

import {
  findNotebookIndex,
  findNoteIndex,
  fundNote,
  fundNotebook,
  generatID,
} from "./utils.js";

// DB Object
let notekeeperDB = {};

const initDB = function () {
  const db = localStorage.getItem("notekeeperDB");
  if (db) {
    notekeeperDB = JSON.parse(db);
  } else {
    notekeeperDB.notebooks = [];
    localStorage.setItem("notekeeperDB", JSON.stringify(notekeeperDB));
  }
};

initDB();

// Reads and loads the localStorage data in to the global varible `notekeeperDB`.

const readDB = function () {
  notekeeperDB = JSON.parse(localStorage.getItem("notekeeperDB"));
};

// Writes the current state of the global varible `notekeeperDB` to local starage

const writeDB = function () {
  localStorage.setItem("notekeeperDB", JSON.stringify(notekeeperDB));
};

export const db = {
  post: {
    // adds a new notebook to the database.
    notebook(name) {
      readDB();
      const noteBookData = {
        id: generatID(),
        name,
        notes: [],
      };
      notekeeperDB.notebooks.push(noteBookData);
      writeDB();
      return noteBookData;
    },

    // adds a new note to a spacified notebook in the database
    note(notebookId, object) {
      readDB();
      const notebookIndex = findNotebookIndex(notekeeperDB, notebookId);
      const notebook = notekeeperDB.notebooks[notebookIndex];

      const noteData = {
        id: generatID(),
        notebookId,
        ...object,
        postedOn: new Date().getTime(),
      };
      notebook.notes.unshift(noteData);

      writeDB();

      return noteData;
    },
  },
  get: {
    // Retieves all notebooks from the database.
    notebook() {
      readDB();
      return notekeeperDB.notebooks;
    },

    // Retrieves all notes within a specified notebook.
    note(notebookId) {
      readDB();
      const notebookIndex = findNotebookIndex(notekeeperDB, notebookId);
      const notebook = notekeeperDB.notebooks[notebookIndex];

      writeDB();
      return notebook ? notebook.notes : [];
    },
  },
  // updata the name of a notebook in the database.
  update: {
    notebook(notebookId, name) {
      readDB();

      const notebook = fundNotebook(notekeeperDB, notebookId);
      notebook.name = name;

      writeDB();
      return notebook;
    },
    // updates the contact of a note in the database.
    note(noteId, object) {
      readDB();
      const oldNote = fundNote(notekeeperDB, noteId);
      const newNote = Object.assign(oldNote, object);
      writeDB();
      return newNote;
    },
  },

  delete: {
    // Delete a noteBook from the database
    notebook(notebookId) {
      readDB();
      const notebookIndex = findNotebookIndex(notekeeperDB, notebookId);

      notekeeperDB.notebooks.splice(notebookIndex, 1);

      writeDB();
    },
    // delete a note from spacified noteBook in the databae.
    note(notebookId, noteId) {
      readDB();
      const notebook = fundNotebook(notekeeperDB, notebookId);
      const noteIndex = findNoteIndex(notebook, noteId);

      notebook.notes.splice(noteIndex, 1);
      writeDB();

      return notebook.notes;
    },
  },
};
