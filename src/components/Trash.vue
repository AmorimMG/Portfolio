<script setup>
import { useAppsStore } from "@/stores/useAppsStore";
import { useFileSystemStore } from "@/stores/useFileSystemStore";
import { useTrashStore } from "@/stores/useTrashStore";

const trashStore = useTrashStore();
const appsStore = useAppsStore();

function restore(app) {
  // Verificar se é um arquivo do sistema de arquivos ou um app da store
  if (app.originalPath) {
    // É um arquivo do sistema de arquivos - restaurar no local original
    const pathParts = app.originalPath.split("/");
    const fileName = pathParts.pop();
    const parentPath = pathParts.join("/") || "/";

    // Restaurar arquivo no sistema de arquivos
    if (app.type === "dir") {
      // Para diretórios (implementação simplificada)
      console.log("Restoring directory:", fileName, "to", parentPath);
      // TODO: Implementar restauração completa de diretórios
    } else {
      // Para arquivos, incluindo .app
      const fileSystemStore = useFileSystemStore();
      let content = "";

      if (fileName.endsWith(".app")) {
        // Usar conteúdo original se disponível, senão reconstruir
        if (app.originalContent) {
          content = app.originalContent;
        } else {
          // Reconstruir conteúdo do app
          content = JSON.stringify(
            {
              title: app.title,
              name: app.component || app.name || "DefaultApp",
              icon: app.icon,
              component: app.component || app.name || "DefaultApp",
              type: "application",
              locked: app.locked || false,
              colSpan: app.colSpan || 1,
              rowSpan: app.rowSpan || 1,
            },
            null,
            2
          );
        }
      }

      console.log(
        "Restoring file:",
        fileName,
        "to:",
        parentPath,
        "with content:",
        content
      );
      fileSystemStore.createFile(fileName, content, parentPath);
    }

    // Remover da lixeira
    trashStore.removeFromTrash(app);
  } else {
    // É um app da store tradicional
    appsStore.restoreApp(app);
  }
}

function permanentDelete(app) {
  const confirmed = confirm(
    `Tem certeza que deseja excluir permanentemente "${app.title || app.name}"? Esta ação não pode ser desfeita.`
  );
  if (confirmed) {
    trashStore.removeFromTrash(app);
  }
}

function clearAll() {
  const confirmed = confirm(
    `Tem certeza que deseja esvaziar a lixeira? Todos os ${trashStore.trash.length} itens serão excluídos permanentemente.`
  );
  if (confirmed) {
    trashStore.trash = [];
  }
}

// Função para verificar se o ícone é uma URL de imagem
function isImageIcon(icon) {
  if (!icon || typeof icon !== "string") return false;
  return (
    icon.startsWith("http") ||
    icon.startsWith("/") ||
    icon.startsWith("data:") ||
    (icon.includes(".") && !icon.match(/^[\u{1F000}-\u{1F9FF}]/u))
  );
}

// Função para obter o tipo do arquivo
function getFileTypeLabel(app) {
  if (app.name && app.name.endsWith(".app")) return "Aplicativo";
  if (app.type === "dir") return "Pasta";

  const name = app.name || app.title || "";
  const ext = name.split(".").pop()?.toLowerCase();

  const typeMap = {
    txt: "Texto",
    md: "Markdown",
    js: "JavaScript",
    json: "JSON",
    pdf: "PDF",
    jpg: "Imagem",
    jpeg: "Imagem",
    png: "Imagem",
    gif: "Imagem",
    mp3: "Áudio",
    mp4: "Vídeo",
    zip: "Arquivo",
  };

  return typeMap[ext] || "Arquivo";
}

// Função para formatar a data de exclusão
function formatDeletedDate(deletedAt) {
  if (!deletedAt) return "Data desconhecida";

  const date = new Date(deletedAt);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffInMinutes < 1) return "Agora mesmo";
  if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h atrás`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d atrás`;

  return date.toLocaleDateString("pt-BR");
}

// Função para exibir o caminho de forma mais amigável
function getPathDisplay(path) {
  if (!path) return "";

  const pathParts = path.split("/");
  const fileName = pathParts.pop();
  const parentPath = pathParts.join("/");

  // Simplificar caminhos comuns
  if (parentPath === "/home/amorim/Desktop") return "Desktop";
  if (parentPath === "/home/amorim/Documents") return "Documentos";
  if (parentPath === "/home/amorim/Downloads") return "Downloads";
  if (parentPath.startsWith("/home/amorim/")) {
    return parentPath.replace("/home/amorim/", "~/");
  }

  return parentPath || "/";
}
</script>

<template>
  <div class="trash-container">
    <!-- Estado vazio -->
    <div class="empty-state" v-if="trashStore.trash.length === 0">
      <div class="empty-icon">🗑️</div>
      <h3 class="empty-title">Lixeira vazia</h3>
      <p class="empty-subtitle">Nenhum item foi excluído recentemente</p>
    </div>

    <!-- Lista de itens -->
    <div v-else class="trash-grid">
      <div class="trash-item" v-for="app in trashStore.trash" :key="app.id">
        <!-- Ícone do arquivo -->
        <div class="item-icon">
          <img
            v-if="isImageIcon(app.icon)"
            loading="lazy"
            :src="app.icon"
            :alt="app.title || app.name"
            class="icon-image"
          />
          <span v-else class="icon-emoji">{{ app.icon || "📄" }}</span>
        </div>

        <!-- Informações do arquivo -->
        <div class="item-info">
          <h4 class="item-title">{{ app.title || app.name }}</h4>
          <div class="item-details">
            <span class="item-type">{{ getFileTypeLabel(app) }}</span>
            <span class="item-separator">•</span>
            <span class="item-date">{{
              formatDeletedDate(app.deletedAt)
            }}</span>
          </div>
          <div class="item-path" v-if="app.originalPath">
            <i class="pi pi-folder"></i>
            {{ getPathDisplay(app.originalPath) }}
          </div>
        </div>

        <!-- Ações -->
        <div class="item-actions">
          <button
            class="action-button restore-btn"
            @click="restore(app)"
            title="Restaurar item"
          >
            <i class="pi pi-refresh"></i>
            Restaurar
          </button>
          <button
            class="action-button delete-btn"
            @click="permanentDelete(app)"
            title="Excluir permanentemente"
          >
            <i class="pi pi-times"></i>
            Excluir
          </button>
        </div>
      </div>
    </div>

    <!-- Rodapé com informações -->
    <div v-if="trashStore.trash.length > 0" class="trash-footer">
      <span class="items-count">
        {{ trashStore.trash.length }}
        {{ trashStore.trash.length === 1 ? "item" : "itens" }} na lixeira
      </span>
      <button class="clear-all-btn" @click="clearAll" title="Esvaziar lixeira">
        <i class="pi pi-trash"></i>
        Esvaziar lixeira
      </button>
    </div>
  </div>
</template>

<style scoped>
.trash-container {
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* Estado vazio */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  opacity: 0.7;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.empty-subtitle {
  color: #6b7280;
  margin: 0;
}

/* Grid de itens */
.trash-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.trash-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.trash-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #d1d5db;
}

/* Ícone do item */
.item-icon {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.icon-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
}

.icon-emoji {
  font-size: 2rem;
}

/* Informações do item */
.item-info {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-details {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.item-separator {
  color: #d1d5db;
}

.item-path {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

.item-path i {
  font-size: 0.75rem;
}

/* Ações */
.item-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.restore-btn {
  background: #10b981;
  color: white;
}

.restore-btn:hover {
  background: #059669;
  transform: translateY(-1px);
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.delete-btn:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

/* Rodapé */
.trash-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  margin-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.items-count {
  font-size: 0.875rem;
  color: #6b7280;
}

.clear-all-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f87171;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-all-btn:hover {
  background: #ef4444;
  transform: translateY(-1px);
}

/* Responsividade */
@media (max-width: 768px) {
  .trash-container {
    padding: 1rem;
  }

  .trash-item {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }

  .item-info {
    text-align: center;
  }

  .item-actions {
    width: 100%;
    justify-content: center;
  }

  .action-button {
    flex: 1;
    justify-content: center;
  }

  .trash-footer {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

/* Animações */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.trash-item {
  animation: slideIn 0.3s ease-out;
}
</style>
