<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav class="container m-auto flex justify-center items-center p-5 md:bg-white bg-gray-100">
        <RouterLink active-class="text-red-500" class="uppercase pr-4 hover:text-red-500" to="/"><b>Home</b></RouterLink>
        <RouterLink active-class="text-red-500" class="uppercase hover:text-red-500" to="/chart"><b>Chart</b></RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
