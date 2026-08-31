<script lang="ts" setup>
import type { ToasterProps } from "vue-sonner"
import { reactiveOmit } from "@vueuse/core"
import { CheckCircle2, Info, Loader2, AlertCircle, AlertTriangle } from "lucide-vue-next"
import { Toaster as Sonner } from "vue-sonner"

const props = defineProps<ToasterProps>()
const delegatedProps = reactiveOmit(props, "toastOptions")
</script>

<template>
  <Sonner
    class="toaster group"
    :toast-options="{
      classes: {
        toast: 'group toast group-[.toaster]:bg-[#FFFDFB] group-[.toaster]:text-[#1A170F] group-[.toaster]:border-[#E4D8CC] group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl group-[.toaster]:p-4.5 group-[.toaster]:gap-4',
        title: 'group-[.toast]:font-extrabold group-[.toast]:text-[15px] group-[.toast]:text-[#1A170F] group-[.toast]:tracking-tight',
        description: 'group-[.toast]:text-[#7D766E] group-[.toast]:text-[13.5px] group-[.toast]:font-medium group-[.toast]:leading-relaxed',
        actionButton:
          'group-[.toast]:bg-[#1A170F] group-[.toast]:text-[#FAF6F1] group-[.toast]:hover:bg-[#E04F26] group-[.toast]:rounded-xl group-[.toast]:font-bold group-[.toast]:text-xs group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:transition',
        cancelButton:
          'group-[.toast]:bg-[#FAF6F1] group-[.toast]:border group-[.toast]:border-[#E4D8CC] group-[.toast]:text-[#1A170F] group-[.toast]:rounded-xl group-[.toast]:font-bold group-[.toast]:text-xs group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:transition',
      },
    }"
    v-bind="delegatedProps"
  >
    <template #success-icon>
      <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
        <CheckCircle2 class="w-5 h-5 stroke-[2.5]" />
      </div>
    </template>
    <template #info-icon>
      <div class="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/25 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs">
        <Info class="w-5 h-5 stroke-[2.5]" />
      </div>
    </template>
    <template #warning-icon>
      <div class="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
        <AlertTriangle class="w-5 h-5 stroke-[2.5]" />
      </div>
    </template>
    <template #error-icon>
      <div class="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
        <AlertCircle class="w-5 h-5 stroke-[2.5]" />
      </div>
    </template>
    <template #loading-icon>
      <div class="w-10 h-10 rounded-2xl bg-[#E04F26]/10 border border-[#E04F26]/25 text-[#E04F26] flex items-center justify-center shrink-0 shadow-2xs">
        <Loader2 class="w-5 h-5 animate-spin stroke-[2.5]" />
      </div>
    </template>
  </Sonner>
</template>
