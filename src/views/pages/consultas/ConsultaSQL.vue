<script setup>
import { sql } from '@codemirror/lang-sql';
import { useToast } from 'primevue/usetoast';
import { ref, watch } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { RESTAPI } from '../../../service/api';
import { exportCSV } from '../../../utils/exportCsv.js';

const length = ref(1);
const currentTab = ref(0);
const toast = useToast();
const maximizable = ref(false);
const scriptmaximizable = ref(false);
const saveConfigVisible = ref(false);
const deleteConfigVisible = ref(false);
const editConfigVisible = ref(false);
const loadConfigVisible = ref(false);
const selectedFilters = ref([null]);
const filterOptions = ref([]);
const codes = ref(Array(length.value).fill({ nome: null, consulta: '', id: null }));
const extensions = [sql()];
const validaHabilitado = ref(true);

const headers = ref([]);
const tableContent = ref([]);

const cmOptions = {
    tabSize: 4,
    styleActiveLine: true,
    lineNumbers: true,
    line: true,
    mode: 'text/x-sql',
    theme: 'solarized light'
};

const filters = ref({
    global: { value: '' }
});

const script = ref({
    nomeScript: '',
    descricaoScript: '',
    ativo: true,
    padraoSistema: true
});

const saveFilterClick = () => {
    const query = {
        nome: script.value.nomeScript,
        descricao: script.value.descricaoScript,
        consulta: codes.value[currentTab.value].consulta,
        ativo: script.value.ativo,
        padraoSistema: script.value.padraoSistema
    };
    RESTAPI.SalvaQuerys(query)
        .then((response) => {
            console.log(response.data);
            codes.value[currentTab.value] = query;
            codes.value[currentTab.value].id = response.data;
            validaHabilitado.value = false;

            toast.add({
                severity: 'success',
                summary: $t('gblSuccess'),
                detail: $t('gblSearchSuccessful'),
                life: 3000
            });
        })
        .catch((error) => {
            toast.add({
                severity: 'error',
                summary: error.response.data,
                life: 3000
            });
        })
        .finally(() => {
            saveConfigVisible.value = false;
        });
};

const searchFilters = () => {
    RESTAPI.CarregaQuerys().then((response) => {
        filterOptions.value = response.data;
        console.log(filterOptions.value);
    });
};

const handleLoadClick = () => {
    if (selectedFilters.value) {
        codes.value[currentTab.value] = selectedFilters.value;
        validaHabilitado.value = false;
        toast.add({
            severity: 'success',
            detail: $t('gblLoadSuccessful'),
            life: 3000
        });
        loadConfigVisible.value = false;
    } else {
        toast.add({
            severity: 'error',
            summary: $t('gblSummarioToastError'),
            detail: $t('gblErroObterDados'),
            life: 3000
        });
    }
};

const handleDeleteClick = () => {
    if (codes.value[currentTab.value].id) {
        RESTAPI.DeletaQuerys(codes.value[currentTab.value].id)
            .then((response) => {
                console.log(response.data);

                deleteConfigVisible.value = false;

                if (codes.value.length === 1) {
                    addTab();
                    codes.value[currentTab.value] = {
                        nome: null,
                        consulta: '',
                        id: null
                    };
                }

                removeTab(currentTab.value);
                setCurrentTab(0);

                toast.add({
                    severity: 'success',
                    summary: $t('gblSuccess'),
                    life: 3000
                });
            })
            .catch((error) => {
                toast.add({
                    severity: 'error',
                    summary: error.response.data,
                    life: 3000
                });
            })
            .finally(() => {
                deleteConfigVisible.value = false;
                console.log(codes.value);
            });
    } else {
        toast.add({
            severity: 'error',
            summary: $t('gblSummarioToastError'),
            detail: $t('gblErroObterDados'),
            life: 3000
        });
    }
};

const HandleEditClick = () => {
    if (codes.value[currentTab.value].id) {
        RESTAPI.EditaQuerys(codes.value[currentTab.value])
            .then((response) => {
                toast.add({
                    severity: 'success',
                    summary: $t('gblSuccess'),
                    life: 3000
                });
            })
            .catch((error) => {
                toast.add({
                    severity: 'error',
                    summary: error.response.data,
                    life: 3000
                });
            })
            .finally(() => {
                editConfigVisible.value = false;
            });
    } else {
        toast.add({
            severity: 'error',
            summary: $t('gblSummarioToastError'),
            detail: $t('gblErroObterDados'),
            life: 3000
        });
    }
};

const addTab = () => {
    codes.value.push('');
    currentTab.value = length.value - 1;
};

const removeTab = (index) => {
    console.log(index);
    if (codes.value.length > 1) {
        codes.value.splice(index, 1);
        /* length.value--; */
        if (currentTab.value === index && currentTab.value > 0) {
            currentTab.value--;
        }
    } else {
        toast.add({
            severity: 'info',
            summary: $t('gblSummarioToastWarn'),
            detail: $t('gblMinimo1'),
            life: 3000
        });
    }
};

const openSaveConfig = () => {
    saveConfigVisible.value = true;
};

const openDeleteConfig = () => {
    deleteConfigVisible.value = true;
};

const openEditConfig = () => {
    editConfigVisible.value = true;
};

const openLoadConfig = () => {
    searchFilters();
    loadConfigVisible.value = true;
};

const fetchTable = () => {
    const query = { comando: codes.value[currentTab.value].consulta };

    RESTAPI.EnviaQuery(query)
        .then((res) => {
            console.log(res);
            tableContent.value = res.data;
            headers.value = res.data.length > 0 ? Object.keys(res.data[0]).map((key) => ({ value: key, text: key })) : [];
            console.log(headers.value);
        })
        .catch((err) => {
            console.log(err);
            toast.add({
                severity: 'info',
                summary: $t('gblSummarioToastWarn'),
                detail: err,
                life: 3000
            });
        });
};

const openModal = () => {
    maximizable.value = true;
};

const openModalScript = () => {
    scriptmaximizable.value = true;
};

const onHide = () => {
    maximizable.value = false;
    scriptmaximizable.value = false;
    saveConfigVisible.value = false;
    loadConfigVisible.value = false;
    editConfigVisible.value = false;
    deleteConfigVisible.value = false;
};

const imprimirTela = () => {
    exportCSV(tableContent.value, 'tabela');
};

const setCurrentTab = (index) => {
    currentTab.value = index;

    if (codes.value[currentTab.value].id) {
        validaHabilitado.value = false;
    } else {
        validaHabilitado.value = true;
    }
};

watch(length, (newLength, oldLength) => {
    if (newLength > oldLength) {
        codes.value.push('');
    } else {
        codes.value.pop();
    }
});
</script>

<template>
    <div class="grid">
        <div style="width: 100%" class="container-main flex col-span-11 flex-row">
            <div style="margin-top: 40px; width: 50px" class="col-span-1 flex flex-col gap-6 items-center">
                <div class="flex flex-col gap-1">
                    <Button icon="pi pi-play" severity="help" raised @click="fetchTable()" />
                    <Button icon="pi pi-save" severity="success" raised @click="openSaveConfig()" />
                    <Button icon="pi pi-upload" severity="info" raised @click="openLoadConfig()" />
                    <Button icon="pi pi-pencil" :disabled="validaHabilitado" severity="secondary" raised
                        @click="openEditConfig()" />
                    <Button icon="pi pi-trash" :disabled="validaHabilitado" severity="danger" raised
                        @click="openDeleteConfig()" />
                </div>
            </div>
            <div style="width: 95%">
                <div class="container-child flex">
                    <Tabs value="0" scrollable class="tab-container">
                        <Tab v-for="(code, index) in codes" :key="index" class="tab"
                            :class="{ active: currentTab === index }"
                            :header="codes[index].nome ?? 'Script ' + (index + 1)" :value="index"
                            @click="setCurrentTab(index)">
                            <span style="width: 60px">{{ codes[index].nome ?? 'Script ' + (index + 1) }}</span>
                            <Button style="width: 10px; margin-left: 15px" icon="pi pi-times"
                                class="button-close button-danger" @click.stop="removeTab(index)" />
                        </Tab>
                    </Tabs>
                    <div style="display: flex; align-items: center">
                        <Button style="width: 25px; height: 25px" icon="pi pi-window-maximize" class="mr-2"
                            severity="primary" @click="openModalScript()" />
                        <Button style="width: 25px; height: 25px" icon="pi pi-plus" severity="primary" raised
                            @click="addTab(index)" />
                    </div>
                </div>
                <splitter style="height: 450px" layout="vertical">
                    <SplitterPanel class="flex items-center justify-center">
                        <codemirror v-model="codes[currentTab].consulta" :options="cmOptions"
                            :style="{ height: '100%' }" :autofocus="true" :indent-with-tab="true" :tab-size="2"
                            :extensions="extensions" />
                    </SplitterPanel>
                    <SplitterPanel class="flex items-center justify-center">
                        <Tab style="width: 100%">
                            <Toolbar>
                                <template #start>
                                    <Button icon="pi pi-print" class="mr-2" severity="primary"
                                        @click="imprimirTela()" />
                                    <Button icon="pi pi-window-maximize" class="mr-2" severity="primary"
                                        @click="openModal()" />
                                </template>
                                <template #end>
                                    <IconField>
                                        <InputIcon>
                                            <i class="pi pi-search" />
                                        </InputIcon>
                                        <InputText v-model="filters['global'].value"
                                            :placeholder="$t('gblPesquisar')" />
                                    </IconField>
                                </template>
                            </Toolbar>
                            <DataTable :value="tableContent" scrollable scrollHeight="150px"
                                tableStyle="min-width: 50rem" :filters="filters" responsiveLayout="scroll">
                                <Column v-for="col in headers" :field="col.value" :header="col.text" :key="col.value" />
                            </DataTable>
                        </Tab>
                    </SplitterPanel>
                </splitter>
            </div>
        </div>
    </div>

    <Dialog header="TABLE VIEWER" :visible="maximizable" @update:visible="onHide()" :maximized="true" :modal="true"
        class="p-dialog-maximized tableViewer">
        <Toolbar>
            <template #start>
                <Button label="DOWNLOAD CSV" @click="imprimirTela()" icon="pi pi-file-o"
                    class="button-primary button-sm" />
            </template>

            <template #end>
                <IconField>
                    <InputIcon>
                        <i class="pi pi-search" />
                    </InputIcon>
                    <InputText v-model="filters['global'].value" placeholder="Search" />
                </IconField>
            </template>
        </Toolbar>
        <DataTable :value="tableContent" scrollable scrollHeight="400px" tableStyle="min-width: 50rem"
            :filters="filters" :paginator="true" :rows="10"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 25, 100]"
            :currentPageReportTemplate="`${$t('gblMostrando')} {currentPage} ${$t('gblEm')} {totalPages} ${$t('gblPaginas')} ${$t('gblDe')} {totalRecords} ${$t('gblResultados')}`"
            responsiveLayout="scroll">
            <Column v-for="col in headers" :field="col.value" :header="col.text" :key="col.value" />
        </DataTable>
    </Dialog>

    <Dialog header="SQL EDITOR" :visible="scriptmaximizable" @update:visible="onHide()" :maximized="true" :modal="true"
        class="p-dialog-maximized sqlEditor">
        <codemirror v-model="codes[currentTab].consulta" :options="cmOptions" :style="{ height: '100%' }"
            :autofocus="true" :indent-with-tab="true" :tab-size="2" :extensions="extensions" />
    </Dialog>

    <Dialog v-model="saveConfigVisible" :visible="saveConfigVisible" @update:visible="onHide()" :modal="true"
        :closable="true" style="width: 500px">
        <template #header>
            {{ $t('gblSaveQueryConfig') }}
        </template>
        <div class="popup-content flex flex-col gap-2">
            <FloatLabel>
                <InputText id="nomeScript" v-model="script.nomeScript" style="width: 100%" />
                <label for="nomeScript">{{ $t('gblFilterName') }}</label>
            </FloatLabel>
            <FloatLabel>
                <InputText id="descricaoScript" v-model="script.descricaoScript" style="width: 100%" />
                <label for="descricaoScript">{{ $t('gblDescricao') }}</label>
            </FloatLabel>

            <div class="field-checkbox mb-0">
                <input type="checkbox" id="ativo" v-model="script.ativo" />
                <label for="ativo">{{ $t('gblAtivo') }}</label>
            </div>
            <div class="field-checkbox mb-0">
                <input type="checkbox" id="ativo" v-model="script.padraoSistema" />
                <label for="padraoSistema">{{ $t('gblPadraoSistema') }}</label>
            </div>
            <div class="inline-flex align-items-end justify-content-end gap-2">
                <Button class="custom-button" :label="$t('gblSave')" @click="saveFilterClick" />
            </div>
        </div>
    </Dialog>

    <Dialog v-model="editConfigVisible" :visible="editConfigVisible" @update:visible="onHide()" :modal="true"
        :closable="true" style="width: 500px">
        <template #header>
            {{ $t('gblEditQueryConfig') }}
        </template>
        <div class="popup-content flex flex-col gap-2">
            <FloatLabel>
                <InputText id="nome" v-model="codes[currentTab].nome" style="width: 100%" />
                <label for="nomeS">{{ $t('gblFilterName') }}</label>
            </FloatLabel>
            <FloatLabel>
                <InputText id="descricao" v-model="codes[currentTab].descricao" style="width: 100%" />
                <label for="descricaoScript">{{ $t('gblDescricao') }}</label>
            </FloatLabel>

            <div class="field-checkbox mb-0">
                <input type="checkbox" id="ativo" v-model="codes[currentTab].ativo" />
                <label for="ativo">{{ $t('gblAtivo') }}</label>
            </div>
            <div class="field-checkbox mb-0">
                <input type="checkbox" id="ativo" v-model="codes[currentTab].padraoSistema" />
                <label for="padraoSistema">{{ $t('gblPadraoSistema') }}</label>
            </div>
            <div class="inline-flex align-items-end justify-content-end gap-2">
                <Button class="custom-button" :label="$t('gblSave')" @click="HandleEditClick" />
            </div>
        </div>
    </Dialog>

    <Dialog v-model="deleteConfigVisible" :visible="deleteConfigVisible" @update:visible="onHide()" :modal="true"
        :closable="true" style="width: 500px">
        <template #header>
            {{ $t('gblDeleteQueryConfig') }}
        </template>
        <div class="popup-content flex flex-col gap-2">
            {{ $t('confirmarDelete') + ' ' + codes[currentTab].nome + ' ?' }}
            <div class="inline-flex align-items-end justify-content-end gap-2">
                <Button class="custom-button" severity="danger" :label="$t('gblDeletar')" @click="handleDeleteClick" />
            </div>
        </div>
    </Dialog>

    <Dialog v-model="loadConfigVisible" :visible="loadConfigVisible" @update:visible="onHide()" :modal="true"
        :closable="true" style="width: 500px">
        <template #header>
            {{ $t('gblLoadQueryConfig') }}
        </template>
        <div class="popup-content flex flex-col gap-5">
            <Select :placeholder="$t('gblSelectFilter')" style="width: 100%" v-model="selectedFilters"
                :options="filterOptions" optionLabel="nome" />
            <div class="inline-flex align-items-end flex gap-2" style="justify-content: end">
                <Button class="custom-button" :label="$t('gblLoad')" @click="handleLoadClick" />
            </div>
        </div>
    </Dialog>
</template>

<style scoped>
.tableViewer>.p-dialog-header {
    background-color: rgba(104, 159, 56, 0.92);
    color: white;
}

.sqlEditor>.p-dialog-header {
    background-color: rgba(104, 159, 56, 0.92);
    color: white;
}

.sqlEditor>.p-dialog-content {
    padding: 0;
}

.cm-editor {
    width: 100%;
}

.button-close {
    background: none;
    color: red;
    align-items: start;
    font-size: 5px !important;
}

.container-main {
    width: 100%;
    padding: 10px;
}

.container-child {
    justify-content: space-between;
    display: flex;
    align-items: center;
}

.tab-container {
    display: flex;
    gap: 5px;
    width: 90%;
    overflow-x: auto;
}

.tab {
    display: flex;
    padding: 5px 10px;
    border-bottom: 2px solid #969c9a;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    color: #3f3f46;
    font-weight: 600;
}

.tab.active {
    color: #10b981;
    border-bottom: 2px solid #10b981;
}

.add-tab {
    padding: 5px;
    cursor: pointer;
}

.textarea {
    width: 100%;
}

.button-sm {
    margin-left: 5px;
}

.hoveredTab {
    border-left: 1px solid;
    border-right: 1px solid;
    border-top: 1px solid;
    border-radius: 5px 5px 0 0;
    background-color: lightgray;
}

.nonHoveredTab {
    border-left: 1px solid;
    border-right: 1px solid;
    border-top: 1px solid;
    border-radius: 5px 5px 0 0;
    margin-left: 2px;
}
</style>
