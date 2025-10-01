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
      Linguagem: {},
      linguagemEdit: "",
      dataLinguagem: [],
      selectedLinguagem: [],
      gridColumns: computed(() => [
        { field: "nome", caption: "Nome" },
        { field: "knowledge", caption: "Conhecimento" },
      ]),
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    formatMessage(data) {
      return data;
    },
    confirmDelete(edit) {
      this.product = edit;
      this.deleteDialog = true;
    },
    editaLinguagem(edit) {
      this.linguagemEdit = edit;
      this.editaDialog = true;
    },
    openNew() {
      this.criarDialog = true;
    },
    getUsers() {
      RESTAPI.LinguagemObterTodos()
        .then((response) => {
          this.dataLinguagem = response.data;
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
    getCancelUser() {
      this.editaDialog = false;
      this.getUsers();
    },
    handleExportCSV() {
      exportCSV(this.dataLinguagem);
    },
    editUser(user) {
      this.linguagemEdit = user.login;
    },
    SalvaLinguagem() {
      RESTAPI.LinguagemCriar(this.Linguagem)
        .then(() => {
          this.getUsers();
          this.criarDialog = false;
          this.toast.add({
            severity: "success",
            summary: $t("SummarioToastSucesso"),
            detail: $t("LinguagemToastCreate"),
            life: 3000,
          });
          this.Linguagem = { admin: false };
        })
        .catch(() => {
          this.toast.add({
            severity: "error",
            summary: $t("SummarioToastError"),
            detail: $t("LinguagemToastCreateError"),
            life: 3000,
          });
        });
    },
    EditaLinguagem() {
      RESTAPI.LinguagemEditar(this.linguagemEdit)
        .then(() => {
          this.getUsers();
          this.editaDialog = false;
          this.toast.add({
            severity: "success",
            summary: $t("SummarioToastSucesso"),
            detail: $t("LinguagemToastEdit"),
            life: 3000,
          });
        })
        .catch(() => {
          this.toast.add({
            severity: "error",
            summary: $t("SummarioToastError"),
            detail: $t("LinguagemToastEditError"),
            life: 3000,
          });
        });
    },
    deleteUser() {
      RESTAPI.LinguagemExcluir(this.product._id)
        .then(() => {
          this.dataLinguagem = this.dataLinguagem.filter(
            (u) => u.id !== this.product.id
          );
          this.deleteDialog = false;
          this.toast.add({
            severity: "success",
            summary: $t("SummarioToastSucesso"),
            detail: $t("LinguagemToastDelete"),
            life: 3000,
          });
        })
        .catch(() => {
          this.toast.add({
            severity: "error",
            summary: $t("SummarioToastError"),
            detail: $t("LinguagemToastDeleteError"),
            life: 3000,
          });
        });
    },
    confirmDeleteAll(edit) {
      this.accounts = edit;
      this.deleteAllDialog = true;
    },
    deleteAll() {
      if (this.selectedLinguagem.length === 0) {
        this.toast.add({
          severity: "warn",
          summary: $t("SummarioToastWarn"),
          detail: $t("NenhumaLinhaSelecionada"),
          life: 3000,
        });
        return;
      }

      this.selectedLinguagem.forEach((user) => {
        RESTAPI.LinguagemExcluir(user._id)
          .then(() => {
            this.dataLinguagem = this.dataLinguagem.filter(
              (u) => u._id !== user._id
            );
            this.toast.add({
              severity: "success",
              summary: $t("SummarioToastSucesso"),
              detail: $t("LinguagemToastDelete"),
              life: 3000,
            });
          })
          .catch(() => {
            this.toast.add({
              severity: "error",
              summary: $t("SummarioToastError"),
              detail: $t("LinguagemToastDeleteError"),
              life: 3000,
            });
          });
      });
      this.deleteAllDialog = false;
      this.selectedLinguagem = [];
    },
    getKnowledgeColor(knowledge) {
      if (knowledge <= 25) return "#ff6b6b"; // Vermelho - Iniciante
      if (knowledge <= 50) return "#ffd93d"; // Amarelo - Básico
      if (knowledge <= 75) return "#6bcf7f"; // Verde - Intermediário
      return "#4d96ff"; // Azul - Avançado
    },
    getKnowledgeLevel(knowledge) {
      if (knowledge <= 25) return "Iniciante";
      if (knowledge <= 50) return "Básico";
      if (knowledge <= 75) return "Intermediário";
      return "Avançado";
    },
    close() {
      this.display = false;
    },
  },
};
</script>

<template>
  <div class="card">
    <h5 class="p-card-title">{{ $t("Linguagens") }}</h5>
    <div id="data-grid-demo">
      <div v-if="dataLinguagem.length < 0">Carregando...</div>
      <div v-else>
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button
                :label="$t('Novo')"
                icon="pi pi-plus"
                class="p-button-success mr-2"
                @click="openNew"
              />
              <Button
                :label="$t('Deletar')"
                icon="pi pi-trash"
                class="p-button-danger"
                @click="confirmDeleteAll"
                :disabled="selectedLinguagem.length === 0"
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
          v-model:selection="selectedLinguagem"
          :value="dataLinguagem"
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
            headerStyle="min-width:10rem;"
          >
            <template #body="slotProps">
              <template
                v-if="column.field === 'ativo' || column.field === 'admin'"
              >
                <i v-if="slotProps.data[column.field]" class="pi pi-check"></i>
                <i v-else class="pi pi-times"></i>
              </template>
              <template v-else>
                {{ slotProps.data[column.field] }}
              </template>
            </template>
          </Column>
          <Column headerStyle="min-width:10rem;">
            <template #body="slotProps">
              <Button
                v-tooltip="$t('Editar')"
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="editaLinguagem(slotProps.data)"
              />
              <Button
                v-tooltip="$t('Excluir')"
                icon="pi pi-trash"
                class="p-button-rounded p-button-danger mt-2"
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
              >{{ $t("Tem Certeza que deseja excluir: ") }}
              <b>{{ product.name }}</b
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
              @click="deleteUser"
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
              <b>{{ this.selectedLinguagem.length }} {{ $t("Linguagem") }}</b
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
          :style="{ width: '550px' }"
          :header="$t('Criar')"
          :modal="true"
          class="p-fluid create-language-dialog"
        >
          <!-- Informações da Linguagem -->
          <div class="field-group mb-4">
            <h6 class="field-group-title mb-3">
              <i class="pi pi-code mr-2"></i>
              Dados da Linguagem/Tecnologia
            </h6>

            <div class="grid formgrid">
              <div class="col-12 mb-3">
                <label for="name" class="form-label"
                  >Nome da Linguagem/Tecnologia *</label
                >
                <InputText
                  id="name"
                  v-model.trim="Linguagem.name"
                  placeholder="Ex: JavaScript, Python, React..."
                  required="true"
                  autofocus
                  class="w-full"
                />
              </div>

              <div class="col-12 mb-3">
                <label for="knowledge" class="form-label"
                  >Nível de Conhecimento (%) *</label
                >
                <div class="knowledge-input-container">
                  <InputNumber
                    id="knowledge"
                    v-model="Linguagem.knowledge"
                    required="true"
                    class="w-full"
                    :min="0"
                    :max="100"
                    placeholder="Digite um valor de 0 a 100"
                    suffix="%"
                  />
                </div>
                <div class="knowledge-info mt-2">
                  <div
                    class="flex justify-content-between text-sm text-color-secondary"
                  >
                    <span
                      ><i class="pi pi-circle-fill" style="color: #ff6b6b"></i>
                      0-25%: Iniciante</span
                    >
                    <span
                      ><i class="pi pi-circle-fill" style="color: #ffd93d"></i>
                      26-50%: Básico</span
                    >
                    <span
                      ><i class="pi pi-circle-fill" style="color: #6bcf7f"></i>
                      51-75%: Intermediário</span
                    >
                    <span
                      ><i class="pi pi-circle-fill" style="color: #4d96ff"></i>
                      76-100%: Avançado</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-3 text-sm text-color-secondary">
              <i class="pi pi-info-circle mr-1"></i>
              Adicione linguagens de programação, frameworks e tecnologias que
              você domina
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
              @click="SalvaLinguagem"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="editaDialog"
          :style="{ width: '550px' }"
          :header="$t('Editar')"
          :modal="true"
          class="p-fluid create-language-dialog"
          @update:visible="getCancelUser"
        >
          <!-- Editar Informações da Linguagem -->
          <div class="field-group mb-4">
            <h6 class="field-group-title mb-3">
              <i class="pi pi-pencil mr-2"></i>
              Editar Linguagem/Tecnologia
            </h6>

            <div class="grid formgrid">
              <div class="col-12 mb-3">
                <label for="editName" class="form-label"
                  >Nome da Linguagem/Tecnologia *</label
                >
                <InputText
                  id="editName"
                  v-model.trim="linguagemEdit.name"
                  required="true"
                  class="w-full"
                  placeholder="Ex: JavaScript, Python, React..."
                />
              </div>

              <div class="col-12 mb-3">
                <label for="editKnowledge" class="form-label"
                  >Nível de Conhecimento (%) *</label
                >
                <div class="knowledge-input-container">
                  <InputNumber
                    id="editKnowledge"
                    v-model="linguagemEdit.knowledge"
                    required="true"
                    class="w-full"
                    :min="0"
                    :max="100"
                    placeholder="Digite um valor de 0 a 100"
                    suffix="%"
                  />
                </div>

                <!-- Progress bar visual -->
                <div
                  v-if="linguagemEdit.knowledge"
                  class="knowledge-progress mt-2"
                >
                  <div class="progress-bar-container">
                    <div
                      class="progress-bar"
                      :style="{
                        width: linguagemEdit.knowledge + '%',
                        backgroundColor: getKnowledgeColor(
                          linguagemEdit.knowledge
                        ),
                      }"
                    ></div>
                  </div>
                  <div class="progress-text text-sm text-center mt-1">
                    <strong>{{
                      getKnowledgeLevel(linguagemEdit.knowledge)
                    }}</strong>
                    - {{ linguagemEdit.knowledge }}%
                  </div>
                </div>

                <div class="knowledge-info mt-2">
                  <div
                    class="flex justify-content-between text-sm text-color-secondary"
                  >
                    <span
                      ><i class="pi pi-circle-fill" style="color: #ff6b6b"></i>
                      0-25%: Iniciante</span
                    >
                    <span
                      ><i class="pi pi-circle-fill" style="color: #ffd93d"></i>
                      26-50%: Básico</span
                    >
                    <span
                      ><i class="pi pi-circle-fill" style="color: #6bcf7f"></i>
                      51-75%: Intermediário</span
                    >
                    <span
                      ><i class="pi pi-circle-fill" style="color: #4d96ff"></i>
                      76-100%: Avançado</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <template #footer>
            <Button
              :label="$t('Cancelar')"
              icon="pi pi-times"
              class="p-button-secondary p-button-text"
              @click="getCancelUser"
            />
            <Button
              :label="$t('Salvar')"
              icon="pi pi-check"
              class="p-button-text"
              @click="EditaLinguagem"
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
}

/* Melhorias no Modal de Linguagens */
.create-language-dialog :deep(.p-dialog-content) {
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

.knowledge-input-container {
  position: relative;
}

.knowledge-info {
  background: var(--surface-card);
  border-radius: 6px;
  padding: 0.75rem;
  border: 1px solid var(--surface-border);
}

.knowledge-progress {
  background: var(--surface-card);
  border-radius: 6px;
  padding: 0.75rem;
  border: 1px solid var(--surface-border);
}

.progress-bar-container {
  background: var(--surface-border);
  border-radius: 10px;
  height: 8px;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 10px;
  position: relative;
}

.progress-text {
  color: var(--text-color);
  font-weight: 500;
}

/* Melhorias nos Input Fields */
.p-inputtext,
.create-language-dialog :deep(.p-inputnumber input) {
  transition: all 0.3s ease;
  border-radius: 6px;
}

.p-inputtext:focus,
.create-language-dialog :deep(.p-inputnumber input:focus) {
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
.create-language-dialog :deep(.p-dialog-footer) {
  padding: 1rem 1.5rem;
  background: var(--surface-ground);
  border-top: 1px solid var(--surface-border);
  gap: 0.75rem;
}

.create-language-dialog :deep(.p-dialog-footer .p-button) {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
}

/* Melhorias no InputNumber */
.create-language-dialog :deep(.p-inputnumber) {
  width: 100%;
}

.create-language-dialog :deep(.p-inputnumber .p-inputnumber-input) {
  width: 100%;
}

.create-language-dialog :deep(.p-inputnumber .p-inputnumber-button-group) {
  border-radius: 0 6px 6px 0;
}

/* Melhorias gerais no diálogo */
.create-language-dialog :deep(.p-dialog-header) {
  background: var(--surface-card);
  border-bottom: 1px solid var(--surface-border);
  padding: 1.25rem 1.5rem;
}

.create-language-dialog :deep(.p-dialog-title) {
  font-weight: 600;
  color: var(--text-color);
}

/* Animações */
@keyframes progressFill {
  from {
    width: 0%;
  }
}

.progress-bar {
  animation: progressFill 0.8s ease-out;
}

/* Responsividade para informações de conhecimento */
@media (max-width: 768px) {
  .knowledge-info .flex {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .knowledge-info .flex span {
    justify-content: center;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
}

/* Hover effects */
.knowledge-info:hover,
.knowledge-progress:hover {
  background: var(--surface-hover);
  transition: background-color 0.3s ease;
}
</style>
