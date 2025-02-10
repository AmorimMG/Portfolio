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
    content: "# First Blog Post\n\nThis is the content of the first blog post. It includes some text, an emoji, and a list.\n\n:rocket: Rocket emoji!\n\n## Features\n- Markdown rendering\n- Large content simulation\n- Emoji support :smile:\n\n### Conclusion\nThis is a small blog post with a few elements.",
    size: "60 KB",
    type: "md",
  },
  {
    date: "2023-05-15",
    content: "# Second Blog Post\n\nThis is the content of the second blog post. It contains even more content and a few more emoji.\n\n✨ Glittery text :sparkles:\n\n## List of Items\n- Apple 🍎\n- Banana 🍌\n- Cherry 🍒\n\n### Summary\nEnjoy the blog post and test all the features.",
    size: "57 KB",
    type: "md",
  },
  {
    date: "2023-06-01",
    content: "# Third Blog Post\n\nThis is the content of the third blog post with some larger sections and more emojis.\n\n🎉🎉 Big celebration!\n\n## What We Have Here\n- A title\n- A list with more items\n- Some fun emojis like :star:, :tada:, and :fire:\n\n### Final Thoughts\nThis is a more extended post for testing the rendering of markdown content.",
    size: "58 KB",
    type: "md",
  },
  {
    date: "2023-06-15",
    content: "# Large Markdown Test Post\n\nThis is a test post with a very large markdown content. We are simulating a large file for testing purposes.\n\n✨ Magic happens here! :star:\n\n## Let's test a long list\n" + 
    Array(50).fill("- Item :memo:").join("\n") + "\n\n## Emojis Everywhere! :eyes: :rocket: :sparkles: :star: :tada:\n\n## Test of a large blockquote\n> This is a quote block for testing rendering large blocks of text. This is where content can get quite large and be rendered correctly with a markdown parser.\n\n",
    size: "1.2 MB",
    type: "md",
  },
  {
    date: "2023-07-01",
    content: "# Extra Large Markdown Test Post\n\nThis is another test post with an even larger markdown content. We are testing how large markdown content affects the preview and rendering.\n\n🤖 :robot: Here comes the robot!\n\n## Long text content for testing performance\n" + 
    Array(100).fill("This is a long line of text for testing the system performance and markdown rendering. :octopus:").join("\n") + 
    "\n\n### Emoji-heavy Test\n- 🏆 Trophy\n- 🥇 Gold Medal\n- 🎮 Video Game Controller\n- 🚀 Rocket\n- 🍕 Pizza\n\nThis is to test how the markdown parser handles large content and emojis simultaneously. The content here is large and contains lots of Markdown elements for rendering.\n\n### Big Image Test\n![Example Image](https://via.placeholder.com/800x400.png)\n\nThe markdown file contains a mixture of content types including large texts, emojis, images, and lists.",
    size: "2.3 MB",
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
    overflow-y: auto;
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
