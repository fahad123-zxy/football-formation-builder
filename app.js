const formations = {
  "4-3-3": [
    [50,90],[15,67],[38,73],[62,73],[85,67],[50,48],[28,55],[72,55],[18,24],[50,27],[82,24]
  ],
  "4-4-2": [
    [50,90],[14,67],[38,72],[62,72],[86,67],[18,46],[38,48],[62,48],[82,46],[38,19],[62,19]
  ],
  "3-5-2": [
    [50,90],[27,69],[50,74],[73,69],[12,51],[32,48],[50,55],[68,48],[88,51],[38,20],[62,20]
  ],
  "4-2-3-1": [
    [50,90],[14,67],[38,72],[62,72],[86,67],[38,52],[62,52],[18,35],[50,32],[82,35],[50,17]
  ],
  "3-4-3": [
    [50,90],[25,70],[50,74],[75,70],[15,48],[38,48],[62,48],[85,48],[17,20],[50,24],[83,20]
  ],
  "5-3-2": [
    [50,90],[8,69],[28,72],[50,75],[72,72],[92,69],[28,48],[50,54],[72,48],[38,19],[62,19]
  ]
};

const defaultNames = ["Jordan","Mason","Theo","Jamie","Ryan","Alex","Leo","Sam","Max","Ben","Eli"];
let kitColor = "#2855d9";
let currentFormation = "4-3-3";

const pitch = document.getElementById("pitch");
const playerList = document.getElementByElementById("playerList");

function renderPlayers(names = defaultNames) {
  pitch.querySelectorAll(".player").forEach(player => player.remove());
  playerList.innerHTML = "";

  formations[currentFormation].forEach((position, index) => {
    const player = document.createElement("div");
    player.className = "player";
    player.style.left = position[0] + "%";
    player.style.top = position[1] + "%";
    player.dataset.index = index;
    player.style.setProperty("--kit-color", kitColor);
    player.innerHTML = `<div class="player-shirt">${index + 1}</div><div class="player-name">${names[index]}</div>`;
    pitch.appendChild(player);
    makeDraggable(player);

    const row = document.createElement("div");
    row.className = "player-row";
    row.innerHTML = `<div class="player-number">${index + 1}</div><input value="${names[index]}" maxlength="14" aria-label="Player ${index + 1} name">`;
    row.querySelector("input").addEventListener("input", event => {
      player.querySelector(".player-name").textContent = event.target.value || `Player ${index + 1}`;
    });
    playerList.appendChild(row);
  });
}

function makeDraggable(player) {
  player.addEventListener("pointerdown", event => {
    event.preventEventDefault();
    player.setPointerCapture(event.pointerId);

    const move = moveEvent => {
      const rect = pitch.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, moveEvent.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, moveEvent.clientY - rect.top));
      player.style.left = (x / rect.width * 100) + "%";
      player.style.top = (y / rect.height * 100) + "%";
    };

    const stop = () => {
      player.removeEventListener("pointermove", move);
      player.removeEventListener("pointerup", stop);
      player.removeEventListener("pointercancel", stop);
    };

    player.addEventListener("pointermove", move);
    player.addEventListener("pointerup", stop);
    player.addEventListener("pointercancel", stop);
  });
}

function setFormation(name) {
  currentFormation = name;
  document.querySelectorAll("[data-formation]").forEach(button => {
    button.classList.toggle("active", button.dataset.formation === name);
  });
  document.getElementById("pitchFormation").textContent = name + " Formation";
  const squadNames = Array.from(playerList.querySelectorAll("input")).map(input => input.value);
  renderPlayers(squadNames.length ? squadNames : defaultNames);
}

document.querySelectorAll("[data-formation]").forEach(button => {
  button.addEventListener("click", () => setFormation(button.dataset.formation));
});

document.querySelectorAll(".swatch").forEach(button => {
  button.addEventListener("click", () => {
    kitColor = button.dataset.color;
    document.documentElement.style.setProperty("--blue", kitColor);
    document.querySelectorAll(".swatch").forEach(swatch => swatch.classList.remove("active"));
    button.classList.add("active");
    pitch.querySelectorAll(".player").forEach(player => player.style.setProperty("--kit-color", kitColor));
  });
});

document.getElementById("teamName").addEventListener("input", event => {
  document.getElementById("pitchTeam").textContent = event.target.value || "Untitled team";
});

document.getElementById("clearPlayers").addEventListener("click", () => {
  playerList.querySelectorAll("input").forEach((input, index) => {
    input.value = "";
    pitch.querySelectorAll(".player")[index].querySelector(".player-name").textContent = "Player " + (index + 1);
  });
});

document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("teamName").value = "Blue Tigers";
  document.getElementById("pitchTeam").textContent = "Blue Tigers";
  kitColor = "#2855d9";
  document.documentElement.style.setProperty("--blue", kitColor);
  document.querySelectorAll(".swatch").forEach((swatch, index) => swatch.classList.toggle("active", index === 0));
  setFormation("4-3-3");
  renderPlayers(defaultNames);
});

document.getElementById("saveBtn").addEventListener("click", async () => {
  const captureArea = document.querySelector(".pitch-wrap");
  const canvas = await html2canvas(captureArea, { backgroundColor: "#f7f8fa", scale: 2 });
  const link = document.createElement("a");
  link.download = "football-formation.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

renderPlayers();
document.querySelector('[data-formation="4-3-3"]').classList.add("active");
