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
let clickCounter = 0;
let nextElementValue;



// check localstorage if there is password stored or not
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
  
// display notes if there are available notes
displayNotes(notes);

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
  } else {
    alert("Can't Add Empty Note");
  }
});

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
        new Intl.DateTimeFormat("en-GB", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        }).format(new Date(date));
      }
    };

    let displayedDate = CalcPassedDays(Date.now(), new Date(date));
    card = `<div class="note" data-sort='${displayedDate}'>
    <i class='bx bx-edit editIcon edit'></i>
    <div class="note-content">${content}</div>
    <i class='bx bxs-message-square-x removeIcon delete'></i>
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
      // remove from the array
      notes.splice(
        notes.findIndex(
          (note) => note == e.target.previousElementSibling.textContent
        ),
        1
      );
      // remove from the localstorage
      localStorage.setItem("note", JSON.stringify(notes));
    }
  }

  //  edit a note
  if (e.target.classList.contains("edit")) {
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
    sortBtn.style.display="flex"
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
  if(sortedState == false){

    sortedNotes.sort((a, b) => {
      if (a.date > b.date) return -1;
      if (b.date > a.date) return 2;
    });
    sortedState = !sortedState
    sortBtn.textContent="Sort (New to Old)"
    displayNotes(sortedNotes);




  }
  else{
    displayNotes(notes)
    sortedState = !sortedState
    sortBtn.textContent="Sort (old to new)"
  }

});

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
          alert("Show YOUR Hidden Notes By Clicking this 'Your Notes' 5 Times");
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
