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
                $(newCell).css("border-bottom-width", "0.3em");
            if (col === 2 || col === 5)
                $(newCell).css("border-right-width", "0.3em");
            if (demoGrid[cellNum] === 0)
                $(newCell).addClass("userFill");

            newCell.id = getID(cellNum).slice(1);   // Removes # at front
        }
    }
}

function colorDemoGrid(colors) {

    $("tr").on("mouseover", function() { $(this).addClass(colors["row"]); })
            .on("mouseout", function() { $(this).removeClass(colors["row"]); });

    $("td").on("mouseover", function () {

        // Set colors for column cells
        let cellNum = $(this).attr("id").slice(4, 6);
        let col = parseInt(cellNum) % 9;
        while (col < 81) {
            $(getID(col)).addClass(colors["col"]);
            col += 9;
        }

        // Set colors for box cells
        let box = getBox(cellNum);
        let boxStart = Math.floor(box / 3) * 27 + (box % 3) * 3;
        for (let pos = boxStart; pos < boxStart + 27; pos += 9) {
            for (let offset = 0; offset < 3; offset++) {
                $(getID(pos + offset)).addClass(colors["box"]);
            }
        }
    })
            .on("mouseout", function () {

            let cellNum = $(this).attr("id").slice(4, 6);
            let col = parseInt(cellNum) % 9;
            while (col < 81) {
                $(getID(col)).removeClass(colors["col"]);
                col += 9;
            }

            // Set colors for box cells
            let box = getBox(cellNum);
            let boxStart = Math.floor(box / 3) * 27 + (box % 3) * 3;
            for (let pos = boxStart; pos < boxStart + 27; pos += 9) {
                for (let offset = 0; offset < 3; offset++) {
                    $(getID(pos + offset)).removeClass(colors["box"]);
                }
            }
        })
}

// Helper Functions
function getBox(cellNum) {

    let rowShift = Math.floor(cellNum / 27);
    let colShift = Math.floor((cellNum % 9) / 3)
    return 3 * rowShift + colShift;
}

function getID(cellNum) { return "#cell" + cellNum.toString(); }

// **** SUDOKU.HTML ****

// Global Variables
let acceptable = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "Backspace"];

function setEventListeners() {

    $("body").on("keydown", function (e) {

        let selected = $(".selectedCell");
        if (selected.length !== 0) {

            let cell = selected[0];
            if ($(cell).hasClass("userFill")) {
                if (acceptable.includes(e.key) && e.key !== "Backspace")
                    cell.innerText = e.key;
                else
                    cell.innerText = "";
            }
        }
    });
}

function loadTimer() {

    setTimeout(function () {
        let time = new Date();
        let elapsed = time - startTime;

        let minutes = Math.floor(elapsed / 60000);
        let seconds = Math.floor((elapsed - (60000 * minutes)) / 1000);

        minutes = (minutes < 10) ? "0" + minutes.toString() : minutes.toString();
        seconds = (seconds < 10) ? "0" + seconds.toString() : seconds.toString();

        $("#timer").text(minutes + ':' + seconds);
        loadTimer();
    }, 1000);
}

function colorGrid(colors) {

    $("#grid tr").on("click", function () {
        $("tr").removeClass(colors["row"] + " " + colors["col"])
        $(this).addClass(colors["row"]);
    });
    $("#grid td").on("click", function () {

        // Reset all background colors
        $("td").removeClass(colors["row"] + " " + colors["col"]);

        // Set colors for column cells
        let col = parseInt($(this).attr("id").slice(4, 6)) % 9;
        while (col < 81) {
            $(getID(col)).addClass(colors["col"]);
            col += 9;
        }

        // Add selectedCell class to current cell
        if ($(this).css("color") !== "#7a7a7a") {
            $(".selectedCell").removeClass("selectedCell");
            $(this).addClass("selectedCell");
        }
    });

}

function createButtons() {

    let buttons = document.getElementById("sudokuInfo");
    for (let row = 0; row < 3; row++) {
        let newRow = buttons.insertRow(row);
        for (let col = 0; col < 3; col++) {
            let newCell = newRow.insertCell(col);
            newCell.innerHTML = 3 * row + col + 1;
            $(newCell).on("click", function() { fillCell(3 * row + col + 1); });
        }
    }
}

function fillCell(num) {

    let selected = $(".selectedCell");
    if (selected.length !== 0) {
        let cell = selected[0];
        if ($(cell).hasClass("userFill"))
            cell.innerText = num.toString();
    }
}
