document.addEventListener("DOMContentLoaded", load_content);


function load_content(){
    let folder = "C:\\";
    inputlisteners();
    recursion(folder);
}


async function recursion(folder){
    const contentlist = await window.electronAPI.checknreadDir(folder);
    if (contentlist){
        const parentdiv = document.getElementById("list")
        const datalistparent = document.getElementById("foldercontent");
        startup(parentdiv, folder, datalistparent)
        inputcheck(folder)

        console.log(contentlist);
        for (const i of contentlist) {
            const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"];
            const videoExtensions = [".mp4", ".mov", ".m4v", ".webm"]
            const audioExtensions = [".mp3", ".flac", ".wav"]
            const isImage = imageExtensions.some(ext => i.toLowerCase().endsWith(ext));
            const isAudio = audioExtensions.some(ext => i.toLowerCase().endsWith(ext));
            const isVideo = videoExtensions.some(ext => i.toLowerCase().endsWith(ext));

            const childdiv = document.createElement("div");
            const button = document.createElement("button");
            const img = document.createElement("img");
            const option = document.createElement("option");



            const new_folder = await window.electronAPI.joinpath(folder, i);
            const isdir = await window.electronAPI.isdir(new_folder);
            if (isdir) {
                button.textContent = i;
                button.classList.add("directory");
                childdiv.classList.add("directory");
                button.addEventListener("click", async function(){
                    recursion(new_folder);
                });
                img.src = "./ICON/23.ico";
                img.style.height = "20px";
                img.style.width = "auto";
                option.value = new_folder;
            } else {
                button.textContent = i;
                button.classList.add("file");
                childdiv.classList.add("file");
                img.style.height = "20px";
                img.style.width = "auto";
                if (isImage){
                    img.src = "./ICON/757.ico"
                } else if (isVideo){
                    img.src = "./ICON/743.ico"
                } else if (isAudio){
                    img.src = "./ICON/749.ico"
                } else {
                    img.src = "./ICON/1.ico";
                    img.style.height = "17px"
                }
            }
            childdiv.classList.add("childdiv");
            childdiv.appendChild(img);
            childdiv.appendChild(button);
            parentdiv.appendChild(childdiv);
            datalistparent.appendChild(option);
        }
    }
}

async function startup(parentdiv, folder, datalistparent){
    while (parentdiv.firstChild) {
        parentdiv.removeChild(parentdiv.firstChild);
    }
    while (datalistparent.firstChild) {
        datalistparent.removeChild(datalistparent.firstChild);
    }
    if (folder !== "C:\\") {
        const childdiv = document.createElement("div");
        const button = document.createElement("button");
        const img = document.createElement("img");
        img.src = "./ICON/35.ico";
        img.style.height = "20px"
        img.style.width = "auto"
        const new_folder = await window.electronAPI.parentdir(folder)
        button.addEventListener("click", function(){
            recursion(new_folder)
        });
        childdiv.appendChild(img);
        childdiv.classList.add("directory");
        button.textContent = "..";
        childdiv.classList.add("childdiv");
        button.classList.add("directory");
        childdiv.appendChild(button);
        parentdiv.appendChild(childdiv);
    }
}

function inputlisteners(){
    const breadcrumb = document.getElementById("breadcrumb");
    breadcrumb.addEventListener("keydown", (event) => {
        if(event.keyCode === 13) {
            const breadcrumbvalue = breadcrumb.value;
            recursion(breadcrumbvalue);
        }
    });
    breadcrumb.addEventListener(`focus`, () => breadcrumb.select());
}

function inputcheck(folder){
    const breadcrumb = document.getElementById("breadcrumb");
    breadcrumb.value = folder;
}