
const conditions = {
  paper_rock: true,
  paper_scissors: false,
  paper_paper: null,
  scissors_paper: true,
  scissors_rock: false,
  scissors_scissors: null,
  rock_paper: false,
  rock_scissors: true,
  rock_rock: null,
}

const choices = {
  rock: "<div id=\"result-rock\" class=\"action-btn red result\"><img src=\"./assets/images/icon-rock.svg\"></div>",
  paper: "<div id=\"result-paper\" class=\"action-btn blue result\"><img src=\"./assets/images/icon-paper.svg\"></div>",
  scissors: "<div id=\"result-scissor\" class=\"action-btn yellow result\"><img src=\"./assets/images/icon-scissors.svg\"></div>"
}

let leaderboards = [];


window.onload = () => {
  const rockBtn = document.getElementById("rock")
  const paperBtn = document.getElementById("paper")
  const scissorsBtn = document.getElementById("scissors")
  const buttonsContainer = document.getElementById("buttons")
  const resultsContainer = document.getElementById("results")
  const score = document.getElementById("score");
  const again = document.getElementById("again");
  const resultTitle = document.getElementById("results-title");
  const saveBtn = document.getElementById("save-btn");
  const nameField = document.getElementById("name");
  const leaderboardsBtn = document.getElementById("leaderboards-btn");

  const options = ["rock", "paper", "scissors"]

  let cpu = null;
  let played = false;
  let loading = false;

  const restart = () => {
    cpu = null;
    buttonsContainer.classList.remove("fadeout")
    buttonsContainer.classList.remove("none");
    resultTitle.classList.remove("fadein")
    played = false;
    resultsContainer.classList.add("none");
    again.classList.add("none")
    $("#picked").find("div").remove();
    $("#cpu").find("div").remove();
    resultTitle.innerText = "";
  }

  const init = () => {
    rockBtn.onclick = () => clickAction("rock");
    paperBtn.onclick = () => clickAction("paper");
    scissorsBtn.onclick = () => clickAction("scissors");
    again.onclick = restart;
    saveBtn.onclick = saveScore;
    leaderboardsBtn.onclick = showLeaderboards;

    const scoreCount = localStorage.getItem("score");
    showLeaderboards();
    score.innerText = Number(scoreCount);
  }


  const saveScore = () => {
    // Could've used jquery ajax, but I wanted to learn natively
    const xhr = new XMLHttpRequest();
    const points = localStorage.getItem("score");

    xhr.open('POST', 'https://jokenpo-api.herokuapp.com/');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
      if (xhr.status === 200) {
        showLeaderboards();
        localStorage.setItem("score", 0);
        $('#saveScore').modal('toggle');
        score.innerText = 0;
      }
    };
    xhr.send(JSON.stringify({
      name: nameField.value,
      points
    }));
    loading = true;


  }

  const showLeaderboards = () => {
    fetch("https://jokenpo-api.herokuapp.com/").then(response => {
      return response.json();
    }).then((response) => {

      leaderboards = response;
      loading = false;

      $("#results-body").empty();
      console.log(leaderboards)
      leaderboards.forEach(({ name, points }, index) => {
        console.log(index, name)
        $("#results-body").append(`<tr><th>${index}</th><td>${name}</td><td>${points}</td></tr>`)

      })
    })

  }

  const clickAction = (option = "") => {
    if (!played) {
      cpu = options[Math.floor(Math.random() * 3)];
      const checkWin = conditions[`${option}_${cpu}`]

      played = true;

      buttonsContainer.classList.add("fadeout");
      setTimeout(() => {
        buttonsContainer.classList.add("none");
        resultsContainer.classList.remove("none");
        resultsContainer.classList.add("fadein");

        $("#picked").append(choices[option]);

        setTimeout(() => {
          console.log(cpu)
          $("#cpu").append(choices[cpu]);
          setTimeout(() => {
            resultTitle.classList.add("fadein")
          }, 500)
        }, 1000)



        if (checkWin) {
          const scoreCount = localStorage.getItem("score");
          localStorage.setItem("score", Number(scoreCount) + 1);
          score.innerText = Number(scoreCount) + 1;
          resultTitle.innerText = "YOU WIN";
        } else if (checkWin === false) {
          resultTitle.innerText = "YOU LOST";
        } else {
          resultTitle.innerText = "TIE";
        }



        setTimeout(() => {
          again.classList.remove("none")
          again.classList.add("fadein")
        }, 2500)


      }, 2000)
    }
  }



  init();
  restart();
}