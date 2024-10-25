<script setup lang="ts">
import { marked } from "marked";
import { computed, ref } from "vue";

interface BlogPost {
	date: string;
	content: string;
	size: string;
	type: string;
}

const blogPosts = ref<BlogPost[]>([
	{
		date: "2023-05-01",
		content: "# First Blog Post\n\nThis is the content of the first blog post.",
		size: "60 KB",
		type: "md",
	},
	{
		date: "2023-05-15",
		content:
			"# Second Blog Post\n\nThis is the content of the second blog post.",
		size: "57 KB",
		type: "md",
	},
	{
		date: "2023-06-01",
		content: "# Third Blog Post\n\nThis is the content of the third blog post.",
		size: "58 KB",
		type: "md",
	},
]);

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
  <div class="file-manager">
    <div class="sidebar">
      <div class="section">
        <h3>Devices</h3>
        <ul>
          <li>System</li>
        </ul>
      </div>
      <div class="section">
        <h3>Favorites</h3>
        <ul>
          <li>Applications</li>
          <li>Desktop</li>
          <li>Documents</li>
          <li>Downloads</li>
          <li>Pictures</li>
        </ul>
      </div>
    </div>
    <div class="main-content w-full">
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
              :class="{ 'selected': selectedPost === post }"
            >
              <td>{{ post.date }}.{{ post.type }}</td>
              <td>{{ new Date(post.date).toLocaleString() }}</td>
              <td>{{ post.size }}</td>
              <td>Markdown</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="selectedPost" class="preview-pane w-full">
        <h2 style="color: black">{{ selectedPost.date }}.{{ selectedPost.type }}</h2>
        <div class="markdown-content" v-html="renderedContent"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.markdown-content{
    h1,h2, p{
        color: black !important;
    }
}

li{
    color: black;
}

.main-content{
    flex-direction: row;
    display: flex;
    gap: 10px;
    color: black !important;
    background-color: #f0f0f0;
}

.preview-pane{
    h1,h2, p{
        color: black !important;
    }
}

.file-list {
    h1,h2{
        color: black !important;
    }
}


.file-manager {
  display: flex;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

.sidebar {
  width: 200px;
  background-color: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  padding: 20px 10px;
}

.section {
  margin-bottom: 20px;
}

.section h3 {
  font-size: 12px;
  color: #888;
  margin-bottom: 5px;
}

.section ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.section li {
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}

.section li:hover {
  background-color: #e0e0e0;
}

.content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
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
