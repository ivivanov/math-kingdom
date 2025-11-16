<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport height for mobile */
  overflow-x: hidden;
  width: 100%;
  /* Handle notched devices */
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
  /* Disable text selection */
  -webkit-user-select: none;
  user-select: none;
  /* Smooth scrolling */
  -webkit-overflow-scrolling: touch;
}

#app {
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  /* Enforce portrait orientation warning */
  display: flex;
  flex-direction: column;
}

/* Orientation lock warning */
@media (orientation: landscape) {
  body::before {
    content: "↻ Please rotate your device to portrait mode";
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 2rem;
    border-radius: 1rem;
    z-index: 99999;
    text-align: center;
    font-size: 1.2rem;
    width: 80%;
    max-width: 400px;
  }

  #app {
    filter: blur(10px);
  }
}

/* Touch-optimized buttons */
button,
a,
[role="button"] {
  min-height: 44px;
  min-width: 44px;
  touch-action: manipulation;
  cursor: pointer;
}

/* Prevent zoom on input focus */
input,
select,
textarea {
  font-size: 16px;
  touch-action: manipulation;
}
</style>
