<script>
import { RESTAPI } from '../../../service/api';
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { exportCSV } from '../../../utils/exportCsv';

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
            Linguagem: {
                admin: false
            },
            userLogin: '',
            dataUsers: [],
            selectedUser: [],
            gridColumns: computed(() => [
                { field: 'nome', caption: 'Nome Linguagem' },
                { field: 'tipo', caption: 'Tipo Linguagem' }
            ])

        };
    },
    created() {
        this.getUsers();
    },
    methods: {
        formatMessage(data){
            return data;
        },
        confirmDelete(edit) {
            this.product = edit;
            this.deleteDialog = true;
        },
        editaLinguagem(edit) {
            this.userLogin = edit;
            this.editaDialog = true;
        },
        openNew() {
            this.criarDialog = true;
        },
        getUsers() {
            RESTAPI.LinguagemObterTodos()
                .then((response) => {
                    this.dataUsers = response.data;
                })
                .catch(() => {
                    this.toast.add({ severity: 'error', summary: $t('SummarioToastError'), detail: $t('ErroObterDadosGenerico'), life: 3000 });
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
        SalvaLinguagem() {
            RESTAPI.LinguagemCriar(this.Linguagem)
                .then(() => {
                    this.getUsers();
                    this.criarDialog = false;
                    this.toast.add({ severity: 'success', summary: $t('SummarioToastSucesso'), detail: $t('LinguagemToastCreate'), life: 3000 });
                    this.Linguagem = { admin: false };
                })
                .catch(() => {
                    this.toast.add({ severity: 'error', summary: $t('SummarioToastError'), detail: $t('LinguagemToastCreateError'), life: 3000 });
                });
        },
        EditaLinguagem() {
            RESTAPI.LinguagemEditar(this.userLogin)
                .then(() => {
                    this.getUsers();
                    this.editaDialog = false;
                    this.toast.add({ severity: 'success', summary: $t('SummarioToastSucesso'), detail: $t('LinguagemToastEdit'), life: 3000 });
                })
                .catch(() => {
                    this.toast.add({ severity: 'error', summary: $t('SummarioToastError'), detail: $t('LinguagemToastEditError'), life: 3000 });
                });
        },
        deleteUser() {
            RESTAPI.LinguagemExcluir(this.product.id)
                .then(() => {
                    this.dataUsers = this.dataUsers.filter((u) => u.id !== this.product.id);
                    this.deleteDialog = false;
                    this.toast.add({ severity: 'success', summary: $t('SummarioToastSucesso'), detail: $t('LinguagemToastDelete'), life: 3000 });
                })
                .catch(() => {
                    this.toast.add({ severity: 'error', summary: $t('SummarioToastError'), detail: $t('LinguagemToastDeleteError'), life: 3000 });
                });
        },
        confirmDeleteAll(edit) {
            this.accounts = edit;
            this.deleteAllDialog = true;
        },
        deleteAll() {
            if (this.selectedUser.length === 0) {
                this.toast.add({ severity: 'warn', summary: $t('SummarioToastWarn'), detail: $t('NenhumaLinhaSelecionada'), life: 3000 });
                return;
            }

            this.selectedUser.forEach((user) => {
                RESTAPI.LinguagemExcluir(user.id)
                    .then(() => {
                        this.dataUsers = this.dataUsers.filter((u) => u.id !== user.id);
                        this.toast.add({ severity: 'success', summary: $t('SummarioToastSucesso'), detail: $t('LinguagemToastDelete'), life: 3000 });
                    })
                    .catch(() => {
                        this.toast.add({ severity: 'error', summary: $t('SummarioToastError'), detail: $t('LinguagemToastDeleteError'), life: 3000 });
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
        <h5 class="p-card-title">{{ $t('Linguagens') }}</h5>
        <div id="data-grid-demo">
            <div v-if="dataUsers.length < 0">Carregando...</div>
            <div v-else>
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button :label="$t('Novo')" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <Button :label="$t('Deletar')" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteAll" :disabled="selectedUser.length === 0" />
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
                    scrollable
                    scrollHeight="50vh"
                    class="table-container"
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
                            <Button v-tooltip="$t('Editar')" icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editaLinguagem(slotProps.data)" />
                            <Button v-tooltip="$t('Excluir')" icon="pi pi-trash" class="p-button-rounded p-button-danger mt-2" @click="confirmDelete(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog class="dialog-component" v-model:visible="deleteDialog" :style="{ width: '450px' }" :header="$t('Excluir')" :modal="true">
                    <div class="flex align-items-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product"
                            >{{ $t('Excluir') }} <b>{{ product.login }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button :label="$t('Cancelar')" icon="pi pi-times" class="p-button-secondary p-button-text" @click="deleteDialog = false" />
                        <Button :label="$t('Sim')" icon="pi pi-check" class="p-button-text" @click="deleteUser" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteAllDialog" :header="$t('Excluir')" :modal="true" :style="{ width: '450px' }">
                    <div class="flex align-items-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product"
                            >{{ $t('Excluir') }} <b>{{ this.selectedUser.length }} {{ $t('Linguagem') }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button :label="$t('Cancelar')" icon="pi pi-times" class="p-button-secondary p-button-text" @click="deleteAllDialog = false" />
                        <Button :label="$t('Sim')" icon="pi pi-check" class="p-button-text" @click="deleteAll" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="criarDialog" :style="{ width: '450px' }" :header="$t('Criar')" :modal="true" class="p-fluid">
                    <div class="row flex">
                        <div class="field col">
                            <FloatLabel>
                                <InputText id="name" v-model.trim="Linguagem.nome" required="true" />
                                <label for="name">{{ $t('Nome') }}</label>
                            </FloatLabel>
                        </div>
                        <div class="field col">
                            <FloatLabel>
                                <InputText id="email" v-model="Linguagem.email" required="true" />
                                <label for="email">{{ $t('Email') }}</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div class="row flex">
                        <div class="field col">
                            <FloatLabel>
                                <InputText id="login" v-model="Linguagem.login" required="true" />
                                <label for="login">{{ $t('Login') }}</label>
                            </FloatLabel>
                        </div>
                        <div class="field col">
                            <FloatLabel>
                                <InputText type="password" id="senha" v-model="Linguagem.senha" required="true" />
                                <label for="senha">{{ $t('Senha') }}</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div class="field-checkbox mb-0">
                        <input type="checkbox" id="admin" v-model="Linguagem.admin" />
                        <label for="admin">{{ $t('Administrador') }}</label>
                    </div>

                    <template #footer>
                        <Button :label="$t('Cancelar')" icon="pi pi-times" class="p-button-secondary p-button-text" @click="criarDialog = false" />
                        <Button :label="$t('Salvar')" icon="pi pi-check" class="p-button-text" @click="SalvaLinguagem" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="editaDialog" :style="{ width: '450px' }" :header="$t('Editar')" :modal="true" class="p-fluid" @update:visible="getCancelUser">
                    <div class="row flex">
                        <div class="field col">
                            <FloatLabel>
                                <InputText id="name" v-model.trim="userLogin.nome" required="true" />
                                <label for="name">{{ $t('Nome') }}</label>
                            </FloatLabel>
                        </div>
                        <div class="field col">
                            <FloatLabel>
                                <InputText id="email" v-model="userLogin.email" required="true" />
                                <label for="email">{{ $t('Email') }}</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div class="row flex">
                        <div class="field col">
                            <FloatLabel>
                                <InputText id="login" v-model="userLogin.login" required="true" />
                                <label for="login">{{ $t('Login') }}</label>
                            </FloatLabel>
                        </div>
                        <div class="field col">
                            <FloatLabel>
                                <InputText type="password" id="senha" v-model="userLogin.senha" required="true" />
                                <label for="senha">{{ $t('Senha') }}</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div class="field-checkbox mb-0">
                        <input type="checkbox" id="admin" v-model="userLogin.admin" />
                        <label for="admin">{{ $t('Administrador') }}</label>
                    </div>
                    <div class="field-checkbox mb-0">
                        <input type="checkbox" id="ativo" v-model="userLogin.ativo" />
                        <label for="ativo">{{ $t('Ativo') }}</label>
                    </div>

                    <template #footer>
                        <Button :label="$t('Cancelar')" icon="pi pi-times" class="p-button-secondary p-button-text" @click="getCancelUser" />
                        <Button :label="$t('Salvar')" icon="pi pi-check" class="p-button-text" @click="EditaLinguagem" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style>
.card {
    aspect-ratio: unset;
}
.table-container {
    gap: 10px;
    display: flex;
    flex-direction: column;
}
</style>
