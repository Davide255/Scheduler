function openNav() {
    let elem = document.getElementById("side-nav");
    elem.style.transition = "all 0.5s ease";
    elem.style.transform = "translateX(0)";
}

function closeNav() {
    document.getElementById("side-nav").style.transform = "translateX(-250px)";
}