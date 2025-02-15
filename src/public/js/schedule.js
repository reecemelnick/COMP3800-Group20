(async function () {

    const chart = new Chart(
        document.getElementById('chart'),
        {
            type: 'bar',
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
                    },
                },
            },
        },
    )
    let data = (await getSchedule()).data
    data = filterData(data)
    console.log(data)
    updateChart(chart, data)
})()


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
        const dateStr = new Date(element.month).toLocaleDateString("en-US", { month: "long", year: "numeric" });
        return dateStr;
    });

    // Set the values of each bar
    chart.data.labels = labels;
    chart.data.datasets[0].data = data.map((element) => element.total);

    //Current month-year as a string
    const currentMonthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    // Update the backgroundColor, indicate which bar is current month-year
    chart.data.datasets[0].backgroundColor = chart.data.datasets[0].data.map((value, index) => {
        return labels[index] === currentMonthYear ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 0.5)';
    });

    //Refresh chart
    chart.update();
}

/*This function may not be needed in the future if backend is able to provide data that is only relevant from this month onwards */
function filterData(data) {
    return data.filter(element => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const elementDate = new Date(element.month);
        return (elementDate.getFullYear() > currentYear) ||
            (elementDate.getFullYear() === currentYear && elementDate.getMonth() >= currentMonth);
    })
}