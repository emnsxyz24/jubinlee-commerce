<template>
  <ClientOnly>
    <div 
      v-if="shouldShow" 
      class="fixed top-3.5 bottom-3.5 right-1 sm:right-1.5 z-[9999] w-2 flex flex-col justify-start pointer-events-none select-none"
    >
      <div 
        ref="trackRef"
        @click="handleTrackClick"
        class="relative w-full h-full pointer-events-auto cursor-pointer"
      >
        <div 
          @mousedown.prevent="startDrag"
          @touchstart.prevent="startTouchDrag"
          :style="{
            height: `${thumbHeight}px`,
            transform: `translate3d(0, ${thumbTop}px, 0)`
          }"
          :class="[
            isDragging || isHovered || isScrolling 
              ? 'opacity-100 bg-[#1A170F] shadow-md scale-105' 
              : 'opacity-40 bg-[#1A170F] hover:opacity-90'
          ]"
          @mouseenter="isHovered = true"
          @mouseleave="isHovered = false"
          class="absolute right-0 w-1.5 rounded-full transition-opacity transition-transform duration-150 ease-out cursor-grab active:cursor-grabbing backdrop-blur-xs will-change-transform"
        ></div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const trackRef = ref<HTMLElement | null>(null);
const shouldShow = ref(false);
const thumbHeight = ref(40);
const thumbTop = ref(0);

const isDragging = ref(false);
const isHovered = ref(false);
const isScrolling = ref(false);

let scrollHideTimeout: any = null;
let dragStartY = 0;
let dragStartScrollTop = 0;
let styleMutationObserver: MutationObserver | null = null;
let resizeObserver: ResizeObserver | null = null;

const isScrollLocked = () => {
  if (typeof document === 'undefined') return false;
  return document.body.style.overflow === 'hidden' || document.documentElement.style.overflow === 'hidden';
};

const updateScrollbar = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  if (isScrollLocked()) {
    shouldShow.value = false;
    return;
  }

  const docEl = document.documentElement;
  const body = document.body;
  const scrollHeight = Math.max(
    docEl.scrollHeight,
    body ? body.scrollHeight : 0,
    docEl.offsetHeight,
    body ? body.offsetHeight : 0,
    docEl.clientHeight
  );
  const clientHeight = window.innerHeight;
  const scrollTop = Math.max(0, window.pageYOffset || window.scrollY || docEl.scrollTop || (body ? body.scrollTop : 0));

  const maxScroll = scrollHeight - clientHeight;

  if (maxScroll <= 5) {
    shouldShow.value = false;
    return;
  }

  shouldShow.value = true;

  const trackHeight = trackRef.value && trackRef.value.clientHeight > 0
    ? trackRef.value.clientHeight
    : Math.max(50, clientHeight - 28);

  const calculatedHeight = Math.max(36, (clientHeight / scrollHeight) * trackHeight);
  thumbHeight.value = Math.min(calculatedHeight, Math.max(20, trackHeight - 10));

  const maxThumbTop = Math.max(0, trackHeight - thumbHeight.value);
  const scrollRatio = Math.min(1, Math.max(0, scrollTop / maxScroll));
  thumbTop.value = Math.min(maxThumbTop, Math.max(0, Math.round(scrollRatio * maxThumbTop)));
};

const onScroll = () => {
  if (isScrollLocked()) {
    shouldShow.value = false;
    return;
  }
  updateScrollbar();
  isScrolling.value = true;

  if (scrollHideTimeout) clearTimeout(scrollHideTimeout);
  scrollHideTimeout = setTimeout(() => {
    isScrolling.value = false;
  }, 1000);
};

const handleTrackClick = (e: MouseEvent) => {
  if (!trackRef.value || isDragging.value || isScrollLocked()) return;
  const rect = trackRef.value.getBoundingClientRect();
  const clickY = e.clientY - rect.top;
  const trackHeight = rect.height;
  
  const docEl = document.documentElement;
  const body = document.body;
  const scrollHeight = Math.max(
    docEl.scrollHeight,
    body ? body.scrollHeight : 0,
    docEl.offsetHeight,
    body ? body.offsetHeight : 0
  );
  const maxScroll = Math.max(0, scrollHeight - window.innerHeight);
  
  const targetScroll = Math.min(maxScroll, Math.max(0, (clickY / trackHeight) * maxScroll));
  window.scrollTo({ top: targetScroll, behavior: 'smooth' });
};

const startDrag = (e: MouseEvent) => {
  if (isScrollLocked()) return;
  isDragging.value = true;
  dragStartY = e.clientY;
  dragStartScrollTop = window.scrollY || document.documentElement.scrollTop;

  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value || isScrollLocked()) return;
  const deltaY = e.clientY - dragStartY;
  
  const docEl = document.documentElement;
  const body = document.body;
  const scrollHeight = Math.max(
    docEl.scrollHeight,
    body ? body.scrollHeight : 0,
    docEl.offsetHeight,
    body ? body.offsetHeight : 0
  );
  const clientHeight = window.innerHeight;
  const maxScroll = Math.max(1, scrollHeight - clientHeight);
  const trackHeight = trackRef.value && trackRef.value.clientHeight > 0
    ? trackRef.value.clientHeight
    : (clientHeight - 28);
  const maxThumbTop = Math.max(1, trackHeight - thumbHeight.value);

  const scrollDelta = (deltaY / maxThumbTop) * maxScroll;
  const targetTop = Math.min(maxScroll, Math.max(0, dragStartScrollTop + scrollDelta));
  window.scrollTo({ top: targetTop });
};

const stopDrag = () => {
  isDragging.value = false;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
};

const startTouchDrag = (e: TouchEvent) => {
  if (!e.touches[0] || isScrollLocked()) return;
  isDragging.value = true;
  dragStartY = e.touches[0].clientY;
  dragStartScrollTop = window.scrollY || document.documentElement.scrollTop;

  window.addEventListener('touchmove', onTouchDrag, { passive: false });
  window.addEventListener('touchend', stopTouchDrag);
};

const onTouchDrag = (e: TouchEvent) => {
  if (!isDragging.value || !e.touches[0] || isScrollLocked()) return;
  const deltaY = e.touches[0].clientY - dragStartY;
  
  const docEl = document.documentElement;
  const body = document.body;
  const scrollHeight = Math.max(
    docEl.scrollHeight,
    body ? body.scrollHeight : 0,
    docEl.offsetHeight,
    body ? body.offsetHeight : 0
  );
  const clientHeight = window.innerHeight;
  const maxScroll = Math.max(1, scrollHeight - clientHeight);
  const trackHeight = trackRef.value && trackRef.value.clientHeight > 0
    ? trackRef.value.clientHeight
    : (clientHeight - 28);
  const maxThumbTop = Math.max(1, trackHeight - thumbHeight.value);

  const scrollDelta = (deltaY / maxThumbTop) * maxScroll;
  const targetTop = Math.min(maxScroll, Math.max(0, dragStartScrollTop + scrollDelta));
  window.scrollTo({ top: targetTop });
};

const stopTouchDrag = () => {
  isDragging.value = false;
  window.removeEventListener('touchmove', onTouchDrag);
  window.removeEventListener('touchend', stopTouchDrag);
};

onMounted(() => {
  updateScrollbar();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateScrollbar, { passive: true });

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => updateScrollbar());
    resizeObserver.observe(document.body);
    resizeObserver.observe(document.documentElement);
  }

  if (typeof MutationObserver !== 'undefined') {
    styleMutationObserver = new MutationObserver(() => {
      updateScrollbar();
    });
    styleMutationObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    styleMutationObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', updateScrollbar);
  }
  if (scrollHideTimeout) clearTimeout(scrollHideTimeout);
  if (resizeObserver) resizeObserver.disconnect();
  if (styleMutationObserver) styleMutationObserver.disconnect();
  stopDrag();
});
</script>
