const API_URL = "https://script.google.com/macros/s/AKfycbxMESs7vN-Gh69b5pyHIxDhZwy0phC-AFDudWZnKhzxmhyzDw0KndfC5UadJQeIIm5ULA/exec";

let lastRuns = null;
let lastWickets = null;

function ballsToOvers(balls) {
  return Math.floor(balls / 6) + "." + (balls % 6);
}


async function fetchScore() {
  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    const d = await res.json();

    // Core UI
    document.getElementById("battingTeam").innerText = d.battingTeam || "";
    document.getElementById("fieldingTeam").innerText = d.fieldingTeam || "";
    document.getElementById("match").innerText = d.match || "";
    document.getElementById("matchInfo").innerText = d.matchInfo || "";
    document.getElementById("thisOver").innerText =
      `This over: ${d.thisOver ? d.thisOver : "–"}`;

    const runs = Number(d.runs || 0);
    const wickets = Number(d.wickets || 0);
    const balls = Number(d.balls || 0);
    const innings = Number(d.innings || 1);
    const target = Number(d.target || 0);

    document.getElementById("total").innerText = `${runs}-${wickets}`;
    document.getElementById("overs").innerText = `${ballsToOvers(balls)} overs`;

    // Target logic
    const targetEl = document.getElementById("target");
    if (innings === 2 && target > 0) {
      const need = target - runs;
      targetEl.style.display = "inline-block";
      targetEl.innerText = need > 0 ? `${d.battingTeam} need ${need} runs` : `${d.battingTeam} won`;
    } else {
      targetEl.style.display = "none";
      targetEl.innerText = "";
    }

    // 🔥 EVENT DETECTION
    if (lastRuns !== null) {
      const diff = runs - lastRuns;
      if (diff === 4) {
        showEvent("4", "four");
          launchConfettiFull();
      }

      if (diff === 6) {
        showEvent("6", "six");
        launchConfettiFull();
      }

    }

    if (lastWickets !== null && wickets > lastWickets) {
      showEvent("WICKET", "wicket");
    }

    lastRuns = runs;
    lastWickets = wickets;

  } catch (e) {
    console.error("Score fetch error:", e);
  }
}

fetchScore();
setInterval(fetchScore, 1000);


function showEvent(text, type) {
  const el = document.getElementById("eventOverlay");
  const textEl = document.getElementById("eventText");
  const labelEl = document.getElementById("eventLabel");

  const label =
    type === "four" ? "FOUR" :
    type === "six" ? "SIX" :
    type === "wicket" ? "WICKET" : "";

  el.className = "";
  textEl.innerText = text;
  labelEl.innerText = label;
  el.classList.add(type, "show");

  setTimeout(() => {
    el.className = "";
    textEl.innerText = "";
    labelEl.innerText = "";
  }, 2400);
}

/* Full-screen confetti */
function launchConfettiFull() {
  const colors = ["", "white", "orange"];

  for (let i = 0; i < 80; i++) {
    const c = document.createElement("div");
    c.className = "confetti " + colors[Math.floor(Math.random() * colors.length)];
    c.style.left = Math.random() * 100 + "vw";
    c.style.animationDelay = (Math.random() * 0.3) + "s";
    document.body.appendChild(c);

    setTimeout(() => c.remove(), 1700);
  }
}
