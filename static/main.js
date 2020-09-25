const db = firebase.firestore();

const layout = {
  title: "Signatures pour la pétition \"pause 5G\"",
  xaxis: {
    type: 'date',
  },
  yaxis: {
    title: 'total signatures',
  },
  yaxis2: {
    title: 'signatures per hour',
    overlaying: 'y',
    side: 'right',
  }
}

async function main() {
  // get data
  const snap = await db.collection('trackers').doc('5gPetition').get();
  const rawData = snap.data();

  
  // sort dates
  let keys = Object.keys(rawData);
  keys.sort((a, b)=>new Date(a) - new Date(b));
  
  document.querySelector("#currentValueDisplay").textContent = rawData[keys[keys.length-1]];

  // read data
  const entries = [];
  keys.forEach(key => {
    // Add GMT+000 so that date is interpreted as UTC
    entries.push({x: new Date(key+" GMT+000"), y: rawData[key]});
  });

  // prepare data resampling and plotly data structure
  const resampled = {x: [], y: [], type: 'scatter', name: 'signatures'};
  const samplesPerMinute = 0.5;
  const minutesPerSample = 1/samplesPerMinute;
  const durationMinutes = (entries[entries.length-1].x - entries[0].x) / 1000 / 60;
  const sampleCount = durationMinutes * samplesPerMinute;
  const timeStart = entries[0].x;

  // reample data
  let currentIdx = 0;
  for(let i=1; i<sampleCount; i++) {
    const time = new Date(timeStart.getTime() + (i * minutesPerSample * 60 * 1000));
    while (entries[currentIdx].x < time) currentIdx += 1;
    const sectionDuration = entries[currentIdx].x - entries[currentIdx-1].x;
    const sectionRange = entries[currentIdx].y - entries[currentIdx-1].y;
    const relative = (time-entries[currentIdx-1].x) / sectionDuration;
    const sampled = entries[currentIdx-1].y + sectionRange * relative;
    resampled.x.push(time);
    resampled.y.push(sampled);
  }

  // compute the derivative
  const derivative = {
    x: [], y: [],
    type: 'scatter',
    name: 'signatures par heure',
    yaxis: 'y2',
  }
  // Start loop at 1 because we need a previous value to compute the slope
  for (let index = 1; index < resampled.x.length; index++) {
    const x = resampled.x[index];
    const y = resampled.y[index];
    const px = resampled.x[index-1];
    const py = resampled.y[index-1];
    const deltaTimeSeconds = (x - px) / 1000;
    const deltaValue = (y-py);

    const deltaValuePerHour = deltaValue / (deltaTimeSeconds / 60 / 60);
    derivative.x.push(x);
    derivative.y.push(deltaValuePerHour);
  }

  Plotly.newPlot('chart', [resampled, derivative], layout);
}

main();
