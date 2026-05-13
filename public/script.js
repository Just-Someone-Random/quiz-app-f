const themeBtn = document.getElementById("theme-btn");
const body = document.body;
const quizBtn = document.getElementById("quiz");
const content = document.querySelector("#content");
const quizContainer = document.querySelector("#quiz-container");
const add = document.getElementById("add");

const q = document.getElementById("q");
const op1 = document.getElementById("op1");
const op2 = document.getElementById("op2");
const op3 = document.getElementById("op3");
const op4 = document.getElementById("op4");
const next = document.getElementById("submit-quiz");
const end = document.getElementById("end");
const resultContainer = document.getElementById("result-container");
const result = document.getElementById("result");

const question = document.getElementById("question");
const option1 = document.getElementById("option1");
const option2 = document.getElementById("option2");
const option3 = document.getElementById("option3");
const option4 = document.getElementById("option4");
const correct = document.getElementById("correct");

let form = [];
let score = 0;
let i = 0;
let options = [op1, op2, op3, op4];

themeBtn.addEventListener("click", function () {
  body.classList.toggle("lightmode");
});

add.addEventListener("click", async function (e) {
  e.preventDefault();

  if (
    question.value &&
    option1.value &&
    option2.value &&
    option3.value &&
    option4.value &&
    correct.value
  ) {
    const data = {
      question: question.value,
      option1: option1.value,
      option2: option2.value,
      option3: option3.value,
      option4: option4.value,
      correct: correct.value.trim()
    };

    await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    question.value = "";
    option1.value = "";
    option2.value = "";
    option3.value = "";
    option4.value = "";
    correct.value = "";

    alert("Question saved!");
  } else {
    alert("Please fill all fields");
  }
});

quizBtn.addEventListener("click", async function (e) {
  e.preventDefault();

  const response = await fetch("/api/questions");
  form = await response.json();

  if (form.length === 0) {
    alert("No questions found. Please add some first.");
    return;
  }

  i = 0;
  score = 0;
  switchWindows(content, quizContainer);
  loadQuestion();
});

function loadQuestion() {
  q.textContent = form[i].question;
  op1.textContent = form[i].option1;
  op2.textContent = form[i].option2;
  op3.textContent = form[i].option3;
  op4.textContent = form[i].option4;
}

next.addEventListener("click", function () {
  const correctIndex = String(form[i].correct).trim();
const correctBtn = document.getElementById("op" + correctIndex);
if (correctBtn) correctBtn.classList.add("correct");
  options.forEach((btn) => {
    if (
      btn.classList.contains("selected") &&
      btn.classList.contains("correct")
    ) {
      score++;
    }
  });

  i++;

  if (i === form.length) {
    next.style.display = "none";
    end.style.display = "flex";
    end.style.justifyContent = "center";
    end.style.alignItems = "center";
    end.style.width = "40%";
    end.style.borderRadius = "50px";
  } else {
    options.forEach((btn) =>
      btn.classList.remove("selected", "correct")
    );

    loadQuestion();
  }
});

end.addEventListener("click", async function () {
  switchWindows(quizContainer, resultContainer);

  result.textContent =
    "You scored " + score + " out of " + form.length;

  await fetch("/api/questions", {
    method: "DELETE"
  });
});

options.forEach((op) => {
  op.onclick = () => {
    options.forEach((btn) =>
      btn.classList.remove("selected")
    );

    op.classList.add("selected");
  };
});

question.addEventListener("keydown", (e) => {
  if (e.key === "Enter") option1.focus();
});

option1.addEventListener("keydown", (e) => {
  if (e.key === "Enter") option2.focus();
});

option2.addEventListener("keydown", (e) => {
  if (e.key === "Enter") option3.focus();
});

option3.addEventListener("keydown", (e) => {
  if (e.key === "Enter") option4.focus();
});

option4.addEventListener("keydown", (e) => {
  if (e.key === "Enter") correct.focus();
});

correct.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    add.click();
    question.focus();
  }
});

function switchWindows(fromW, toW) {
  fromW.classList.add("fade-out");
  fromW.classList.remove("fade-in");

  setTimeout(() => {
    fromW.style.display = "none";

    toW.style.display = "flex";

    toW.classList.remove("fade-out");
    toW.classList.add("fade-in");
  }, 500);
}
