function changeBackground(imageUrl) {
    document.body.style.backgroundImage = "url('" + imageUrl + "')";
    localStorage.setItem('selectedBackground', imageUrl);
}

function applyStoredBackground() {
    const selectedBackground = localStorage.getItem('selectedBackground');
    if (selectedBackground) {
        document.body.style.backgroundImage = "url('" + selectedBackground + "')";
    }
}

window.addEventListener('load', applyStoredBackground);

document.getElementById('background1').addEventListener('click', function () {
    changeBackground('bg1.jpg');
});

document.getElementById('background2').addEventListener('click', function () {
    changeBackground('bg2.jpg');
});

document.getElementById('background3').addEventListener('click', function () {
    changeBackground('bg4.jpg');
});

document.getElementById('background4').addEventListener('click', function () {
    changeBackground('bg5.jpg');
});
