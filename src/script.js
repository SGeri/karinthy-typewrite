const fs = require("fs-extra");

const submitButton = document.getElementById("button-submit");
const nameInput = document.getElementById("name");
const textInput = document.getElementById("text");
const alertHolder = document.getElementById("alert-holder");

document.addEventListener("DOMContentLoaded", async function () {
  await readConfig();
});

setInterval(async () => {
  const currentPosition = textInput.selectionStart;

  if (global.prevPosition > currentPosition) {
    textInput.setSelectionRange(prevPosition, prevPosition);
  }

  global.prevPosition = currentPosition;
}, 100);

submitButton.onclick = async function () {
  submitButton.style.display = "none";

  if (!nameInput.value || !textInput.value) {
    await showErrorMessage("Hiányzó mezők!");
    return;
  }

  await fs.outputFile(
    getFileSavePath(nameInput.value),
    textInput.value,
    async function (err) {
      if (err) await showErrorMessage("Sikertelen mentés: \n" + err);
    }
  );

  await showSuccessMessage("Tesztedet sikeresen elküldted!");
};

function showErrorMessage(message) {
  alertHolder.innerHTML =
    `<div id="alert-error" class="alert alert-danger" role="alert">` +
    message +
    `</div>`;

  setTimeout(function () {
    alertHolder.innerHTML = "";
    submitButton.style.display = "inherit";
  }, 3000);
}

function showSuccessMessage(message) {
  alertHolder.innerHTML =
    `<div id="alert-success" class="alert alert-primary" role="alert">` +
    message +
    `</div>`;
}

function getFileSavePath(name) {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

  return global.config.sharedDirectoryPath + `\\${date}\\${name}.txt`;
}

async function readConfig() {
  const localConfig = JSON.parse(await fs.readFileSync("./app-config.json"));

  global.config = {
    sharedDirectoryPath: localConfig.sharedDirectoryPath,
    prevPosition: 0,
  };
}
