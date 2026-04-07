async function displayTodayEvent() {
    // a) Work out today's date
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    
    const todayKey = `${day}-${month}`; // Format: "07-04"

    // b) Work out which of the files 01 to 12 this represents
    const fileName = `${month}.json`;
    const filePath = `JSON/${fileName}`;

    try {
        const response = await fetch(filePath);
        
        if (!response.ok) {
            throw new Error(`Could not fetch ${fileName}`);
        }

        const monthData = await response.json();

        // c) Within that file, work out which date is today's date
        const todayData = monthData.find(entry => entry.date === todayKey);

        if (todayData && todayData.events.length > 0) {
            // d) Randomly select one of the items
            const randomIndex = Math.floor(Math.random() * todayData.events.length);
            const selectedEvent = todayData.events[randomIndex];

            // e) Print to screen the date, the event and the theme
            // Using document.write for a simple print, or console.log
            const output = `
                <div style="font-family: sans-serif; padding: 20px;">
                    <p><strong>Date:</strong> ${selectedEvent.date}</p>
                    <p><strong>Event:</strong> ${selectedEvent.event}</p>
                    <p><strong>Theme:</strong> ${selectedEvent.theme}</p>
                </div>
            `;
            document.body.innerHTML = output;
            
            // Also logging to console for verification
            console.log(selectedEvent);
        } else {
            document.body.innerHTML = `<p>No events found for today's date: ${todayKey}</p>`;
        }
    } catch (error) {
        console.error("Error loading event data:", error);
        document.body.innerHTML = `<p>Error: ${error.message}. Ensure you are running this through a web server.</p>`;
    }
}

// Execute the function
displayTodayEvent();