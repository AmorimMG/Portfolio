<script setup>
import { useToast } from "primevue/usetoast";
import { computed, onMounted, ref } from "vue";
import { RESTAPI } from "../../../service/api";
import { getUserCookie } from "../../../service/session";
import { exportCSV } from "../../../utils/exportCsv";

const deleteDialog = ref(false);
const deleteAllDialog = ref(false);
const criarDialog = ref(false);
const dt = ref();
const editaDialog = ref(false);
const toast = useToast();
const product = ref({});
const usuario = ref({ admin: false });
const userLogin = ref("");
const dataUsers = ref([]);
const selectedUser = ref([]);
const userCookie = ref(getUserCookie());

const gridColumns = computed(() => [
  { field: "_id", caption: "id" },
  { field: "usuario", caption: "Usuario" },
  { field: "email", caption: "Email" },
]);

onMounted(() => {
  getUsers();
  console.log(userCookie.value);
});

function confirmDelete(edit) {
  product.value = edit;
  deleteDialog.value = true;
}

function editaUsuario(edit) {
  userLogin.value = edit;
  editaDialog.value = true;
}

function openNew() {
  criarDialog.value = true;
}

function getUsers() {
  //Busca do Mongodb
  RESTAPI.UsuarioObterTodos()
    .then((response) => {
      dataUsers.value = response.data;
    })
    .catch(() => {
      toast.add({
        severity: "error",
        summary: $t("SummarioToastError"),
        detail: $t("ErroObterDadosGenerico"),
        life: 3000,
      });
    });
}

function getCancelUser() {
  editaDialog.value = false;
  getUsers();
}

function handleExportCSV() {
  exportCSV(dataUsers.value);
}

function editUser(user) {
  userLogin.value = user.login;
}

function SalvaUsuario() {
  RESTAPI.UsuarioCriar(usuario.value)
    .then(() => {
      getUsers();
      criarDialog.value = false;
      toast.add({
        severity: "success",
        summary: $t("SummarioToastSucesso"),
        detail: $t("UsuarioToastCreate"),
        life: 3000,
      });
      usuario.value = { admin: false };
    })
    .catch(() => {
      toast.add({
        severity: "error",
        summary: $t("SummarioToastError"),
        detail: $t("UsuarioToastCreateError"),
        life: 3000,
      });
    });
  /*
createUserWithEmailAndPassword(auth, usuario.value.email, usuario.value.password)
   .then((userCredential) => {
       // Signed in
       const user = userCredential.user;
       console.log(user);
       // ...
   })
   .catch((error) => {
       const errorCode = error.code;
       const errorMessage = error.message;
       console.log(errorCode, errorMessage);
       // ..
   }); */

  /* 	addDatabase("projetos", usuario.value)
            .then((res) => {
                console.log(usuario.value);
                console.log(res);
            })
            .catch((error) => {
                console.error("Error adding user: ", error);
            }); */
}

function EditaUsuario() {
  RESTAPI.UsuarioEditar(userLogin.value)
    .then(() => {
      getUsers();
      editaDialog.value = false;
      toast.add({
        severity: "success",
        summary: $t("SummarioToastSucesso"),
        detail: $t("UsuarioToastEdit"),
        life: 3000,
      });
    })
    .catch(() => {
      toast.add({
        severity: "error",
        summary: $t("SummarioToastError"),
        detail: $t("UsuarioToastEditError"),
        life: 3000,
      });
    });
}

function deleteUser() {
  RESTAPI.UsuarioExcluir(product.value._id)
    .then(() => {
      dataUsers.value = dataUsers.value.filter(
        (u) => u.id !== product.value._id
      );
      deleteDialog.value = false;
      toast.add({
        severity: "success",
        summary: $t("SummarioToastSucesso"),
        detail: $t("UsuarioToastDelete"),
        life: 3000,
      });
    })
    .catch(() => {
      toast.add({
        severity: "error",
        summary: $t("SummarioToastError"),
        detail: $t("UsuarioToastDeleteError"),
        life: 3000,
      });
    });
}

function confirmDeleteAll(edit) {
  selectedUser.value = edit;
  deleteAllDialog.value = true;
}

function deleteAll() {
  if (selectedUser?.value?.length === 0) {
    toast.add({
      severity: "warn",
      summary: $t("SummarioToastWarn"),
      detail: $t("NenhumaLinhaSelecionada"),
      life: 3000,
    });
    return;
  }

  selectedUser.value.forEach((user) => {
    RESTAPI.UsuarioExcluir(user._id)
      .then(() => {
        dataUsers.value = dataUsers.value.filter((u) => u._id !== user._id);
        toast.add({
          severity: "success",
          summary: $t("SummarioToastSucesso"),
          detail: $t("UsuarioToastDelete"),
          life: 3000,
        });
      })
      .catch(() => {
        toast.add({
          severity: "error",
          summary: $t("SummarioToastError"),
          detail: $t("UsuarioToastDeleteError"),
          life: 3000,
        });
      });
  });
  deleteAllDialog.value = false;
  selectedUser.value = [];
}
</script>

<template>
  <div class="card">
    <h5 class="p-card-title">Usuarios</h5>
    <div id="data-grid-demo">
      <div v-if="dataUsers?.length < 0">Carregando...</div>
      <div v-else>
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button
                label="Novo"
                icon="pi pi-plus"
                class="p-button-success mr-2"
                @click="openNew"
              />
              <Button
                label="Deletar"
                icon="pi pi-trash"
                class="p-button-danger"
                @click="confirmDeleteAll"
                :disabled="selectedUser?.length === 0"
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
          class="table-container"
          ref="dt"
          v-model:selection="selectedUser"
          :value="dataUsers"
          dataKey="id"
          :paginator="true"
          :rows="10"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          responsiveLayout="scroll"
          scrollable
          scrollHeight="50vh"
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
                v-tooltip="'Editar'"
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="editaUsuario(slotProps.data)"
              />
              <Button
                :disabled="slotProps.data?._id === userCookie?._id"
                v-tooltip="'Excluir'"
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
              >{{ $t("Excluir") }} <b>{{ product.usuario }}</b
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
              <b>{{ this.selectedUser?.length }} {{ $t("Usuarios") }}</b
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
          class="p-fluid create-user-dialog"
        >
          <!-- Informações do Usuário -->
          <div class="field-group mb-4">
            <h6 class="field-group-title mb-3">
              <i class="pi pi-user mr-2"></i>
              Dados do Usuário
            </h6>

            <div class="grid formgrid">
              <div class="col-12 mb-3">
                <label for="usuario" class="form-label"
                  >Nome de Usuário *</label
                >
                <InputText
                  id="usuario"
                  v-model.trim="usuario.usuario"
                  placeholder="Digite o nome de usuário"
                  required="true"
                  autofocus
                  class="w-full"
                />
              </div>

              <div class="col-12 md:col-6 mb-3">
                <label for="email" class="form-label">Email *</label>
                <InputText
                  id="email"
                  v-model="usuario.email"
                  type="email"
                  placeholder="usuario@exemplo.com"
                  required="true"
                  class="w-full"
                />
              </div>

              <div class="col-12 md:col-6 mb-3">
                <label for="password" class="form-label">Senha *</label>
                <Password
                  id="password"
                  v-model="usuario.password"
                  placeholder="Digite uma senha"
                  required="true"
                  class="w-full"
                  toggleMask
                  :feedback="false"
                />
              </div>
            </div>

            <div class="mt-3 text-sm text-color-secondary">
              <i class="pi pi-info-circle mr-1"></i>
              Certifique-se de usar um email válido e uma senha segura
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
              @click="SalvaUsuario"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="editaDialog"
          :style="{ width: '600px' }"
          :header="$t('Editar')"
          :modal="true"
          class="p-fluid create-user-dialog"
          @update:visible="getCancelUser"
        >
          <!-- Editar Informações do Usuário -->
          <div class="field-group mb-4">
            <h6 class="field-group-title mb-3">
              <i class="pi pi-pencil mr-2"></i>
              Editar Dados do Usuário
            </h6>

            <div class="grid formgrid">
              <div class="col-12 mb-3">
                <label for="editUsuario" class="form-label"
                  >Nome de Usuário *</label
                >
                <InputText
                  id="editUsuario"
                  v-model.trim="userLogin.usuario"
                  required="true"
                  class="w-full"
                  placeholder="Digite o nome de usuário"
                />
              </div>

              <div class="col-12 md:col-6 mb-3">
                <label for="editEmail" class="form-label">Email *</label>
                <InputText
                  id="editEmail"
                  v-model="userLogin.login"
                  type="email"
                  required="true"
                  class="w-full"
                  placeholder="usuario@exemplo.com"
                />
              </div>

              <div class="col-12 md:col-6 mb-3">
                <label for="editPassword" class="form-label">Nova Senha</label>
                <Password
                  id="editPassword"
                  v-model="userLogin.password"
                  placeholder="Digite uma nova senha (opcional)"
                  class="w-full"
                  toggleMask
                  :feedback="false"
                />
              </div>

              <div class="col-12 mb-3">
                <div
                  class="field-checkbox-container p-3 border-round surface-border border-1"
                >
                  <div class="flex align-items-center">
                    <Checkbox
                      id="ativo"
                      v-model="userLogin.ativo"
                      :binary="true"
                    />
                    <label for="ativo" class="ml-2 font-medium">
                      <i class="pi pi-check-circle mr-1"></i>
                      {{ $t("Usuário Ativo") }}
                    </label>
                  </div>
                  <small class="text-color-secondary mt-1 block">
                    Desmarque para desativar o acesso do usuário ao sistema
                  </small>
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
              @click="EditaUsuario"
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

/* Melhorias no Modal de Usuários */
.create-user-dialog :deep(.p-dialog-content) {
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

.field-checkbox-container {
  background: var(--surface-card);
  transition: all 0.3s ease;
}

.field-checkbox-container:hover {
  background: var(--surface-hover);
}

/* Melhorias nos Input Fields */
.p-inputtext,
.create-user-dialog :deep(.p-password input) {
  transition: all 0.3s ease;
  border-radius: 6px;
}

.p-inputtext:focus,
.create-user-dialog :deep(.p-password input:focus) {
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
.create-user-dialog :deep(.p-dialog-footer) {
  padding: 1rem 1.5rem;
  background: var(--surface-ground);
  border-top: 1px solid var(--surface-border);
  gap: 0.75rem;
}

.create-user-dialog :deep(.p-dialog-footer .p-button) {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
}

/* Melhorias no campo de senha */
.create-user-dialog :deep(.p-password) {
  width: 100%;
}

.create-user-dialog :deep(.p-password .p-inputtext) {
  width: 100%;
}

/* Melhorias gerais no diálogo */
.create-user-dialog :deep(.p-dialog-header) {
  background: var(--surface-card);
  border-bottom: 1px solid var(--surface-border);
  padding: 1.25rem 1.5rem;
}

.create-user-dialog :deep(.p-dialog-title) {
  font-weight: 600;
  color: var(--text-color);
}

/* Checkbox melhorado */
.create-user-dialog :deep(.p-checkbox) {
  margin-right: 0.5rem;
}

.create-user-dialog :deep(.p-checkbox .p-checkbox-box) {
  border-radius: 4px;
  transition: all 0.3s ease;
}

.create-user-dialog
  :deep(.p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box:hover) {
  border-color: var(--primary-color);
}

.create-user-dialog
  :deep(.p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight) {
  background: var(--primary-color);
  border-color: var(--primary-color);
}
</style>
