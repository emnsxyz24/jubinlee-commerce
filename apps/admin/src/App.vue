<template>
  <div class="min-h-screen bg-[#FDF8F4] text-[#1A170F] font-sans antialiased">
    <RouterView />
    <FloatingScrollbar />
    <Toaster position="bottom-right" />
  </div>
</template>

<script setup lang="ts">
import FloatingScrollbar from './components/FloatingScrollbar.vue';
import { Toaster } from '@/components/ui/sonner';
</script>

