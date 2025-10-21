<template>
  <div
    class="font-sans min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-600 flex flex-col items-center py-10 px-4"
  >
    <div class="w-full max-w-4xl mx-auto">
      <header class="text-center mb-6 md:mb-8">
        <h1
          class="text-3xl md:text-5xl font-bold bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 bg-clip-text text-transparent mb-2 md:mb-3 tracking-wide"
        >
          ✨ Dream Picture Book ✨
        </h1>
        <p class="text-gray-600 text-sm md:text-lg font-medium">
          Where everyday moments become heartwarming tales
        </p>
        <p class="text-gray-400 text-xs md:text-sm mt-1 md:mt-2">
          Let your objects come alive and share their gentle stories with you
        </p>
      </header>

      <main
        class="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-4 md:p-8 w-full border border-purple-100"
      >
        <!-- Phase 1: Image Upload -->
        <div
          v-if="currentPhase === 'upload' && !isLoading"
          class="animate-fade-in"
        >
          <label
            for="file-upload"
            class="cursor-pointer w-full flex flex-col items-center justify-center border-3 border-dashed border-rose-300 rounded-3xl p-8 md:p-16 bg-gradient-to-br from-amber-50/50 via-rose-50/50 to-orange-50/50 hover:from-amber-100/50 hover:via-rose-100/50 hover:to-orange-100/50 transition-all duration-500 shadow-lg hover:shadow-xl"
          >
            <template v-if="!uploadedImage">
              <div
                class="bg-gradient-to-r from-rose-400 to-orange-400 p-2 md:p-4 rounded-full mb-3 md:mb-6"
              >
                <svg
                  class="w-10 md:w-16 h-10 md:h-16 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <span
                class="text-lg md:text-2xl font-bold text-transparent bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text mb-2 md:mb-3"
                >✨ Upload Your Photo ✨</span
              >
              <span
                class="text-xs md:text-sm text-gray-500 text-center max-w-md"
                >Choose a photo of any everyday object - a coffee cup, a book, a
                plant... anything that holds a special place in your heart</span
              >
              <span class="text-xs text-gray-400 mt-2 md:mt-4 italic"
                >🌟 Let's create magic together 🌟</span
              >
            </template>
            <img
              v-else
              :src="uploadedImage"
              alt="Uploaded Preview"
              class="max-h-48 md:max-h-80 rounded-2xl shadow-2xl"
            />
          </label>
          <input
            id="file-upload"
            type="file"
            @change="handleFileUpload"
            class="hidden"
            accept="image/*"
          />
        </div>

        <!-- Phase 2: Story Display & Character Naming -->
        <div
          v-if="currentPhase === 'story_display' && !isLoading"
          class="animate-fade-in space-y-8"
        >
          <!-- Story and Image -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <!-- Left: Generated Image -->
            <div class="space-y-2 md:space-y-4">
              <h3
                class="text-sm md:text-xl font-semibold text-center text-transparent bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text"
              >
                ✨ A Magical World Awaits ✨
              </h3>
              <div
                class="bg-gradient-to-br from-rose-50/50 to-orange-50/50 rounded-2xl p-2 md:p-4 border border-rose-200/50"
              >
                <img
                  :src="generatedImageUrl"
                  alt="Story Illustration"
                  class="w-full rounded-xl shadow-lg"
                />
              </div>
            </div>

            <!-- Right: Story with Placeholder -->
            <div class="space-y-3 md:space-y-6 flex flex-col justify-center">
              <div
                class="bg-gradient-to-br from-amber-50/50 to-yellow-50/50 rounded-2xl p-3 md:p-6 border border-amber-200/50"
              >
                <p
                  class="text-gray-700 leading-relaxed text-xs md:text-lg italic"
                >
                  {{ storyTemplate }}
                </p>
              </div>

              <div
                class="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 rounded-xl p-2 md:p-4 border border-blue-200/50"
              >
                <p class="text-xs md:text-sm text-gray-600">
                  <span class="font-semibold text-blue-600">Character:</span>
                  {{ characterDescription }}
                </p>
              </div>
            </div>
          </div>

          <!-- Naming Section -->
          <div
            class="bg-gradient-to-r from-purple-50/50 via-pink-50/50 to-rose-50/50 rounded-2xl p-4 md:p-8 border border-purple-200/50 space-y-4 md:space-y-6"
          >
            <div class="text-center">
              <h2
                class="text-xl md:text-3xl font-bold text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text mb-2 md:mb-3"
              >
                💫 Give Your Friend a Name 💫
              </h2>
              <p class="text-gray-600 text-sm md:text-lg">
                This special character is waiting to meet you...
              </p>
            </div>

            <div class="max-w-md mx-auto">
              <input
                v-model="characterName"
                type="text"
                placeholder="Type a warm, gentle name..."
                @keyup.enter="startChat"
                class="w-full px-3 md:px-6 py-2 md:py-4 text-sm md:text-lg text-center rounded-full border-2 border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/80 backdrop-blur placeholder-purple-300 shadow-sm"
              />
            </div>

            <!-- Buttons -->
            <div class="flex gap-2 md:gap-4 justify-center flex-wrap">
              <button
                @click="reset"
                class="px-4 md:px-6 py-2 md:py-3 rounded-full border-2 border-gray-300 text-gray-600 hover:bg-gray-50 transition-all font-medium text-xs md:text-base"
              >
                🔄 Start Over
              </button>
              <button
                @click="startChat"
                :disabled="!characterName.trim()"
                class="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 text-white font-semibold px-6 md:px-10 py-2 md:py-3 rounded-full hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 text-xs md:text-base whitespace-nowrap"
              >
                ✨ Let's Talk! ✨
              </button>
            </div>
          </div>
        </div>

        <!-- Phase 3: Interactive Chat -->
        <div
          v-if="currentPhase === 'chat'"
          class="animate-fade-in flex flex-col"
          :style="{
            height: 'calc(100vh - 300px)',
            minHeight: '900px',
          }"
        >
          <div
            class="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 h-full overflow-hidden"
          >
            <!-- Left: Story Illustration Gallery (Horizontal Carousel) -->
            <div
              class="md:col-span-1 h-full flex flex-col gap-1 md:gap-4 order-2 md:order-1"
            >
              <!-- Character Card -->
              <div
                class="bg-gradient-to-br from-amber-50/70 via-rose-50/70 to-orange-50/70 rounded-xl md:rounded-2xl p-2 md:p-5 border-2 border-rose-200/50 shadow-lg flex-shrink-0"
              >
                <div class="text-center space-y-0.5 md:space-y-2">
                  <h3
                    class="text-sm md:text-2xl font-bold text-transparent bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text"
                  >
                    {{ characterName }}
                  </h3>
                  <p class="text-xs text-gray-600 italic line-clamp-2">
                    {{ characterDescription }}
                  </p>
                </div>
              </div>

              <!-- Image Carousel Container -->
              <div class="flex-1 flex flex-col gap-1 md:flex">
                <!-- Carousel Navigation -->
                <div
                  class="flex justify-between items-center px-1 md:px-2 gap-1"
                >
                  <button
                    @click="scrollCarouselLeft"
                    class="bg-rose-300 hover:bg-rose-400 text-white p-1 md:p-2 rounded-full transition-colors text-xs md:text-base"
                    :disabled="currentImageIndex === 0"
                  >
                    ←
                  </button>
                  <p class="text-xs text-gray-500 flex-1 text-center">
                    {{ currentImageIndex + 1 }}/{{ totalImages }}
                  </p>
                  <button
                    @click="scrollCarouselRight"
                    class="bg-rose-300 hover:bg-rose-400 text-white p-1 md:p-2 rounded-full transition-colors text-xs md:text-base"
                    :disabled="currentImageIndex >= totalImages - 1"
                  >
                    →
                  </button>
                </div>

                <!-- Carousel Images -->
                <div class="flex-1 overflow-hidden rounded-xl md:rounded-2xl">
                  <div
                    class="flex transition-transform duration-500 h-full"
                    :style="{
                      transform: `translateX(-${currentImageIndex * 100}%)`,
                    }"
                  >
                    <!-- Original Photo -->
                    <div
                      class="w-full flex-shrink-0 rounded-xl md:rounded-2xl overflow-hidden"
                    >
                      <div
                        class="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 rounded-xl md:rounded-2xl p-1 md:p-3 border-2 border-blue-200/50 shadow-md h-full flex flex-col"
                      >
                        <p
                          class="text-xs text-center text-gray-500 mb-1 font-semibold line-clamp-1"
                        >
                          📖 Your Story
                        </p>
                        <img
                          :src="uploadedImage"
                          alt="Original"
                          class="w-full flex-1 object-cover rounded-lg shadow-md"
                        />
                      </div>
                    </div>

                    <!-- First Generated Story Image -->
                    <div
                      v-if="generatedImageUrl"
                      class="w-full flex-shrink-0 rounded-xl md:rounded-2xl overflow-hidden"
                    >
                      <div
                        class="bg-white/80 backdrop-blur rounded-xl md:rounded-2xl p-1 md:p-3 shadow-lg border-2 border-rose-200/50 h-full flex flex-col"
                      >
                        <p
                          class="text-xs text-center text-gray-500 mb-1 font-semibold line-clamp-1"
                        >
                          ✨ Ch.1 ✨
                        </p>
                        <img
                          :src="generatedImageUrl"
                          alt="Story illustration"
                          class="w-full flex-1 object-cover rounded-lg"
                        />
                      </div>
                    </div>

                    <!-- Generated Story Images from Chat -->
                    <div
                      v-for="(imgUrl, index) in chatImages"
                      :key="'img-' + index"
                      class="w-full flex-shrink-0 rounded-xl md:rounded-2xl overflow-hidden"
                    >
                      <div
                        class="bg-white/80 backdrop-blur rounded-xl md:rounded-2xl p-1 md:p-3 shadow-lg border-2 border-rose-200/50 h-full flex flex-col"
                      >
                        <p
                          class="text-xs text-center text-gray-500 mb-1 font-semibold line-clamp-1"
                        >
                          ✨ Ch.{{ index + 2 }} ✨
                        </p>
                        <img
                          :src="imgUrl"
                          alt="Story moment"
                          class="w-full flex-1 object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Chat Messages -->
            <div
              class="md:col-span-2 flex flex-col h-full overflow-hidden order-1 md:order-2"
            >
              <!-- Chat History -->
              <div
                class="bg-gradient-to-b from-purple-50/30 via-pink-50/20 to-transparent p-2 md:p-6 rounded-xl md:rounded-2xl space-y-1 md:space-y-4 overflow-y-auto border-2 border-purple-200/30 flex-1 min-h-0"
                ref="chatContainer"
              >
                <div
                  v-if="chatMessages.length === 0"
                  class="text-center text-gray-400 py-4 md:py-12 text-xs md:text-base"
                >
                  <p class="text-sm md:text-lg">
                    ✨ {{ characterName }} is waiting... ✨
                  </p>
                </div>

                <div
                  v-for="(msg, index) in chatMessages"
                  :key="index"
                  :class="[
                    'animate-fade-in',
                    msg.role === 'user'
                      ? 'flex justify-end'
                      : 'flex justify-start',
                  ]"
                >
                  <div
                    :class="[
                      'max-w-[85%] md:max-w-[80%] px-2 md:px-5 py-1.5 md:py-3 rounded-xl md:rounded-2xl shadow-sm text-xs md:text-sm',
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-br-sm'
                        : 'bg-gradient-to-r from-amber-100 to-orange-100 text-gray-800 rounded-bl-sm border border-orange-200/50',
                    ]"
                    v-if="msg.content"
                  >
                    <p class="leading-relaxed">{{ msg.content }}</p>
                  </div>
                </div>
              </div>

              <!-- Input Area - Fixed at Bottom -->
              <div
                class="bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-xl md:rounded-2xl p-1.5 md:p-4 border-2 border-purple-200/50 flex-shrink-0 mt-1 md:mt-4"
              >
                <div class="flex gap-0.5 md:gap-2 flex-col">
                  <div class="flex gap-0.5 md:gap-2">
                    <input
                      v-model="userMessage"
                      @keyup.enter="sendMessage"
                      :disabled="isStreaming"
                      type="text"
                      placeholder="Share your thoughts... 💭"
                      class="flex-1 px-2 md:px-6 py-1.5 md:py-3 rounded-full border-2 border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:opacity-50 bg-white/80 backdrop-blur text-gray-700 text-xs md:text-base"
                    />
                    <button
                      @click="sendMessage"
                      :disabled="!userMessage.trim() || isStreaming"
                      class="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 text-white px-2 md:px-8 py-1.5 md:py-3 rounded-full hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 font-medium whitespace-nowrap text-xs md:text-base"
                    >
                      💫 Send
                    </button>
                  </div>
                  <div class="text-center">
                    <button
                      @click="endChat"
                      class="text-xs text-gray-500 hover:text-gray-700 transition-colors underline"
                    >
                      � End Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-12 animate-fade-in">
          <div class="flex flex-col items-center">
            <svg
              class="animate-spin h-12 w-12 text-purple-400 mb-4"
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
            <p class="text-purple-500 font-semibold">{{ loadingMessage }}</p>
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="mt-6 p-4 bg-rose-100/60 border border-rose-300 text-rose-700 rounded-xl animate-fade-in"
        >
          <p><strong>Oops, something went wrong:</strong></p>
          <p>{{ error }}</p>
          <div class="text-center mt-4">
            <button
              @click="error = ''"
              class="bg-rose-400 text-white font-semibold py-2 px-6 rounded-full hover:bg-rose-500 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
  <!-- Phase 4: Story Summary Modal Component -->
  <StorySummaryModal
    :is-open="currentPhase === 'summary'"
    :character-name="characterName"
    :all-images="allSummaryImages"
    :chat-messages="chatMessages"
    @create-new="reset"
  />
</template>

<script setup>
import { ref, nextTick, computed, watch } from "vue";
const currentPhase = ref("upload");

const uploadedImage = ref(null);
const imageBase64 = ref("");
const storyTemplate = ref("");
const characterDescription = ref("");
const characterName = ref("");
const generatedImageUrl = ref("");
const chatMessages = ref([]);
const chatImages = ref([]);
const userMessage = ref("");
const isLoading = ref(false);
const isStreaming = ref(false);
const error = ref("");
const loadingMessage = ref("Creating your magical story...");
const chatContainer = ref(null);
const currentImageIndex = ref(0);

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    uploadedImage.value = e.target.result;
    imageBase64.value = e.target.result.split(",")[1];

    await generateStoryAndImage();
  };
  reader.readAsDataURL(file);
};

const generateStoryAndImage = async () => {
  isLoading.value = true;
  loadingMessage.value = "The storyteller is weaving your tale...";

  try {
    const response = await $fetch("/api/generate", {
      method: "POST",
      body: { image: imageBase64.value },
    });

    storyTemplate.value = response.storyTemplate;
    characterDescription.value = response.characterDescription;
    generatedImageUrl.value = response.imageUrl;

    currentPhase.value = "story_display";
  } catch (err) {
    console.error("Failed to generate story:", err);
    error.value =
      err.data?.statusMessage ||
      "Failed to create your story. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

const startChat = async () => {
  if (!characterName.value.trim()) {
    error.value = "Please give your character a name";
    return;
  }

  isLoading.value = true;
  loadingMessage.value = `${characterName.value} is coming to life...`;

  try {
    const finalStory = storyTemplate.value.replace(
      /\[CHARACTER\]/g,
      characterName.value
    );

    const initialMessage = `Hello! I'm ${characterName.value}. ${
      finalStory.split(".")[0]
    }. I'm so happy to meet you!`;
    chatMessages.value.push({
      role: "assistant",
      content: initialMessage,
    });

    currentPhase.value = "chat";
    // Set default to second image (Chapter 1 - The Beginning)
    currentImageIndex.value = 1;

    await nextTick();
    scrollToBottom();
  } catch (err) {
    console.error("Error starting chat:", err);
    error.value = "Failed to start the conversation";
  } finally {
    isLoading.value = false;
  }
};

const sendMessage = async () => {
  if (!userMessage.value.trim() || isStreaming.value) return;

  const message = userMessage.value.trim();
  userMessage.value = "";

  chatMessages.value.push({
    role: "user",
    content: message,
  });

  await nextTick();
  scrollToBottom();

  isStreaming.value = true;
  chatMessages.value.push({
    role: "assistant",
    content: "",
  });
  const assistantMessageIndex = chatMessages.value.length - 1;
  const decoder = new TextDecoder();

  try {
    const messagesForApi = chatMessages.value
      .slice(0, assistantMessageIndex)
      .filter((msg) => msg.content)
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messagesForApi,
        characterName: characterName.value,
        characterDescription: characterDescription.value,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Failed to get response reader");
    }

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const payload = JSON.parse(line);

          if (payload.type === "text_chunk") {
            const cleanContent = payload.content.replace(
              /\[DRAWING:.*?\]/g,
              ""
            );
            chatMessages.value[assistantMessageIndex].content += cleanContent;

            await nextTick();
            scrollToBottom();
          } else if (payload.type === "image_url") {
            if (chatMessages.value[assistantMessageIndex].content === "") {
              chatMessages.value.splice(assistantMessageIndex, 1);
            }
            chatMessages.value.push({
              role: "assistant",
              imageUrl: payload.content,
            });
            chatImages.value.push(payload.content);

            await nextTick();
            scrollToBottom();
          } else if (payload.type === "done") {
          }
        } catch (e) {
          console.warn("Skipping non-JSON line:", line);
        }
      }
    }
    isStreaming.value = false;
  } catch (err) {
    console.error("Error sending message:", err);
    error.value = "Failed to send message. Please try again.";
    if (chatMessages.value[assistantMessageIndex]?.content === "") {
      chatMessages.value.splice(assistantMessageIndex, 1);
    }
  } finally {
    if (chatMessages.value[assistantMessageIndex]) {
      chatMessages.value[assistantMessageIndex].content = chatMessages.value[
        assistantMessageIndex
      ].content
        .replace(/\[DRAWING:.*?\]/g, "")
        .trim();
    }
    const finalChunk = decoder.decode();
    if (finalChunk) {
    }
  }
};
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const totalImages = computed(() => {
  let count = 1;
  if (generatedImageUrl.value) count++;
  count += chatImages.value.length;
  return count;
});

watch(
  () => chatImages.value.length,
  (newLength, oldLength) => {
    if (newLength > oldLength) {
      nextTick(() => {
        currentImageIndex.value = totalImages.value - 1;
      });
    }
  }
);

const scrollCarouselLeft = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
};

const scrollCarouselRight = () => {
  if (currentImageIndex.value < totalImages.value - 1) {
    currentImageIndex.value++;
  }
};

// Computed property for all summary images
const allSummaryImages = computed(() => {
  const images = [uploadedImage.value];
  if (generatedImageUrl.value) images.push(generatedImageUrl.value);
  images.push(...chatImages.value);
  return images.filter((img) => img);
});

// End chat and show summary
const endChat = () => {
  currentPhase.value = "summary";
};

// Reset to initial state
const reset = () => {
  currentPhase.value = "upload";
  uploadedImage.value = null;
  imageBase64.value = "";
  storyTemplate.value = "";
  characterDescription.value = "";
  characterName.value = "";
  generatedImageUrl.value = "";
  chatMessages.value = [];
  chatImages.value = [];
  userMessage.value = "";
  error.value = "";
  currentImageIndex.value = 0;
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap");

body {
  font-family: "Poppins", sans-serif;
}

/* Soft fade-in animation */
.animate-fade-in {
  animation: fadeIn 0.8s ease-in-out;
}

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
</style>
