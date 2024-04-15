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
    rook, knight, bishop, queen, king, bishop, knight, rook,
]


function shuffle(array) {
    for (let i = 7; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
        [array[56 + i], array[56 + j]] = [array[56 + j], array[56 + i]];
    }
    return array;
}

// let fboard = shuffle(startPieces);
let fboard = startPieces;




function createBoard() {
    fboard.forEach((startPiece, i) => {
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


    if (correctGo) {

        if (takenByOpponent && valid) {
            e.target.parentNode.append(draggedElement)
            e.target.remove()
        }


        else if (taken && !takenByOpponent) {
            infoDisplay.textContent = "you cannot go here!"
            setTimeout(() => infoDisplay.textContent = "", 2000)

        }

        else if (valid) {
            e.target.append(draggedElement)
        }
        checkflag = 0;
        alllSquares.forEach(square => {
            if (square.firstChild && square.firstChild.id.includes('king') && !square.firstChild.firstChild.classList.contains(playerGo)) {
                kingId = Number(square.getAttribute('square-id'));
            }
        });


        checkCheck(kingId);
        if (checkflag) {



            if (kingId > 0) checkAround(kingId - 1);
            else checkflag++;

            if (kingId < 63) checkAround(kingId + 1);
            else checkflag++;

            if (kingId < 56) checkAround(kingId + width);
            else checkflag++;

            if (kingId > 7) checkAround(kingId - width);
            else checkflag++;

            if (kingId > 8) checkAround(kingId - width - 1);
            else checkflag++;

            if (kingId > 6) checkAround(kingId - width + 1);
            else checkflag++;

            if (kingId < 55) checkAround(kingId + width + 1);
            else checkflag++;

            if (kingId < 57) checkAround(kingId + width - 1);
            else checkflag++;

            if (checkflag === 9) {
                console.log("CHECKMATE!");
                return;
            }

            else console.log("Check!")


        }
        else console.log("No check!");



        if (valid) changePlayer()


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
                startId + width - 1 === targetId && document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild
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
            if (
                startId + 1 === targetId ||
                startId - 1 === targetId ||
                startId - width === targetId ||
                startId + width === targetId ||
                startId + width + 1 === targetId ||
                startId + width - 1 === targetId ||
                startId - width - 1 === targetId ||
                startId - width + 1 === targetId

            ) return true;

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

    // console.log("kingId", kingId);
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









