(async function () {

    //This is what the expected data from server looks like (key = month + year, value = anticipated number)
    const mock = {
        'Jan 2025': 250,
        'Feb 2025': 280,
        'Mar 2025': 130,
        'Apr 2025': 300,
        'May 2025': 352,
        'Jun 2025': 123,
        'Jul 2025': 57,
        'Aug 2025': 501,
        'Sep 2025': 444,
        'Oct 2025': 123,
        'Nov 2025': 112,
        'Dec 2025': 224,
        'Jan 2026': 250,
        'Feb 2026': 280,
        'Mar 2026': 130,
        'Apr 2026': 300,
        'May 2026': 352,
        'Jun 2026': 123,
        'Jul 2026': 57,
        'Aug 2026': 501,
        'Sep 2026': 444,
        'Oct 2026': 123,
        'Nov 2026': 112,
        'Dec 2026': 224,
    }



    new Chart(
        document.getElementById('chart'),
        {
            type: 'bar',
            data: {
                labels: Object.keys(mock),
                datasets: [
                    {
                        label: 'Anticipated number of patients',
                        data: Object.values(mock),
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
})()