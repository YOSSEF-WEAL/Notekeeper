"use strict";
import { clinet } from "../client.js";
import { db } from "../db.js";
import { activeNoteBook, makeElemEditable } from "../utils.js";
import { DeleteConfirmModal } from "./Modal.js";
import { Tooltip } from "./Tooltip.js";

const notePanelTitle = document.querySelector("[data-note-panel-title]");

/*
 Creates a navigation item representing a notebook. This item displays the notebook's name, allows editing * and deletion of the notebook, and handles click events to display its associated notes.
*/
export const NavItem = function (id, name) {
  const navItem = document.createElement("div");
  navItem.classList.add("nav-item");
  //   navItem.setAttribute("data-notebook-field");
  navItem.setAttribute("data-notebook", id);

  navItem.innerHTML = `<span
      class="text text-label-large"
      data-notebook-field
      >${name}</span
    >
    <button
      class="icon-btn small"
      aria-label="Edit notebook"
      data-tooltip="Edit notebook"
      data-edit-btn
    >
      <span class="material-symbols-rounded" aria-hidden="true">edit</span>
      <div class="state-layer"></div>
    </button>
    <button
      class="icon-btn small"
      aria-label="Delete notebook"
      data-tooltip="Delete notebook"
      data-delete-btn
    >
      <span class="material-symbols-rounded" aria-hidden="true">delete</span>
      <div class="state-layer"></div>
    </button>
    <div class="state-layer"></div>`;

  // show tooltip on edit and delete button

  const tooltipElems = navItem.querySelectorAll("[data-tooltip]");
  tooltipElems.forEach((elem) => Tooltip(elem));
  /*
- Handles the click event on the navigation item. updata the note panels's title, retrives the associated notes.
- and marks items as active.
*/

  navItem.addEventListener("click", function () {
    notePanelTitle.textContent = name;
    activeNoteBook.call(this);
    const noteList = db.get.note(this.dataset.notebook);
    clinet.note.read(noteList);
  });

  // Notebook edit functionality

  const navItemEditBtn = navItem.querySelector("[data-edit-btn]");
  const navitemField = navItem.querySelector("[data-notebook-field]");
  navItemEditBtn.addEventListener(
    "click",
    makeElemEditable.bind(null, navitemField)
  );
  navitemField.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      this.removeAttribute("contenteditable");

      // Update edited data in database
      const updataNoteBookData = db.update.notebook(id, this.textContent);

      // Render Updated notebook
      clinet.noteBook.update(id, updataNoteBookData);
    }
  });

  // Notebook Delete functionality
  const navItemDeleteBtn = navItem.querySelector("[ data-delete-btn]");

  navItemDeleteBtn.addEventListener("click", function () {
    const modal = DeleteConfirmModal(name);

    modal.open();

    modal.onSubmit(function (isConfirm) {
      if (isConfirm) {
        db.delete.notebook(id);
        clinet.noteBook.delete(id);
      }
      modal.close();
    });
  });
  return navItem;
};
