const EMI_API_URL = '/api/emi/calculate';

// Prepayment State
let prepayments = [];
let rateChanges = [];
let emiChart = null;

document.addEventListener('DOMContentLoaded', () => {

    // Format input fields with Indian commas automatically
    const principalInput = document.getElementById('principal');
    const monthlyPrepayInput = document.getElementById('monthly-prepayment');

    const formatInput = (input) => {
        let value = input.value.replace(/[^0-9]/g, '');
        if (value) {
            input.value = parseInt(value, 10).toLocaleString('en-IN');
        } else {
            input.value = input.id === 'principal' ? '' : '0';
        }
    };

    principalInput.addEventListener('input', () => formatInput(principalInput));
    monthlyPrepayInput.addEventListener('input', () => formatInput(monthlyPrepayInput));

    // Modern Date Picker Initialization
    flatpickr("#start-date", {
        defaultDate: "today",
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "F j, Y",
        theme: "dark"
    });

    flatpickr("#monthly-prepay-start", {
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "M j, Y",
        theme: "dark"
    });

    flatpickr("#monthly-prepay-end", {
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "M j, Y",
        theme: "dark"
    });

    // Add Event Listeners for Dynamic Lists
    document.getElementById('add-prepayment-btn').addEventListener('click', addPrepaymentField);
    document.getElementById('add-rate-btn').addEventListener('click', addRateField);

    // Slider sync: Interest Rate
    const rateSlider = document.getElementById('interest-rate-slider');
    const rateInput = document.getElementById('interest-rate');
    const rateDisplay = document.getElementById('rate-display');

    rateSlider.addEventListener('input', () => {
        rateInput.value = rateSlider.value;
        rateDisplay.textContent = rateSlider.value + '%';
    });
    rateInput.addEventListener('input', () => {
        rateSlider.value = rateInput.value;
        rateDisplay.textContent = rateInput.value + '%';
    });

    // Slider sync: Tenure
    const tenureSlider = document.getElementById('tenure-slider');
    const tenureInput = document.getElementById('tenure');
    const tenureDisplay = document.getElementById('tenure-display');

    tenureSlider.addEventListener('input', () => {
        tenureInput.value = tenureSlider.value;
        tenureDisplay.textContent = tenureSlider.value + ' Months';
    });
    tenureInput.addEventListener('input', () => {
        tenureSlider.value = tenureInput.value;
        tenureDisplay.textContent = tenureInput.value + ' Months';
    });

    // Form Submission
    document.getElementById('calculate-btn').addEventListener('click', calculateEMI);

    // Export to Excel
    document.getElementById('export-excel-btn').addEventListener('click', exportToExcel);

    // Initial calculation (optional)
    calculateEMI();
});

function exportToExcel() {
    const tbody = document.getElementById('schedule-body');
    if (!tbody || tbody.rows.length === 0) {
        alert('No data to export. Please calculate the schedule first.');
        return;
    }

    // Build CSV content with header
    const headers = ['Date', 'EMI', 'Principal', 'Interest', 'Prepayment', 'Rate (%)', 'Balance'];
    let csv = '\uFEFF'; // BOM for Excel UTF-8 support
    csv += headers.join(',') + '\n';

    // Add summary row
    const principal = document.getElementById('principal').value;
    const rate = document.getElementById('interest-rate').value;
    const tenure = document.getElementById('tenure').value;
    const startDate = document.getElementById('summary-start-date').innerText;
    const endDate = document.getElementById('summary-end-date').innerText;
    const emi = document.getElementById('summary-emi').innerText;
    const months = document.getElementById('summary-months').innerText;

    csv += '\n';
    csv += 'Loan Summary\n';
    csv += `Principal Amount,"${principal}"\n`;
    csv += `Annual Interest Rate,${rate}%\n`;
    csv += `Tenure,${tenure} Months\n`;
    csv += `Start Date,${startDate}\n`;
    csv += `End Date,${endDate}\n`;
    csv += `Initial EMI,"${emi}"\n`;
    csv += `Effective Tenure,${months}\n`;
    csv += '\n';
    csv += headers.join(',') + '\n';

    // Add data rows
    Array.from(tbody.rows).forEach(row => {
        const cells = Array.from(row.cells).map(cell => {
            let val = cell.innerText.replace(/₹/g, '').replace(/,/g, '').trim();
            // Wrap in quotes if it contains special characters
            if (val.includes('/') || val.includes(',')) {
                return `"${val}"`;
            }
            return val;
        });
        csv += cells.join(',') + '\n';
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `EMI_Schedule_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 0
    }).format(amount);
}

function createFormGroup(labelText, inputType, inputId, placeholder, required, flexValue = "1") {
    const group = document.createElement('div');
    group.className = 'form-group';
    group.style.flex = flexValue;

    const label = document.createElement('label');
    label.innerText = labelText;

    const input = document.createElement('input');
    // If it's a date field, we use type="text" and initialize flatpickr
    input.type = inputType === 'date' ? 'text' : inputType;
    input.className = 'form-control';
    input.id = inputId;
    if (placeholder) input.placeholder = placeholder;
    if (required) input.required = true;
    input.autocomplete = "off";

    group.appendChild(label);
    group.appendChild(input);

    if (inputType === 'date') {
        setTimeout(() => {
            flatpickr(input, {
                dateFormat: "Y-m-d",
                altInput: true,
                altFormat: "M j, Y",
                theme: "dark"
            });
        }, 0);
    }

    return group;
}

function addPrepaymentField() {
    const list = document.getElementById('prepayments-list');
    const index = Date.now();

    const item = document.createElement('div');
    item.className = 'dynamic-item';

    // Use Date picker for Prepayment Date
    const dateGroup = createFormGroup('Date', 'date', `prepay-date-${index}`, '', true, "1");
    const amountGroup = createFormGroup('Amount (₹)', 'text', `prepay-amount-${index}`, 'e.g. 50,000', true, "2");

    // Auto format amount logic for dynamic fields
    amountGroup.querySelector('input').addEventListener('input', function (e) {
        let val = this.value.replace(/[^0-9]/g, '');
        if (val) this.value = parseInt(val, 10).toLocaleString('en-IN');
        else this.value = '';
    });

    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-small btn-danger';
    delBtn.innerHTML = '<i class="fas fa-trash"></i>';
    delBtn.onclick = () => { list.removeChild(item); };

    item.appendChild(dateGroup);
    item.appendChild(amountGroup);
    item.appendChild(delBtn);

    list.appendChild(item);
}

function addRateField() {
    const list = document.getElementById('rate-changes-list');
    const index = Date.now();

    const item = document.createElement('div');
    item.className = 'dynamic-item';
    item.style.flexDirection = 'column';
    item.style.alignItems = 'stretch';
    item.style.gap = '0.5rem';

    const row1 = document.createElement('div');
    row1.style.display = 'flex';
    row1.style.gap = '0.5rem';

    const startDateGroup = createFormGroup('Start Date', 'date', `rate-start-${index}`, '', true, "1");
    const endDateGroup = createFormGroup('End Date', 'date', `rate-end-${index}`, '', true, "1");

    row1.appendChild(startDateGroup);
    row1.appendChild(endDateGroup);

    const row2 = document.createElement('div');
    row2.style.display = 'flex';
    row2.style.gap = '0.5rem';
    row2.style.alignItems = 'flex-end';

    const newRateGroup = createFormGroup('New Rate (%)', 'number', `rate-value-${index}`, 'e.g. 9.0', true, "1");
    newRateGroup.querySelector('input').step = '0.1';

    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-small btn-danger';
    delBtn.innerHTML = '<i class="fas fa-trash"></i>';
    delBtn.style.height = '36px';
    delBtn.onclick = () => { list.removeChild(item); };

    row2.appendChild(newRateGroup);
    row2.appendChild(delBtn);

    item.appendChild(row1);
    item.appendChild(row2);

    list.appendChild(item);
}

function gatherRateChangesData() {
    const list = document.getElementById('rate-changes-list');
    const data = [];

    Array.from(list.children).forEach(item => {
        const startInput = item.querySelector('input[id^="rate-start"]');
        const endInput = item.querySelector('input[id^="rate-end"]');
        const valInput = item.querySelector('input[id^="rate-value"]');

        if (startInput && endInput && valInput && startInput.value && endInput.value && valInput.value) {
            data.push({
                startDate: startInput.value,
                endDate: endInput.value,
                newRate: parseFloat(valInput.value)
            });
        }
    });

    return data;
}

function gatherDynamicData(listId, datePrefix, valPrefix, valKey) {
    const list = document.getElementById(listId);
    const data = [];

    Array.from(list.children).forEach(item => {
        const dateInput = item.querySelector(`input[id^="${datePrefix}"]`);
        const valInput = item.querySelector(`input[id^="${valPrefix}"]`);

        if (dateInput && valInput && dateInput.value && valInput.value) {
            // Remove commas from amount numbers before pushing
            let valNum = parseFloat(valInput.value.replace(/,/g, ''));
            data.push({
                date: dateInput.value,
                [valKey]: valNum
            });
        }
    });

    return data;
}

async function calculateEMI() {
    const principalStr = document.getElementById('principal').value;
    const rate = document.getElementById('interest-rate').value;
    const tenure = document.getElementById('tenure').value;
    const startDateStr = document.getElementById('start-date').value;
    const monthlyPrepayStr = document.getElementById('monthly-prepayment').value || '0';

    if (!principalStr || !rate || !tenure || !startDateStr) {
        alert("Please fill in Principal, Start Date, Interest Rate, and Tenure.");
        return;
    }

    const principalNum = parseFloat(principalStr.replace(/,/g, ''));

    const requestData = {
        startDate: startDateStr,
        principal: principalNum,
        annualInterestRate: parseFloat(rate),
        tenureInMonths: parseInt(tenure),
        prepayments: gatherDynamicData('prepayments-list', 'prepay-date', 'prepay-amount', 'amount'),
        rateChanges: gatherRateChangesData(),
        monthlyPrepayment: parseFloat(monthlyPrepayStr.replace(/,/g, '')),
        monthlyPrepayStartDate: document.getElementById('monthly-prepay-start').value,
        monthlyPrepayEndDate: document.getElementById('monthly-prepay-end').value
    };

    const resultsPanel = document.getElementById('results-panel');
    resultsPanel.classList.add('loading');

    try {
        const response = await fetch(EMI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) throw new Error('Failed to calculate EMI');

        const data = await response.json();
        renderResults(data, principalNum);
    } catch (error) {
        console.error("Error calculating EMI:", error);
        alert("An error occurred while calculating EMI. Make sure the backend server is running.");
    } finally {
        resultsPanel.classList.remove('loading');
    }
}

function renderResults(data, principalNum) {
    // Render Summary
    document.getElementById('summary-principal').innerText = formatCurrency(principalNum);

    if (data.schedule && data.schedule.length > 0) {
        document.getElementById('summary-emi').innerText = formatCurrency(data.schedule[0].emi);
    } else {
        document.getElementById('summary-emi').innerText = '₹0';
    }

    // Calculate effective tenure & Dates
    const effectiveTenure = data.schedule.length;
    document.getElementById('summary-months').innerText = `${effectiveTenure} Months`;

    // Render Dates
    const startDateRaw = document.getElementById('start-date').value; // YYYY-MM-DD
    if (startDateRaw) {
        const parts = startDateRaw.split('-');
        document.getElementById('summary-start-date').innerText = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    if (data.schedule && effectiveTenure > 0) {
        document.getElementById('summary-end-date').innerText = data.schedule[effectiveTenure - 1].date;
    } else {
        document.getElementById('summary-end-date').innerText = '-';
    }

    // Render Pie Chart
    if (emiChart) {
        emiChart.destroy();
    }
    const ctx = document.getElementById('emiPieChart').getContext('2d');
    emiChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Principal Amount', 'Total Interest'],
            datasets: [{
                data: [principalNum, data.totalInterest],
                backgroundColor: ['#6366f1', '#f43f5e'],
                borderColor: ['rgba(30, 41, 59, 1)', 'rgba(30, 41, 59, 1)'],
                borderWidth: 2,
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#f8fafc', font: { family: 'Inter', size: 12 } }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return ' ' + context.label + ': ' + formatCurrency(context.raw);
                        }
                    }
                }
            }
        }
    });

    // Render Table
    const tbody = document.getElementById('schedule-body');
    tbody.innerHTML = '';

    data.schedule.forEach(row => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${row.date}</td>
            <td>${formatCurrency(row.emi)}</td>
            <td>${formatCurrency(row.principal)}</td>
            <td>${formatCurrency(row.interest)}</td>
            <td style="color: ${row.prepayment > 0 ? 'var(--green)' : 'inherit'}; font-weight: ${row.prepayment > 0 ? '600' : 'normal'}">${row.prepayment > 0 ? '+ ' : ''}${formatCurrency(row.prepayment)}</td>
            <td>${row.interestRate}%</td>
            <td>${formatCurrency(row.remainingBalance)}</td>
        `;
        tbody.appendChild(tr);
    });
}
