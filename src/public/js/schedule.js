(async function () {
    const barSelector = document.getElementById('bar-selector')
    const lineSelector = document.getElementById('line-selector')

    let chart = configChart('bar')
    let data = (await getSchedule()).data
    data = filterData(data)
    updateChart(chart, data)

    barSelector.addEventListener('click', (e) => {
        focusSelector(barSelector, lineSelector)
        chart.destroy()
        chart = configChart('bar')
        updateChart(chart, data)
    })

    lineSelector.addEventListener('click', (e) => {
        focusSelector(lineSelector, barSelector)
        chart.destroy()
        chart = configChart('line')
        updateChart(chart, data)
    })
})()

function configChart(chartType) {
    return new Chart(
        document.getElementById('chart'),
        {
            type: chartType,
            data: {
                // labels: Object.keys(mock),
                datasets: [
                    {
                        label: 'Anticipated number of patients',
                        // data: Object.values(mock),
                    },
                ],
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Months',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Anticipated number of patients',
                        },
                        min: 0,
                    },
                },
            },
        },
    )
}

async function getSchedule() {
    try {
        const response = await fetch('/getschedule', {
            method: 'GET',
        })

        if (response.status === 200) {
            return await response.json()
        } else {
            alert(`Error fetching data: ${response.status}`)
            return NULL
        }

    } catch (error) {
        alert('Failed to reach server: ' + error.message)
        return NULL
    }
}

function updateChart(chart, data) {
    // Set the labels in Month-Year strings
    const labels = data.map((element) => {
        const dateStr = new Date(element.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        return dateStr
    })

    // Set the values of each bar
    chart.data.labels = labels
    chart.data.datasets[0].data = data.map((element) => element.total)

    //Current month-year as a string
    const currentMonthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })

    //Refresh chart
    chart.update()
}

/*This function may not be needed in the future if backend is able to provide data that is only relevant from this month onwards */
function filterData(data) {
    return data.filter(element => {
        const currentDate = new Date()
        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth()
        const elementDate = new Date(element.month)
        return (elementDate.getFullYear() > currentYear) ||
            (elementDate.getFullYear() === currentYear && elementDate.getMonth() >= currentMonth)
    })
}

function focusSelector(selectedElement, deselectedElement) {
    selectedElement.classList = 'btn btn-primary'
    deselectedElement.classList = 'btn btn-secondary'
}