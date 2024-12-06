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
            toast.add({ severity: 'error', summary: $t('SummarioToastError'), detail: $t('ErroObterDadosGenerico'), life: 3000 });
        }); 

//Busca do Firebase
/* 	getDatabase("projetos")
		.then((response) => {
			console.log(response);
			dataUsers.value = response;
		})
		.catch((error) => {
			console.error("Error fetching data:", error);
		}); */
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
            toast.add({ severity: 'success', summary: $t('SummarioToastSucesso'), detail: $t('UsuarioToastCreate'), life: 3000 });
            usuario.value = { admin: false };
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: $t('SummarioToastError'), detail: $t('UsuarioToastCreateError'), life: 3000 });
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
				(u) => u.id !== product.value._id,
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
                            <Button label="Novo" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <Button label="Deletar" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteAll" :disabled="selectedUser?.length === 0" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <Button label="Exportar" icon="pi pi-upload" class="p-button-help" @click="handleExportCSV()" />
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
                            <Button :disabled="slotProps.data?._id === userCookie?._id" v-tooltip="'Excluir'" icon="pi pi-trash" class="p-button-rounded p-button-danger mt-2" @click="confirmDelete(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog class="dialog-component" v-model:visible="deleteDialog" :style="{ width: '450px' }" :header="$t('Excluir')" :modal="true">
                    <div class="flex align-items-center">
                        <i class="pi pi-exclamation-triangle mr-3 p-large" />
                        <span v-if="product"
                            >{{ $t('Excluir') }} <b>{{ product.usuario }}</b
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
                        <i class="pi pi-exclamation-triangle mr-3 p-large" />
                        <span v-if="product"
                            >{{ $t('Excluir') }} <b>{{ this.selectedUser?.length }} {{ $t('Usuarios') }}</b
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
                                <InputText id="usuario" v-model.trim="usuario.usuario" required="true" />
                                <label for="usuario">{{ $t('Usuário') }}</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div class="row flex">
                        <div class="field col">
                            <FloatLabel>
                                <InputText id="email" v-model="usuario.email" required="true" />
                                <label for="email">{{ $t('Email') }}</label>
                            </FloatLabel>
                        </div>
                        <div class="field col">
                            <FloatLabel>
                                <InputText type="password" id="password" v-model="usuario.password" required="true" />
                                <label for="password">{{ $t('password') }}</label>
                            </FloatLabel>
                        </div>
                    </div>

                    <template #footer>
                        <Button :label="$t('Cancelar')" icon="pi pi-times" class="p-button-secondary p-button-text" @click="criarDialog = false" />
                        <Button :label="$t('Salvar')" icon="pi pi-check" class="p-button-text" @click="SalvaUsuario" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="editaDialog" :style="{ width: '450px' }" :header="$t('Editar')" :modal="true" class="p-fluid" @update:visible="getCancelUser">
                    <div class="row flex">
                        <div class="field col">
                            <FloatLabel>
                                <InputText id="usuario" v-model.trim="userLogin.usuario" required="true" />
                                <label for="usuario">{{ $t('Usuário') }}</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div class="row flex">
                        <div class="field col">
                            <FloatLabel>
                                <InputText id="email" v-model="userLogin.login" required="true" />
                                <label for="email">{{ $t('Email') }}</label>
                            </FloatLabel>
                        </div>
                        <div class="field col">
                            <FloatLabel>
                                <InputText type="password" id="password" v-model="userLogin.password" required="true" />
                                <label for="password">{{ $t('password') }}</label>
                            </FloatLabel>
                        </div>
                    </div>
                    <div class="field-checkbox mb-0">
                        <input type="checkbox" id="ativo" v-model="userLogin.ativo" />
                        <label for="ativo">{{ $t('Ativo') }}</label>
                    </div>

                    <template #footer>
                        <Button :label="$t('Cancelar')" icon="pi pi-times" class="p-button-secondary p-button-text" @click="getCancelUser" />
                        <Button :label="$t('Salvar')" icon="pi pi-check" class="p-button-text" @click="EditaUsuario" />
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
</style>
