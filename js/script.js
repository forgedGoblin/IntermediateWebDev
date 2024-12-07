import { safeAwait } from "./utils.js";

const API_KEY = "RGAPI-6d646b36-2f61-4a38-a628-2201259dd9ac";
const REGION = "ph2";
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

let globalPuuid = null;
let gameName = null;
let tagLine = null;

// Bind event listeners
document
    .getElementById("get-mastery")
    ?.addEventListener("click", fetchMasteryData);

// Helper functions
// Fetch player's PUUID by Riot ID (gameName + tagLine)
async function fetchPUUIDByRiotId() {
    const riotId = document.getElementById("summoner-name").value;

    // split game name and tagline and place them inside respective variables
    [gameName, tagLine] = riotId.split("#");

    if (!gameName || !tagLine) {
        console.error("Please enter a valid Riot ID (gameName#tagLine).");
        return;
    }

    try {
        // fetch puuid with cors proxy server
        const response = await fetch(
            `${CORS_PROXY}https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`Error fetching PUUID: ${response.statusText}`);
        }

        const data = await response.json();
        const puuid = data.puuid;

        // set puuid as a global variable for global access
        globalPuuid = puuid;
        return globalPuuid;
    } catch (error) {
        console.error("Error:", error.message);
    }
}

// Function to fetch top 5 champion masteries by PUUID
async function fetchChampionMasteries(globalPuuid) {
    try {
        // from puuid fetch player's champion mastery
        const response = await fetch(
            `${CORS_PROXY}https://${REGION}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${globalPuuid}?api_key=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error(
                `Error fetching champion masteries: ${response.statusText}`
            );
        }

        const masteryData = await response.json();

        // fetch champion data from DataDragon API
        const championData = await fetch(
            "https://ddragon.leagueoflegends.com/cdn/14.22.1/data/en_US/champion.json"
        )
            .then(response => response.json())
            .then(data => data.data)
            .catch(error => {
                throw new Error(
                    "Error fetching champion data: " + error.message
                );
            });

        // map champion data for quick lookup by champion ID
        const championMap = {};
        for (const champ in championData) {
            const champInfo = championData[champ];
            championMap[champInfo.key] = {
                name: champInfo.name,
                image: `https://ddragon.leagueoflegends.com/cdn/14.22.1/img/champion/${champInfo.id}.png`,
            };
        }

        // map to combine mastery data and champion info (name and image)
        const masteryWithNames = masteryData.map(mastery => ({
            ...mastery,
            championName:
                championMap[mastery.championId]?.name || "Unknown Champion",
            championImage:
                championMap[mastery.championId]?.image || "/placeholder.svg",
        }));

        // filter and sort the data based on mastery points
        const filteredMasteries = masteryWithNames
            .filter(mastery => mastery.championPoints > 0)
            .sort((a, b) => b.championPoints - a.championPoints)
            .slice(0, 5);

        return filteredMasteries;
    } catch (error) {
        console.error("Error:", error.message);
    }
}

// Display mastery title and data in HTML
function displayMasteryData(masteries) {
    const masteryContainer = document.getElementById("mastery-container");
    const masteryContainerTitle = document.getElementById(
        "mastery-container-title"
    );

    masteryContainer.innerHTML = "";
    masteryContainerTitle.innerHTML = "";

    // output data into index.html
    // display league stat links
    const masteryTitleContent = document.createElement("div");
    masteryTitleContent.classList.add("font-ibm-plex-mono-500");
    masteryTitleContent.innerHTML = `
    <h2>Champion Mastery Data</h2>
    <div id="link-div" class="flex-row">
        <a
            class="profile-link font-ibm-plex-mono-400"
            href="https://www.op.gg/summoners/ph/${encodeURIComponent(
                gameName
            )}%20-${encodeURIComponent(tagLine)}"
            target="_blank"
        >op.gg</a>
        <a
            class="profile-link font-ibm-plex-mono-400"
            href="https://www.leagueofgraphs.com/summoner/ph/${encodeURIComponent(
                gameName
            )}-${encodeURIComponent(tagLine)}"
            target="_blank"
        >League of Graphs</a>
        <a
            class="profile-link font-ibm-plex-mono-400"
            href="https://u.gg/lol/profile/ph2/${encodeURIComponent(
                gameName
            )}%20-${encodeURIComponent(tagLine)}/overview"
            target="_blank"
        >u.gg</a>
    </div>
`;
    masteryContainerTitle.appendChild(masteryTitleContent);

    // display top 5 mastery
    if (masteries && masteries.length > 0) {
        masteries.slice(0, 5).forEach(mastery => {
            const masteryElement = document.createElement("div");
            masteryElement.classList.add("champion-card", "flex-col");
            masteryElement.innerHTML = `
                <div class="champion-image">
                    <img src="${mastery.championImage}" alt="${
                mastery.championName
            } Image" height="96" width="96" />
                </div>
                <h3 class="champion-name">${mastery.championName}</h3>
                <div class="mastery-info">
                    <p class="mastery-level">
                        <span>Mastery Level:</span>
                        <span class="highlight">${mastery.championLevel}</span>
                    </p>
                    <p class="mastery-points">
                        <span>Mastery Points:</span>
                        <span class="highlight">${mastery.championPoints.toLocaleString()}</span>
                    </p>
                </div>
            `;
            masteryContainer.appendChild(masteryElement);
        });
    } else {
        masteryContainer.innerHTML += "<p>No champion mastery data found.</p>";
    }
}
//Helper functions

// Fetch mastery data and display it
async function fetchMasteryData() {
    const summonerName = document.getElementById("summoner-name").value;
    const [gameName, tagLine] = summonerName.split("#");

    if (!gameName || !tagLine) {
        alert("Please enter a valid Riot ID (gameName#tagLine).");
        return;
    }

    const [err, data] = await safeAwait(async () => {
        const puuid = await fetchPUUIDByRiotId(gameName, tagLine);
        if (!puuid) return;
        return await fetchChampionMasteries(puuid);
    });

    if (data) displayMasteryData(data);
    else showCorsWarning();
}

const showCorsWarning = () => {
    console.warn("Cors not yet enabled");
    const dialog = document.getElementById("cors-warning");
    dialog.showModal();
};
