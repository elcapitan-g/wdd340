document.addEventListener("DOMContentLoaded", () => {
  // Grab the inv_id from a data attribute on a container element
  const container = document.getElementById("inventory-notes-container");
  if (!container) return;

  const invId = container.dataset.invId;
  if (!invId) return;

  fetch(`/inv/getNotes/${invId}`)
    .then((response) => response.json())
    .then((notes) => {
      const notesList = document.getElementById("notes-list");
      if (!notesList) return;

      notesList.innerHTML = ""; // Clear previous notes if any

      if (notes.length === 0) {
        notesList.innerHTML = "<p>No notes available.</p>";
        return;
      }

      notes.forEach((note) => {
        const li = document.createElement("li");
        li.textContent = `${new Date(note.created_at).toLocaleString()}: ${note.note_text}`;
        notesList.appendChild(li);
      });
    })
    .catch((error) => console.error("Error loading notes:", error));
});
document.addEventListener("DOMContentLoaded", () => {
  // Grab the inv_id from a data attribute on a container element
  const container = document.getElementById("inventory-notes-container");
  if (!container) return;

  const invId = container.dataset.invId;
  if (!invId) return;

  fetch(`/inv/getNotes/${invId}`)
    .then((response) => response.json())
    .then((notes) => {
      const notesList = document.getElementById("notes-list");
      if (!notesList) return;

      notesList.innerHTML = ""; // Clear previous notes if any

      if (notes.length === 0) {
        notesList.innerHTML = "<p>No notes available.</p>";
        return;
      }

      notes.forEach((note) => {
        const li = document.createElement("li");
        li.textContent = `${new Date(note.created_at).toLocaleString()}: ${note.note_text}`;
        notesList.appendChild(li);
      });
    })
    .catch((error) => console.error("Error loading notes:", error));
});
