const gameBoard = document.querySelector("#gameboard")
const playerDisplay = document.querySelector("#player")
const infoDisplay = document.querySelector("#info-display")
const width = 8
let playerGo = 'white'
playerDisplay.textContent = 'white'
let kingId;
let checkflag = 0;




const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook
]

function createBoard() {
    startPieces.forEach((startPiece, i) => {
        const square = document.createElement('div')
        square.classList.add('square')
        square.innerHTML = startPiece

        square.firstChild?.setAttribute('draggable', true)
        square.setAttribute('square-id', 63 - i)

        const row = Math.floor(i / 8)
        if (row % 2 == 0) {
            if (i % 2 == 0) square.classList.add('beige')
            else square.classList.add('brown')
        }
        else {
            if (i % 2 == 1) square.classList.add('beige')
            else square.classList.add('brown')
        }

        if (i < 16) {
            square.firstChild.firstChild.classList.add('black')
        }

        if (i > 47) {
            square.firstChild.firstChild.classList.add('white')
        }

        gameBoard.append(square)

    })
}

createBoard()

const allSquares = document.querySelectorAll(".square")
let alllSquares = document.querySelectorAll(".square")




allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)
})

let startPositionId
let draggedElement


function dragStart(e) {
    startPositionId = e.target.parentNode.getAttribute('square-id')
    draggedElement = e.target;
}

function dragOver(e) {
    e.preventDefault()
}

function dragDrop(e) {
    e.stopPropagation()
    let p = e.target

    while (!(p.classList.contains('square') || p.classList.contains('piece'))) {
        p = p.parentNode
    }

    const correctGo = draggedElement.firstChild.classList.contains(playerGo)
    const taken = p.classList.contains('piece')
    const valid = checkIfValid(p)
    const opponentGo = playerGo === 'white' ? 'black' : 'white'

    const takenByOpponent = p.firstChild?.classList.contains(opponentGo)



    alllSquares = document.querySelectorAll(".square")

    alllSquares.forEach(square => {
        if (square.firstChild && square.firstChild.id.includes('king') && !square.firstChild.firstChild.classList.contains(playerGo)) {
            kingId = Number(square.getAttribute('square-id'));
        }
    });





    if (correctGo) {

        if (takenByOpponent && valid) {
            e.target.parentNode.append(draggedElement)
            e.target.remove()
        }


        else if (taken && !takenByOpponent) {

            setTimeout(() => gamestatus.textContent = "", 2000)

        }

        else if (valid) {
            e.target.append(draggedElement)
        }


    }

    checkflag = 0;
    alllSquares.forEach(square => {
        if (square.firstChild && square.firstChild.id.includes('king') && !square.firstChild.firstChild.classList.contains(playerGo)) {
            kingId = Number(square.getAttribute('square-id'));
        }
    });


    checkCheck(kingId);


    if (checkflag) document.getElementById("gamestatus").textContent = "CHECK";
    else document.getElementById("gamestatus").textContent = "";


    if (!checkMate) {
        alert("CHECKMATE!");
        allSquares.forEach(square => {
            square.firstChild?.setAttribute('draggable', true)
        })
    }



    if (valid) {
        changePlayer();
    }


}



function checkIfValid(target) {

    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'))

    const startId = Number(startPositionId)
    const piece = draggedElement.id



    switch (piece) {

        case 'pawn':
            const starterRow = [8, 9, 10, 11, 12, 13, 14, 15]

            if (
                starterRow.includes(startId) && startId + width * 2 === targetId || startId + width === targetId ||
                startId + width - 1 === targetId && document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild ||
                startId + width + 1 === targetId && document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild
            ) return true;
            break;

        case 'knight':
            if (
                startId + width * 2 + 1 === targetId ||
                startId + width * 2 - 1 === targetId ||
                startId + width + 2 === targetId ||
                startId + width - 2 === targetId ||
                startId - width * 2 + 1 === targetId ||
                startId - width * 2 - 1 === targetId ||
                startId - width + 2 === targetId ||
                startId - width - 2 === targetId
            ) return true;

            break;

        case 'bishop':

            for (let i = 1; i < 8; i++) {
                if (startId + i * width + i === targetId) {
                    let f = 0
                    for (let j = 1; j < i; j++) {
                        if (document.querySelector(`[square-id="${startId + j * width + j}"]`).firstChild) f++
                    }
                    if (!f) return true;
                }
                if (startId + i * width - i === targetId) {
                    let f = 0
                    for (let j = 1; j < i; j++) {
                        if (document.querySelector(`[square-id="${startId + j * width - j}"]`).firstChild) f++
                    }
                    if (!f) return true;
                }
                if (startId - i * width + i === targetId) {
                    let f = 0
                    for (let j = 1; j < i; j++) {
                        if (document.querySelector(`[square-id="${startId - j * width + j}"]`).firstChild) f++
                    }
                    if (!f) return true;
                }
                if (startId - i * width - i === targetId) {
                    let f = 0
                    for (let j = 1; j < i; j++) {
                        if (document.querySelector(`[square-id="${startId - j * width - j}"]`).firstChild) f++
                    }
                    if (!f) return true;
                }
            }

            break;

        case 'rook':
            for (let i = 1; i < 8; i++) {

                if (startId + i === targetId) {
                    let f = 0
                    for (let j = 1; j < i; j++) {
                        if (document.querySelector(`[square-id="${startId + j}"]`).firstChild) f++
                    }
                    if (!f) return true;
                }
                if (startId - i === targetId) {
                    let f = 0
                    for (let j = 1; j < i; j++) {
                        if (document.querySelector(`[square-id="${startId - j}"]`).firstChild) f++
                    }
                    if (!f) return true;
                }
                if (startId + i * width === targetId) {
                    let f = 0
                    for (let j = 1; j < i; j++) {
                        if (document.querySelector(`[square-id="${startId + j * width}"]`).firstChild) f++
                    }
                    if (!f) return true;
                }
                if (startId - i * width === targetId) {
                    let f = 0
                    for (let j = 1; j < i; j++) {
                        if (document.querySelector(`[square-id="${startId - j * width}"]`).firstChild) f++
                    }
                    if (!f) return true;
                }
            }

            break;

        case 'queen':

            for (let i = 1; i < 8; i++) {
                if (startId + i * width + i === targetId) {
                    let f = 0
                    for (let j = 1; j < i; j++) {
                        if (document.querySelector(`[square-id="${startId + j * width + j}"]`).firstChild) f++
                    }
                    if (!f) return true;
                }
                if (startId + i * width - i === targetId) {
                    let f = 0
                    for (let j = 1; j < i; j++) {
                        if (document.querySelector(`[square-id="${startId + j * width - j}"]`).firstChild) f++
                    }
                    if (!f) return true;
                }
                if (startId - i * width + i === targetId) {
                    let f = 0
                    for (let j = 1; j < i; j++) {
                        if (document.querySelector(`[square-id="${startId - j * width + j}"]`).firstChild) f++
                    }
                    if (!f) return true;
                }
                if (startId - i * width - i === targetId) {
                    let f = 0
                    for (let j = 1; j < i; j++) {
                        if (document.querySelector(`[square-id="${startId - j * width - j}"]`).firstChild) f++
                    }
                    if (!f) return true;
                }
                if (startId + i === targetId) {
                    let f = 0
                    for (let j = 1; j < i; j++) {
                        if (document.querySelector(`[square-id="${startId + j}"]`).firstChild) f++
                    }
                    if (!f) return true;
                }
                if (startId - i === targetId) {
                    let f = 0
                    for (let j = 1; j < i; j++) {
                        if (document.querySelector(`[square-id="${startId - j}"]`).firstChild) f++
                    }
                    if (!f) return true;
                }
                if (startId + i * width === targetId) {
                    let f = 0
                    for (let j = 1; j < i; j++) {
                        if (document.querySelector(`[square-id="${startId + j * width}"]`).firstChild) f++
                    }
                    if (!f) return true;
                }
                if (startId - i * width === targetId) {
                    let f = 0
                    for (let j = 1; j < i; j++) {
                        if (document.querySelector(`[square-id="${startId - j * width}"]`).firstChild) f++
                    }
                    if (!f) return true;
                }
            }

            break;

        case 'king':

            if (playerGo === 'white') {
                if (startId + 2 === targetId &&
                    cWl === 0 &&
                    !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
                    !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
                    !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
                    document.querySelector(`[square-id="${startId + 4}"]`).firstChild.id === 'rook' &&
                    document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&
                    document.querySelector(`[square-id="${startId + 4}"]`).firstChild.firstChild.classList.contains(playerGo)
                ) {
                    return true;
                }
                else if (startId - 2 === targetId &&
                    cWs === 0 &&
                    !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
                    !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
                    document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
                    document.querySelector(`[square-id="${startId + 3}"]`).firstChild.id === 'rook' &&
                    document.querySelector(`[square-id="${startId + 3}"]`).firstChild.firstChild.classList.contains(playerGo)
                ) {
                    return true;
                }

                else if (
                    startId + 1 === targetId ||
                    startId - 1 === targetId ||
                    startId - width === targetId ||
                    startId + width === targetId ||
                    startId + width + 1 === targetId ||
                    startId + width - 1 === targetId ||
                    startId - width - 1 === targetId ||
                    startId - width + 1 === targetId

                ) return true;
            }

            else {
                if (startId - 2 === targetId &&
                    cBl === 0 &&
                    !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
                    !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
                    !document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
                    document.querySelector(`[square-id="${startId + 4}"]`).firstChild.id === 'rook' &&
                    document.querySelector(`[square-id="${startId + 4}"]`).firstChild &&
                    document.querySelector(`[square-id="${startId + 4}"]`).firstChild.firstChild.classList.contains(playerGo)
                ) {

                    return true;
                }
                else if (startId + 2 === targetId &&
                    cBs === 0 &&
                    !document.querySelector(`[square-id="${startId + 1}"]`).firstChild &&
                    !document.querySelector(`[square-id="${startId + 2}"]`).firstChild &&
                    document.querySelector(`[square-id="${startId + 3}"]`).firstChild &&
                    document.querySelector(`[square-id="${startId + 3}"]`).firstChild.id === 'rook' &&
                    document.querySelector(`[square-id="${startId + 3}"]`).firstChild.firstChild.classList.contains(playerGo)
                ) {
                    return true;
                }

                else if (
                    startId + 1 === targetId ||
                    startId - 1 === targetId ||
                    startId - width === targetId ||
                    startId + width === targetId ||
                    startId + width + 1 === targetId ||
                    startId + width - 1 === targetId ||
                    startId - width - 1 === targetId ||
                    startId - width + 1 === targetId

                ) return true;

            }




            break;

    }

}

function changePlayer() {
    if (playerGo === "black") {
        reverseIds()
        playerGo = "white"
        playerDisplay.textContent = 'white'
    }
    else {
        revertIds()
        playerGo = "black"
        playerDisplay.textContent = 'black'

    }
}

function reverseIds() {
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) =>
        square.setAttribute('square-id', (width * width - 1) - i))
}

function revertIds() {
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) =>
        square.setAttribute('square-id', i))
}


function checkCheck(kid) {
    alllSquares.forEach(square => {
        if (square.firstChild && square.firstChild.firstChild.classList.contains(playerGo)) {
            const attacker = square.firstChild.id;
            const atId = Number(square.getAttribute('square-id'));


            switch (attacker) {

                case 'pawn':
                    if (
                        atId - width + 1 === kid ||
                        atId - width - 1 === kid
                    ) {
                        checkflag++;
                        return true;
                    }

                    break;

                case 'knight':
                    if (
                        atId + width * 2 + 1 === kid ||
                        atId + width * 2 - 1 === kid ||
                        atId + width + 2 === kid ||
                        atId + width - 2 === kid ||
                        atId - width * 2 + 1 === kid ||
                        atId - width * 2 - 1 === kid ||
                        atId - width + 2 === kid ||
                        atId - width - 2 === kid
                    ) {
                        checkflag++;
                        return true;
                    }

                    break;

                case 'bishop':
                    for (let i = 1; i < 8; i++) {
                        if (atId + i * width + i === kid) {
                            let f = 0
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${atId + j * width + j}"]`).firstChild) f++
                            }
                            if (!f) {
                                checkflag++;
                                return true;
                            }
                        }
                        if (atId + i * width - i === kid) {
                            let f = 0
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${atId + j * width - j}"]`).firstChild) f++
                            }
                            if (!f) {
                                checkflag++;
                                return true;
                            }
                        }
                        if (atId - i * width + i === kid) {
                            let f = 0
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${atId - j * width + j}"]`).firstChild) f++
                            }
                            if (!f) {
                                checkflag++;
                                return true;
                            }
                        }
                        if (atId - i * width - i === kid) {
                            let f = 0
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${atId - j * width - j}"]`).firstChild) f++
                            }
                            if (!f) {
                                checkflag++;

                                return true;
                            }
                        }
                    }

                    break;

                case 'rook':

                    for (let i = 1; i < 8; i++) {
                        if (atId + i === kid) {
                            let f = 0;
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${atId + j}"]`).firstChild) f++
                            }
                            if (!f) {
                                checkflag++;
                                return true;
                            }
                        }


                        if (atId - i === kid) {
                            let f = 0;
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${atId - j}"]`).firstChild) f++
                            }
                            if (!f) {
                                checkflag++;
                                return true;
                            }
                        }
                        if (atId + i * width === kid) {
                            let f = 0;
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${atId + j * width}"]`).firstChild) f++
                            }
                            if (!f) {
                                checkflag++;
                                return true;
                            }
                        }
                        if (atId - i * width === kid) {
                            let f = 0;
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${atId - j * width}"]`).firstChild) f++
                            }
                            if (!f) {
                                checkflag++;
                                return true;
                            }
                        }

                    }

                    break;

                case 'queen':

                    for (let i = 1; i < 8; i++) {
                        if (atId + i * width + i === kid) {
                            let f = 0
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${atId + j * width + j}"]`).firstChild) f++
                            }
                            if (!f) {
                                checkflag++;
                                return true;
                            }
                        }
                        if (atId + i * width - i === kid) {
                            let f = 0
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${atId + j * width - j}"]`).firstChild) f++
                            }
                            if (!f) {
                                checkflag++;
                                return true;
                            }
                        }
                        if (atId - i * width + i === kid) {
                            let f = 0
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${atId - j * width + j}"]`).firstChild) f++
                            }
                            if (!f) {
                                checkflag++;
                                return true;
                            }
                        }
                        if (atId - i * width - i === kid) {
                            let f = 0
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${atId - j * width - j}"]`).firstChild) f++
                            }
                            if (!f) {
                                checkflag++;
                                return true;
                            }
                        }

                        if (atId + i * width + i === kid) {
                            let f = 0
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${atId + j * width + j}"]`).firstChild) f++
                            }
                            if (!f) {
                                checkflag++;
                                return true;
                            }
                        }
                        if (atId + i * width - i === kid) {
                            let f = 0
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${atId + j * width - j}"]`).firstChild) f++
                            }
                            if (!f) {
                                checkflag++;
                                return true;
                            }
                        }
                        if (atId - i * width + i === kid) {
                            let f = 0
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${atId - j * width + j}"]`).firstChild) f++
                            }
                            if (!f) {
                                checkflag++;
                                return true;
                            }
                        }
                        if (atId - i * width - i === kid) {
                            let f = 0
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${atId - j * width - j}"]`).firstChild) f++
                            }
                            if (!f) {
                                checkflag++;
                                return true;
                            }
                        }


                    }

                    break;

            }
        }


    });



}

function checkAround(kid) {


    const square = document.querySelector(`[square-id="${kid}"]`);
    if (square.firstChild && square.firstChild.classList.contains('piece') && !square.firstChild.firstChild.classList.contains(playerGo))
        checkflag++;
    else checkCheck(kid);
}


function checkMate() {
    let alllSquares = document.querySelectorAll(".square")

    alllSquares.forEach(square => {
        if (square.firstChild && !square.firstChild.firstChild.classList.contains(playerGo)) {
            let piece = square.firstChild.id;
            let pid = square.getAttribute('square-id');
            let kingkiid;
            let s1 = square;


            switch (piece) {

                case 'pawn':

                    let s2 = document.querySelector(`[square-id="${pid - width}"]`).firstChild;
                    if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                        let temp = s2.firstchild;
                        s2.firstChild.remove();
                        s2.append(s1.firstchild);
                        s1.firstChild.remove();
                        alllSquares.forEach(square2 => {
                            if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                kingkiid = Number(square2.getAttribute('square-id'));
                            }
                        });


                        checkflag = 0;
                        checkCheck(kingkiid);


                        s1.append(s2.firstChild);
                        s2.append(temp);


                        if (checkflag == 0) return false;
                    }

                    break;

                case 'knight':


                    if (pid + width + 2 < 64 && pid + width + 2 >= 0) {
                        let s2 = document.querySelector(`[square-id="${pid + width + 2}"]`).firstChild;
                        if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                            let temp = s2.firstchild;
                            s2.firstChild.remove();
                            s2.append(s1.firstchild);
                            s1.firstChild.remove();
                            alllSquares.forEach(square2 => {
                                if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                    kingkiid = Number(square2.getAttribute('square-id'));
                                }
                            });


                            checkflag = 0;
                            checkCheck(kingkiid);


                            s1.append(s2.firstChild);
                            s2.append(temp);


                            if (checkflag == 0) return false;



                        }
                    }
                    if (pid + width - 2 < 64 && pid + width - 2 >= 0) {
                        let s2 = document.querySelector(`[square-id="${pid + width - 2}"]`).firstChild;
                        if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                            let temp = s2.firstchild;
                            s2.firstChild.remove();
                            s2.append(s1.firstchild);
                            s1.firstChild.remove();
                            alllSquares.forEach(square2 => {
                                if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                    kingkiid = Number(square2.getAttribute('square-id'));
                                }
                            });


                            checkflag = 0;
                            checkCheck(kingkiid);


                            s1.append(s2.firstChild);
                            s2.append(temp);


                            if (checkflag == 0) return false;



                        }
                    }
                    if (pid - width + 2 < 64 && pid - width + 2 >= 0) {
                        let s2 = document.querySelector(`[square-id="${pid - width + 2}"]`).firstChild;
                        if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                            let temp = s2.firstchild;
                            s2.firstChild.remove();
                            s2.append(s1.firstchild);
                            s1.firstChild.remove();
                            alllSquares.forEach(square2 => {
                                if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                    kingkiid = Number(square2.getAttribute('square-id'));
                                }
                            });


                            checkflag = 0;
                            checkCheck(kingkiid);


                            s1.append(s2.firstChild);
                            s2.append(temp);


                            if (checkflag == 0) return false;



                        }
                    }
                    if (pid - width - 2 < 64 && pid - width - 2 >= 0) {
                        let s2 = document.querySelector(`[square-id="${pid - width - 2}"]`).firstChild;
                        if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                            let temp = s2.firstchild;
                            s2.firstChild.remove();
                            s2.append(s1.firstchild);
                            s1.firstChild.remove();
                            alllSquares.forEach(square2 => {
                                if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                    kingkiid = Number(square2.getAttribute('square-id'));
                                }
                            });


                            checkflag = 0;
                            checkCheck(kingkiid);


                            s1.append(s2.firstChild);
                            s2.append(temp);


                            if (checkflag == 0) return false;



                        }
                    }
                    if (pid + 2 * width + 1 < 64 && pid + 2 * width + 1 >= 0) {
                        let s2 = document.querySelector(`[square-id="${pid + 2 * width + 1}"]`).firstChild;
                        if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                            let temp = s2.firstchild;
                            s2.firstChild.remove();
                            s2.append(s1.firstchild);
                            s1.firstChild.remove();
                            alllSquares.forEach(square2 => {
                                if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                    kingkiid = Number(square2.getAttribute('square-id'));
                                }
                            });


                            checkflag = 0;
                            checkCheck(kingkiid);


                            s1.append(s2.firstChild);
                            s2.append(temp);


                            if (checkflag == 0) return false;



                        }
                    }
                    if (pid + 2 * width - 1 < 64 && pid + 2 * width - 1 >= 0) {
                        let s2 = document.querySelector(`[square-id="${pid + 2 * width - 1}"]`).firstChild;
                        if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                            let temp = s2.firstchild;
                            s2.firstChild.remove();
                            s2.append(s1.firstchild);
                            s1.firstChild.remove();
                            alllSquares.forEach(square2 => {
                                if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                    kingkiid = Number(square2.getAttribute('square-id'));
                                }
                            });


                            checkflag = 0;
                            checkCheck(kingkiid);


                            s1.append(s2.firstChild);
                            s2.append(temp);


                            if (checkflag == 0) return false;



                        }
                    }
                    if (pid - 2 * width + 1 < 64 && pid - 2 * width + 1 >= 0) {
                        let s2 = document.querySelector(`[square-id="${pid - 2 * width + 1}"]`).firstChild;
                        if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                            let temp = s2.firstchild;
                            s2.firstChild.remove();
                            s2.append(s1.firstchild);
                            s1.firstChild.remove();
                            alllSquares.forEach(square2 => {
                                if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                    kingkiid = Number(square2.getAttribute('square-id'));
                                }
                            });


                            checkflag = 0;
                            checkCheck(kingkiid);


                            s1.append(s2.firstChild);
                            s2.append(temp);


                            if (checkflag == 0) return false;



                        }
                    }
                    if (pid - 2 * width - 1 < 64 && pid - 2 * width - 1 >= 0) {
                        let s2 = document.querySelector(`[square-id="${pid - 2 * width - 1}"]`).firstChild;
                        if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                            let temp = s2.firstchild;
                            s2.firstChild.remove();
                            s2.append(s1.firstchild);
                            s1.firstChild.remove();
                            alllSquares.forEach(square2 => {
                                if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                    kingkiid = Number(square2.getAttribute('square-id'));
                                }
                            });


                            checkflag = 0;
                            checkCheck(kingkiid);


                            s1.append(s2.firstChild);
                            s2.append(temp);


                            if (checkflag == 0) return false;



                        }
                    }


                    break;

                case 'bishop':

                    //NE
                    for (let i = 1; i < 8; i++) {
                        if (pid + i * width + i < 64 && pid + i * width + i >= 0) {
                            let f = 0;
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${pid + j * width + j}"]`).firstChild) f++
                            }
                            if (!f) {
                                let s2 = document.querySelector(`[square-id="${pid + i * width + i}"]`).firstChild;
                                if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                                    let temp = s2.firstchild;
                                    s2.firstChild.remove();
                                    s2.append(s1.firstchild);
                                    s1.firstChild.remove();
                                    alllSquares.forEach(square2 => {
                                        if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                            kingkiid = Number(square2.getAttribute('square-id'));
                                        }
                                    });


                                    checkflag = 0;
                                    checkCheck(kingkiid);


                                    s1.append(s2.firstChild);
                                    s2.append(temp);


                                    if (checkflag == 0) return false;

                                }
                            }
                        }
                    }
                    //NW
                    for (let i = 1; i < 8; i++) {
                        if (pid + i * width - i < 64 && pid + i * width - i >= 0) {
                            let f = 0;
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${pid + j * width - j}"]`).firstChild) f++
                            }
                            if (!f) {
                                let s2 = document.querySelector(`[square-id="${pid + i * width - i}"]`).firstChild;
                                if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                                    let temp = s2.firstchild;
                                    s2.firstChild.remove();
                                    s2.append(s1.firstchild);
                                    s1.firstChild.remove();
                                    alllSquares.forEach(square2 => {
                                        if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                            kingkiid = Number(square2.getAttribute('square-id'));
                                        }
                                    });


                                    checkflag = 0;
                                    checkCheck(kingkiid);


                                    s1.append(s2.firstChild);
                                    s2.append(temp);


                                    if (checkflag == 0) return false;

                                }
                            }
                        }
                    }
                    //SW
                    for (let i = 1; i < 8; i++) {
                        if (pid - i * width + i < 64 && pid - i * width + i >= 0) {
                            let f = 0;
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${pid - j * width + j}"]`).firstChild) f++
                            }
                            if (!f) {
                                let s2 = document.querySelector(`[square-id="${pid - i * width + i}"]`).firstChild;
                                if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                                    let temp = s2.firstchild;
                                    s2.firstChild.remove();
                                    s2.append(s1.firstchild);
                                    s1.firstChild.remove();
                                    alllSquares.forEach(square2 => {
                                        if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                            kingkiid = Number(square2.getAttribute('square-id'));
                                        }
                                    });


                                    checkflag = 0;
                                    checkCheck(kingkiid);


                                    s1.append(s2.firstChild);
                                    s2.append(temp);


                                    if (checkflag == 0) return false;

                                }
                            }
                        }
                    }
                    //SE
                    for (let i = 1; i < 8; i++) {
                        if (pid - i * width - i < 64 && pid - i * width - i >= 0) {
                            let f = 0;
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${pid - j * width - j}"]`).firstChild) f++
                            }
                            if (!f) {
                                let s2 = document.querySelector(`[square-id="${pid - i * width - i}"]`).firstChild;
                                if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                                    let temp = s2.firstchild;
                                    s2.firstChild.remove();
                                    s2.append(s1.firstchild);
                                    s1.firstChild.remove();
                                    alllSquares.forEach(square2 => {
                                        if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                            kingkiid = Number(square2.getAttribute('square-id'));
                                        }
                                    });


                                    checkflag = 0;
                                    checkCheck(kingkiid);


                                    s1.append(s2.firstChild);
                                    s2.append(temp);


                                    if (checkflag == 0) return false;

                                }
                            }
                        }
                    }

                    break;

                case 'rook':

                    //top
                    for (let i = 1; i < 8; i++) {
                        if (pid + i < 64 && pid + i >= 0) {
                            let f = 0;
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${pid + j}"]`).firstChild) f++
                            }
                            if (!f) {
                                let s2 = document.querySelector(`[square-id="${pid + i}"]`).firstChild;
                                if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                                    let temp = s2.firstchild;
                                    s2.firstChild.remove();
                                    s2.append(s1.firstchild);
                                    s1.firstChild.remove();
                                    alllSquares.forEach(square2 => {
                                        if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                            kingkiid = Number(square2.getAttribute('square-id'));
                                        }
                                    });


                                    checkflag = 0;
                                    checkCheck(kingkiid);


                                    s1.append(s2.firstChild);
                                    s2.append(temp);


                                    if (checkflag == 0) return false;

                                }
                            }
                        }
                    }

                    //down
                    for (let i = 1; i < 8; i++) {
                        if (pid - i < 64 && pid - i >= 0) {
                            let f = 0;
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${pid - j}"]`).firstChild) f++
                            }
                            if (!f) {
                                let s2 = document.querySelector(`[square-id="${pid - i}"]`).firstChild;
                                if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                                    let temp = s2.firstchild;
                                    s2.firstChild.remove();
                                    s2.append(s1.firstchild);
                                    s1.firstChild.remove();
                                    alllSquares.forEach(square2 => {
                                        if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                            kingkiid = Number(square2.getAttribute('square-id'));
                                        }
                                    });


                                    checkflag = 0;
                                    checkCheck(kingkiid);


                                    s1.append(s2.firstChild);
                                    s2.append(temp);


                                    if (checkflag == 0) return false;

                                }
                            }
                        }
                    }

                    //left
                    for (let i = 1; i < 8; i++) {
                        if (pid - i * width < 64 && pid - i * width >= 0) {
                            let f = 0;
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${pid - j * width}"]`).firstChild) f++
                            }
                            if (!f) {
                                let s2 = document.querySelector(`[square-id="${pid - i * width}"]`).firstChild;
                                if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                                    let temp = s2.firstchild;
                                    s2.firstChild.remove();
                                    s2.append(s1.firstchild);
                                    s1.firstChild.remove();
                                    alllSquares.forEach(square2 => {
                                        if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                            kingkiid = Number(square2.getAttribute('square-id'));
                                        }
                                    });


                                    checkflag = 0;
                                    checkCheck(kingkiid);


                                    s1.append(s2.firstChild);
                                    s2.append(temp);


                                    if (checkflag == 0) return false;

                                }
                            }
                        }
                    }

                    //right
                    for (let i = 1; i < 8; i++) {
                        if (pid + i * width < 64 && pid + i * width >= 0) {
                            let f = 0;
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${pid + j * width}"]`).firstChild) f++
                            }
                            if (!f) {
                                let s2 = document.querySelector(`[square-id="${pid + i * width}"]`).firstChild;
                                if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                                    let temp = s2.firstchild;
                                    s2.firstChild.remove();
                                    s2.append(s1.firstchild);
                                    s1.firstChild.remove();
                                    alllSquares.forEach(square2 => {
                                        if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                            kingkiid = Number(square2.getAttribute('square-id'));
                                        }
                                    });


                                    checkflag = 0;
                                    checkCheck(kingkiid);


                                    s1.append(s2.firstChild);
                                    s2.append(temp);


                                    if (checkflag == 0) return false;

                                }
                            }
                        }
                    }


                    break;

                case 'queen':

                    //NE
                    for (let i = 1; i < 8; i++) {
                        if (pid + i * width + i < 64 && pid + i * width + i >= 0) {
                            let f = 0;
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${pid + j * width + j}"]`).firstChild) f++
                            }
                            if (!f) {
                                let s2 = document.querySelector(`[square-id="${pid + i * width + i}"]`).firstChild;
                                if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                                    let temp = s2.firstchild;
                                    s2.firstChild.remove();
                                    s2.append(s1.firstchild);
                                    s1.firstChild.remove();
                                    alllSquares.forEach(square2 => {
                                        if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                            kingkiid = Number(square2.getAttribute('square-id'));
                                        }
                                    });


                                    checkflag = 0;
                                    checkCheck(kingkiid);


                                    s1.append(s2.firstChild);
                                    s2.append(temp);


                                    if (checkflag == 0) return false;

                                }
                            }
                        }
                    }
                    //NW
                    for (let i = 1; i < 8; i++) {
                        if (pid + i * width - i < 64 && pid + i * width - i >= 0) {
                            let f = 0;
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${pid + j * width - j}"]`).firstChild) f++
                            }
                            if (!f) {
                                let s2 = document.querySelector(`[square-id="${pid + i * width - i}"]`).firstChild;
                                if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                                    let temp = s2.firstchild;
                                    s2.firstChild.remove();
                                    s2.append(s1.firstchild);
                                    s1.firstChild.remove();
                                    alllSquares.forEach(square2 => {
                                        if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                            kingkiid = Number(square2.getAttribute('square-id'));
                                        }
                                    });


                                    checkflag = 0;
                                    checkCheck(kingkiid);


                                    s1.append(s2.firstChild);
                                    s2.append(temp);


                                    if (checkflag == 0) return false;

                                }
                            }
                        }
                    }
                    //SW
                    for (let i = 1; i < 8; i++) {
                        if (pid - i * width + i < 64 && pid - i * width + i >= 0) {
                            let f = 0;
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${pid - j * width + j}"]`).firstChild) f++
                            }
                            if (!f) {
                                let s2 = document.querySelector(`[square-id="${pid - i * width + i}"]`).firstChild;
                                if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                                    let temp = s2.firstchild;
                                    s2.firstChild.remove();
                                    s2.append(s1.firstchild);
                                    s1.firstChild.remove();
                                    alllSquares.forEach(square2 => {
                                        if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                            kingkiid = Number(square2.getAttribute('square-id'));
                                        }
                                    });


                                    checkflag = 0;
                                    checkCheck(kingkiid);


                                    s1.append(s2.firstChild);
                                    s2.append(temp);


                                    if (checkflag == 0) return false;

                                }
                            }
                        }
                    }
                    //SE
                    for (let i = 1; i < 8; i++) {
                        if (pid - i * width - i < 64 && pid - i * width - i >= 0) {
                            let f = 0;
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${pid - j * width - j}"]`).firstChild) f++
                            }
                            if (!f) {
                                let s2 = document.querySelector(`[square-id="${pid - i * width - i}"]`).firstChild;
                                if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                                    let temp = s2.firstchild;
                                    s2.firstChild.remove();
                                    s2.append(s1.firstchild);
                                    s1.firstChild.remove();
                                    alllSquares.forEach(square2 => {
                                        if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                            kingkiid = Number(square2.getAttribute('square-id'));
                                        }
                                    });


                                    checkflag = 0;
                                    checkCheck(kingkiid);


                                    s1.append(s2.firstChild);
                                    s2.append(temp);


                                    if (checkflag == 0) return false;

                                }
                            }
                        }
                    }

                    //top
                    for (let i = 1; i < 8; i++) {
                        if (pid + i < 64 && pid + i >= 0) {
                            let f = 0;
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${pid + j}"]`).firstChild) f++
                            }
                            if (!f) {
                                let s2 = document.querySelector(`[square-id="${pid + i}"]`).firstChild;
                                if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                                    let temp = s2.firstchild;
                                    s2.firstChild.remove();
                                    s2.append(s1.firstchild);
                                    s1.firstChild.remove();
                                    alllSquares.forEach(square2 => {
                                        if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                            kingkiid = Number(square2.getAttribute('square-id'));
                                        }
                                    });


                                    checkflag = 0;
                                    checkCheck(kingkiid);


                                    s1.append(s2.firstChild);
                                    s2.append(temp);


                                    if (checkflag == 0) return false;

                                }
                            }
                        }
                    }

                    //down
                    for (let i = 1; i < 8; i++) {
                        if (pid - i < 64 && pid - i >= 0) {
                            let f = 0;
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${pid - j}"]`).firstChild) f++
                            }
                            if (!f) {
                                let s2 = document.querySelector(`[square-id="${pid - i}"]`).firstChild;
                                if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                                    let temp = s2.firstchild;
                                    s2.firstChild.remove();
                                    s2.append(s1.firstchild);
                                    s1.firstChild.remove();
                                    alllSquares.forEach(square2 => {
                                        if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                            kingkiid = Number(square2.getAttribute('square-id'));
                                        }
                                    });


                                    checkflag = 0;
                                    checkCheck(kingkiid);


                                    s1.append(s2.firstChild);
                                    s2.append(temp);


                                    if (checkflag == 0) return false;

                                }
                            }
                        }
                    }

                    //left
                    for (let i = 1; i < 8; i++) {
                        if (pid - i * width < 64 && pid - i * width >= 0) {
                            let f = 0;
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${pid - j * width}"]`).firstChild) f++
                            }
                            if (!f) {
                                let s2 = document.querySelector(`[square-id="${pid - i * width}"]`).firstChild;
                                if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                                    let temp = s2.firstchild;
                                    s2.firstChild.remove();
                                    s2.append(s1.firstchild);
                                    s1.firstChild.remove();
                                    alllSquares.forEach(square2 => {
                                        if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                            kingkiid = Number(square2.getAttribute('square-id'));
                                        }
                                    });


                                    checkflag = 0;
                                    checkCheck(kingkiid);


                                    s1.append(s2.firstChild);
                                    s2.append(temp);


                                    if (checkflag == 0) return false;

                                }
                            }
                        }
                    }

                    //right
                    for (let i = 1; i < 8; i++) {
                        if (pid + i * width < 64 && pid + i * width >= 0) {
                            let f = 0;
                            for (let j = 1; j < i; j++) {
                                if (document.querySelector(`[square-id="${pid + j * width}"]`).firstChild) f++
                            }
                            if (!f) {
                                let s2 = document.querySelector(`[square-id="${pid + i * width}"]`).firstChild;
                                if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                                    let temp = s2.firstchild;
                                    s2.firstChild.remove();
                                    s2.append(s1.firstchild);
                                    s1.firstChild.remove();
                                    alllSquares.forEach(square2 => {
                                        if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                            kingkiid = Number(square2.getAttribute('square-id'));
                                        }
                                    });


                                    checkflag = 0;
                                    checkCheck(kingkiid);


                                    s1.append(s2.firstChild);
                                    s2.append(temp);


                                    if (checkflag == 0) return false;

                                }
                            }
                        }
                    }

                    break;

                case 'king':

                    if (pid + 1 < 64 && pid + 1 >= 0) {

                        let s2 = document.querySelector(`[square-id="${pid + 1}"]`).firstChild;
                        if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                            let temp = s2.firstchild;
                            s2.firstChild.remove();
                            s2.append(s1.firstchild);
                            s1.firstChild.remove();
                            alllSquares.forEach(square2 => {
                                if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                    kingkiid = Number(square2.getAttribute('square-id'));
                                }
                            });


                            checkflag = 0;
                            checkCheck(kingkiid);


                            s1.append(s2.firstChild);
                            s2.append(temp);


                            if (checkflag == 0) return false;

                        }
                    }
                    if (pid - 1 < 64 && pid - 1 >= 0) {

                        let s2 = document.querySelector(`[square-id="${pid - 1}"]`).firstChild;
                        if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                            let temp = s2.firstchild;
                            s2.firstChild.remove();
                            s2.append(s1.firstchild);
                            s1.firstChild.remove();
                            alllSquares.forEach(square2 => {
                                if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                    kingkiid = Number(square2.getAttribute('square-id'));
                                }
                            });


                            checkflag = 0;
                            checkCheck(kingkiid);


                            s1.append(s2.firstChild);
                            s2.append(temp);


                            if (checkflag == 0) return false;

                        }
                    }
                    if (pid + width < 64 && pid + width >= 0) {

                        let s2 = document.querySelector(`[square-id="${pid + width}"]`).firstChild;
                        if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                            let temp = s2.firstchild;
                            s2.firstChild.remove();
                            s2.append(s1.firstchild);
                            s1.firstChild.remove();
                            alllSquares.forEach(square2 => {
                                if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                    kingkiid = Number(square2.getAttribute('square-id'));
                                }
                            });


                            checkflag = 0;
                            checkCheck(kingkiid);


                            s1.append(s2.firstChild);
                            s2.append(temp);


                            if (checkflag == 0) return false;

                        }
                    }
                    if (pid - width < 64 && pid - width >= 0) {

                        let s2 = document.querySelector(`[square-id="${pid - width}"]`).firstChild;
                        if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                            let temp = s2.firstchild;
                            s2.firstChild.remove();
                            s2.append(s1.firstchild);
                            s1.firstChild.remove();
                            alllSquares.forEach(square2 => {
                                if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                    kingkiid = Number(square2.getAttribute('square-id'));
                                }
                            });


                            checkflag = 0;
                            checkCheck(kingkiid);


                            s1.append(s2.firstChild);
                            s2.append(temp);


                            if (checkflag == 0) return false;

                        }
                    }
                    if (pid + 1 + width < 64 && pid + 1 + width >= 0) {

                        let s2 = document.querySelector(`[square-id="${pid + 1 + width}"]`).firstChild;
                        if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                            let temp = s2.firstchild;
                            s2.firstChild.remove();
                            s2.append(s1.firstchild);
                            s1.firstChild.remove();
                            alllSquares.forEach(square2 => {
                                if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                    kingkiid = Number(square2.getAttribute('square-id'));
                                }
                            });


                            checkflag = 0;
                            checkCheck(kingkiid);


                            s1.append(s2.firstChild);
                            s2.append(temp);


                            if (checkflag == 0) return false;

                        }
                    }
                    if (pid + 1 - width < 64 && pid + 1 - width >= 0) {

                        let s2 = document.querySelector(`[square-id="${pid + 1 - width}"]`).firstChild;
                        if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                            let temp = s2.firstchild;
                            s2.firstChild.remove();
                            s2.append(s1.firstchild);
                            s1.firstChild.remove();
                            alllSquares.forEach(square2 => {
                                if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                    kingkiid = Number(square2.getAttribute('square-id'));
                                }
                            });


                            checkflag = 0;
                            checkCheck(kingkiid);


                            s1.append(s2.firstChild);
                            s2.append(temp);


                            if (checkflag == 0) return false;

                        }
                    }
                    if (pid + width - 1 < 64 && pid + width - 1 >= 0) {

                        let s2 = document.querySelector(`[square-id="${pid + width - 1}"]`).firstChild;
                        if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                            let temp = s2.firstchild;
                            s2.firstChild.remove();
                            s2.append(s1.firstchild);
                            s1.firstChild.remove();
                            alllSquares.forEach(square2 => {
                                if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                    kingkiid = Number(square2.getAttribute('square-id'));
                                }
                            });


                            checkflag = 0;
                            checkCheck(kingkiid);


                            s1.append(s2.firstChild);
                            s2.append(temp);


                            if (checkflag == 0) return false;

                        }
                    }
                    if (pid - width - 1 < 64 && pid - width - 1 >= 0) {

                        let s2 = document.querySelector(`[square-id="${pid - width - 1}"]`).firstChild;
                        if (!s2.firstChild || s2.firstChild.firstChild.classList.contains(playerGo)) {
                            let temp = s2.firstchild;
                            s2.firstChild.remove();
                            s2.append(s1.firstchild);
                            s1.firstChild.remove();
                            alllSquares.forEach(square2 => {
                                if (square2.firstChild && square2.firstChild.id.includes('king') && !square2.firstChild.firstChild.classList.contains(playerGo)) {
                                    kingkiid = Number(square2.getAttribute('square-id'));
                                }
                            });


                            checkflag = 0;
                            checkCheck(kingkiid);


                            s1.append(s2.firstChild);
                            s2.append(temp);


                            if (checkflag == 0) return false;

                        }
                    }


                    break;


            }



        }
    })



    return true;

}

// console.log(gameBoard);
// let squareyo=gameBoard.get
// let mys = document.querySelector(`[square-id="55"]`);
// let mys2 = document.querySelector(`[square-id="63"]`);
// let ap = mys2.firstChild
// mys.firstChild.remove();
// mys.appendChild(ap);
// mys2.firstChild.remove();
// console.log(mys.firstChild);

// let hola = mys.getAttribute('square-id');
// console.log(hola);










