// sudoku.js
// This file contains the JavaScript for the Sudoku site

function indexStartup() {

    AOS.init(); // Needed for animation on scroll to work
    let demoColors = { "row": "rowDemoColor", "col": "colDemoColor", "box": "boxDemoColor" };
    createGrid("demoGrid", "");
    colorDemoGrid(demoColors);

    // Adjust properties of  grid
    $(".grid").css("padding-left", "3%").css("padding-top", "1%").css("width", "45%");
}

function sudokuStartup() {

    AOS.init(); // Needed for animation on scroll to work
    window.startTime = new Date();
    $("header").css("height", "16vh");
    let gridColors = { "row": "rowGridColor", "col": "colGridColor"};

    createGrid("grid", "");
    colorGrid(gridColors);
    setEventListeners();
    createButtons();
    loadTimer();

    // Adjust properties of  grid
    $(".grid").css("padding-left", "20%").css("padding-top", "3%").css("width", "60%");
}

function learnStartup() {
    AOS.init();
    $("header").css("height", "16vh");
    createGrid("eliminationGrid", "elim");
    //createGrid("elimination2Grid", "2elim");
}

// **** INDEX.HTML ****

function createGrid(gridID, prefix) {

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

            newCell.id = prefix + getID(cellNum).slice(1);   // Removes # at front
        }
    }
}

function colorDemoGrid(colors) {

    $(".grid tr").on("mouseover", function() { $(this).addClass(colors["row"]); })
            .on("mouseout", function() { $(this).removeClass(colors["row"]); });

    $(".grid td").on("mouseover", function () {

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

    let docBody = $("body");
    docBody.on("keydown", function (e) {

        let selected = $(".selectedCell");
        if (selected.length !== 0) {

            let cell = selected[0];
            if ($(cell).hasClass("userFill")) {
                if (acceptable.includes(e.key) && e.key !== "Backspace") {
                    cell.innerText = e.key;
                } else
                    cell.innerText = "";
            }
        }
    });

    docBody.on("keyup", function(e) {

        let selected = $(".selectedCell");
        if (selected.length !== 0)  {
            if ($(selected[0]).hasClass("userFill")) {
                if (acceptable.includes(e.key) && e.key !== "Backspace")
                    checkValidity();
                else if (e.key === "Backspace")
                    $(".errorCell").removeClass("errorCell");
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

    let buttons = document.getElementById("keypad");
    for (let row = 0; row < 3; row++) {
        let newRow = buttons.insertRow(row);
        for (let col = 0; col < 3; col++) {
            let newCell = newRow.insertCell(col);
            newCell.innerHTML = 3 * row + col + 1;
            $(newCell).on("click", function() {
                fillCell(3 * row + col + 1);
                checkValidity();
            });
        }
    }

    let firstRow = document.getElementById("otherKeys").insertRow(0);
    let hint = firstRow.insertCell(0);
    let backspace = firstRow.insertCell(1);

    $(hint).html("<i class='fa fa-lightbulb' style='color: #7a7a7a; font-size: 0.9em'</i><br><p id='hint'>Hint</p>");
    $(backspace).html("<i class='fas fa-backspace' style='color: #7a7a7a; font-size: 0.9em'</i><br><p id='undo'>Undo</p>");

    $(backspace).on("click", function () {
        $(".selectedCell").text("");
        $(".errorCell").removeClass("errorCell");
    });
}

// **** LEARN.HTML ****

function T1ElimAnim() {

    $("#eliminationGrid td").css("backgroundColor", "inherit");
    $(".userFill").text("");
    // Cells eliminated
    setTimeout(function() { $("#elimcell24").css("backgroundColor", "rgba(0,47,188,0.24)"); }, 500);
    $("#elimcell23").html("<i class='fas fa-times' data-aos='zoom-in' data-aos-delay='1000'></i>");
    $("#elimcell22").html("<i class='fas fa-times' data-aos='zoom-in' data-aos-delay='1500'></i>");
    $("#elimcell21").html("<i class='fas fa-times' data-aos='zoom-in' data-aos-delay='2000'></i>");

    setTimeout(function() { $("#elimcell40").css("backgroundColor", "rgba(0,47,188,0.24)"); }, 2500);
    $("#elimcell13").html("<i class='fas fa-times' data-aos='zoom-in' data-aos-delay='3000'></i>");

    setTimeout(function() { $("#elimcell12").text("1").css("color", "#1E2E40").css("font-weight", "bolder")
        .css("backgroundColor", "rgba(101, 171, 171, 0.39)"); }, 3500);

}

function T1SolAnim() {

    $("#eliminationGrid td").css("backgroundColor", "inherit");
    $(".userFill").text("");
    // Cells eliminated
    setTimeout(function() { $("#elimcell16").css("backgroundColor", "rgba(0,47,188,0.24)"); }, 500);
    $("#elimcell26").html("<i class='fas fa-times' data-aos='zoom-in' data-aos-delay='1000'></i>");

    setTimeout(function() { $("#elimcell51").css("backgroundColor", "rgba(0,47,188,0.24)"); }, 1500);
    $("#elimcell44").html("<i class='fas fa-times' data-aos='zoom-in' data-aos-delay='2000'></i>");
    $("#elimcell53").html("<i class='fas fa-times' data-aos='zoom-in' data-aos-delay='2500'></i>");

    setTimeout(function() { $("#elimcell59").css("backgroundColor", "rgba(0,47,188,0.24)"); }, 3000);
    $("#elimcell62").html("<i class='fas fa-times' data-aos='zoom-in' data-aos-delay='3500'></i>");

    setTimeout(function() { $("#elimcell80").text("8").css("color", "#1E2E40").css("font-weight", "bolder")
        .css("backgroundColor", "rgba(101, 171, 171, 0.39)"); }, 4500);

}

// Helper Functions
function fillCell(num) {

    let selected = $(".selectedCell");
    if (selected.length !== 0) {
        let cell = selected[0];
        if ($(cell).hasClass("userFill"))
            cell.innerText = num.toString();
    }
}

function checkValidity() {

    let cell = $(".selectedCell");
    let val = cell[0].textContent;
    if (val === "") return;
    let selected = parseInt(cell.attr("id").slice(4, 6));
    $(".errorCell").removeClass("errorCell");
    let rowError = checkRow(selected, val);
    let colError = checkCol(selected, val);
    let boxError = checkBox(selected, val);

    if (rowError !== -1 || colError !== -1 || boxError !== -1) {
        $(cell).addClass("errorCell");
    }
}

function checkRow(cellNum, val) {

    let rowStart = Math.floor(cellNum / 9) * 9;
    for (let i = 0; i < 9; i++) {

        if (rowStart + i !== cellNum) {
            let checkedCell = document.getElementById(getID(rowStart + i).slice(1));
            let fillVal = checkedCell.textContent;
            if (fillVal === val) {
                $(checkedCell).addClass("errorCell");
                return rowStart + i;
            }

        }
    }
    return -1;
}

function checkCol(cellNum, val) {

    let colStart = cellNum % 9;
    for (let i = 0; i < 9; i++) {
        if (colStart + 9 * i !== cellNum) {
            let checkedCell = document.getElementById(getID(9 * i + colStart).slice(1));
            let fillVal = checkedCell.textContent;
            if (fillVal === val) {
                $(checkedCell).addClass("errorCell");
                return 9 * i + colStart;
            }
        }
    }
    return -1;
}

function checkBox(cellNum, val) {

    let boxStart = getBox(cellNum);
    boxStart = Math.floor(boxStart / 3) * 27 + 3 * (boxStart % 3);
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {

            let cell = boxStart + 9 * row + col;
            if (cell !== cellNum) {
                let checkedCell = document.getElementById(getID(cell).slice(1));
                let fillVal = checkedCell.textContent;
                if (fillVal === val) {
                    $(checkedCell).addClass("errorCell");
                    return cell;
                }
            }
        }
    }
    return -1;
}