"use strict";

const overlay = document.createElement("div");
overlay.classList.add("overlay", "modal-overlay");

// Create and manages a modal for adding or editing notes. the modal allows users to unput a note's title and text, and provides functionalty to submit ans save the note.

const NoteModal = function (
  title = "Untitled",
  text = "Add your Note...",
  time = ""
) {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  modal.innerHTML = `
    <button class="icon-btn large" aria-label=" Close modal" data-close-btn>
      <span class="material-symbols-rounded" aria-hidden="true">close</span>
      <div class="state-layer"></div>
    </button>

    <input
      type="text"
      placeholder="Untitled"
      value="${title}"
      class="modal-title text-title-medium"
      data-note-field
    />
    <textarea
      placeholder="Take a note..."
      class="modal-text text-body-large custom-scrollbar"
      data-note-field
    >${text}</textarea
    >

    <div class="modal-footer">
      <span class="time text-label-large">${time}</span>
      <button class="btn text" data-submit-btn>
        <span class="text-label-large">Save</span>
        <div class="state-layer"></div>
      </button>
    </div>
  `;

  const submitBtn = modal.querySelector("[data-submit-btn]");
  submitBtn.disabled = true;
  const [titleField, textField] = modal.querySelectorAll("[data-note-field]");

  const enableSubmit = function () {
    submitBtn.disabled = titleField.value && !textField.value;
  };

  textField.addEventListener("keyup", enableSubmit);
  titleField.addEventListener("keyup", enableSubmit);

  // Opens the note modal by appending it ti the document body and setting focus on the title field.
  const open = function () {
    document.body.appendChild(modal);
    document.body.appendChild(overlay);
    titleField.focus();
  };

  // Closes the note modal by removing it from document body.
  const close = function () {
    document.body.removeChild(modal);
    document.body.removeChild(overlay);
  };

  const closeBtn = modal.querySelector("[data-close-btn]");
  closeBtn.addEventListener("click", close);

  // Handle the submission of note within the modal.
  const onSubmit = function (callback) {
    submitBtn.addEventListener("click", function () {
      const noteData = {
        title: titleField.value,
        text: textField.value,
      };
      callback(noteData);
    });
  };

  return { open, close, onSubmit };
};

// Creates and manages a modal for confirming the deletetion of an item.
const DeleteConfirmModal = function (title) {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  modal.innerHTML = `
    <h3 class="modal-title text-title-medium">
      Are you sure you want to delete <strong>"${title}"</strong> ?
    </h3>
    <div class="modal-footer">
      <button class="btn text" data-action-btn="false">
        <span class="text-label-large">Cancel</span>
        <div class="state-layer"></div>
      </button>
      <button class="btn fill" data-action-btn="true">
        <span class="text-label-large">Delete</span>
        <div class="state-layer"></div>
      </button>
    </div>
  `;

  // Opens The delete confirmation modal by appending it ti thr document body

  const open = function () {
    document.body.appendChild(modal);
    document.body.appendChild(overlay);
  };

  const actionBtns = modal.querySelectorAll("[data-action-btn]");

  // Closes the delete confirmation modal by removing it from the document body
  const close = function () {
    document.body.removeChild(modal);
    document.body.removeChild(overlay);
  };

  // Handles the Submission of the delete confirmation.
  const onSubmit = function (callback) {
    actionBtns.forEach((btn) =>
      btn.addEventListener("click", function () {
        const isConfirm = this.dataset.actionBtn === "true" ? true : false;

        callback(isConfirm);
      })
    );
  };
  return { open, close, onSubmit };
};

export { DeleteConfirmModal, NoteModal };
