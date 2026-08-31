<template>
  <div 
    v-if="shouldShow" 
    class="absolute top-8 bottom-8 right-1.5 z-50 w-2.5 flex flex-col justify-start pointer-events-none select-none"
  >
    <div 
      ref="trackRef"
      @click="handleTrackClick"
      class="relative w-full flex-1 pointer-events-auto cursor-pointer"
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
            ? 'opacity-100 bg-[#1A170F] shadow-md w-2' 
            : 'opacity-40 bg-[#1A170F] hover:opacity-90 w-1.5'
        ]"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
        class="absolute right-0 rounded-full transition-all duration-150 ease-out cursor-grab active:cursor-grabbing backdrop-blur-xs will-change-transform origin-right"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps<{
  target?: any;
}>();

const trackRef = ref<HTMLElement | null>(null);
const shouldShow = ref(false);
const thumbHeight = ref(32);
const thumbTop = ref(0);

const isDragging = ref(false);
const isHovered = ref(false);
const isScrolling = ref(false);

let scrollHideTimeout: any = null;
let dragStartY = 0;
let dragStartScrollTop = 0;
let resizeObserver: ResizeObserver | null = null;
let mutationObserver: MutationObserver | null = null;
let currentTargetEl: HTMLElement | null = null;

const getTargetElement = (): HTMLElement | null => {
  if (!props.target) return null;
  if (props.target instanceof HTMLElement) return props.target;
  if (props.target?.$el instanceof HTMLElement) return props.target.$el;
  return null;
};

const updateScrollbar = () => {
  const el = currentTargetEl || getTargetElement();
  if (!el) {
    shouldShow.value = false;
    return;
  }

  const scrollHeight = el.scrollHeight;
  const clientHeight = el.clientHeight;
  const maxScroll = Math.max(1, scrollHeight - clientHeight);

  if (scrollHeight - clientHeight <= 5) {
    shouldShow.value = false;
    return;
  }

  shouldShow.value = true;

  const trackHeight = trackRef.value && trackRef.value.clientHeight > 0
    ? trackRef.value.clientHeight
    : Math.max(40, clientHeight - 64);

  const calculatedHeight = Math.max(28, (clientHeight / scrollHeight) * trackHeight * 0.65);
  thumbHeight.value = Math.min(calculatedHeight, Math.max(20, trackHeight - 16));

  const maxThumbTop = Math.max(0, trackHeight - thumbHeight.value);
  const scrollTop = Math.min(maxScroll, Math.max(0, el.scrollTop));
  const scrollRatio = maxScroll > 0 ? (scrollTop / maxScroll) : 0;
  thumbTop.value = Math.min(maxThumbTop, Math.max(0, Math.round(scrollRatio * maxThumbTop)));
};

const onScroll = () => {
  updateScrollbar();
  isScrolling.value = true;

  if (scrollHideTimeout) clearTimeout(scrollHideTimeout);
  scrollHideTimeout = setTimeout(() => {
    isScrolling.value = false;
  }, 1000);
};

const handleTrackClick = (e: MouseEvent) => {
  const el = currentTargetEl || getTargetElement();
  if (!el || !trackRef.value || isDragging.value) return;
  const rect = trackRef.value.getBoundingClientRect();
  const clickY = e.clientY - rect.top;
  const trackHeight = rect.height;
  
  const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
  const targetScroll = Math.min(maxScroll, Math.max(0, (clickY / trackHeight) * maxScroll));
  el.scrollTo({ top: targetScroll, behavior: 'smooth' });
};

const startDrag = (e: MouseEvent) => {
  const el = currentTargetEl || getTargetElement();
  if (!el) return;
  isDragging.value = true;
  dragStartY = e.clientY;
  dragStartScrollTop = el.scrollTop;

  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
};

const onDrag = (e: MouseEvent) => {
  const el = currentTargetEl || getTargetElement();
  if (!isDragging.value || !el) return;
  const deltaY = e.clientY - dragStartY;
  
  const clientHeight = el.clientHeight;
  const maxScroll = Math.max(1, el.scrollHeight - clientHeight);
  const trackHeight = trackRef.value && trackRef.value.clientHeight > 0
    ? trackRef.value.clientHeight
    : (clientHeight - 64);
  const maxThumbTop = Math.max(1, trackHeight - thumbHeight.value);

  const scrollDelta = (deltaY / maxThumbTop) * maxScroll;
  const targetTop = Math.min(maxScroll, Math.max(0, dragStartScrollTop + scrollDelta));
  el.scrollTop = targetTop;
};

const stopDrag = () => {
  isDragging.value = false;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
};

const startTouchDrag = (e: TouchEvent) => {
  const el = currentTargetEl || getTargetElement();
  if (!el || !e.touches[0]) return;
  isDragging.value = true;
  dragStartY = e.touches[0].clientY;
  dragStartScrollTop = el.scrollTop;

  window.addEventListener('touchmove', onTouchDrag, { passive: false });
  window.addEventListener('touchend', stopTouchDrag);
};

const onTouchDrag = (e: TouchEvent) => {
  const el = currentTargetEl || getTargetElement();
  if (!isDragging.value || !el || !e.touches[0]) return;
  const deltaY = e.touches[0].clientY - dragStartY;
  
  const clientHeight = el.clientHeight;
  const maxScroll = Math.max(1, el.scrollHeight - clientHeight);
  const trackHeight = trackRef.value && trackRef.value.clientHeight > 0
    ? trackRef.value.clientHeight
    : (clientHeight - 64);
  const maxThumbTop = Math.max(1, trackHeight - thumbHeight.value);

  const scrollDelta = (deltaY / maxThumbTop) * maxScroll;
  const targetTop = Math.min(maxScroll, Math.max(0, dragStartScrollTop + scrollDelta));
  el.scrollTop = targetTop;
};

const stopTouchDrag = () => {
  isDragging.value = false;
  window.removeEventListener('touchmove', onTouchDrag);
  window.removeEventListener('touchend', stopTouchDrag);
};

const attachListeners = (el: HTMLElement | null) => {
  if (currentTargetEl) {
    currentTargetEl.removeEventListener('scroll', onScroll);
    if (resizeObserver) resizeObserver.disconnect();
    if (mutationObserver) mutationObserver.disconnect();
  }

  currentTargetEl = el;

  if (currentTargetEl) {
    currentTargetEl.addEventListener('scroll', onScroll, { passive: true });
    
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateScrollbar();
      });
      resizeObserver.observe(currentTargetEl);
      if (currentTargetEl.firstElementChild) {
        resizeObserver.observe(currentTargetEl.firstElementChild);
      }
    }

    if (typeof MutationObserver !== 'undefined') {
      mutationObserver = new MutationObserver(() => {
        updateScrollbar();
      });
      mutationObserver.observe(currentTargetEl, { childList: true, subtree: true, attributes: true });
    }

    nextTick(() => {
      updateScrollbar();
    });
  }
};

watch(() => props.target, () => {
  nextTick(() => {
    attachListeners(getTargetElement());
  });
}, { immediate: true, deep: true });

onMounted(() => {
  nextTick(() => {
    attachListeners(getTargetElement());
  });
});

onUnmounted(() => {
  if (currentTargetEl) {
    currentTargetEl.removeEventListener('scroll', onScroll);
  }
  if (scrollHideTimeout) clearTimeout(scrollHideTimeout);
  if (resizeObserver) resizeObserver.disconnect();
  if (mutationObserver) mutationObserver.disconnect();
  stopDrag();
});
</script>
