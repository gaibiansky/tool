document.addEventListener('DOMContentLoaded', () => {
    // 延迟检测，确保浏览器先将 HTML 渲染出来
    setTimeout(() => {
        checkDomainsOnLoad();
    }, 0);
});

function checkDomainsOnLoad() {
    const rows = document.querySelectorAll("#website-list tr");

    rows.forEach((row) => {
        const url = row.getAttribute('data-url');  
        const statusCell = row.cells[2]; // 第三列是状态栏             

        if (!url) return;

        // 基于 Image 探测
        checkUrlAccessibility(url, 5000)
            .then(() => {
                // 🛠️ 核心修改：用 <span class="status-text"> 包裹可访问文本，使其与打开按钮通过 CSS 完美靠右排列
                statusCell.innerHTML = `<span class="status-text">可访问</span><a href="${url}" class="open-link" target="_blank">打开</a>`;
                statusCell.classList.remove("loading");
                statusCell.classList.add("accessible");
            })
            .catch(() => {
                statusCell.textContent = "不可访问";
                statusCell.classList.remove("loading");
                statusCell.classList.add("inaccessible");
            });
    });
}

function checkUrlAccessibility(url, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        let timer = setTimeout(() => {
            img.src = ""; 
            reject(new Error("timeout"));
        }, timeout);

        img.onload = () => {
            clearTimeout(timer);
            resolve();
        };

        img.onerror = () => {
            clearTimeout(timer);
            resolve(); 
        };

        const cacheBuster = (url.indexOf('?') === -1 ? '?' : '&') + 't=' + new Date().getTime();
        img.src = url + cacheBuster;
    });
}