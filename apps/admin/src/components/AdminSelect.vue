<template>
  <div 
    ref="containerRef" 
    class="relative inline-block"
    :class="[fullWidth ? 'w-full' : '']"
  >
    <button
      type="button"
      @click="toggleDropdown"
      :disabled="disabled"
      :class="[
        compact 
          ? 'px-3 py-1.5 text-xs rounded-xl' 
          : 'px-4 py-2.5 text-xs sm:text-sm rounded-2xl min-h-[44px]',
        fullWidth ? 'w-full justify-between' : '',
        isOpen ? 'border-[#E04F26] ring-1 ring-[#E04F26]/30' : 'border-[#E4D8CC]/70 hover:border-[#1A170F]/40',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      ]"
      class="bg-[#FAF6F1] border text-[#1A170F] font-bold flex items-center gap-2 transition shadow-2xs select-none max-w-full"
      :title="selectedLabel"
      :aria-expanded="isOpen"
    >
      <div class="flex items-center gap-2 min-w-0 truncate">
        <svg 
          v-if="icon === 'filter'" 
          class="w-4 h-4 text-[#E04F26] shrink-0" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-9.75 0h9.75" />
        </svg>

        <svg 
          v-else-if="icon === 'sort'" 
          class="w-4 h-4 text-[#E04F26] shrink-0" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
        </svg>

        <span class="truncate font-semibold">{{ selectedLabel }}</span>
      </div>

      <svg 
        :class="[isOpen ? 'rotate-180 text-[#E04F26]' : 'text-[#1A170F]/50']"
        class="w-3.5 h-3.5 transition-transform duration-200 shrink-0 ml-auto" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2.5" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </button>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 translate-y-1 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-1 scale-95"
      >
        <div
          v-if="isOpen"
          ref="dropdownRef"
          :style="{
            position: 'fixed',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            zIndex: 99999,
          }"
          :class="[
            compact ? 'p-1 rounded-xl' : 'p-1.5 rounded-2xl'
          ]"
          class="bg-[#FAF6F1] border border-[#E4D8CC] shadow-2xl max-h-64 overflow-y-auto"
        >
          <button
            v-for="opt in normalizedOptions"
            :key="String(opt.value)"
            type="button"
            :disabled="opt.disabled"
            @click="selectOption(opt)"
            :class="[
              compact ? 'px-3 py-1.5 text-xs rounded-lg' : 'px-3.5 py-2.5 text-xs sm:text-sm rounded-xl',
              isSelected(opt.value)
                ? 'bg-[#1A170F] text-[#FAF6F1] font-bold'
                : opt.disabled
                  ? 'text-[#1A170F]/30 cursor-not-allowed'
                  : 'text-[#1A170F]/80 hover:bg-[#E4D8CC]/50 hover:text-[#1A170F] font-medium cursor-pointer'
            ]"
            class="w-full text-left transition flex items-center justify-between gap-2"
          >
            <span class="truncate">{{ opt.label }}</span>
            <svg 
              v-if="isSelected(opt.value)" 
              class="w-4 h-4 text-[#E04F26] shrink-0" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2.5" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';

interface OptionItem {
  value: string | number;
  label: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null;
    options: Array<string | number | OptionItem>;
    placeholder?: string;
    icon?: string;
    disabled?: boolean;
    compact?: boolean;
    fullWidth?: boolean;
    align?: 'left' | 'right';
  }>(),
  {
    modelValue: '',
    placeholder: 'Pilih...',
    icon: '',
    disabled: false,
    compact: false,
    fullWidth: false,
    align: 'left',
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'change', value: string | number): void;
  (e: 'blur'): void;
}>();

const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownPosition = ref({ top: 0, left: 0, width: 0 });

const normalizedOptions = computed<OptionItem[]>(() => {
  return props.options.map(opt => {
    if (typeof opt === 'object' && opt !== null) {
      return opt as OptionItem;
    }
    return {
      value: opt,
      label: String(opt),
    };
  });
});

const selectedOption = computed(() => {
  return normalizedOptions.value.find(opt => String(opt.value) === String(props.modelValue ?? ''));
});

const selectedLabel = computed(() => {
  if (selectedOption.value) {
    return selectedOption.value.label;
  }
  return props.placeholder;
});

const isSelected = (val: string | number) => {
  return String(val) === String(props.modelValue ?? '');
};

const updatePosition = () => {
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect();
    const minW = props.compact ? 160 : 200;
    const computedWidth = props.fullWidth ? rect.width : Math.max(rect.width, minW);

    let left = rect.left;
    if (props.align === 'right' || (left + computedWidth > window.innerWidth - 12)) {
      left = Math.max(12, rect.right - computedWidth);
    }

    let top = rect.bottom + 6;
    if (top + 260 > window.innerHeight && rect.top > 260) {
      top = rect.top - 260;
    }

    dropdownPosition.value = {
      top: Math.max(10, top),
      left: Math.max(10, left),
      width: computedWidth,
    };
  }
};

const toggleDropdown = () => {
  if (!props.disabled) {
    if (!isOpen.value) {
      updatePosition();
      nextTick(() => {
        updatePosition();
      });
    }
    isOpen.value = !isOpen.value;
  }
};

const selectOption = (opt: OptionItem) => {
  if (opt.disabled) return;
  emit('update:modelValue', opt.value);
  emit('change', opt.value);
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node;
  if (
    containerRef.value && !containerRef.value.contains(target) &&
    dropdownRef.value && !dropdownRef.value.contains(target)
  ) {
    isOpen.value = false;
  }
};

const handleWindowEvents = () => {
  if (isOpen.value) {
    updatePosition();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside, true);
  window.addEventListener('resize', handleWindowEvents, { passive: true });
  window.addEventListener('scroll', handleWindowEvents, { passive: true, capture: true });
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true);
  window.removeEventListener('resize', handleWindowEvents);
  window.removeEventListener('scroll', handleWindowEvents, true);
});
</script>
