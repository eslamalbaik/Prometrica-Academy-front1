<script setup lang="ts">
import logo from "@/assets/prometrica-logo.png";
import { Mail, Send, Twitter, Instagram } from "lucide-vue-next";
</script>

<template>
  <footer id="contact" class="relative mt-24 bg-primary text-primary-foreground">
    <div class="absolute inset-x-0 -top-12 mx-auto h-24 max-w-7xl rounded-3xl bg-accent/0" />
    <div class="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-5">
      <div class="md:col-span-2">
        <div class="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2">
          <img :src="logo" alt="Prometrica Academy" class="h-9 w-auto" />
        </div>
        <p class="mt-5 max-w-sm text-sm text-primary-foreground/70">
          The leading educational destination for future pharmacists. Strategic curricula,
          advanced training, and a reliable path to licensing success.
        </p>
        <div class="mt-6 flex gap-3">
          <a href="#" aria-label="Telegram" class="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-accent hover:text-primary">
            <Send class="h-4 w-4" />
          </a>
          <a href="#" aria-label="X" class="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-accent hover:text-primary">
            <Twitter class="h-4 w-4" />
          </a>
          <a href="#" aria-label="Instagram" class="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-accent hover:text-primary">
            <Instagram class="h-4 w-4" />
          </a>
        </div>
      </div>

      <div>
        <h4 class="mb-4 text-sm font-semibold">Platform</h4>
        <ul class="space-y-2 text-sm text-primary-foreground/70">
          <li><a href="#programs" class="hover:text-accent">Programs</a></li>
          <li><a href="#courses" class="hover:text-accent">Courses</a></li>
          <li><a href="#speakers" class="hover:text-accent">Speakers</a></li>
        </ul>
      </div>
      <div>
        <h4 class="mb-4 text-sm font-semibold">Company</h4>
        <ul class="space-y-2 text-sm text-primary-foreground/70">
          <li><a href="#about" class="hover:text-accent">About</a></li>
          <li><a href="#why" class="hover:text-accent">Why Prometrica</a></li>
          <li><a href="#process" class="hover:text-accent">Process</a></li>
        </ul>
      </div>
      <div>
        <h4 class="mb-4 text-sm font-semibold">Contact</h4>
        <a href="mailto:info@prometrica.academy" class="inline-flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-accent">
          <Mail class="h-4 w-4" /> info@prometrica.academy
        </a>
        <p class="mt-3 text-sm text-primary-foreground/70">24/7 Academic Support</p>
      </div>
    </div>
    <div class="border-t border-white/10">
      <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-primary-foreground/60 md:flex-row">
        <p>© 2026 Prometrica Academy. All rights reserved.</p>
        <p>Designed for excellence. Built for confident exam success.</p>
      </div>
    </div>
  </footer>
</template>
