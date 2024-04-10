// El use strict es per a que el codi sigui més segur i no es puguin fer coses que no es poden fer en JS
"use strict";

// Importacions
import { dic } from "./dictionary/diccionari.js";

let keyboardListener;
let screenKeyboardListener;
let keyboardLines;

// Dades
let utilsGame = {
  letraClicada: "",
  currentRow: 0,
  playingCol: 0,
  currentCol: 1,
  abecedariCatala: [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "Ç",
    "ENTER",
    "BACKSPACE",
  ],
};

let dataUser = {
  name: "",
  surname: "",
  email: "",
  phone: "",
  games: 0,
  wins: 0,
  bestGame: 0,
  fastestGame: 0,
};

const paraula = dic[Math.floor(Math.random() * dic.length)];

window.onload = () => {
  if (localStorage.getItem("userData") != null) {
    dataUser = JSON.parse(localStorage.getItem("userData"));
    // console.log(dataUser)
    listenerKeyboard();
  } else {
    displayLogin();
  }
};

function displayLogin() {
  Swal.fire({
    // title: 'WORDLE IBC',
    html: `
    <span class='swal-title-inicio'>WORDLE IBC</span>
      <label class="swal-label-inicio">Nom</label>
      <input type="text" id="nom" class="swal2-input swal-input-inicio swal-input-inicio" placeholder="Escriu el teu nom">
      <label class="swal-label-inicio">Cognoms</label>
      <input type="text" id="cognom" class="swal2-input swal-input-inicio" placeholder="Escriu els teu cognoms">
      <label class="swal-label-inicio">Correu</label>
      <input type="email" id="correu" class="swal2-input swal-input-inicio" placeholder="Escriu el teu correu">
      <label class="swal-label-inicio">Telèfon</label>
      <input type="tel" id="telefon" class="swal2-input swal-ultimo-input-inicio" placeholder="Escriu el teu telèfon">
    `,
    focusConfirm: false,
    allowOutsideClick: false, // Aquí se establece para evitar que se cierre al hacer clic fuera
    confirmButtonText: "Jugar",
    preConfirm: () => {
      const nom = document.getElementById("nom").value;
      const cognom = document.getElementById("cognom").value;
      const correu = document.getElementById("correu").value;
      const telefon = document.getElementById("telefon").value;

      if (!nom) {
        Swal.showValidationMessage(`Siusplau, omple el camp del nom`);
        return false;
      }
      if (!cognom) {
        Swal.showValidationMessage(`Siusplau, omple el camp del cognom`);
        return false;
      }

      if (
        correu.search(
          /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
        )
      ) {
        Swal.showValidationMessage(
          `Siusplau, omple el camp del correu correctament`
        );
        return false;
      } else {
        if (!correu) {
          Swal.showValidationMessage(`Siusplau, omple el camp del correu`);
          return false;
        }
      }

      if (!/^(\+34|0034|34)?[ -]*(6|7)[ -]*([0-9][ -]*){8}$/.test(telefon)) {
        Swal.showValidationMessage(
          `Siusplau, omple el camp del telèfon correctament`
        );
        return false;
      } else {
        if (!telefon) {
          Swal.showValidationMessage(`Siusplau, omple el camp del telèfon`);
          return false;
        }
      }
      // console.log(nom + " " + cognom + " " + correu + " " + telefon);
      // dataUser = {
      //   name: nom,
      //   surname: cognom,
      //   email: correu,
      //   phone: telefon,
      //   games: 0,
      //   wins: 0,
      //   bestGame: 0,
      //   fastestGame: 0
      // }
      dataUser.name = nom;
      dataUser.surname = cognom;
      localStorage.setItem("userData", JSON.stringify(dataUser)); // añadimos los datos de usuario al localStorage
      listenerKeyboard();
      return { nom, cognom, correu, telefon };
    },
    customClass: {
      popup: "swal-inicio",
      title: "swal-title-inicio",
    },
  });
}

function listenerKeyboard() {
  console.log(paraula);
  // listener teclado pantalla
  var keyboard = document.getElementsByClassName("teclado")[0];
  keyboardLines = keyboard.children[0].childNodes;
  for (let i = 0; i < keyboardLines.length; i++) {
    for (let j = 0; j < keyboardLines[i].childNodes.length; j++) {
      keyboardLines[i].childNodes[j].addEventListener(
        "click",
        screenKeyboardListener
      );
    }
  }
  // listener teclado real
  document.addEventListener(
    "keyup",
    (keyboardListener = (event) => {
      for (let i = 0; i < utilsGame.abecedariCatala.length; i++) {
        var letter = utilsGame.abecedariCatala[i];
        if (event.key.toUpperCase() == letter) {
          utilsGame.letraClicada = event.key.toUpperCase();
          playGame();
        }
      }
    })
  );
}

// Funciones del navbar
// Events
document
  .querySelector("span[onclick='showInfo()']")
  .addEventListener("click", showInfo);
document
  .querySelector("span[onclick='showData()']")
  .addEventListener("click", showData);
document
  .querySelector("body div[class='header'] div span:nth-child(1)")
  .addEventListener("click", restartGame);

function showInfo() {
  Swal.fire({
    imageUrl: "assets/img/info.png",
    icon: "info",
  });
}

function showData() {
  let userResults = JSON.parse(localStorage.getItem("userData"));
  Swal.fire({
    title: "Estadístiques",
    html:
      "Nom del jugador: " +
      userResults.name +
      " " +
      userResults.surname +
      "<br>Partides realitzades: " +
      userResults.games +
      "<br>Partides guanyades: " +
      userResults.wins +
      "<br>Millor partida: " +
      userResults.bestGame +
      "<br>Record de velocitat: " +
      userResults.fastestGame +
      " segons",
    iconHtml:
      "<span class='material-symbols-outlined' style='color: black;font-weight:bolder'>finance</span>",
  });
}

function shortWordAlert() {
  Swal.fire({
    icon: "error",
    title: "Has de completar la paraula",
    text:
      "No pots deixar cel·les en blanc. Acaba de completar la paraula, si us plau. Si t'has equivocat" +
      " pots esborrar amb la tecla de retrocés.",
  });
}

function winGame(oldTime, oldGames) {
  let userResults = JSON.parse(localStorage.getItem("userData"));
  Swal.fire({
    title: "Enhorabona! Has guanyat!",
    text:
      "Ho has aconseguit amb " +
      oldGames +
      " intents i amb " +
      oldTime +
      " segons",
    icon: "success",
    allowOutsideClick: false, // Aquí se establece para evitar que se cierre al hacer clic fuera
  });
  removeListeners();
}

function lostGame() {

  // Mostrem la paraula a trobar
  Toastify({
    text: paraula,
    duration: 3000,
    gravity: "top",
    position: "center",
    style: {
      background: "#323232",
      width: 3000,
      paddingLeft: "100px",
      paddingRight: "100px",
    },
  }).showToast();
  removeListeners();
}


screenKeyboardListener = () => {
  if (
    keyboardLines[i].childNodes[j].textContent.toUpperCase() ==
    "KEYBOARD_RETURN"
  ) {
    utilsGame.letraClicada = "ENTER";
  } else {
    utilsGame.letraClicada =
      keyboardLines[i].childNodes[j].textContent.toUpperCase();
  }
  playGame();
};

// Función para eliminar los event listeners
function removeListeners() {
  console.log(keyboardLines);
  document.removeEventListener("keyup", keyboardListener);
  for (let i = 0; i < keyboardLines.length; i++) {
    for (let j = 0; j < keyboardLines[i].childNodes.length; j++) {
      keyboardLines[i].childNodes[j].removeEventListener(
        "click",
        screenKeyboardListener
      );
    }
  }
}

function wordNotInDictionary() {
  Swal.fire({
    icon: "error",
    title: "La paraula no existeix al diccionari",
    text: "Tria amb un altre paraula, aquesta no existeix dins del nostre diccionari.",
  });
}

function restartGame() {
  window.location.reload();
}

/**
 * Función para jugar
 */
function playGame() {
  // Recibimos los
  let userResults = JSON.parse(localStorage.getItem("userData"));
  dataUser.games = userResults.games + 1;

  // Iniciamos el cronometro
  let fechaInicio = new Date();
  let cronometro = setInterval(function () {
    let tiempoTranscurrido = new Date() - fechaInicio;

    // Aqui guardamos el tiempo en segundos
    dataUser.fastestGame = parseFloat((tiempoTranscurrido / 1000).toFixed(2));
  }, 20);

  // console.log(utilsGame.currentCol)

  utilsGame.playingCol = document.getElementById(utilsGame.currentCol);
  
  // console.log(utilsGame.playingCol)
  if (utilsGame.currentRow <= 5) {
    if (utilsGame.letraClicada == "BACKSPACE") {
      utilsGame.playingCol.children[utilsGame.currentRow - 1].innerHTML = "";
      utilsGame.currentRow--;
    } else {
      if (utilsGame.currentRow == 5 && utilsGame.letraClicada == "ENTER") {
        utilsGame.currentCol++;
        utilsGame.currentRow = 0;
        let paraulaEscrita = "";
        document
          .querySelector("tr[id='" + (utilsGame.currentCol - 1) + "']")
          .querySelectorAll("td")
          .forEach((td) => {
            paraulaEscrita += td.innerHTML.toLowerCase();
          });
        if (dic.indexOf(paraulaEscrita) != -1) {

          // si la palabra existe en el diccionario ...
          if (paraulaEscrita == paraula) {
            clearInterval(cronometro);

            // si hemos acertado la palabra ...
            document
              .querySelector("tr[id='" + (utilsGame.currentCol - 1) + "']")
              .querySelectorAll("td")
              .forEach((td) => {
                td.style.backgroundColor = "#43A047";
                td.style.color = "white";
              });

            // comprobamos si es la mejor partida
            let oldTime = dataUser.fastestGame;
            let oldGames = utilsGame.currentCol - 1;
            dataUser.wins++;
            dataUser.bestGame =
              oldGames <
                (userResults.bestGame == 0 ? 999 : userResults.bestGame)
                ? oldGames
                : userResults.bestGame;
            dataUser.fastestGame =
              dataUser.fastestGame <
                (userResults.fastestGame == 0 ? 999 : userResults.fastestGame)
                ? dataUser.fastestGame
                : userResults.fastestGame;
            console.log(cronometro + " segundos");
            localStorage.setItem("userData", JSON.stringify(dataUser)); // añadimos los datos de usuario al localStorage
            winGame(oldTime, oldGames);
          } else {

            // Si una lletra està bé però no està en la posició correcta la posarem de color groc
            for (let i = 0; i < paraula.length; i++) {
              if (paraulaEscrita[i] == paraula[i]) {
                document
                  .querySelector("tr[id='" + (utilsGame.currentCol - 1) + "']")
                  .querySelectorAll("td")[i].style.backgroundColor = "#43A047";
                document
                  .querySelector("tr[id='" + (utilsGame.currentCol - 1) + "']")
                  .querySelectorAll("td")[i].style.color = "white";
              } else {
                if (paraula.includes(paraulaEscrita[i])) {
                  document
                    .querySelector(
                      "tr[id='" + (utilsGame.currentCol - 1) + "']"
                    )
                    .querySelectorAll("td")[i].style.backgroundColor =
                    "#E4A81D";
                  document
                    .querySelector(
                      "tr[id='" + (utilsGame.currentCol - 1) + "']"
                    )
                    .querySelectorAll("td")[i].style.color = "white";
                } else {
                  document
                    .querySelector(
                      "tr[id='" + (utilsGame.currentCol - 1) + "']"
                    )
                    .querySelectorAll("td")[i].style.backgroundColor =
                    "#757575";
                  document
                    .querySelector(
                      "tr[id='" + (utilsGame.currentCol - 1) + "']"
                    )
                    .querySelectorAll("td")[i].style.color = "white";
                }
              }
            }
          }
        } else {
          if (Swal.isVisible()) {
            Swal.close();
          } else {
            wordNotInDictionary();
          }
          console.log(utilsGame.currentCol);
          utilsGame.currentCol--;
          utilsGame.currentRow = 5;
        }

        if (utilsGame.currentCol == 7) {
          dataUser.bestGame = userResults.bestGame;
          dataUser.fastestGame = userResults.bestGame;
          dataUser.fastestGame = userResults.fastestGame;
          localStorage.setItem("userData", JSON.stringify(dataUser));
          lostGame();
        }
        console.log(
          utilsGame.currentCol - 1 + " - " + paraula + " - " + paraulaEscrita
        );
      } else {
        if (utilsGame.letraClicada != "ENTER") {
          utilsGame.playingCol.children[utilsGame.currentRow].innerHTML =
            utilsGame.letraClicada;
          utilsGame.currentRow++;
        } else {
          if (Swal.isVisible()) {
            Swal.close();
          } else {
            shortWordAlert();
          }
        }
      }
      // console.log(utilsGame.currentRow)
    }
  }
}
