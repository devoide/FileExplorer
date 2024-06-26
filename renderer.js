document.addEventListener("DOMContentLoaded", load_content);


const fileTypes = {
    image: [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"],
    video: [".mp4", ".mov", ".m4v", ".webm"],
    audio: [".mp3", ".flac", ".wav"]
};

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
        let sortedContentlist = []
        let listfile = []
        for (const i of contentlist) {
            const new_folder = await window.electronAPI.joinpath(folder, i);
            const isdir = await window.electronAPI.isdir(new_folder);

            if (isdir) {
                sortedContentlist.push(i)
            } else {
                listfile.push(i)
            }
        }
        sortedContentlist = sortedContentlist.concat(listfile)
        console.log(sortedContentlist)
        for (const i of sortedContentlist){
            const childdiv = document.createElement("div");
            const button = document.createElement("button");
            const img = document.createElement("img");
            const option = document.createElement("option");



            const new_folder = await window.electronAPI.joinpath(folder, i);
            const isdir = await window.electronAPI.isdir(new_folder);
            img.style.height = "20px";
            img.style.width = "20px";

            if (isdir) {
                button.textContent = i;
                button.classList.add("directory");
                childdiv.classList.add("directory");
                childdiv.addEventListener("click", async function(){
                    recursion(new_folder);
                });
                img.src = "./ICON/23.ico";
                option.value = new_folder;
            } else {
                button.textContent = i;
                button.classList.add("file");
                childdiv.classList.add("file");
                childdiv.addEventListener("click", async function(){
                    window.electronAPI.start(new_folder)
                })
                const filesort = getFileType(i)
                if (filesort === "image"){
                    img.src = new_folder
                    //img.src = "./ICON/757.ico"
                } else if (filesort === "video"){
                    img.src = "./ICON/743.ico"
                } else if (filesort === "audio"){
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
    const info =  await window.electronAPI.disks()
    while (parentdiv.firstChild) {
        parentdiv.removeChild(parentdiv.firstChild);
    }
    while (datalistparent.firstChild) {
        datalistparent.removeChild(datalistparent.firstChild);
    }
    const infoList = info.map((x) => `${x[0]}\\`);
    const result = infoList.find((i) => i === folder);
    if (!result){
        const childdiv = document.createElement("div");
        const button = document.createElement("button");
        const img = document.createElement("img");
        img.src = "./ICON/35.ico";
        img.style.height = "20px";
        img.style.width = "20px";
        const new_folder = await window.electronAPI.parentdir(folder);
        childdiv.addEventListener("click", function(){
            recursion(new_folder);
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

function getFileType(fileName) {
    const extension = fileName.toLowerCase().slice(fileName.lastIndexOf('.'));
    for (const type in fileTypes) {
        if (fileTypes[type].includes(extension)) {
            return type;
        }
    }
    return 'unknown';
}
