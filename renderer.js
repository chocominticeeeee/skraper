async function main() {
    const templates = await window.myAPI.loadJson();
    loadTemplates(templates);
    document.getElementById("runSkrape").addEventListener("click", async (e) => {
        resultReset();
        currentStatus("実行中...");
        const targetUrl = document.getElementById("targetUrl").value;
        const targetSelector = document.getElementById("targetSelector").value;
        window.myAPI
            .skrape({
                url: targetUrl,
                selector: targetSelector,
            })
            .then((res) => {
                if (res[0] === "error") {
                    resultReflector(res);
                    currentStatus("エラー");
                } else {
                    resultReflector(res);
                    currentStatus("完了！");
                }
            });
    });
    document.getElementById("saveTemplate").addEventListener("click", (e) => {
        const saveUrl = document.getElementById("targetUrl").value;
        const saveSelector = document.getElementById("targetSelector").value;
        window.myAPI
            .saveTemplate({
                url: saveUrl,
                selector: saveSelector,
            })
            .then(async () => {
                const templates = await window.myAPI.loadJson();
                loadTemplates(templates);
            });
    });
}

main();

function loadTemplates(templates) {
    const parentElem = document.querySelector(".templates");
    parentElem.innerHTML = "";
    templates.forEach((template) => {
        const item = document.createElement("li");
        item.classList.add("list-group-item", "pe-5");
        item.setAttribute("data-url", template.url);
        item.setAttribute("data-selector", template.selector);
        item.innerHTML = `URL : ${template.url}<br>Selector : ${template.selector}`;
        item.addEventListener("click", (e) => {
            document.getElementById("targetUrl").value = e.target.dataset.url;
            document.getElementById("targetSelector").value = e.target.dataset.selector;
        });
        parentElem.appendChild(item);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("deleteButton", "btn", "btn-danger", "btn-sm");
        deleteButton.textContent = "✕";
        deleteButton.addEventListener("click", (e) => {
            e.stopPropagation();
            const deleteUrl = item.getAttribute("data-url")
            const deleteSelector = item.getAttribute("data-selector")
            window.myAPI
                .deleteTemplate({
                    url: deleteUrl,
                    selector: deleteSelector,
                })
                .then(async (res) => {
                    const templates = await window.myAPI.loadJson();
                    loadTemplates(templates);
                });
        });
        item.appendChild(deleteButton);
    });
}

function resultReflector(result = []) {
    const resultElem = document.getElementById("result");
    result.forEach((element) => {
        const item = document.createElement("li");
        item.classList.add("list-group-item");
        item.textContent = element;
        resultElem.appendChild(item);
    });
}

function resultReset() {
    const resultElem = document.getElementById("result");
    resultElem.innerHTML = "";
}

function currentStatus(status) {
    document.getElementById("status").textContent = status;
}
