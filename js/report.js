document.getElementById('observationForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const type = document.getElementById('observationType').value;
    const location = document.getElementById('location').value;
    const details = document.getElementById('details').value;
    const severity = document.getElementById('severity').value;

    const newReport = createReportElement(type, location, details, severity);

    const reportsList = document.querySelector('.reports-list');
    reportsList.insertBefore(newReport, reportsList.firstChild);

    this.reset();
});

function createReportElement(type, location, details, severity) {
    let iconClass, typeClass, typeDisplay;

    switch (type) {
        case 'weather':
            iconClass = 'fas fa-cloud-rain';
            typeClass = 'weather';
            typeDisplay = '';
            break;
        case 'earthquake':
            iconClass = 'fas fa-mountain';
            typeClass = 'quake';
            typeDisplay = '';
            break;
        case 'flood':
            iconClass = 'fas fa-water';
            typeClass = 'flood';
            typeDisplay = '';
            break;
        default:
            iconClass = 'fas fa-exclamation';
            typeClass = '';
            typeDisplay = 'Observation';
    }

    const reportItem = document.createElement('div');
    reportItem.className = 'report-item';

    // Store the timestamp as a data attribute
    const timestamp = new Date();
    reportItem.dataset.timestamp = timestamp.toISOString();

    reportItem.innerHTML = `
        <div class="report-type ${typeClass}">
          <i class="${iconClass}"></i>
        </div>
        <div class="report-content">
          <h4>${typeDisplay} ${details}</h4>
          <p>${location}, <span class="time-ago">just now</span></p>
          ${severity ? `<span class="report-severity ${severity}">${severity.charAt(0).toUpperCase() + severity.slice(1)}</span>` : ''}
        </div>
      `;

    // Update the time ago text immediately
    updateTimeAgo(reportItem);

    // Set interval to update the time ago text every minute
    const intervalId = setInterval(() => updateTimeAgo(reportItem), 60000);
    reportItem.dataset.intervalId = intervalId;

    return reportItem;
}

function updateTimeAgo(reportItem) {
    const timestamp = new Date(reportItem.dataset.timestamp);
    const now = new Date();
    const seconds = Math.floor((now - timestamp) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        const timeAgoText = interval === 1 ? "1 year ago" : `${interval} years ago`;
        reportItem.querySelector('.time-ago').textContent = timeAgoText;
        return;
    }
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        const timeAgoText = interval === 1 ? "1 month ago" : `${interval} months ago`;
        reportItem.querySelector('.time-ago').textContent = timeAgoText;
        return;
    }
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        const timeAgoText = interval === 1 ? "1 day ago" : `${interval} days ago`;
        reportItem.querySelector('.time-ago').textContent = timeAgoText;
        return;
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        const timeAgoText = interval === 1 ? "1 hour ago" : `${interval} hours ago`;
        reportItem.querySelector('.time-ago').textContent = timeAgoText;
        return;
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        const timeAgoText = interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
        reportItem.querySelector('.time-ago').textContent = timeAgoText;
        return;
    }
    
    reportItem.querySelector('.time-ago').textContent = "just now";
}

// Cleanup intervals when reports are removed (optional but recommended)
// You might want to call this when removing reports from the DOM
function clearReportIntervals(reportItem) {
    if (reportItem.dataset.intervalId) {
        clearInterval(parseInt(reportItem.dataset.intervalId));
    }
}
