module.exports = () => {

    var timer = {};
    var schedulerTimeout = null;
    var schedData, timerObject;

    function resetTimerArray() {
        timer = {};
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m++) {
                timer[h + "-" + m] = { "val": 0, "treshold": 0 };
            }
        }
        return timer;
    }

    function getJobsOfTheDay(day) {
        timerObject = resetTimerArray();
        timerObject.today = day;
        schedData.week.find((item) => { return item.id == day; }).jobs.forEach((job) => {
            for (let h = job.on.hour; h <= job.off.hour; h++) {
                let last = (h === job.off.hour) ? job.off.minute : 60;
                let first = (h === job.on.hour) ? job.on.minute : 0;
                for (let m = first; m < last; m++) {
                    timerObject[h + "-" + m].val = 1;
                    timerObject[h + "-" + m].treshold = job.on.treshold;
                }
            }
        });
        return timerObject;
    }
    return {
        setData(data) {
            schedData = data;
        },
        getTimerObject() {
            return timerObject;
        }

    }

}