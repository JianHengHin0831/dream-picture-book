<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
  >
    <div
      class="bg-gradient-to-br from-purple-50 via-pink-50 to-white rounded-2xl md:rounded-3xl shadow-2xl max-w-full md:max-w-2xl w-full max-h-[80vh] md:max-h-[90vh] overflow-y-auto border-2 border-purple-200/50"
    >
      <!-- Header -->
      <div
        class="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 p-4 md:p-8 text-center sticky top-0 z-10"
      >
        <h2
          class="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2 drop-shadow-lg"
        >
          ✨ Our Story Together ✨
        </h2>
        <p class="text-white/90 text-sm md:text-lg">
          A tale of meeting {{ characterName }}
        </p>
      </div>

      <!-- Photo Carousel Section -->
      <div class="p-4 md:p-8 space-y-3 md:space-y-4">
        <div class="text-center mb-4 md:mb-6">
          <h3
            class="text-xl md:text-2xl font-bold text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text mb-1 md:mb-2"
          >
            📸 Magical Moments
          </h3>
          <p class="text-gray-600 text-xs md:text-sm">The journey unfolds...</p>
        </div>

        <!-- Auto-scrolling Carousel -->
        <div class="relative">
          <div class="overflow-hidden rounded-xl md:rounded-2xl">
            <div
              class="flex transition-transform duration-1000 ease-linear"
              :style="{
                transform: `translateX(-${autoScrollIndex * 100}%)`,
              }"
            >
              <!-- Original Photo -->
              <div class="w-full flex-shrink-0">
                <img
                  :src="allImages[0]"
                  alt="Original"
                  class="w-full h-48 md:h-72 object-cover rounded-xl md:rounded-2xl shadow-lg"
                />
              </div>

              <!-- Other Images -->
              <div
                v-for="(imgUrl, index) in allImages.slice(1)"
                :key="'summary-img-' + index"
                class="w-full flex-shrink-0"
              >
                <img
                  :src="imgUrl"
                  alt="Story moment"
                  class="w-full h-48 md:h-72 object-cover rounded-xl md:rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>

          <!-- Carousel Indicators -->
          <div class="flex justify-center gap-1.5 md:gap-2 mt-3 md:mt-4">
            <div
              v-for="(_, index) in allImages"
              :key="'indicator-' + index"
              :class="[
                'h-1.5 md:h-2 rounded-full transition-all',
                index === autoScrollIndex
                  ? 'bg-purple-500 w-6 md:w-8'
                  : 'bg-purple-200 w-1.5 md:w-2',
              ]"
            ></div>
          </div>
        </div>
      </div>

      <!-- Story Summary Section -->
      <div class="px-4 md:px-8 py-4 md:py-6 space-y-3 md:space-y-4">
        <div class="text-center mb-4 md:mb-6">
          <h3
            class="text-xl md:text-2xl font-bold text-transparent bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text mb-3 md:mb-4"
          >
            📖 Our Conversation
          </h3>
        </div>

        <!-- Story Summary -->
        <div
          class="bg-gradient-to-br from-amber-50/50 to-yellow-50/50 rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-amber-200/30 space-y-3 md:space-y-4 max-h-48 md:max-h-64 overflow-y-auto"
        >
          <div v-if="isLoadingSummary" class="text-center py-6 md:py-8">
            <div class="flex justify-center mb-2">
              <svg
                class="animate-spin h-6 md:h-8 w-6 md:w-8 text-purple-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <p class="text-gray-600 text-sm md:text-base">
              Weaving your story together...
            </p>
          </div>

          <p
            v-else
            class="text-gray-700 leading-relaxed italic text-xs md:text-base"
          >
            {{ storyNarrative }}
          </p>
        </div>
      </div>

      <!-- Character's Farewell Message -->
      <div
        class="px-4 md:px-8 py-4 md:py-6 space-y-3 md:space-y-4 border-t-2 border-purple-200/30"
      >
        <div
          class="bg-gradient-to-r from-purple-100 via-pink-100 to-rose-100 rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-purple-300/50 text-center"
        >
          <p
            class="text-base md:text-lg font-semibold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text mb-2"
          >
            {{ characterName }}'s Farewell
          </p>
          <p
            v-if="isLoadingSummary"
            class="text-gray-600 italic text-sm md:text-base"
          >
            Preparing a special message...
          </p>
          <p
            v-else
            class="text-gray-700 italic text-xs md:text-base leading-relaxed"
          >
            "{{ farewellMessage }}"
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div
        class="px-4 md:px-8 py-4 md:py-6 flex justify-center gap-2 md:gap-4 border-t-2 border-purple-200/30 sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent"
      >
        <button
          @click="handleCreateNew"
          class="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 text-white font-semibold px-4 md:px-8 py-2 md:py-3 rounded-full hover:shadow-xl transition-all transform hover:scale-105 text-sm md:text-base"
        >
          🔄 Create a New Story
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  characterName: {
    type: String,
    default: "Friend",
  },
  allImages: {
    type: Array,
    default: () => [],
  },
  chatMessages: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["close", "createNew"]);

const autoScrollIndex = ref(0);
const storyNarrative = ref("");
const farewellMessage = ref("");
const isLoadingSummary = ref(false);
let carouselInterval = null;

// Generate story summary from API
const generateStorySummary = async () => {
  isLoadingSummary.value = true;

  try {
    const response = await fetch("/api/generateSummary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        characterName: props.characterName,
        chatMessages: props.chatMessages,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate summary");
    }

    const data = await response.json();
    storyNarrative.value = data.storyNarrative;
    farewellMessage.value = data.farewellMessage;
  } catch (err) {
    console.error("Error generating summary:", err);
    // Fallback messages
    storyNarrative.value =
      "A magical encounter brought us together, and every moment was filled with warmth and wonder.";
    farewellMessage.value =
      "Thank you for believing in the magic within me. You will always be special in my heart.";
  } finally {
    isLoadingSummary.value = false;
  }
};

// Auto-scroll carousel
const startCarousel = () => {
  if (props.allImages.length > 0) {
    carouselInterval = setInterval(() => {
      autoScrollIndex.value =
        (autoScrollIndex.value + 1) % props.allImages.length;
    }, 3000); // Change image every 3 seconds
  }
};

const stopCarousel = () => {
  if (carouselInterval) {
    clearInterval(carouselInterval);
    carouselInterval = null;
  }
};

const handleCreateNew = () => {
  emit("createNew");
};

// Watch for modal open/close
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      generateStorySummary();
      startCarousel();
    } else {
      stopCarousel();
    }
  }
);

onMounted(() => {
  if (props.isOpen) {
    generateStorySummary();
    startCarousel();
  }
});

onUnmounted(() => {
  stopCarousel();
});
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-in-out;
}

/* Hide scrollbar while keeping scroll functionality */
.overflow-y-auto::-webkit-scrollbar {
  display: none;
}

.overflow-y-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
