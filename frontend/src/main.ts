import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.mount("#app");

// Import notifications store after app is mounted
import { useNotificationsStore } from "./stores/notifications";

// Register Service Worker for PWA functionality
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/math-kingdom/sw.js")
      .then((registration) => {
        console.log(
          "Service Worker registered successfully:",
          registration.scope
        );

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 3600000); // Check every hour

        // Handle service worker updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New service worker available, prompt user to reload
                const notificationsStore = useNotificationsStore();
                notificationsStore.showConfirm(
                  "New version available! Update now for the latest features.",
                  [
                    {
                      label: "Update Now",
                      type: "primary",
                      handler: () => {
                        newWorker.postMessage({ type: "SKIP_WAITING" });
                        window.location.reload();
                      },
                    },
                    {
                      label: "Later",
                      type: "secondary",
                      handler: () => {}, // Just dismiss
                    },
                  ]
                );
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });

  // Handle service worker controller change
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  });
}

// PWA Install Prompt - Show automatically after first visit
let deferredPrompt: any = null;

window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;

  // Show install prompt automatically after a brief delay
  setTimeout(() => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        deferredPrompt = null;
      });
    }
  }, 2000); // Show prompt after 2 seconds
});

// Log when app is installed
window.addEventListener("appinstalled", () => {
  console.log("Math Kingdom has been installed as a PWA");
  deferredPrompt = null;
});

// Portrait Orientation Lock
if ("screen" in window && "orientation" in window.screen) {
  const screenOrientation = window.screen.orientation as any;

  // Try to lock to portrait on supported devices
  if ("lock" in screenOrientation) {
    screenOrientation.lock("portrait").catch((err: Error) => {
      console.log("Orientation lock not supported or denied:", err.message);
    });
  }
}

// Fallback orientation warning for older browsers is handled in CSS (App.vue)
