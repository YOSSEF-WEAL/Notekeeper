"use strict";

import { clinet } from "../client.js";
import { db } from "../db.js";
import { getRelativeTime } from "../utils.js";
import { DeleteConfirmModal, NoteModal } from "./Modal.js";
import { Tooltip } from "./Tooltip.js";

// Creates an HTML card elemnt representing a note baseed on provided note data.

export const Card = function (noteData) {
  const { id, title, text, postedOn, notebookId } = noteData;
  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("data-note", id);

  card.innerHTML = `
    <h3 class="card-title text-title-medium">${title}</h3>
    <p class="card-text text-body-large">${text}</p>
    <div class="wrapper">
      <span class="card-time text-label-large"
        >${getRelativeTime(postedOn)}</span
      >
      <div class='btnCardDiv'>
        <button
          class="icon-btn large"
          aria-label="Delete note"
          data-tooltip="Delete note"
          data-delete-btn
        >
          <span class="material-symbols-rounded" aria-hidden="true"
            >delete</span
          >
          <div class="state-layer"></div>
        </button>

        <button
          class="icon-btn small"
          aria-label="Edit notebook"
          data-tooltip="Edit notebook"
          data-edit-btn=""
        >
          <span class="material-symbols-rounded" aria-hidden="true">edit</span>
          <div class="state-layer"></div>
        </button>
      </div>
    </div>

    <div class="state-layer"></div>
  `;

  Tooltip(card.querySelector("[data-tooltip]"));

  // note detail view & edit functionlaty
  card.addEventListener("click", function () {
    const modal = NoteModal(title, text, getRelativeTime(postedOn));
    modal.open();
    modal.onSubmit(function (noteData) {
      const updatedData = db.update.note(id, noteData);

      // Update the note in the client UI
      clinet.note.update(id, updatedData);
      modal.close();
    });
  });

  // note delete functionlaty
  const deleteBtn = card.querySelector("[data-delete-btn]");
  deleteBtn.addEventListener("click", function (event) {
    event.stopImmediatePropagation();

    const modal = DeleteConfirmModal(title);
    modal.open();
    modal.onSubmit(function (isConfirm) {
      if (isConfirm) {
        const existedNotes = db.delete.note(notebookId, id);
        // Update the client UI to reflect note Deletion
        clinet.note.delete(id, existedNotes.length);
      }
      modal.close();
    });
  });
  return card;
};
