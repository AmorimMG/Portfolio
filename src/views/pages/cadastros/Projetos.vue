<script>
import { RESTAPI } from '../../../service/api';
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { exportCSV } from '../../../utils/exportCsv';
import { getUserCookie } from '../../../service/session';

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
            usuario: {
                admin: false
            },
            userLogin: '',
            dataUsers: [],
            selectedUser: [],
            gridColumns: computed(() => [
                { field: 'id', caption: 'ID' },
                { field: 'usuario', caption: 'Usuario' },
                { field: 'email', caption: 'Email' },
            ]),
            userCookie: getUserCookie(),

        };
    },
    created() {
        this.getUsers();
        console.log(this.userCookie);
    },
    methods: {
        formatMessage(data){
            return data;
        },
        confirmDelete(edit) {
            this.product = edit;
            this.deleteDialog = true;
        },
        editaUsuario(edit) {
            this.userLogin = edit;
            this.editaDialog = true;
        },
        openNew() {
            this.criarDialog = true;
        },
        getUsers() {
            RESTAPI.UsuarioObterTodos()
                .then((response) => {
                    this.dataUsers = response.data;
                })
                .catch(() => {
                    this.toast.add({ severity: 'error', summary: this.formatMessage('gblSummarioToastError'), detail: this.formatMessage('gblErroObterDadosGenerico'), life: 3000 });
                });
        },
        getCancelUser() {
            this.editaDialog = false;
            this.getUsers();
        },
        handleExportCSV() {
            exportCSV(this.dataUsers);
        },
        editUser(user) {
            this.userLogin = user.login;
        },
        SalvaUsuario() {
            RESTAPI.UsuarioCriar(this.usuario)
                .then(() => {
                    this.getUsers();
                    this.criarDialog = false;
                    this.toast.add({ severity: 'success', summary: this.formatMessage('gblSummarioToastSucesso'), detail: this.formatMessage('gblUsuarioToastCreate'), life: 3000 });
                    this.usuario = { admin: false };
                })
                .catch(() => {
                    this.toast.add({ severity: 'error', summary: this.formatMessage('gblSummarioToastError'), detail: this.formatMessage('gblUsuarioToastCreateError'), life: 3000 });
                });
        },
        EditaUsuario() {
            RESTAPI.UsuarioEditar(this.userLogin)
                .then(() => {
                    this.getUsers();
                    this.editaDialog = false;
                    this.toast.add({ severity: 'success', summary: this.formatMessage('gblSummarioToastSucesso'), detail: this.formatMessage('gblUsuarioToastEdit'), life: 3000 });
                })
                .catch(() => {
                    this.toast.add({ severity: 'error', summary: this.formatMessage('gblSummarioToastError'), detail: this.formatMessage('gblUsuarioToastEditError'), life: 3000 });
                });
        },
        deleteUser() {
            RESTAPI.UsuarioExcluir(this.product.id)
                .then(() => {
                    this.dataUsers = this.dataUsers.filter((u) => u.id !== this.product.id);
                    this.deleteDialog = false;
                    this.toast.add({ severity: 'success', summary: this.formatMessage('gblSummarioToastSucesso'), detail: this.formatMessage('gblUsuarioToastDelete'), life: 3000 });
                })
                .catch(() => {
                    this.toast.add({ severity: 'error', summary: this.formatMessage('gblSummarioToastError'), detail: this.formatMessage('gblUsuarioToastDeleteError'), life: 3000 });
                });
        },
        confirmDeleteAll(edit) {
            this.accounts = edit;
            this.deleteAllDialog = true;
        },
        deleteAll() {
            if (this.selectedUser.length === 0) {
                this.toast.add({ severity: 'warn', summary: this.formatMessage('gblSummarioToastWarn'), detail: this.formatMessage('gblNenhumaLinhaSelecionada'), life: 3000 });
                return;
            }

            this.selectedUser.forEach((user) => {
                RESTAPI.UsuarioExcluir(user.id)
                    .then(() => {
                        this.dataUsers = this.dataUsers.filter((u) => u.id !== user.id);
                        this.toast.add({ severity: 'success', summary: this.formatMessage('gblSummarioToastSucesso'), detail: this.formatMessage('gblUsuarioToastDelete'), life: 3000 });
                    })
                    .catch(() => {
                        this.toast.add({ severity: 'error', summary: this.formatMessage('gblSummarioToastError'), detail: this.formatMessage('gblUsuarioToastDeleteError'), life: 3000 });
                    });
            });
            this.deleteAllDialog = false;
            this.selectedUser = [];
        },
        close() {
            this.display = false;
        },
    }
};
</script>

<template>
    <div class="card">
        <h5 class="p-card-title">Usuarios</h5>
        <div id="data-grid-demo">
            <div v-if="dataUsers.length < 0">Carregando...</div>
            <div v-else>
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Novo" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <Button label="Deletar" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteAll" :disabled="selectedUser.length === 0" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <Button label="Exportar" icon="pi pi-upload" class="p-button-help" @click="handleExportCSV()" />
                    </template>
                </Toolbar>
                <DataTable
                    ref="dt"
                    v-model:selection="selectedUser"
                    :value="dataUsers"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    responsiveLayout="scroll"
                >
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column v-for="column in gridColumns" :key="column.field" :field="column.field" :header="column.caption" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">{{ column.caption }}</span>
                            <template v-if="column.field === 'ativo' || column.field === 'admin'">
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
                            <Button v-tooltip="'Editar'" icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editaUsuario(slotProps.data)" />
                            <Button :disabled="slotProps.data?.id === this.userCookie?.id" v-tooltip="'Excluir'" icon="pi pi-trash" class="p-button-rounded p-button-danger mt-2" @click="confirmDelete(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog class="dialog-component" v-model:visible="deleteDialog" :style="{ width: '450px' }" :header="this.formatMessage('gblExcluir')" :modal="true">
                    <div class="flex align-items-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product"
                            >{{ this.formatMessage('gblExcluir') }} <b>{{ product.login }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button :label="this.formatMessage('gblCancelar')" icon="pi pi-times" class="p-button-secondary p-button-text" @click="deleteDialog = false" />
                        <Button :label="this.formatMessage('gblSim')" icon="pi pi-check" class="p-button-text" @click="deleteUser" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteAllDialog" :header="this.formatMessage('gblExcluir')" :modal="true" :style="{ width: '450px' }">
                    <div class="flex align-items-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product"
                            >{{ this.formatMessage('gblExcluir') }} <b>{{ this.selectedUser.length }} {{ this.formatMessage('gblUsuarios') }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button :label="this.formatMessage('gblCancelar')" icon="pi pi-times" class="p-button-secondary p-button-text" @click="deleteAllDialog = false" />
                        <Button :label="this.formatMessage('gblSim')" icon="pi pi-check" class="p-button-text" @click="deleteAll" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="criarDialog" :style="{ width: '450px' }" :header="this.formatMessage('gblCriar')" :modal="true" class="p-fluid">
                    <div class="row flex">
                        <div class="field col">
                            <FloatLabel>
                                <InputText id="name" v-model.trim="usuario.nome" required="true" />
                                <label for="name">{{ this.formatMessage('gblNome') }}</label>
                            </FloatLabel>
                        </div>
                        <div class="field col">
                            <FloatLabel>
                                <InputText id="email" v-model="usuario.email" required="true" />
                                <label for="email">{{ this.formatMessage('gblEmail') }}</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div class="row flex">
                        <div class="field col">
                            <FloatLabel>
                                <InputText id="login" v-model="usuario.login" required="true" />
                                <label for="login">{{ this.formatMessage('gblLogin') }}</label>
                            </FloatLabel>
                        </div>
                        <div class="field col">
                            <FloatLabel>
                                <InputText type="password" id="senha" v-model="usuario.senha" required="true" />
                                <label for="senha">{{ this.formatMessage('gblSenha') }}</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div class="field-checkbox mb-0">
                        <input type="checkbox" id="admin" v-model="usuario.admin" />
                        <label for="admin">{{ this.formatMessage('gblAdministrador') }}</label>
                    </div>

                    <template #footer>
                        <Button :label="this.formatMessage('gblCancelar')" icon="pi pi-times" class="p-button-secondary p-button-text" @click="criarDialog = false" />
                        <Button :label="this.formatMessage('gblSalvar')" icon="pi pi-check" class="p-button-text" @click="SalvaUsuario" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="editaDialog" :style="{ width: '450px' }" :header="this.formatMessage('gblEditar')" :modal="true" class="p-fluid" @update:visible="getCancelUser">
                    <div class="row flex">
                        <div class="field col">
                            <FloatLabel>
                                <InputText id="name" v-model.trim="userLogin.nome" required="true" />
                                <label for="name">{{ this.formatMessage('gblNome') }}</label>
                            </FloatLabel>
                        </div>
                        <div class="field col">
                            <FloatLabel>
                                <InputText id="email" v-model="userLogin.email" required="true" />
                                <label for="email">{{ this.formatMessage('gblEmail') }}</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div class="row flex">
                        <div class="field col">
                            <FloatLabel>
                                <InputText id="login" v-model="userLogin.login" required="true" />
                                <label for="login">{{ this.formatMessage('gblLogin') }}</label>
                            </FloatLabel>
                        </div>
                        <div class="field col">
                            <FloatLabel>
                                <InputText type="password" id="senha" v-model="userLogin.senha" required="true" />
                                <label for="senha">{{ this.formatMessage('gblSenha') }}</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div class="field-checkbox mb-0">
                        <input type="checkbox" id="admin" v-model="userLogin.admin" />
                        <label for="admin">{{ this.formatMessage('gblAdministrador') }}</label>
                    </div>
                    <div class="field-checkbox mb-0">
                        <input type="checkbox" id="ativo" v-model="userLogin.ativo" />
                        <label for="ativo">{{ this.formatMessage('gblAtivo') }}</label>
                    </div>

                    <template #footer>
                        <Button :label="this.formatMessage('gblCancelar')" icon="pi pi-times" class="p-button-secondary p-button-text" @click="getCancelUser" />
                        <Button :label="this.formatMessage('gblSalvar')" icon="pi pi-check" class="p-button-text" @click="EditaUsuario" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style></style>
