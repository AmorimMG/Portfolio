<script>
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';
import { RESTAPI } from '../../../service/api';
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
            projeto: ref({ img: '' }),
            editProject: '',
            dataUsers: [],
            selectedUser: [],
            languages: ref([]),
            file: ref(),
            selectedLanguageNames: computed(() => {
                return this.projeto.languages.map((language) => language.nome);
            }),
            gridColumns: computed(() => [
                { field: 'languages', caption: 'Linguas' },
                { field: 'title', caption: 'Titulo' },
                { field: 'subtitle', caption: 'Subtitulo' },
                { field: 'description', caption: 'Descrição' },
                { field: 'img', caption: 'Imagem' },
                { field: 'link', caption: 'Link' }
            ])
        };
    },
    created() {
        this.getUsers();
        this.getLanguages();
    },
    methods: {
        formatMessage(data) {
            return data;
        },
        confirmDelete(edit) {
            this.product = edit;
            this.deleteDialog = true;
        },
        editaProjeto(edit) {
            this.editProject = edit;
            this.editaDialog = true;
        },
        openNew() {
            this.criarDialog = true;
        },
        getUsers() {
            RESTAPI.ProjetoObterTodos()
                .then((response) => {
                    this.dataUsers = response.data;
                })
                .catch(() => {
                    this.toast.add({
                        severity: 'error',
                        summary: $t('SummarioToastError'),
                        detail: $t('ErroObterDadosGenerico'),
                        life: 3000
                    });
                });
        },
        getLanguages() {
            RESTAPI.LinguagemObterTodos()
                .then((response) => {
                    this.languages = response.data;
                })
                .catch(() => {
                    this.toast.add({
                        severity: 'error',
                        summary: $t('SummarioToastError'),
                        detail: $t('ErroObterDadosGenerico'),
                        life: 3000
                    });
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
            this.editProject = user.login;
        },
        SalvaProjeto() {
            const formData = new FormData();
            formData.append('title', this.projeto.title);
            formData.append('subtitle', this.projeto.subtitle);
            formData.append('link', this.projeto.link);
            formData.append('description', this.projeto.description);
            formData.append('languages', JSON.stringify(this.selectedLanguageNames));

            if (this.file) {
                formData.append('file', this.file);
            }

            RESTAPI.ProjetoCriar(formData)
                .then(() => {
                    this.getUsers();
                    this.toast.add({
                        severity: 'success',
                        summary: $t('SummarioToastSucesso'),
                        detail: $t('ProjetoToastCreate'),
                        life: 3000
                    });
                    this.projeto = { admin: false };
                })
                .catch(() => {
                    this.toast.add({
                        severity: 'error',
                        summary: $t('SummarioToastError'),
                        detail: $t('ProjetoToastCreateError'),
                        life: 3000
                    });
                })
                .finally(() => {
                    this.projeto = { title: '', subtitle: '', link: '', description: '' };
                    this.criarDialog = false;
                });
        },

        EditaProjeto() {
            const dataToSend = { ...this.editProject, languages: this.selectedLanguageNames };
            RESTAPI.ProjetoEditar(dataToSend)
                .then(() => {
                    this.getUsers();
                    this.editaDialog = false;
                    this.toast.add({
                        severity: 'success',
                        summary: $t('SummarioToastSucesso'),
                        detail: $t('ProjetoToastEdit'),
                        life: 3000
                    });
                })
                .catch(() => {
                    this.toast.add({
                        severity: 'error',
                        summary: $t('SummarioToastError'),
                        detail: $t('ProjetoToastEditError'),
                        life: 3000
                    });
                });
        },
        deleteUser() {
            RESTAPI.ProjetoExcluir(this.product._id)
                .then(() => {
                    this.dataUsers = this.dataUsers.filter((u) => u._id !== this.product._id);
                    this.deleteDialog = false;
                    this.toast.add({
                        severity: 'success',
                        summary: $t('SummarioToastSucesso'),
                        detail: $t('ProjetoToastDelete'),
                        life: 3000
                    });
                })
                .catch(() => {
                    this.toast.add({
                        severity: 'error',
                        summary: $t('SummarioToastError'),
                        detail: $t('ProjetoToastDeleteError'),
                        life: 3000
                    });
                });
        },
        confirmDeleteAll(edit) {
            this.accounts = edit;
            this.deleteAllDialog = true;
        },
        deleteAll() {
            if (this.selectedUser.length === 0) {
                this.toast.add({
                    severity: 'warn',
                    summary: $t('SummarioToastWarn'),
                    detail: $t('NenhumaLinhaSelecionada'),
                    life: 3000
                });
                return;
            }

            this.selectedUser.forEach((user) => {
                RESTAPI.ProjetoExcluir(user._id)
                    .then(() => {
                        this.dataUsers = this.dataUsers.filter((u) => u._id !== user._id);
                        this.toast.add({
                            severity: 'success',
                            summary: $t('SummarioToastSucesso'),
                            detail: $t('ProjetoToastDelete'),
                            life: 3000
                        });
                    })
                    .catch(() => {
                        this.toast.add({
                            severity: 'error',
                            summary: $t('SummarioToastError'),
                            detail: $t('ProjetoToastDeleteError'),
                            life: 3000
                        });
                    });
            });
            this.deleteAllDialog = false;
            this.selectedUser = [];
        },
        onFileSelect(event) {
            const file = event.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const binaryData = e.target.result; // This is already a Base64 string
                    const blob = new Blob([binaryData], { type: file.type });
                    console.log(blob);
                    this.file = blob;
                };
                reader.readAsArrayBuffer(file);
            }
        },
        close() {
            this.display = false;
        }
    }
};
</script>

<template>
    <div class="card">
        <h5 class="p-card-title">Projetos</h5>
        <div id="data-grid-demo">
            <div v-if="dataUsers.length < 0">Carregando...</div>
            <div v-else>
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Novo" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <Button label="Deletar" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteAll"
                                :disabled="selectedUser.length === 0" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <Button label="Exportar" icon="pi pi-upload" class="p-button-help" @click="handleExportCSV()" />
                    </template>
                </Toolbar>
                <DataTable ref="dt" v-model:selection="selectedUser" :value="dataUsers" dataKey="_id" :paginator="true"
                    :rows="10" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]" responsiveLayout="scroll" scrollable scrollHeight="50vh"
                    class="table-container">
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column v-for="column in gridColumns" :key="column.field" :field="column.field"
                        :header="column.caption" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
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
                            <Button v-tooltip="'Editar'" icon="pi pi-pencil"
                                class="p-button-rounded p-button-success mr-2" @click="editaProjeto(slotProps.data)" />
                            <Button v-tooltip="'Excluir'" icon="pi pi-trash"
                                class="p-button-rounded p-button-danger mt-2" @click="confirmDelete(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog class="dialog-component" v-model:visible="deleteDialog" :style="{ width: '450px' }"
                    :header="$t('Excluir')" :modal="true">
                    <div class="flex items-center">
                        <i class="pi pi-exclamation-triangle mr-3 p-large" />
                        <span v-if="product">{{ $t('Excluir') }} <b>{{ product.title }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button :label="$t('Cancelar')" icon="pi pi-times" class="p-button-secondary p-button-text"
                            @click="deleteDialog = false" />
                        <Button :label="$t('Sim')" icon="pi pi-check" class="p-button-text" @click="deleteUser" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteAllDialog" :header="$t('Excluir')" :modal="true"
                    :style="{ width: '450px' }">
                    <div class="flex items-center">
                        <i class="pi pi-exclamation-triangle mr-3 p-large" />
                        <span v-if="product">{{ $t('Excluir') }} <b>{{ this.selectedUser.length }} {{ $t('Projetos')
                                }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button :label="$t('Cancelar')" icon="pi pi-times" class="p-button-secondary p-button-text"
                            @click="deleteAllDialog = false" />
                        <Button :label="$t('Sim')" icon="pi pi-check" class="p-button-text" @click="deleteAll" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="criarDialog" :style="{ width: '450px' }" :header="$t('Criar')" :modal="true"
                    class="p-fluid">
                    <div class="row flex">
                        <div class="field col">
                            <FloatLabel>
                                <InputText id="titulo" v-model.trim="projeto.title" required="true" />
                                <label for="titulo">{{ $t('Titulo') }}</label>
                            </FloatLabel>
                        </div>
                        <div class="field col">
                            <FloatLabel>
                                <InputText id="subtitulo" v-model="projeto.subtitle" required="true" />
                                <label for="subtitulo">{{ $t('SubTitulo') }}</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div class="row flex">
                        <div class="field col-span-6">
                            <FloatLabel>
                                <InputText id="link" v-model="projeto.link" required="true" />
                                <label for="link">{{ $t('Link') }}</label>
                            </FloatLabel>
                        </div>
                        <div class="field col-span-6">
                            <FloatLabel>
                                <FileUpload mode="basic" accept="image/*" chooseLabel="Choose Image"
                                    @select="onFileSelect" />
                                <!--                                 <InputText id="imagem" v-model="projeto.img" required />
                                <label for="imagem">{{ $t('imagem') }}</label> -->
                            </FloatLabel>
                        </div>
                    </div>
                    <div class="row flex">
                        <div class="field col">
                            <FloatLabel>
                                <MultiSelect v-model="projeto.languages" :options="languages" filter optionLabel="nome"
                                    placeholder="Select Languages" :maxSelectedLabels="3" class="w-full"
                                    required="true" />
                                <!-- <InputText id="languages" v-model="projeto.languages" required="true" /> -->
                                <label for="languages">{{ $t('languages') }}</label>
                            </FloatLabel>
                        </div>
                    </div>

                    <div class="row flex">
                        <div class="field col">
                            <FloatLabel>
                                <InputText id="descricao" v-model="projeto.description" required="true" />
                                <label for="descricao">{{ $t('Descricao') }}</label>
                            </FloatLabel>
                        </div>
                    </div>

                    <template #footer>
                        <Button :label="$t('Cancelar')" icon="pi pi-times" class="p-button-secondary p-button-text"
                            @click="criarDialog = false" />
                        <Button :label="$t('Salvar')" icon="pi pi-check" class="p-button-text" @click="SalvaProjeto" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="editaDialog" :style="{ width: '450px' }" :header="$t('Editar')" :modal="true"
                    class="p-fluid" @update:visible="getCancelUser">
                    <div class="row flex">
                        <div class="field col">
                            <FloatLabel>
                                <InputText id="titulo" v-model.trim="editProject.title" required="true" />
                                <label for="titulo">{{ $t('Titulo') }}</label>
                            </FloatLabel>
                        </div>
                        <div class="field col">
                            <FloatLabel>
                                <InputText id="subtitulo" v-model="editProject.subtitle" required="true" />
                                <label for="subtitulo">{{ $t('SubTitulo') }}</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div class="row flex">
                        <div class="field col">
                            <FloatLabel>
                                <InputText id="link" v-model="editProject.link" required="true" />
                                <label for="link">{{ $t('Link') }}</label>
                            </FloatLabel>
                        </div>
                        <div class="field col">
                            <FloatLabel>
                                <InputText id="imagem" v-model="editProject.img" required="true" />
                                <label for="imagem">{{ $t('imagem') }}</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div class="row flex">
                        <div class="field col">
                            <FloatLabel>
                                <MultiSelect v-model="editProject.languages" :options="languages" filter
                                    optionLabel="nome" placeholder="Select Languages" :maxSelectedLabels="3"
                                    class="w-full" required="true" />
                                <label for="languages">{{ $t('languages') }}</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div class="row flex">
                        <div class="field col">
                            <FloatLabel>
                                <InputText id="descricao" v-model="editProject.description" required="true" />
                                <label for="descricao">{{ $t('Descricao') }}</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <template #footer>
                        <Button :label="$t('Cancelar')" icon="pi pi-times" class="p-button-secondary p-button-text"
                            @click="getCancelUser" />
                        <Button :label="$t('Salvar')" icon="pi pi-check" class="p-button-text" @click="EditaProjeto" />
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
</style>
