let input = document.querySelector(".user-input");
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
let fakeNotes = document.querySelector(".fake-notes");
let logOut = document.querySelector(".logout");
let sortBtn = document.querySelector(".sort-btn");
let deletedNotesPage = document.querySelector(".deleted-notes");
let deletedNotesContainer = document.querySelector(".deleted-container");
let deletedNotesBtn = document.querySelector(".recycle-bin");
let backHomeBtn = document.querySelector(".home-btn");
let createNewNoteBtn = document.querySelector(".add-new-note-btn");
let noteCreatorPage = document.querySelector(".note-creator");
let clickCounter = 0;
let nextElementValue;

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

// display notes if there are available notes
displayNotes(notes);

createNewNoteBtn.addEventListener("click", function () {
  noteCreatorPage.classList.toggle("show-note-creator");
});

// create new note
saveBtn.addEventListener("click", function () {
  if (input.value) {
    let note = {
      content: input.value,
      date: new Date().toISOString(),
    };
    notes.push(note);
    localStorage.setItem("note", JSON.stringify(notes));
    input.value = "";
    displayNotes(notes);
    noteCreatorPage.classList.toggle("show-note-creator");
  } else {
    alert("Can't Add Empty Note");
    noteCreatorPage.classList.toggle("show-note-creator");
  }
});

// display original notes
function displayNotes(notes) {
  containerOfNotes.innerHTML = "";
  let card;
  for (const { content, date } of notes) {
    let CalcPassedDays = function (date1, date2) {
      let passedDays = Math.round(
        Math.abs((date1 - date2) / (1000 * 60 * 60 * 24))
      );
      console.log(passedDays);
      if (passedDays == 0) {
        return "Today";
      }
      if (passedDays == 1) {
        return "Yesterday";
      }
      if (passedDays <= 7) {
        return `${passedDays} days ago`;
      } else {
      return  new Intl.DateTimeFormat("en-GB", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        }).format(new Date(date));
      }
    };

    let displayedDate = CalcPassedDays(Date.now(), new Date(date));
    card = `<div class="note" data-sort='${displayedDate}'>
    <i class="fa-solid fa-pen-to-square editIcon edit"></i>
    <div class="note-content">${content}</div>
    <i class="fa-solid fa-trash-can removeIcon delete"></i>
    <span class="date"> ${displayedDate} </span>
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
    inputUpdate.value = e.target.nextElementSibling.textContent;
    nextElementValue = e.target.nextElementSibling.textContent;
  }
});

updateBtn.addEventListener("click", function () {
  if (inputUpdate.value != "") {
    // update array
    notes[notes.findIndex((note) => note.content == nextElementValue)].content =
      inputUpdate.value;
    // update dom
    inputUpdate.value = "";
    displayNotes(notes);
    noteUpdaterBox.classList.add("show-note-updater");
    // update local storage
    localStorage.setItem("note", JSON.stringify(notes));

    containerOfNotes.style.display = "flex";
  } else {
    alert("Can't Save Empty Notes");
  }
});

// unhide notes by the secret btn
secertBtn.addEventListener("click", function () {
  clickCounter++;
  if (clickCounter == 5) {
    fakeNotes.classList.remove("show-fake-notes");
    containerOfNotes.style.display = "flex";
    sortBtn.style.display = "flex";
    deletedNotesBtn.style.display = "flex";
  }
});

// sorting
let sortedState = false;
sortBtn.addEventListener("click", function () {
  let sortedNotes = [];
  notes.forEach((note) => {
    let notte = {
      content: note.content,
      date: +new Date(note.date),
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
    displayNotes(notes);
    sortedState = !sortedState;
  }
});

// deleted notes page functionality

// display deleted notes
function displayDeletedNotes(deletedNotes) {
  deletedNotesContainer.innerHTML = "";
  let card;
  for (let { content } of deletedNotes) {
    card = `<div class="deleted-note">
  <i class="fa-solid fa-trash remove-forever"></i>
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
    let userDecision = confirm("Are Sure To Delete This Note ForEver !");
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

// Login and sign up functions

function login() {
  loginPage.style.display = "flex";
  loginBtn.addEventListener("click", function () {
    if (passwordInputLogin.value == passcode) {
      alert("logged in successfully");
      favIcon.href = "./unlock.png";
      loginPage.style.display = "none";
      fakeNotes.classList.add("show-fake-notes");
      // in case this the first visit to the site from this user
      let firstVisit = JSON.parse(localStorage.getItem("firstVisit"));
      setTimeout(() => {
        if (firstVisit == null) {
          alert(
            "Show YOUR Hidden Notes By Clicking On 'Your Notes' Word 5 Times"
          );
          firstVisit = false;
          localStorage.setItem("firstVisit", JSON.stringify(firstVisit));
        }
      }, 200);
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
