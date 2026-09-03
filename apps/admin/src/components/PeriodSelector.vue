<template>
  <PopoverRoot v-model:open="isOpen">
    <PopoverTrigger as-child>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 px-5.5 py-2.5 rounded-2xl bg-[#FAF6F1] hover:bg-[#EBE3DA] border border-[#E4D8CC] text-[#1A170F] text-sm font-semibold shadow-2xs transition-all duration-150 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#1A170F]/15 active:scale-[0.98]"
        :aria-label="`Select month and year, current: ${periodStore.formattedPeriod}`"
      >
        <Calendar class="w-4 h-4 text-[#7D766E]" />
        <span>{{ periodStore.formattedPeriod }}</span>
        <ChevronDown class="w-4 h-4 text-[#7D766E] transition-transform duration-200" :class="isOpen ? 'rotate-180' : ''" />
      </button>
    </PopoverTrigger>

    <PopoverPortal>
      <PopoverContent
        side="bottom"
        :side-offset="8"
        align="end"
        class="z-50 w-72 rounded-2xl bg-[#FFFDFB] p-4 shadow-xl border border-[#E4D8CC] text-[#1A170F] focus:outline-none animate-in fade-in-0 zoom-in-95 select-none"
      >
        <div class="flex items-center justify-between pb-3 border-b border-[#F4ECE5]">
          <button
            type="button"
            :disabled="browsingYear <= periodStore.MIN_YEAR"
            @click="browsingYear--"
            class="w-7 h-7 rounded-lg flex items-center justify-center text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] transition cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
            aria-label="Previous Year"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>

          <span class="font-bold text-sm font-mono tracking-tight text-[#1A170F]">
            {{ browsingYear }}
          </span>

          <button
            type="button"
            @click="browsingYear++"
            class="w-7 h-7 rounded-lg flex items-center justify-center text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] transition cursor-pointer"
            aria-label="Next Year"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>

        <div class="grid grid-cols-3 gap-2 py-3">
          <button
            v-for="(name, idx) in MONTH_SHORT_NAMES"
            :key="name"
            type="button"
            :disabled="periodStore.isMonthDisabled(browsingYear, idx)"
            @click="selectMonth(idx)"
            class="h-9 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center justify-center relative cursor-pointer"
            :class="[
              isSelected(browsingYear, idx)
                ? 'bg-[#1A170F] text-[#FAF6F1] shadow-xs font-bold'
                : isRealCurrentMonth(browsingYear, idx)
                ? 'bg-[#FAF6F1] text-[#E04F26] border border-[#E04F26]/30 font-bold hover:bg-[#EBE3DA]'
                : periodStore.isMonthDisabled(browsingYear, idx)
                ? 'opacity-25 cursor-not-allowed text-[#9E978F]'
                : 'text-[#4A433C] hover:bg-[#FAF6F1] hover:text-[#1A170F]'
            ]"
          >
            {{ name }}
          </button>
        </div>

        <div class="pt-3 border-t border-[#F4ECE5] flex items-center justify-between">
          <button
            type="button"
            @click="handleResetToCurrent"
            class="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#7D766E] hover:text-[#1A170F] transition cursor-pointer"
          >
            <RotateCcw class="w-3 h-3" />
            <span>This Month</span>
          </button>

          <span class="text-[10px] text-[#9E978F] font-medium">
            Min: Aug 2026
          </span>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverPortal,
} from 'reka-ui';
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-vue-next';
import { usePeriodStore, MONTH_SHORT_NAMES } from '../stores/period';

const periodStore = usePeriodStore();
const isOpen = ref(false);
const browsingYear = ref(periodStore.selectedYear);

watch(
  () => periodStore.selectedYear,
  (val) => {
    browsingYear.value = val;
  }
);

watch(isOpen, (open) => {
  if (open) {
    browsingYear.value = periodStore.selectedYear;
  }
});

const isSelected = (year: number, monthIndex: number) => {
  return periodStore.selectedYear === year && periodStore.selectedMonth === monthIndex;
};

const isRealCurrentMonth = (year: number, monthIndex: number) => {
  return periodStore.currentYear === year && periodStore.currentMonth === monthIndex;
};

const selectMonth = (monthIndex: number) => {
  if (periodStore.isMonthDisabled(browsingYear.value, monthIndex)) return;
  periodStore.setPeriod(browsingYear.value, monthIndex);
  isOpen.value = false;
};

const handleResetToCurrent = () => {
  periodStore.resetToCurrentMonth();
  browsingYear.value = periodStore.selectedYear;
  isOpen.value = false;
};
</script>
