async function displayTodayEvent() {
    // 1. Work out today's date for the filename and the lookup key
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const todayKey = `${day}-${month}`; // Matches "07-04"

    // 2. Define the path (This is where the 'undefined' error usually happens)
    const fileName = `${month}.json`;
    const baseUrl = 'https://raw.githubusercontent.com/lavamitts/on-this-day/refs/heads/main/data/';
    const filePath = `${baseUrl}${fileName}`;

    try {
        const response = await fetch(filePath);
        
        if (!response.ok) {
            throw new Error(`Could not fetch ${fileName} (Status: ${response.status})`);
        }

        const monthData = await response.json();

        // 3. Find today's entry in the file
        const todayData = monthData.find(entry => entry.date === todayKey);

        if (todayData && todayData.events && todayData.events.length > 0) {
            // 4. Random selection
            const randomIndex = Math.floor(Math.random() * todayData.events.length);
            const selectedEvent = todayData.events[randomIndex];
            const theme = selectedEvent.theme;
            const img = 'https://raw.githubusercontent.com/lavamitts/on-this-day/refs/heads/main/data/' theme.toLowerCase() + ".webp";

            // 5. Format the date string to "7 April 1945"
            // We split the "1945-04-07" string to avoid timezone shifts
            const [y, m, d] = selectedEvent.date.split('-');
            const eventDateObj = new Date(y, m - 1, d);
            
            const formattedDate = eventDateObj.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            // 6. Inject into the WordPress container
            // const container = document.getElementById('otd-container');
            const container = document.getElementsByClassName('otd-container')[0];
            
            if (container) {
                container.innerHTML = `
                    <div class="otd-card" style="font-family: sans-serif; border-left: 4px solid #0073aa; padding: 15px; background: #f9f9f9; max-width: 600px;">
                        <p style="margin: 0 0 5px 0; font-weight: bold; color: #333;">${formattedDate}</p>
                        <p style="margin: 0 0 10px 0; line-height: 1.5; color: #000;">${selectedEvent.event}</p>
                        <p style="margin: 0; font-size: 0.85em; color: #666; text-transform: uppercase;">Theme: ${selectedEvent.theme}</p>
                    </div>
                `;
            }
        } else {
            console.warn(`No events found for ${todayKey}`);
        }
    } catch (error) {
        // This will now report the specific error if something else fails
        console.error("OTD Error:", error);
    }
}

// Initialise the function
displayTodayEvent();