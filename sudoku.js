// sudoku.js
// This file contains the JavaScript for the Sudoku site

function indexStartup() {

    let demoColors = { "row": "rowDemoColor", "col": "colDemoColor", "box": "boxDemoColor" };
    createGrid("demoGrid");
    colorDemoGrid(demoColors);
}

function sudokuStartup() {

    window.startTime = new Date();
    let gridColors = { "row": "rowGridColor", "col": "colGridColor"};

    createGrid("grid");
    colorGrid(gridColors);
    setEventListeners();
    createButtons();
    loadTimer();
}

// **** INDEX.HTML ****

function createGrid(gridID) {

    let demoGrid = [1, 0, 0, 9, 8, 5, 6, 2, 4, 4, 0, 0, 0, 0, 2, 3, 8, 7, 0, 0, 8, 0, 0, 0, 1, 0, 0,
        0, 7, 0, 0, 5, 6, 4, 0, 2, 6, 4, 2, 0, 1, 0, 0, 0, 0, 5, 0, 3, 0, 2, 7, 8, 1, 0,
        0, 0, 4, 2, 7, 8, 9, 0, 0, 7, 0, 0, 0, 0, 3, 2, 4, 1, 0, 2, 0, 6, 0, 1, 0, 3, 0];

    let sudokuTable = document.getElementById(gridID);
    for (let row = 0; row < 9; row++) {

        let newRow = sudokuTable.insertRow(row);
        for (let col = 0; col < 9; col++) {

            let newCell = newRow.insertCell(col);
            let cellNum = 9 * row + col;
            if (demoGrid[cellNum] !== 0)
                newCell.innerHTML = demoGrid[cellNum];
            if (row === 2 || row === 5)
                newCell.style.borderBottomWidth = "0.3em";
            if (col === 2 || col === 5)
                newCell.style.borderRightWidth = "0.3em";
            if (demoGrid[cellNum] === 0)
                newCell.classList.add("userFill");

            newCell.id = getID(cellNum);
        }
    }
}

function colorDemoGrid(colors) {

    let rows = document.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        rows[i].onmouseover = function() { rows[i].classList.add(colors["row"]); };
        rows[i].onmouseout = function() { rows[i].classList.remove(colors["row"]); };
    }

    let cells = document.getElementsByTagName("td");
    for (let j = 0; j < cells.length; j++) {
        cells[j].onmouseover = function() {

            // Set colors for column cells
            let cellNum = cells[j].id.slice(4, 6)
            let col = parseInt(cellNum) % 9;
            while (col < 81) {
                let sameColCell = document.getElementById(getID(col));
                sameColCell.classList.add(colors["col"]);
                col += 9;
            }

            // Set colors for box cells
            let box = getBox(cellNum);
            let boxStart = Math.floor(box / 3) * 27 + (box % 3) * 3;
            for (let pos = boxStart; pos < boxStart + 27; pos += 9) {
                for (let offset = 0; offset < 3; offset++) {
                    let final = pos + offset;
                    let finalCell = document.getElementById(getID(final));
                    finalCell.classList.add(colors["box"]);
                }
            }
        }
        cells[j].onmouseout = function() {

            let cellNum = cells[j].id.slice(4, 6);
            let col = parseInt(cellNum) % 9;
            while (col < 81) {
                let sameColCell = document.getElementById(getID(col));
                sameColCell.classList.remove(colors["col"]);
                col += 9;
            }

            // Set colors for box cells
            let box = getBox(cellNum);
            let boxStart = Math.floor(box / 3) * 27 + (box % 3) * 3;
            for (let pos = boxStart; pos < boxStart + 27; pos += 9) {
                for (let offset = 0; offset < 3; offset++) {
                    let final = pos + offset;
                    let finalCell = document.getElementById(getID(final));
                    finalCell.classList.remove(colors["box"]);
                }
            }
        }
    }
}

// Helper Functions
function getBox(cellNum) {

    let rowShift = Math.floor(cellNum / 27);
    let colShift = Math.floor((cellNum % 9) / 3)
    return 3 * rowShift + colShift;
}

function getID(cellNum) { return "cell" + cellNum.toString(); }

// **** SUDOKU.HTML ****

// Global Variables
let acceptable = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "Backspace"];

function setEventListeners() {

    document.body.onkeydown = function (e) {

        let selected = document.getElementsByClassName("selectedCell");
        if (selected.length !== 0) {

            if (selected[0].classList.contains("userFill") === true) {
                if (acceptable.includes(e.key)) {
                    if (e.key === "Backspace") selected[0].innerText = "";
                    else selected[0].innerText = e.key;

                } else selected[0].innerText = "";
            }
        }
    }
}

function loadTimer() {

    setTimeout(function () {
        let time = new Date();
        let elapsed = time - startTime;
        let timer = document.getElementById("timer");

        let minutes = Math.floor(elapsed / 60000);
        let seconds = Math.floor((elapsed - (60000 * minutes)) / 1000);

        minutes = (minutes < 10) ? "0" + minutes.toString() : minutes.toString();
        seconds = (seconds < 10) ? "0" + seconds.toString() : seconds.toString();

        timer.innerText = minutes + ':' + seconds;
        loadTimer();
    }, 1000);
}

function colorGrid(colors) {

    let rows = document.getElementById("grid").getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        rows[i].onclick = function() {

            let resetRows = document.getElementsByTagName("tr");
            for (let j = 0; j < resetRows.length; ++j)
                resetRows[j].classList.remove(colors["row"], colors["col"]);
            rows[i].classList.add(colors["row"]);
        };
    }

    let cells = document.getElementById("grid").getElementsByTagName("td");
    for (let j = 0; j < cells.length; j++) {
        cells[j].onclick = function() {

            // Reset all background colors
            let gridCells = document.getElementsByTagName("td");
            for (let i = 0; i < 81; i++)
                gridCells[i].classList.remove(colors["row"], colors["col"]);

            // Set colors for column cells
            let col = parseInt(cells[j].id.slice(4, 6)) % 9;
            while (col < 81) {
                let sameColCell = document.getElementById(getID(col));
                sameColCell.classList.add(colors["col"]);
                col += 9;
            }

            // Add selectedCell class to current cell
            if (cells[j].getAttribute("color") !== "#7a7a7a") {
                let selected = document.getElementsByClassName("selectedCell");
                if (selected.length > 0) selected[0].classList.remove("selectedCell");
                cells[j].classList.add("selectedCell");
            }
        }
    }
}

function createButtons() {

    let buttons = document.getElementById("sudokuInfo");
    for (let row = 0; row < 3; row++) {
        let newRow = buttons.insertRow(row);
        for (let col = 0; col < 3; col++) {
            let newCell = newRow.insertCell(col);
            newCell.innerHTML = 3 * row + col + 1;
            newCell.addEventListener("click", function () {
                fillCell(3 * row + col + 1);
            })

        }
    }
}

function fillCell(num) {

    let selected = document.getElementsByClassName("selectedCell");
    if (selected.length !== 0) {
        if (selected[0].classList.contains("userFill") === true)
            selected[0].innerText = num.toString();
    }
}
