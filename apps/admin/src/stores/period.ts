import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const MIN_YEAR = 2026;
const MIN_MONTH = 7;

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const MONTH_SHORT_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

const STORAGE_KEY = 'admin_selected_period';

const getInitialPeriod = (): { year: number; month: number } => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.year === 'number' && typeof parsed.month === 'number') {
        if (parsed.year > MIN_YEAR || (parsed.year === MIN_YEAR && parsed.month >= MIN_MONTH)) {
          if (parsed.month >= 0 && parsed.month <= 11) {
            return { year: parsed.year, month: parsed.month };
          }
        }
      }
    }
  } catch {}

  const defaultYear = currentYear < MIN_YEAR ? MIN_YEAR : currentYear;
  const defaultMonth = defaultYear === MIN_YEAR && currentMonth < MIN_MONTH ? MIN_MONTH : currentMonth;
  return { year: defaultYear, month: defaultMonth };
};

export const usePeriodStore = defineStore('period', () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const initial = getInitialPeriod();
  const selectedYear = ref<number>(initial.year);
  const selectedMonth = ref<number>(initial.month);

  const formattedPeriod = computed(() => {
    return `${MONTH_NAMES[selectedMonth.value]} ${selectedYear.value}`;
  });

  const isCurrentMonth = computed(() => {
    return selectedYear.value === currentYear && selectedMonth.value === currentMonth;
  });

  const startDate = computed(() => {
    return new Date(Date.UTC(selectedYear.value, selectedMonth.value, 1, 0, 0, 0, 0));
  });

  const endDate = computed(() => {
    return new Date(Date.UTC(selectedYear.value, selectedMonth.value + 1, 0, 23, 59, 59, 999));
  });

  const dateRange = computed(() => {
    const monthName = MONTH_NAMES[selectedMonth.value];
    const lastDay = new Date(selectedYear.value, selectedMonth.value + 1, 0).getDate();
    return `${monthName} 1, ${selectedYear.value} - ${monthName} ${lastDay}, ${selectedYear.value}`;
  });

  const isMonthDisabled = (year: number, monthIndex: number): boolean => {
    if (year < MIN_YEAR) return true;
    if (year === MIN_YEAR && monthIndex < MIN_MONTH) return true;
    return false;
  };

  const setPeriod = (year: number, month: number) => {
    let targetYear = Math.max(MIN_YEAR, year);
    let targetMonth = month;

    if (targetYear === MIN_YEAR && targetMonth < MIN_MONTH) {
      targetMonth = MIN_MONTH;
    }

    selectedYear.value = targetYear;
    selectedMonth.value = targetMonth;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ year: targetYear, month: targetMonth })
      );
    } catch {}
  };

  const resetToCurrentMonth = () => {
    setPeriod(currentYear, currentMonth);
  };

  return {
    MIN_YEAR,
    MIN_MONTH,
    currentYear,
    currentMonth,
    selectedYear,
    selectedMonth,
    formattedPeriod,
    isCurrentMonth,
    startDate,
    endDate,
    dateRange,
    isMonthDisabled,
    setPeriod,
    resetToCurrentMonth,
  };
});
