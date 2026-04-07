let viewDate = new Date();

async function updateDisplay(targetDate) {
    const d = targetDate.getDate();
    const m = targetDate.getMonth() + 1;

    // Force 2-digit padding
    const dayStr = d < 10 ? '0' + d : '' + d;
    const monthStr = m < 10 ? '0' + m : '' + m;

    // YOUR DATA FORMAT: "DD-MM" (e.g. "01-03" for 1st March)
    const lookupKey = `${dayStr}-${monthStr}`;
    const fileName = `${monthStr}.json`;

    const rootPath = 'https://raw.githubusercontent.com/lavamitts/on-this-day/refs/heads/main/';
    const filePath = `${rootPath}data/history/${fileName}`;

    console.log(`Fetching: ${fileName} | Looking for Key: ${lookupKey}`);

    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
        
        const monthData = await response.json();
        
        // Find the entry. We use .trim() just in case there is whitespace in the JSON keys
        const dayEntry = monthData.find(entry => entry.date.trim() === lookupKey);

        if (!dayEntry) {
            console.warn(`Key "${lookupKey}" not found in ${fileName}. Available keys:`, monthData.map(e => e.date));
        }

        renderEvents(dayEntry ? dayEntry.events : [], targetDate, rootPath);
    } catch (error) {
        console.error("Navigation Error:", error);
        renderEvents([], targetDate, rootPath);
    }
}

function renderEvents(events, date, rootPath) {
    const container = document.getElementsByClassName('otd-container')[0];
    if (!container) return;

    const dateHeading = date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long'
    });

    let eventsHtml = '';
    
    if (events && events.length > 0) {
        eventsHtml = events.map(ev => {
            const eventYear = ev.date.split('-')[0];
            const themeImg = `${rootPath}themes/otd-theme-${ev.theme.toLowerCase()}.webp`;

            return `
                <div class="otd-event-row" style="display: flex; align-items: flex-start; margin-bottom: 20px;">
                    <img src="${themeImg}" style="width: 65px; margin-right: 15px;" />
                    <div>
                        <p style="font-weight: bold; margin: 0;">${eventYear}</p>
                        <p style="margin: 2px 0 0 0;">${ev.event}</p>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        eventsHtml = '<p>No historical events found for this date.</p>';
    }

    container.innerHTML = `
        <div class="otd-card" style="border: 1px solid #ccc; padding: 20px; border-radius: 8px;">
            <div class="otd-nav" style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <button id="otd-prev">Previous</button>
                <button id="otd-today">Today</button>
                <button id="otd-next">Next</button>
            </div>
            <h2 style="text-align: center;">${dateHeading}</h2>
            <hr />
            <div class="otd-list">${eventsHtml}</div>
        </div>
    `;

    document.getElementById('otd-prev').onclick = () => navigateDays(-1);
    document.getElementById('otd-next').onclick = () => navigateDays(1);
    document.getElementById('otd-today').onclick = () => {
        viewDate = new Date();
        updateDisplay(viewDate);
    };
}

function navigateDays(offset) {
    viewDate.setDate(viewDate.getDate() + offset);
    updateDisplay(viewDate);
}

document.addEventListener('DOMContentLoaded', () => updateDisplay(viewDate));