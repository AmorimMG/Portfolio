<script setup lang="ts">
import { marked } from "marked";
import { computed, onMounted, ref } from "vue";

interface BlogPost {
  name: string;
  date: string;
  content: string;
  size: string;
  type: string;
}

const blogPosts = ref<BlogPost[]>([]);

onMounted(async () => {
  try {
    const modules = import.meta.glob("/src/data/blog/*.md", { as: "raw" });
    for (const path in modules) {
      const content = await modules[path]();
      const fileName = path.split("/").pop()?.replace(".md", "") || "";

      blogPosts.value.push({
        name: fileName,
        date: new Date().toISOString().split("T")[0],
        content,
        size: `${Math.round(content.length / 1024)} KB`,
        type: "md",
      });
    }
  } catch (error) {
    console.error("Error loading blog posts:", error);
  }
});

const selectedPost = ref<BlogPost | null>(null);

const sortedPosts = computed(() => {
  return [...blogPosts.value].sort((a, b) => b.date.localeCompare(a.date));
});

const selectPost = (post: BlogPost) => {
  selectedPost.value = post;
};

const renderedContent = computed(() => {
  if (selectedPost.value) {
    return marked(selectedPost.value.content);
  }
  return "";
});
</script>

<template>
  <Splitter>
    <SplitterPanel class="flex justify-center" :size="100">
      <div class="file-list w-full">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date Modified</th>
              <th>Size</th>
              <th>Kind</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="post in sortedPosts"
              :key="post.date"
              @click="selectPost(post)"
              :class="{ selected: selectedPost === post }"
            >
              <td>{{ post.name }}</td>
              <td>{{ new Date(post.date).toLocaleDateString() }}</td>
              <td>{{ post.size }}</td>
              <td>Markdown</td>
            </tr>
          </tbody>
        </table>
      </div>
    </SplitterPanel>
    <SplitterPanel
      v-if="selectedPost"
      class="flex justify-center"
      :size="50"
      :minSize="35"
    >
      <div class="preview-pane">
        <h2 style="color: black">
          {{ selectedPost.date }}.{{ selectedPost.type }}
        </h2>
        <div class="markdown-content" v-html="renderedContent"></div>
      </div>
    </SplitterPanel>
  </Splitter>
</template>

<style scoped>
:deep(.markdown-content) {
  h1,
  h2,
  h3,
  li,
  p {
    color: black !important;
  }
}

.p-splitter {
  background-color: white;
  border: none;
  height: 100%;
}
.p-splitterpanel {
  overflow-y: auto;
  height: 100%;
}

.preview-pane {
  width: 100%;
  overflow-y: auto;
  padding: 50px;

  h1,
  h2,
  p {
    color: black !important;
  }
}

.file-list {
  :is(h1, h2) {
    color: black !important;
  }
}

.content {
  flex-grow: 1;
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid #e0e0e0;
  color: black;
}

th {
  background-color: #f5f5f5;
  font-weight: normal;
  color: #888;
}

tr:hover {
  background-color: #f0f0f0;
}

tr.selected {
  background-color: #d8e6ff;
}
</style>
