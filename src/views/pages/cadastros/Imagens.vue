<script>
import { useToast } from "primevue/usetoast";
import { computed, ref } from "vue";
import { RESTAPI } from "../../../service/api";
import { exportCSV } from "../../../utils/exportCsv";

export default {
  data() {
    return {
      display: false,
      deleteDialog: ref(false),
      deleteAllDialog: ref(false),
      criarDialog: ref(false),
      dt: ref(),
      editaDialog: ref(false),
      toast: useToast(),
      product: {},
      imagem: ref({}),
      editImage: "",
      dataImages: [],
      selectedImages: [],
      file: ref(),
      uploadType: ref("file"), // 'file' ou 'url'
      urlDebounceTimer: null, // Timer para debounce da URL
      isProcessingUrl: false, // Estado de processamento da URL
      gridColumns: computed(() => [
        { field: "name", caption: "Nome" },
        { field: "url", caption: "URL" },
        { field: "type", caption: "Tipo" },
        { field: "extension", caption: "Extensão" },
        { field: "description", caption: "Descrição" },
      ]),
    };
  },
  created() {
    this.getImages();
  },
  beforeUnmount() {
    this.clearUrlDebounce();
  },
  methods: {
    formatMessage(data) {
      return data;
    },
    confirmDelete(edit) {
      this.product = edit;
      this.deleteDialog = true;
    },
    editaImagem(edit) {
      this.editImage = edit;
      this.editaDialog = true;
    },
    openNew() {
      this.imagem = { name: "", description: "", extension: "", url: "" };
      this.file = null;
      this.uploadType = "file";
      this.clearUrlDebounce();
      this.criarDialog = true;
    },
    getImages() {
      RESTAPI.ImagemObterTodos()
        .then((response) => {
          this.dataImages = response.data;
        })
        .catch(() => {
          this.toast.add({
            severity: "error",
            summary: $t("SummarioToastError"),
            detail: $t("ErroObterDadosGenerico"),
            life: 3000,
          });
        });
    },
    getCancelImage() {
      this.editaDialog = false;
      this.getImages();
    },
    handleExportCSV() {
      exportCSV(this.dataImages);
    },
    SalvaImagem() {
      // Validação
      if (
        !this.imagem.name ||
        !this.imagem.description ||
        !this.imagem.extension
      ) {
        this.toast.add({
          severity: "warn",
          summary: "Campos Obrigatórios",
          detail: "Preencha todos os campos obrigatórios",
          life: 3000,
        });
        return;
      }

      if (this.uploadType === "file" && !this.file) {
        this.toast.add({
          severity: "warn",
          summary: "Arquivo Necessário",
          detail: "Selecione um arquivo para upload",
          life: 3000,
        });
        return;
      }

      if (this.uploadType === "url" && !this.imagem.url) {
        this.toast.add({
          severity: "warn",
          summary: "URL Necessária",
          detail: "Insira uma URL válida para a imagem",
          life: 3000,
        });
        return;
      }

      const formData = new FormData();
      formData.append("name", this.imagem.name);
      formData.append("description", this.imagem.description);
      formData.append("type", "image");
      formData.append("extension", this.imagem.extension);

      // Se é upload de arquivo
      if (this.uploadType === "file" && this.file) {
        formData.append("file", this.file);
      }

      // Se é URL externa
      if (this.uploadType === "url" && this.imagem.url) {
        formData.append("url", this.imagem.url);
      }

      RESTAPI.ImagemCriar(formData)
        .then(() => {
          this.getImages();
          this.toast.add({
            severity: "success",
            summary: $t("SummarioToastSucesso"),
            detail: $t("ImagemToastCreate"),
            life: 3000,
          });
          this.imagem = {};
        })
        .catch(() => {
          this.toast.add({
            severity: "error",
            summary: $t("SummarioToastError"),
            detail: $t("ImagemToastCreateError"),
            life: 3000,
          });
        })
        .finally(() => {
          this.imagem = { name: "", description: "", extension: "", url: "" };
          this.file = null;
          this.uploadType = "file";
          this.clearUrlDebounce();
          this.criarDialog = false;
        });
    },
    EditaImagem() {
      const dataToSend = { ...this.editImage };
      RESTAPI.ImagemEditar(dataToSend)
        .then(() => {
          this.getImages();
          this.editaDialog = false;
          this.toast.add({
            severity: "success",
            summary: $t("SummarioToastSucesso"),
            detail: $t("ImagemToastEdit"),
            life: 3000,
          });
        })
        .catch(() => {
          this.toast.add({
            severity: "error",
            summary: $t("SummarioToastError"),
            detail: $t("ImagemToastEditError"),
            life: 3000,
          });
        });
    },
    deleteImage() {
      RESTAPI.ImagemExcluir(this.product._id)
        .then(() => {
          this.dataImages = this.dataImages.filter(
            (u) => u._id !== this.product._id
          );
          this.deleteDialog = false;
          this.toast.add({
            severity: "success",
            summary: $t("SummarioToastSucesso"),
            detail: $t("ImagemToastDelete"),
            life: 3000,
          });
        })
        .catch(() => {
          this.toast.add({
            severity: "error",
            summary: $t("SummarioToastError"),
            detail: $t("ImagemToastDeleteError"),
            life: 3000,
          });
        });
    },
    confirmDeleteAll(edit) {
      this.accounts = edit;
      this.deleteAllDialog = true;
    },
    deleteAll() {
      if (this.selectedImages.length === 0) {
        this.toast.add({
          severity: "warn",
          summary: $t("SummarioToastWarn"),
          detail: $t("NenhumaLinhaSelecionada"),
          life: 3000,
        });
        return;
      }

      this.selectedImages.forEach((image) => {
        RESTAPI.ImagemExcluir(image._id)
          .then(() => {
            this.dataImages = this.dataImages.filter(
              (u) => u._id !== image._id
            );
            this.toast.add({
              severity: "success",
              summary: $t("SummarioToastSucesso"),
              detail: $t("ImagemToastDelete"),
              life: 3000,
            });
          })
          .catch(() => {
            this.toast.add({
              severity: "error",
              summary: $t("SummarioToastError"),
              detail: $t("ImagemToastDeleteError"),
              life: 3000,
            });
          });
      });
      this.deleteAllDialog = false;
      this.selectedImages = [];
    },
    onFileSelect(event) {
      const file = event.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const binaryData = e.target.result;
          const blob = new Blob([binaryData], { type: file.type });
          this.file = blob;

          // Auto preencher nome e extensão baseado no arquivo
          this.imagem.name = file.name;
          this.imagem.extension = file.name.split(".").pop().toLowerCase();
        };
        reader.readAsArrayBuffer(file);
      }
    },
    onUrlChange() {
      // Limpar timer anterior se existir
      if (this.urlDebounceTimer) {
        clearTimeout(this.urlDebounceTimer);
      }

      // Se URL está vazia, limpar campos
      if (!this.imagem.url) {
        this.isProcessingUrl = false;
        return;
      }

      // Mostrar estado de processamento
      this.isProcessingUrl = true;

      // Criar novo timer com delay de 500ms
      this.urlDebounceTimer = setTimeout(() => {
        if (this.imagem.url) {
          // Extrair nome do arquivo da URL
          const urlParts = this.imagem.url.split("/");
          const fileName = urlParts[urlParts.length - 1];

          if (fileName && fileName.includes(".")) {
            // Decodificar URL se necessário
            const decodedFileName = decodeURIComponent(fileName);
            this.imagem.name = decodedFileName;
            this.imagem.extension = decodedFileName
              .split(".")
              .pop()
              .toLowerCase();
          }
        }
        this.isProcessingUrl = false;
      }, 500); // 500ms de delay
    },
    clearUrlDebounce() {
      if (this.urlDebounceTimer) {
        clearTimeout(this.urlDebounceTimer);
        this.urlDebounceTimer = null;
      }
    },
    close() {
      this.display = false;
    },
  },
};
</script>

<template>
  <div class="card">
    <h5 class="p-card-title">Imagens CDN</h5>
    <div id="data-grid-demo">
      <div v-if="dataImages.length < 0">Carregando...</div>
      <div v-else>
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button
                label="Nova"
                icon="pi pi-plus"
                class="p-button-success mr-2"
                @click="openNew"
              />
              <Button
                label="Deletar"
                icon="pi pi-trash"
                class="p-button-danger"
                @click="confirmDeleteAll"
                :disabled="!selectedImages || !selectedImages.length"
              />
            </div>
          </template>

          <template v-slot:end>
            <Button
              label="Exportar"
              icon="pi pi-upload"
              class="p-button-help"
              @click="handleExportCSV()"
            />
          </template>
        </Toolbar>
        <DataTable
          ref="dt"
          v-model:selection="selectedImages"
          :value="dataImages"
          dataKey="_id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          responsiveLayout="scroll"
          scrollable
          scrollHeight="50vh"
          class="table-container"
        >
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column
            v-for="column in gridColumns"
            :key="column.field"
            :field="column.field"
            :header="column.caption"
            :sortable="true"
            headerStyle="width:14%; min-width:10rem;"
          >
            <template #body="slotProps">
              <template v-if="column.field === 'url'">
                <img
                  v-if="slotProps.data.url"
                  :src="slotProps.data.url"
                  class="w-16 h-16 object-cover rounded shadow-2"
                  :alt="slotProps.data.name"
                />
                <span v-else>{{ slotProps.data[column.field] }}</span>
              </template>
              <template v-else>
                <span class="font-bold">{{
                  slotProps.data[column.field]
                }}</span>
              </template>
            </template>
          </Column>
          <Column headerStyle="min-width:10rem;">
            <template #body="slotProps">
              <Button
                v-tooltip="'Editar'"
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="editaImagem(slotProps.data)"
              />
              <Button
                v-tooltip="'Excluir'"
                icon="pi pi-trash"
                class="p-button-rounded p-button-warning"
                @click="confirmDelete(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>

        <Dialog
          class="dialog-component"
          v-model:visible="deleteDialog"
          :style="{ width: '450px' }"
          :header="$t('Excluir')"
          :modal="true"
        >
          <div class="flex items-center">
            <i class="pi pi-exclamation-triangle mr-3 p-large" />
            <span v-if="product"
              >{{ $t("Excluir") }} <b>{{ product.name }}</b
              >?</span
            >
          </div>
          <template #footer>
            <Button
              :label="$t('Cancelar')"
              icon="pi pi-times"
              class="p-button-secondary p-button-text"
              @click="deleteDialog = false"
            />
            <Button
              :label="$t('Sim')"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteImage"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="deleteAllDialog"
          :header="$t('Excluir')"
          :modal="true"
          :style="{ width: '450px' }"
        >
          <div class="flex items-center">
            <i class="pi pi-exclamation-triangle mr-3 p-large" />
            <span v-if="product"
              >{{ $t("Excluir") }}
              <b>{{ this.selectedImages.length }} {{ $t("Imagens") }}</b
              >?</span
            >
          </div>
          <template #footer>
            <Button
              :label="$t('Cancelar')"
              icon="pi pi-times"
              class="p-button-secondary p-button-text"
              @click="deleteAllDialog = false"
            />
            <Button
              :label="$t('Sim')"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteAll"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="criarDialog"
          :style="{ width: '600px' }"
          :header="$t('Criar')"
          :modal="true"
          class="p-fluid create-image-dialog"
        >
          <!-- Informações Básicas -->
          <div class="field-group mb-4">
            <h6 class="field-group-title mb-3">
              <i class="pi pi-info-circle mr-2"></i>
              Informações Básicas
            </h6>

            <div class="grid formgrid">
              <div class="col-12 md:col-8 mb-3">
                <label for="name" class="form-label">Nome *</label>
                <InputText
                  id="name"
                  v-model.trim="imagem.name"
                  placeholder="Nome do arquivo ou imagem"
                  required="true"
                  autofocus
                  class="w-full"
                  :class="{ 'p-invalid': submitted && !imagem.name }"
                />
              </div>

              <div class="col-12 md:col-4 mb-3">
                <label for="extension" class="form-label">Extensão *</label>
                <InputText
                  id="extension"
                  v-model.trim="imagem.extension"
                  placeholder="jpg, png, gif..."
                  required="true"
                  class="w-full"
                  :class="{ 'p-invalid': submitted && !imagem.extension }"
                />
              </div>

              <div class="col-12 mb-3">
                <label for="description" class="form-label">Descrição *</label>
                <Textarea
                  id="description"
                  v-model="imagem.description"
                  placeholder="Descreva a imagem..."
                  required="true"
                  rows="3"
                  class="w-full"
                  :class="{ 'p-invalid': submitted && !imagem.description }"
                />
              </div>
            </div>
          </div>

          <!-- Tipo de Upload -->
          <div class="field-group mb-4">
            <h6 class="field-group-title mb-3">
              <i class="pi pi-cloud-upload mr-2"></i>
              Origem da Imagem
            </h6>

            <div
              class="upload-type-selection p-3 border-round surface-border border-1"
            >
              <div class="flex gap-4">
                <div class="flex align-items-center">
                  <RadioButton
                    id="uploadFile"
                    v-model="uploadType"
                    name="uploadType"
                    value="file"
                  />
                  <label for="uploadFile" class="ml-2 font-medium">
                    <i class="pi pi-file mr-1"></i>
                    Upload de Arquivo
                  </label>
                </div>

                <div class="flex align-items-center">
                  <RadioButton
                    id="uploadUrl"
                    v-model="uploadType"
                    name="uploadType"
                    value="url"
                  />
                  <label for="uploadUrl" class="ml-2 font-medium">
                    <i class="pi pi-link mr-1"></i>
                    Link/URL Externa
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Upload de Arquivo -->
          <div class="field-group mb-4" v-if="uploadType === 'file'">
            <h6 class="field-group-title mb-3">
              <i class="pi pi-upload mr-2"></i>
              Selecionar Arquivo
            </h6>

            <div
              class="upload-area p-4 border-round border-2 border-dashed surface-border text-center"
            >
              <FileUpload
                mode="basic"
                name="demo[]"
                :auto="false"
                :choose-label="'📁 Escolher Arquivo'"
                accept="image/*"
                :maxFileSize="5000000"
                @select="onFileSelect"
                class="custom-file-upload"
              />
              <div class="mt-3 text-sm text-color-secondary">
                <i class="pi pi-info-circle mr-1"></i>
                Formatos aceitos: JPG, PNG, GIF, WebP | Tamanho máximo: 5MB
              </div>
            </div>
          </div>

          <!-- URL Externa -->
          <div class="field-group mb-4" v-if="uploadType === 'url'">
            <h6 class="field-group-title mb-3">
              <i class="pi pi-external-link mr-2"></i>
              URL da Imagem
            </h6>

            <div class="url-input-container">
              <div class="p-inputgroup">
                <InputText
                  id="imageUrl"
                  v-model.trim="imagem.url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  @input="onUrlChange"
                  class="w-full"
                  :class="{
                    'p-invalid':
                      submitted && uploadType === 'url' && !imagem.url,
                  }"
                />
                <span v-if="isProcessingUrl" class="p-inputgroup-addon">
                  <i class="pi pi-spin pi-spinner"></i>
                </span>
              </div>
              <small class="text-color-secondary mt-2 block">
                <i class="pi pi-info-circle mr-1"></i>
                <span v-if="isProcessingUrl"> Processando URL... </span>
                <span v-else>
                  Cole aqui o link direto para a imagem (deve terminar com .jpg,
                  .png, etc.)
                </span>
              </small>

              <!-- Preview da URL -->
              <div
                v-if="imagem.url"
                class="image-preview mt-4 p-3 border-round surface-ground"
              >
                <div
                  class="flex align-items-center justify-content-between mb-2"
                >
                  <span class="font-medium text-color">
                    <i class="pi pi-eye mr-1"></i>
                    Preview da Imagem
                  </span>
                </div>
                <div class="preview-container text-center">
                  <img
                    :src="imagem.url"
                    class="preview-image border-round shadow-2"
                    :alt="imagem.name || 'Preview'"
                    @error="$event.target.style.display = 'none'"
                    @load="$event.target.style.display = 'block'"
                    style="
                      max-width: 200px;
                      max-height: 200px;
                      object-fit: cover;
                    "
                  />
                </div>
              </div>
            </div>
          </div>

          <template #footer>
            <Button
              :label="$t('Cancelar')"
              icon="pi pi-times"
              class="p-button-secondary p-button-text"
              @click="criarDialog = false"
            />
            <Button
              :label="$t('Salvar')"
              icon="pi pi-check"
              class="p-button-text"
              @click="SalvaImagem"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="editaDialog"
          :style="{ width: '450px' }"
          :header="$t('Editar')"
          :modal="true"
          class="p-fluid"
          @update:visible="getCancelImage"
        >
          <div class="row flex">
            <div class="field col">
              <label for="editName">Nome</label>
              <InputText
                id="editName"
                v-model.trim="editImage.name"
                required="true"
                autofocus
                :class="{ 'p-invalid': submitted && !editImage.name }"
              />
            </div>
            <div class="field col">
              <label for="editExtension">Extensão</label>
              <InputText
                id="editExtension"
                v-model.trim="editImage.extension"
                required="true"
                :class="{ 'p-invalid': submitted && !editImage.extension }"
              />
            </div>
          </div>
          <div class="row flex">
            <div class="field col">
              <label for="editDescription">Descrição</label>
              <Textarea
                id="editDescription"
                v-model="editImage.description"
                required="true"
                rows="3"
                cols="20"
                :class="{ 'p-invalid': submitted && !editImage.description }"
              />
            </div>
          </div>
          <div class="row flex" v-if="editImage.url">
            <div class="field col">
              <label>Preview Atual</label>
              <img
                :src="editImage.url"
                class="w-32 h-32 object-cover rounded shadow-2 mt-2"
                :alt="editImage.name"
              />
            </div>
          </div>
          <template #footer>
            <Button
              :label="$t('Cancelar')"
              icon="pi pi-times"
              class="p-button-secondary p-button-text"
              @click="getCancelImage"
            />
            <Button
              :label="$t('Salvar')"
              icon="pi pi-check"
              class="p-button-text"
              @click="EditaImagem"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  aspect-ratio: unset;
}

.table-container {
  line-break: anywhere;

  ::-webkit-scrollbar {
    height: 8px;
  }
}

/* Melhorias no Modal de Criação */
.create-image-dialog :deep(.p-dialog-content) {
  padding: 1.5rem;
}

.field-group {
  background: var(--surface-ground);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid var(--surface-border);
}

.field-group-title {
  color: var(--primary-color);
  font-weight: 600;
  font-size: 1rem;
  margin: 0;
  display: flex;
  align-items: center;
}

.form-label {
  font-weight: 500;
  color: var(--text-color);
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.upload-type-selection {
  background: var(--surface-card);
  transition: all 0.3s ease;
}

.upload-type-selection:hover {
  background: var(--surface-hover);
}

.upload-area {
  background: var(--surface-card);
  transition: all 0.3s ease;
}

.upload-area:hover {
  background: var(--surface-hover);
  border-color: var(--primary-color);
}

.custom-file-upload :deep(.p-button) {
  background: var(--primary-color);
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.custom-file-upload :deep(.p-button:hover) {
  background: var(--primary-color-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--primary-color-rgb), 0.3);
}

.url-input-container .p-inputtext {
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 0.95rem;
}

.image-preview {
  border: 1px solid var(--surface-border);
  animation: fadeIn 0.3s ease-in;
}

.preview-image {
  border: 2px solid var(--surface-border);
  transition: transform 0.3s ease;
}

.preview-image:hover {
  transform: scale(1.05);
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

/* Melhorias nos Radio Buttons */
.field-radiobutton {
  margin: 0;
}

.field-radiobutton label {
  cursor: pointer;
  transition: color 0.3s ease;
}

.field-radiobutton label:hover {
  color: var(--primary-color);
}

/* Melhorias nos Input Fields */
.p-inputtext,
.p-inputtextarea {
  transition: all 0.3s ease;
  border-radius: 6px;
}

.p-inputtext:focus,
.p-inputtextarea:focus {
  box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.1);
  border-color: var(--primary-color);
}

/* Grid responsivo melhorado */
.grid.formgrid {
  margin: 0;
  gap: 0;
}

.grid.formgrid > .col-12 {
  padding: 0 0.5rem;
}

.grid.formgrid > .col-12:first-child {
  padding-left: 0;
}

.grid.formgrid > .col-12:last-child {
  padding-right: 0;
}

/* Melhoria nos ícones */
.pi {
  font-size: 0.9rem;
}

/* Texto secundário melhorado */
.text-color-secondary {
  color: var(--text-color-secondary);
  font-size: 0.85rem;
  line-height: 1.4;
}

/* Botões do footer melhorados */
.create-image-dialog :deep(.p-dialog-footer) {
  padding: 1rem 1.5rem;
  background: var(--surface-ground);
  border-top: 1px solid var(--surface-border);
  gap: 0.75rem;
}

.create-image-dialog :deep(.p-dialog-footer .p-button) {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
}
</style>
