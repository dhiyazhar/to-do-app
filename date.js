document.addEventListener('DOMContentLoaded', () => {
    // Get references to the date elements
    const dayElement = document.getElementById('day');
    const numElement = document.getElementById('num');
    const monthElement = document.getElementById('month');

    // Function to update the date
    function updateDate() {
        // Create a new Date object
        const currentDate = new Date();

        // Define arrays for day and month names
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

        // Get day, date, and month
        const dayName = days[currentDate.getDay()];
        const dateNum = currentDate.getDate();
        const monthName = months[currentDate.getMonth()];

        // Update the elements
        dayElement.textContent = dayName;
        numElement.textContent = dateNum;
        monthElement.textContent = monthName;
    }

    // Call the function immediately to set the date when the page loads
    updateDate();

    // Optionally, update the date every minute to ensure accuracy
    setInterval(updateDate, 60000);
});