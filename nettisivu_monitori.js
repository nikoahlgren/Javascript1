document.addEventListener("DOMContentLoaded", function () {
    const siteList = document.getElementById("siteList");
    const addSiteForm = document.getElementById("addSiteForm");
    const siteInput = document.getElementById("siteInput");
    const pingAllBtn = document.getElementById("pingAll");
    let sites = JSON.parse(localStorage.getItem("sites")) || [];

    function saveSites() {
        localStorage.setItem("sites", JSON.stringify(sites));
    }

    function updateSiteStatus(index, status) {
        const statusDot = document.getElementById(`status-${index}`);
        statusDot.style.color = status ? "green" : "red";
    }

    window.pingSite = function (index) {
        fetch(sites[index], { mode: "no-cors" })
            .then(() => updateSiteStatus(index, true))
            .catch(() => updateSiteStatus(index, false));
    };

    window.deleteSite = function (index) {
        sites.splice(index, 1);
        saveSites();
        renderSites();
    };

    function renderSites() {
        siteList.innerHTML = "";
        sites.forEach((site, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><span id="status-${index}" style="color: gray;">●</span></td>
                <td>${site}</td>
                <td>
                    <button onclick="pingSite(${index})">Ping</button>
                    <button onclick="deleteSite(${index})">Delete</button>
                </td>
            `;
            siteList.appendChild(row);
        });
    }

    addSiteForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const site = siteInput.value.trim();
        if (site && !sites.includes(site)) {
            sites.push(site);
            saveSites();
            renderSites();
        }
        siteInput.value = "";
    });

    pingAllBtn.addEventListener("click", function () {
        sites.forEach((_, index) => pingSite(index));
    });

    setInterval(() => sites.forEach((_, index) => pingSite(index)), 300000);

    renderSites();
});
