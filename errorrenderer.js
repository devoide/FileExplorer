document.addEventListener("DOMContentLoaded", load_content);

function load_content(){
    const cancelbutton = document.getElementById("cancelbtn");
    cancelbutton.addEventListener("click", () => {
        window.electronAPI.closewin();
    })
}