<template>
    <div
        class="scrollbar-hidden relative overflow-x-auto scroll-smooth pb-[3px]">
        <ul class="flex">
              <slot></slot>
        </ul>
      
        <div class="absolute z-[2] h-[3px] w-full bg-primary/20 dark:bg-gray-800">
        </div>
    </div>


</template>