<script setup lang="ts"></script>

<template>
    <div class="file-manager">
        <div class="sidebar">
            <div class="section">
                <h3>🖥️ Devices</h3>
                <ul>
                    <li>💻 System</li>
                </ul>
            </div>
            <div class="section">
                <h3>⭐ Favorites</h3>
                <ul>
                    <li>📦 Applications</li>
                    <li>🖥️ Desktop</li>
                    <li>📄 Documents</li>
                    <li>⬇️ Downloads</li>
                    <li>🖼️ Pictures</li>
                </ul>
            </div>
        </div>
        <div class="main-content w-full">
            <slot />
        </div>
    </div>
</template>

<style scoped>
li {
    color: black;
}

.main-content {
    background-color: white;
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
</style>
