function formatDate(date, withTime) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
        hours = d.getHours();
        minutes = d.getMinutes();
        seconds = d.getSeconds();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    let finalTime = `${year}-${month}-${day}`;
    if(withTime) {
        finalTime += ` ${hours}:${minutes}:${seconds}`;
    }

    return finalTime;
}

export { formatDate };