<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import QRCode from 'qrcode'

const visible = ref(false)
const qrDataUrl = ref('')

function getCurrentUrl() {
  if (typeof window !== 'undefined') return window.location.href
  return ''
}

async function generateQR() {
  const url = getCurrentUrl()
  if (!url) return
  try {
    qrDataUrl.value = await QRCode.toDataURL(url, {
      width: 280,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    })
  } catch {
    qrDataUrl.value = ''
  }
}

function toggle() {
  visible.value = !visible.value
}

watch(visible, (v) => {
  if (v) nextTick(generateQR)
})

function onKeyDown(e) {
  if (e.key === 'q' && !e.ctrlKey && !e.metaKey && !e.altKey) {
    const tag = (e.target || {}).tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
    toggle()
  }
  if (e.key === 'Escape' && visible.value) {
    visible.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="qr-overlay" @click.self="toggle()">
      <div class="qr-card">
        <button class="close-btn" title="Close (Esc)" @click="toggle">&times;</button>
        <p class="qr-heading">Share this slide</p>
        <img v-if="qrDataUrl" :src="qrDataUrl" alt="QR code" class="qr-image" />
        <p class="qr-url">{{ getCurrentUrl() }}</p>
        <p class="qr-hint">Press <kbd>q</kbd> or click outside to dismiss</p>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.qr-overlay {
  position: fixed;
  inset: 0;
  z-index: 9500;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.qr-card {
  position: relative;
  text-align: center;
  padding: 3rem 4rem;
  max-width: 90vw;
}

.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  color: rgba(255, 255, 255, 0.8);
  border-color: rgba(255, 255, 255, 0.4);
}

.qr-heading {
  font-family: var(--deck-font-display, sans-serif);
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.qr-image {
  display: block;
  margin: 0 auto 1.5rem;
  border-radius: 12px;
}

.qr-url {
  font-family: var(--deck-font-mono, monospace);
  font-size: clamp(0.8rem, 1.5vw, 1rem);
  color: rgba(255, 255, 255, 0.5);
  word-break: break-all;
  line-height: 1.4;
}

.qr-hint {
  margin-top: 1.5rem;
  font-family: var(--deck-font-body, sans-serif);
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.35);
}

.qr-hint kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.6em;
  padding: 0.1em 0.4em;
  font-family: var(--deck-font-mono, monospace);
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}
</style>
