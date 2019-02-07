if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {
            console.log('Registered:', registration);
        })
        .catch(function(error) {
            console.log('Registration failed: ', error);
        });
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;

    var inst = prompt("Installare laPWA?", "y / n");

    if (inst == "y") prompt("OK INSTALLO...");
});