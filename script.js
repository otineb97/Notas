const noteContainer = document.getElementById("note-container");
const noteTitle = document.getElementById("note-title");
const noteDescription = document.getElementById("note-description");

noteContainer.addEventListener("click", () => {
  noteContainer.classList.add("expanded");
});

document.addEventListener("click", (event) => {
  if (!noteContainer.contains(event.target)) {
    noteContainer.classList.remove("expanded");
    noteTitle.value = "";
    noteDescription.value = "";
  }
});

noteContainer.addEventListener("click", (event) => {
  event.stopPropagation();
});
