"use strict";

document.addEventListener("DOMContentLoaded", start);

const HTML = {};
const sortingStudents = document.querySelectorAll(".sort");
const myButtons = document.querySelectorAll(".filter");
let studentJSON = [];
let allOfStudent = [];
let currentList = [];
let countsOfStudents;
let winners = [];
let expelledStudents = [];
let bloodArray = [];
let halfBloodArray = [];
let pureBloodArray = [];

const Student = {
  firstName: "",
  lastName: "",
  gender: "",
  house: "",
  bloodStatus: "",
  middleName: null,
  nickName: null,
  image: null,
  star: false,
  winner: false,
  expelled: false
};

//START AND GET JSON

function start() {
  HTML.template = document.querySelector(".student-temp");
  HTML.dest = document.querySelector(".listofstudents");
  HTML.popup = document.querySelector(".popup");
  HTML.wrapper = document.querySelector(".section-wrapper");
  HTML.studentName = document.querySelector(".contentpopup>h2");
  allOfStudent = currentList;

  countsOfStudents = 0;

  // Adds event-listeners to filter and sort buttons
  // FILTER BUTTONS.
  //THE HARD-CODED WAY

  /* document.querySelector("[data-filter='Gryffindor']").addEventListener("click", filterGryffindor);
  document.querySelector("[data-filter='Hufflepuff']").addEventListener("click", filterHufflepuff);
  document.querySelector("[data-filter='Ravenclaw']").addEventListener("click", filterRavenclaw);
  document.querySelector("[data-filter='Slytherin']").addEventListener("click", filterSlytherin);
  document.querySelector("[data-filter='all']").addEventListener("click", showAll);
  document.querySelector("[data-filter='expelled']").addEventListener("click", showExpelled); */

  // SORT BUTTONS & FILTER BUTTONS
  // THE EASY WAY

  sortingStudents.forEach(button => {
    button.addEventListener("click", sortButtonClick);
  });

  myButtons.forEach(botton => {
    botton.addEventListener("click", filterBottonClick);
  });

  getJson();
  //changes body color with dropdown menu.
  document.querySelector("select#theme").addEventListener("change", selectTheme);
}

//ASYNC Function getJson.

async function getJson() {
  const jsonData = await fetch("https://petlatkea.dk/2020/hogwarts/students.json");
  const bloodStatus = await fetch("http://petlatkea.dk/2020/hogwarts/families.json");

  studentJSON = await jsonData.json();
  bloodArray = await bloodStatus.json();

  arrangeObjects(studentJSON, bloodArray);
}

// NOT NEEDED
function selectTheme() {
  document.querySelector("body").setAttribute("data-house", this.value);
}

//Display List function that helps the filtering to work.

function displayList(student) {
  // clear the list
  document.querySelector(".listofstudents").innerHTML = "";

  // build a new list
  currentList.forEach(showStudent);
}

//Filtering by House.

function filterGryffindor() {
  currentList = allOfStudent.filter(isGryffindor);
  displayList(currentList);
}

function filterHufflepuff() {
  currentList = allOfStudent.filter(isHufflepuff);
  displayList(currentList);
}
function filterRavenclaw() {
  currentList = allOfStudent.filter(isRavenclaw);
  displayList(currentList);
}
function filterSlytherin() {
  currentList = allOfStudent.filter(isSlytherin);
  displayList(currentList);
}
function showAll() {
  currentList = allOfStudent.filter(isAll);
  displayList(currentList);
}

function isGryffindor(student) {
  return student.house === "Gryffindor";
}

function isHufflepuff(student) {
  return student.house === "Hufflepuff";
}
function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}
function isSlytherin(student) {
  return student.house === "Slytherin";
}

function isAll(student) {
  return student;
}

//POPUP
function showPopup(student) {
  console.log("showPopup");

  HTML.popup.classList.add("popup-appear");

  document.querySelector(".contentpopup").setAttribute("data-house", student.house);

  document.querySelector(".contentpopup>h3").textContent = "House: " + student.house;

  document.querySelector(".contentpopup>h4").textContent = "Gender: " + student.gender;

  document.querySelector(".contentpopup>h5").textContent = "Bloodstatus: " + student.blood;

  document.querySelector(".contentpopup>img").src = `images/${student.image}.png`;

  if (student.lastName == undefined) {
    HTML.studentName.textContent = student.firstName;
  } else if (student.middleName == undefined) {
    HTML.studentName.textContent = student.firstName + " " + student.lastName;
  } else {
    HTML.studentName.textContent = student.firstName + " " + student.middleName + " " + student.lastName;
  }

  if (student.nickName != null) {
    HTML.studentName.textContent = `${student.firstName} "${student.nickName}" ${student.lastName}`;
  }

  document.querySelector(".contentpopup>h3").textContent = "House: " + student.house;
  if (student.fullName == "") {
    HTML.studentName.textContent = student.fullName + "";
  }
  document.querySelector(".close").addEventListener("click", () => {
    HTML.popup.classList.remove("popup-appear");
  });
}

//CLEAN UP DATA

function arrangeObjects() {
  halfBloodArray = bloodArray.half;
  pureBloodArray = bloodArray.pure;

  console.log(halfBloodArray);
  console.log(pureBloodArray);

  studentJSON.forEach(cleanData);
  currentList = allOfStudent;
  console.log(bloodArray);
}

function cleanData(studentData) {
  let student = Object.create(Student);

  // FULLNAME //TRIM REMOVES WHITESPACE
  let fullName = studentData.fullname.trim();
  fullName = fullName.toLowerCase();

  // FIRSTNAME
  let firstletter = fullName.substring(0, 1);
  firstletter = firstletter.toUpperCase();

  student.firstName = fullName.substring(1, fullName.indexOf(" "));
  student.firstName = firstletter + student.firstName;

  // LASTNAME
  student.lastName = fullName.substring(fullName.lastIndexOf(" ") + 1, fullName.length + 1);

  let firstletterLastName = student.lastName.substring(0, 1);
  firstletterLastName = firstletterLastName.toUpperCase();
  student.lastName = firstletterLastName + fullName.substring(fullName.lastIndexOf(" ") + 2, fullName.length + 1);

  // MIDDLE NAME
  student.middleName = fullName.substring(student.firstName.length + 1, fullName.lastIndexOf(" "));
  let firstletterMiddle = student.middleName.substring(0, 1);
  firstletterMiddle = firstletterMiddle.toUpperCase();
  if (student.middleName == " ") {
    student.middleName = null;
  } else if (student.middleName.includes('"')) {
    firstletterMiddle = student.middleName.substring(1, 2);
    firstletterMiddle = firstletterMiddle.toUpperCase();
    student.nickName = firstletterMiddle + fullName.substring(student.firstName.length + 3, fullName.lastIndexOf(" ") - 1);
  } else {
    student.middleName = firstletterMiddle + fullName.substring(student.firstName.length + 2, fullName.lastIndexOf(" "));
  }

  if (fullName.includes(" ") == false) {
    student.firstName = fullName.substring(1);
    student.firstName = firstletter + student.firstName;

    student.middleName = null;
    student.lastName = null;
  }
  // IMAGES

  student.image = student.lastName + "_" + firstletter;
  student.image = student.image.toLowerCase();

  if (student.lastName == "Patil") {
    student.image = student.lastName + "_" + student.firstName;
    student.image = student.image.toLowerCase();
  } else if (student.lastName == "Finch-fletchley") {
    student.image = "fletchley_j";
  } else if (student.lastName == null) {
    student.image = null;
  }

  // GENDER

  let genderDisplay = studentData.gender;
  let firstCharGender = genderDisplay.substring(0, 1);
  firstCharGender = firstCharGender.toUpperCase();
  student.gender = firstCharGender + genderDisplay.substring(1);

  // HOUSE
  student.house = studentData.house.toLowerCase();
  student.house = student.house.trim();
  let houses = student.house.substring(0, 1);
  houses = houses.toUpperCase();
  student.house = houses + student.house.substring(1);

  //Bloodstatus
  const halfBloodType = halfBloodArray.some(halfBlood => {
    return halfBlood === student.lastName;
  });
  const pureBloodType = pureBloodArray.some(pureBlood => {
    return pureBlood === student.lastName;
  });
  if (halfBloodType === true) {
    student.blood = "Halfblood";
  } else if (pureBloodType === true) {
    student.blood = "Pureblood";
  } else {
    student.blood = "Muggle";
  }
  console.log(student);

  allOfStudent.push(student);
  showStudent(student);
}

function showStudent(student) {
  let klon = HTML.template.cloneNode(true).content;
  let expellStudent = klon.querySelector("[data-field=expell]");
  let studentWinner = klon.querySelector("[data-field=winner]");

  if (student.lastName == undefined) {
    klon.querySelector("li").textContent = student.firstName;
  } else {
    klon.querySelector("li").textContent = student.firstName + " " + student.lastName;
  }

  if (student.lastName == "") {
    klon.querySelector("li").textContent = student.firstName + " " + student.lastName;
    +"";
  }

  HTML.dest.appendChild(klon);

  HTML.dest.lastElementChild.addEventListener("click", () => {
    showPopup(student);
  });

  //expell click function

  expellStudent.addEventListener("click", function() {
    expellAStudent(student);
  });

  //setprefict

  if (student.winner === true) {
    studentWinner.classList.remove("grayout");
  } else {
    studentWinner.classList.add("grayout");
  }

  //prefict click function
  studentWinner.addEventListener("click", function() {
    checkWinner(student);
  });
}

//Expell student

function expellAStudent(student) {
  console.log("henrik");

  student.expelled = true;

  expelledStudents.push(student);

  currentList = allOfStudent.filter(student => {
    return student.expelled === false;
  });

  console.log(student.expelled);
  displayList(currentList);
}

//CheckWinner
//first make new array with animals set to be winners
//Checks if animal.type and winner.type are the same and store in variable
//if they are the same animal.winner is false
//if the animal types are the same you cannot choose that as a winner
//only one type of animal can be a

function checkWinner(student) {
  winners = currentList.filter(student => student.winner === true);
  const winnerType = winners.some(winner => {
    return winner.house === student.house;
  });
  if (student.winner === true) {
    student.winner = false;
  } else {
    if (winnerType) {
      //calling oneWinnerOfEachType function
      oneWinnerOfEachType();
      student.winner = false;
    } else if (winners.length == 2) {
      //calling removeOneToAddAnother function
      removeOneToAddAnother();
      student.winner = false;
    } else {
      student.winner = true;
    }
  }

  console.log(winners);
  console.log(student.winner);
  displayList(currentList);
}

//Eventslisterners on buttons in dialog popups
//Printing the correct text string into dialog popups

function oneWinnerOfEachType() {
  document.querySelector("#onlyonekind").classList.add("show");
  document.querySelector("#onlyonekind .closebutton").addEventListener("click", closeDialog);
  document.querySelector("#onlyonekind .removebutton1").addEventListener("click", () => {
    closeDialog();
  });
  console.log(oneWinnerOfEachType);
  document.querySelector("#onlyonekind .student1").textContent = winners[0].firstName + " " + winners[0].lastName + " " + winners[0].house;
}

function removeOneToAddAnother() {
  document.querySelector("#onlytwowinners").classList.add("show");
  document.querySelector("#onlytwowinners .closebutton").addEventListener("click", closeDialog);
  document.querySelector("#onlytwowinners .removebutton1").addEventListener("click", () => {
    removeOneAnimal();
  });
  console.log(removeOneToAddAnother);
  document.querySelector("#onlytwowinners .student1").textContent = winners[0].firstName + " " + winners[0].lastName + " " + winners[0].house;
  document.querySelector("#onlytwowinners .student2").textContent = winners[1].firstName + " " + winners[1].lastName + " " + winners[1].house;
}

//DIALOG BOX

function closeDialog() {
  document.querySelector("#onlytwowinners").classList.remove("show");
  document.querySelector("#onlyonekind").classList.remove("show");
  start();
}

function removeOneAnimal() {
  document.querySelector("#onlytwowinners").classList.remove("show");
  // TODO: Remove winner icon and make the selected student being removed
  // to false again. NEED HELP!
}

//sorting

function sortButtonClick() {
  console.log("sortButton");

  //const sort = this.dataset.sort;
  if (this.dataset.action === "sort") {
    clearAllSort();
    console.log("forskellig fra sorted", this.dataset.action);
    this.dataset.action = "sorted";
  } else {
    if (this.dataset.sortDirection === "asc") {
      this.dataset.sortDirection = "desc";
      console.log("sortdir desc", this.dataset.sortDirection);
    } else {
      this.dataset.sortDirection = "asc";
      console.log("sortdir asc", this.dataset.sortDirection);
    }
  }
  mySort(this.dataset.sort, this.dataset.sortDirection);
}

function clearAllSort() {
  console.log("clearAllSort");
  sortingStudents.forEach(botton => {
    botton.dataset.action = "sort";
  });
}

function mySort(sortBy, sortDirection) {
  console.log(`mySort-, ${sortBy} sortDirection-  ${sortDirection}  `);
  let desc = 1;
  currentList = allOfStudent.filter(allOfStudent => true);

  if (sortDirection === "desc") {
    desc = -1;
  }

  currentList.sort(function(a, b) {
    var x = a[sortBy];
    var y = b[sortBy];
    if (x < y) {
      return -1 * desc;
    }
    if (x > y) {
      return 1 * desc;
    }
    return 0;
  });

  displayList(currentList);
}

//--------------------------------------FILTER

function filterBottonClick() {
  const filter = this.dataset.filter;
  clearAllSort();
  console.log(filter);
  myFilter(filter);
}

function myFilter(filter) {
  console.log("myFilter", filter);
  if (filter === "all") {
    currentList = allOfStudent.filter(allOfStudent => true);
    displayList(currentList);
  } else if (filter === "expelled") {
    currentList = expelledStudents;
    displayList(currentList);
  } else {
    currentList = allOfStudent.filter(student => student.house === filter);
    displayList(currentList);
  }
}
