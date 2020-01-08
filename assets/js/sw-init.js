if (navigator.serviceWorker) {
    navigator.serviceWorker.register('./service-worker.js')
        .then(function(registration) {
            console.log('Registered:', registration);
        })
        .catch(function(error) {
            console.log('Registration failed: ', error);
        });
}


//let deferredPrompt;
/*
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    //e.preventDefault();
    //deferredPrompt = e;
    // $('.popup').show(0);
    // Stash the event so it can be triggered later.
});
*/
function install() {
    //alert('install...');
    //deferredPrompt.prompt();
};