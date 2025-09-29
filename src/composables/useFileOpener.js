import { useFileSystemStore } from '@/stores/useFileSystemStore';
import { ref } from 'vue';
import { useNotifications } from './useNotifications';

export function useFileOpener() {
    const fileSystemStore = useFileSystemStore();
    const { notifyError, notifyWarning, notifyInfo } = useNotifications();
    
    const isViewerOpen = ref(false);
    const currentFileData = ref(null);

    async function openFile(path) {
        try {
            const result = await fileSystemStore.openFile(path);
            
            if (result.success) {
                currentFileData.value = result.fileData;
                isViewerOpen.value = true;
                
                // Notificar sucesso se necessário
                if (result.fileData.type === 'document') {
                    notifyInfo(
                        'Arquivo Aberto', 
                        `${result.fileData.name} foi aberto para visualização`
                    );
                }
            } else {
                // Tratar erro
                if (result.shouldNotify) {
                    const notifyMethod = result.notificationType === 'error' ? notifyError :
                                       result.notificationType === 'warning' ? notifyWarning :
                                       notifyInfo;
                    
                    notifyMethod(
                        'Erro ao Abrir Arquivo',
                        result.error + (result.suggestion ? `\n\n${result.suggestion}` : '')
                    );
                }
                
                // Se é um arquivo não suportado, oferecer download
                if (result.notificationType === 'warning') {
                    const item = fileSystemStore.getItemAtPath(path);
                    if (item?.realPath) {
                        setTimeout(() => {
                            notifyInfo(
                                'Download Disponível',
                                'Clique aqui para baixar o arquivo',
                                0 // Não remover automaticamente
                            );
                        }, 1000);
                    }
                }
            }
            
            return result;
        } catch (error) {
            notifyError(
                'Erro Inesperado',
                `Ocorreu um erro ao tentar abrir o arquivo: ${error.message}`
            );
            return { success: false, error: error.message };
        }
    }

    function closeViewer() {
        isViewerOpen.value = false;
        currentFileData.value = null;
    }

    function canOpen(path) {
        return fileSystemStore.canOpenFile(path);
    }

    async function downloadFile(path) {
        const item = fileSystemStore.getItemAtPath(path);
        if (!item) {
            notifyError('Erro', 'Arquivo não encontrado');
            return;
        }

        if (!item.realPath) {
            notifyWarning('Aviso', 'Este arquivo não pode ser baixado (arquivo simulado)');
            return;
        }

        try {
            const link = document.createElement('a');
            link.href = item.realPath;
            link.download = path.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            notifyInfo('Download Iniciado', `Download de ${path.split('/').pop()} iniciado`);
        } catch (error) {
            notifyError('Erro de Download', `Não foi possível baixar o arquivo: ${error.message}`);
        }
    }

    return {
        isViewerOpen,
        currentFileData,
        openFile,
        closeViewer,
        canOpen,
        downloadFile
    };
}
