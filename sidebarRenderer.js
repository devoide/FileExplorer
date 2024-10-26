document.addEventListener("DOMContentLoaded", load_content);


function load_content(){
    information()
}



async function information(){
    const info =  await window.electronAPI.disks()
    for (const i of info){
        const parentdiv = document.getElementById("sidebar")
        const childdiv = document.createElement("div");
        const button = document.createElement("button");

        button.addEventListener("click", () => recursion(`${i[0]}\\`))

        /*disk = i[0]*/
        button.textContent = `${i[4]} (${i[0]})`


        button.classList.add("directory");
        childdiv.classList.add("childdiv");
        childdiv.appendChild(button);
        parentdiv.appendChild(childdiv);
    }
}