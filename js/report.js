
// The corrected JavaScript from above
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

    reportItem.innerHTML = `
        <div class="report-type ${typeClass}">
          <i class="${iconClass}"></i>
        </div>
        <div class="report-content">
          <h4>${typeDisplay} ${details}</h4>
          <p>${location}, just now</p>
          ${severity ? `<span class="report-severity ${severity}">${severity.charAt(0).toUpperCase() + severity.slice(1)}</span>` : ''}
        </div>
      `;

    return reportItem;
}