let noteContentInput = document.querySelector(".user-input");
let noteTitleInput = document.querySelector(".note-title-input");
let noteTitleUpdate = document.querySelector(".note-title-edit-input");
let saveBtn = document.querySelector(".saveBtn");
let noteUpdaterBox = document.querySelector(".note-updater");
let inputUpdate = document.querySelector(".note-edit-input");
let updateBtn = document.querySelector(".updateBtn");
let loginPage = document.querySelector(".loginPage");
let passwordInputLogin = document.querySelector(".passwordInputLogin");
let loginBtn = document.querySelector(".login-btn");
let signUpPage = document.querySelector(".signUpPage");
let passwordInputsignUp = document.querySelector(".passwordInputsignUp");
let signUpBtn = document.querySelector(".signUp-btn");
let favIcon = document.querySelector("link[rel='shortcut icon']");
let containerOfNotes = document.querySelector(".notes");
let secertBtn = document.querySelector(".secert-btn");
let sortBtn = document.querySelector(".sort-btn");
let deletedNotesPage = document.querySelector(".deleted-notes");
let deletedNotesContainer = document.querySelector(".deleted-container");
let deletedNotesBtn = document.querySelector(".recycle-bin");
let backHomeBtn = document.querySelector(".home-btn");
let createNewNoteBtn = document.querySelector(".add-new-note-btn");
let noteCreatorPage = document.querySelector(".note-creator");
let deleteAllBtn = document.querySelector(".delete-all");
let tags = Array.from(document.querySelectorAll(".tag"));
let filterTags = Array.from(document.querySelectorAll(".tag-filter"));
let searchInput = document.querySelector(".search");

// check local storage if there is password stored or not
let passcode = localStorage.getItem("passcode") || null;

// in case there is password stored the login page display .. if there is no password the signup page display
if (passcode) {
  login();
} else {
  signUp();
}

// check localstorage if there are notes stored or not
let notes = JSON.parse(localStorage.getItem("note"))
  ? JSON.parse(localStorage.getItem("note"))
  : [];
// check local storage if there are deleted notes stored or not
let deletedNotes = JSON.parse(localStorage.getItem("deleted-note"))
  ? JSON.parse(localStorage.getItem("deleted-note"))
  : [];

// display notes if there are stored notes
displayNotes(notes);
// tag functionality
tags.forEach(function (tag) {
  tag.addEventListener("click", function () {
    tag.classList.toggle("active-tag");
  });
});
// tag filters functionality
filterTags.forEach(function (tag) {
  tag.addEventListener("click", function (e) {
    filterTags.map((tag) => tag.classList.remove("filter-tag-active"));
    e.target.classList.add("filter-tag-active");
    let filter = e.target.getAttribute("data-filter");
    displayFilteredNotes(notes, filter);
  });
});
// function for displaying filtered notes based on filter tag clicked
function displayFilteredNotes(notes, filter) {
  let filteredNotes = notes.filter(
    (note) => note.tags.includes(`${filter}`) == true
  );
  displayNotes(filteredNotes);
}

// show and hide new note creator
createNewNoteBtn.addEventListener("click", function () {
  noteCreatorPage.classList.toggle("show-note-creator");
});

// create new note
saveBtn.addEventListener("click", function () {
  if (noteContentInput.value && noteTitleInput.value) {
    let selectedTags = tags
      .filter((tag) => tag.classList.contains("active-tag") == true)
      .map((tag) => tag.getAttribute("data-tag"));
    let tagsArr = ["all", ...selectedTags];
    let note = {
      title: noteTitleInput.value,
      content: noteContentInput.value,
      date: new Date().toISOString(),
      tags: tagsArr,
    };
    notes.push(note);
    localStorage.setItem("note", JSON.stringify(notes));
    noteContentInput.value = noteTitleInput.value = "";
    // display the notes
    displayNotes(notes);
    // close note  creator
    noteCreatorPage.classList.toggle("show-note-creator");
    // remove active tags
    tags.forEach(function (tag) {
      tag.classList.remove("active-tag");
    });
  } else {
    alert("Can't Add Empty Note or Note Without Title");
    noteCreatorPage.classList.toggle("show-note-creator");
  }
});

// display original notes
function displayNotes(notes) {
  containerOfNotes.innerHTML = "";
  let card;
  for (const { title, content, date, tags } of notes) {
    let CalcPassedDays = function (date1, date2) {
      let passedDays = Math.round(
        Math.abs((date1 - date2) / (1000 * 60 * 60 * 24))
      );
      if (passedDays == 0) {
        return "Today";
      }
      if (passedDays == 1) {
        return "Yesterday";
      }
      if (passedDays <= 7) {
        return `${passedDays} days ago`;
      } else {
        new Intl.DateTimeFormat("en-GB", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        }).format(new Date(date));
      }
    };

    let displayedDate = CalcPassedDays(Date.now(), new Date(date));
    let tagsElements = [];
    tags.forEach(function (tag) {
      tagsElements.push(`<span class="note-tag">${tag}</span>`);
    });

    card = `<div class="note" data-sort='${displayedDate}'>
    <i class="fa-solid fa-pen-to-square editIcon edit"></i>
    <h5 class="note-title">${title}</h5>
    <div class="note-content">${content}</div>
    <i class="fa-solid fa-trash-can removeIcon delete"></i>
    <span class="date"> ${displayedDate} </span>
    <div class="note-tags">${tagsElements
      .filter((tag) => tag.includes("all") == false)
      .join(",")
      .replaceAll(",", " ")}</div>
    </div>`;
    containerOfNotes.insertAdjacentHTML("afterbegin", card);
  }
}

containerOfNotes.addEventListener("click", function (e) {
  //  delete a note
  if (e.target.classList.contains("delete")) {
    let userDecision = confirm("Are You Sure To Delete The Note");
    if (userDecision) {
      // remove from dom
      e.target.parentElement.remove();
      // push it to deleted notes array
      deletedNotes.push(
        notes.find(
          (note) => note.content == e.target.previousElementSibling.textContent
        )
      );
      // save deleted notes array to local storage
      localStorage.setItem("deleted-note", JSON.stringify(deletedNotes));
      // update deleted notes container (dom)
      displayDeletedNotes(deletedNotes);
      // remove note from the notes array
      notes.splice(
        notes.findIndex(
          (note) => note.content == e.target.previousElementSibling.textContent
        ),
        1
      );
      // remove from the localstorage
      localStorage.setItem("note", JSON.stringify(notes));
    }
  }

  //  edit a note
  if (e.target.classList.contains("edit")) {
    containerOfNotes.style.display = "none";
    noteUpdaterBox.classList.remove("show-note-updater");
    inputUpdate.focus();
    noteTitleUpdate.focus();
    inputUpdate.value =
      e.target.nextElementSibling.nextElementSibling.textContent;
    noteContentFetcher =
      e.target.nextElementSibling.nextElementSibling.textContent;
    noteTitleUpdate.value = e.target.nextElementSibling.textContent;
    noteTitleFetcher = e.target.nextElementSibling.textContent;
  }
});

updateBtn.addEventListener("click", function () {
  if (inputUpdate.value != "" && noteTitleUpdate.value != "") {
    // update array
    notes[notes.findIndex((note) => note.title == noteTitleFetcher)].title =
      noteTitleUpdate.value;

    notes[
      notes.findIndex((note) => note.content == noteContentFetcher)
    ].content = inputUpdate.value;
    // update dom
    inputUpdate.value = noteTitleUpdate.value = "";
    displayNotes(notes);
    noteUpdaterBox.classList.add("show-note-updater");
    // update local storage
    localStorage.setItem("note", JSON.stringify(notes));

    containerOfNotes.style.display = "flex";
  } else {
    alert("Can't Save Empty Notes");
  }
});

// sorting
let sortedState = false;
sortBtn.addEventListener("click", function () {
  let filter = filterTags
    .find((tag) => tag.classList.contains("filter-tag-active"))
    .getAttribute("data-filter");
  let filteredNotes = notes.filter(
    (note) => note.tags.includes(`${filter}`) == true
  );
  let sortedNotes = [];
  filteredNotes.forEach((note) => {
    let notte = {
      title: note.title,
      content: note.content,
      date: +new Date(note.date),
      tags: note.tags,
    };
    sortedNotes.push(notte);
  });
  if (sortedState == false) {
    sortedNotes.sort((a, b) => {
      if (a.date > b.date) return -1;
      if (b.date > a.date) return 2;
    });
    sortedState = !sortedState;
    displayNotes(sortedNotes);
  } else {
    sortedNotes.sort((a, b) => {
      if (a.date > b.date) return 1;
      if (b.date > a.date) return -1;
    });
    displayNotes(sortedNotes);
    sortedState = !sortedState;
  }
});
// search feature
searchInput.addEventListener("input", function () {
  let filteredNote = notes.filter((note) =>
    note.content.toLowerCase().includes(searchInput.value.toLowerCase())
  );
  displayNotes(filteredNote);
});
// deleted notes page functionality

// display deleted notes
function displayDeletedNotes(deletedNotes) {
  deletedNotesContainer.innerHTML = "";
  let card;
  for (let { title, content } of deletedNotes) {
    card = `<div class="deleted-note">
  <i class="fa-solid fa-trash remove-forever"></i>
  <h5 class="deleted-note-title">${title}</h5>
  <div class="deleted-note-content">${content}</div>
  <i class="fa-solid fa-rotate-left restore"></i>
</div>`;
    deletedNotesContainer.insertAdjacentHTML("afterbegin", card);
  }
}
displayDeletedNotes(deletedNotes);

// restore deleted notes and remove for ever

deletedNotesContainer.addEventListener("click", function (e) {
  // restore note

  if (e.target.classList.contains("restore")) {
    let userDecision = confirm("Are Sure To Restore This Note");
    if (userDecision) {
      // remove from dom
      e.target.parentElement.remove();
      // push it to notes array
      notes.push(
        deletedNotes.find(
          (note) => note.content == e.target.previousElementSibling.textContent
        )
      );
      // update local storage
      localStorage.setItem("note", JSON.stringify(notes));
      // remove note from deleted notes array
      deletedNotes.splice(
        deletedNotes.findIndex(
          (note) => note.content == e.target.previousElementSibling.textContent
        ),
        1
      );
      // update local storage
      localStorage.setItem("deleted-note", JSON.stringify(deletedNotes));
      // update notes container (dom)
      displayNotes(notes);
    }
  }

  // remove note for ever
  else if (e.target.classList.contains("remove-forever")) {
    let userDecision = confirm("Are Sure To Delete This Note Forever ?");
    if (userDecision) {
      // remove from dom
      e.target.parentElement.remove();
      // remove note from deleted notes array
      deletedNotes.splice(
        deletedNotes.findIndex(
          (note) => note.content == e.target.nextElementSibling.textContent
        ),
        1
      );
      // update local storage
      localStorage.setItem("deleted-note", JSON.stringify(deletedNotes));
    }
  }
});

// show deleted notes page
deletedNotesBtn.addEventListener("click", function () {
  deletedNotesPage.style.display = "block";
  containerOfNotes.style.display = "none";
});

// hide deleted notes page
backHomeBtn.addEventListener("click", function () {
  deletedNotesPage.style.display = "none";
  containerOfNotes.style.display = "flex";
});

// delete all notes from deleted notes page
deleteAllBtn.addEventListener("click", function () {
  let userDecision = confirm("Are Sure To Delete All Notes Forever ?");
  if (userDecision) {
    // remove from dom
    deletedNotesContainer.innerHTML = "";
    // empty the array
    deletedNotes.length = 0;
    // update local storage
    localStorage.setItem("deleted-note", JSON.stringify(deletedNotes));
  }
});

// Login and sign up functions

function login() {
  loginPage.style.display = "flex";
  loginBtn.addEventListener("click", function () {
    if (passwordInputLogin.value == passcode) {
      favIcon.href = "./unlock.png";
      loginPage.style.display = "none";
    } else {
      alert("Wrong Password");
    }
    passwordInputLogin.value = "";
  });
}
function signUp() {
  signUpPage.style.display = "flex";
  signUpBtn.addEventListener("click", function () {
    if (passwordInputsignUp.value.length > 9) {
      passcode = passwordInputsignUp.value;
      localStorage.setItem("passcode", passcode);
      alert("Sign up Successfully");
      passwordInputsignUp.value = "";
      signUpPage.style.display = "none";
      loginPage.style.display = "flex";
      location.reload();
    } else {
      alert("Password should be more than 9 Characters");
      passwordInputsignUp.value = "";
    }
  });
}
