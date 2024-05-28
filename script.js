const noteContainer = document.getElementById("note-container");
const noteTitle = document.getElementById("note-title");
const noteDescription = document.getElementById("note-description");
const saveNoteButton = document.getElementById("save-note");
const cancelNoteButton = document.getElementById("cancel-note");
const notesList = document.getElementById("notes-list");
const searchInput = document.getElementById("search-input");

let notes = JSON.parse(localStorage.getItem('notes')) || [];
let editingNoteIndex = null;
let selectedNoteIndex = null;

function displayNotes(filteredNotes = notes) {
    notesList.innerHTML = '';
    filteredNotes.forEach((note, index) => {
        const noteCard = document.createElement('div');
        noteCard.classList.add('col');
        const cardBorderClass = note.color === '#212429' ? 'border' : 'border-0';
        noteCard.innerHTML = `
            <div class="card custom-card ${cardBorderClass} ${note.completed ? 'completed-note' : ''}" style="background-color: ${note.color || '#212429'};">
                <div class="card-body">
                    <h5 class="card-title">${note.title}</h5>
                    <p class="card-text">${note.description}</p>
                    <p class="card-text">${note.date}</p>
                    <div class="card-actions d-flex justify-content-end">
                        <i class="fas fa-check-circle" title="Aprobar" onclick="toggleComplete(${index})"></i>
                        <i class="fas fa-edit" title="Editar" onclick="editNote(${index})"></i>
                        <i class="fas fa-palette" title="Cambiar Color" onclick="showColorPicker(${index}, event)"></i>
                        <i class="fas fa-trash-alt" title="Borrar" onclick="deleteNote(${index})"></i>
                    </div>
                </div>
            </div>
        `;
        notesList.appendChild(noteCard);
    });

    new Masonry(notesList, {
        itemSelector: '.col',
        columnWidth: '.col',
        percentPosition: true
    });
}

function saveNote() {
    const title = noteTitle.value.trim();
    const description = noteDescription.value.trim();
    if (!title || !description) {
        alert("Ambos campos son obligatorios.");
        return;
    }

    const now = new Date();
    const dateOptions = { day: '2-digit', month: 'short' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const date = `${now.toLocaleDateString('es-ES', dateOptions)}, ${now.toLocaleTimeString('es-ES', timeOptions)}`;

    const note = { title, description, date, completed: false, color: '#212429' };
    if (editingNoteIndex !== null) {
        notes[editingNoteIndex] = note;
        editingNoteIndex = null;
    } else {
        notes.push(note);
    }
    localStorage.setItem('notes', JSON.stringify(notes));
    clearNoteInput();
    displayNotes();
}

function editNote(index) {
    noteTitle.value = notes[index].title;
    noteDescription.value = notes[index].description;
    editingNoteIndex = index;
    noteContainer.classList.add("expanded");
}

function deleteNote(index) {
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
}

function searchNotes(event) {
    const query = event.target.value.toLowerCase();
    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(query) || 
        note.description.toLowerCase().includes(query)
    );
    displayNotes(filteredNotes);
}

function toggleComplete(index) {
    notes[index].completed = !notes[index].completed;
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
}

function cancelNote() {
    clearNoteInput();
    editingNoteIndex = null;
    noteContainer.classList.remove("expanded");
}

function showColorPicker(index, event) {
    selectedNoteIndex = index;
    const colorPicker = document.getElementById("color-picker");
    colorPicker.classList.remove("d-none");
    colorPicker.style.top = `${event.clientY}px`;
    colorPicker.style.left = `${event.clientX}px`;
}

function changeNoteColor(color) {
    if (selectedNoteIndex !== null) {
        notes[selectedNoteIndex].color = color;
        localStorage.setItem('notes', JSON.stringify(notes));
        displayNotes();
        hideColorPicker();
    }
}

function hideColorPicker() {
    const colorPicker = document.getElementById("color-picker");
    colorPicker.classList.add("d-none");
}

function clearNoteInput() {
    noteTitle.value = '';
    noteDescription.value = '';
}

document.addEventListener("click", (event) => {
    const colorPicker = document.getElementById("color-picker");

    if (!colorPicker.contains(event.target) && !event.target.classList.contains('fa-palette')) {
        hideColorPicker();
    }

    if (!noteContainer.contains(event.target) && !event.target.classList.contains('fa-edit')) {
        noteContainer.classList.remove("expanded");
        clearNoteInput();
        editingNoteIndex = null;
    }
});

noteContainer.addEventListener("click", () => {
    noteContainer.classList.add("expanded");
});

noteContainer.addEventListener("click", (event) => {
    event.stopPropagation();
});

saveNoteButton.addEventListener("click", saveNote);

cancelNoteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    cancelNote();
});

searchInput.addEventListener("input", searchNotes);

displayNotes();
