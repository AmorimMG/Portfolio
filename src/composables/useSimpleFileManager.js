/**
 * Composable para gerenciar arquivos de forma simples
 * Sem necessidade de scripts externos ou APIs complexas
 */
import { useFileSystemStore } from '@/stores/useFileSystemStore';
import { useNotifications } from './useNotifications';

export function useSimpleFileManager() {
    const fileSystemStore = useFileSystemStore();
    const { notifySuccess, notifyError, notifyInfo } = useNotifications();

    /**
     * Adiciona um arquivo manualmente ao sistema
     * Útil quando você coloca um arquivo na pasta e quer que apareça imediatamente
     */
    async function addFile(category, fileName) {
        try {
            // Verificar se o arquivo existe primeiro
            const url = `/user-files/${category}/${fileName}`;
            const response = await fetch(url, { method: 'HEAD' });
            
            if (!response.ok) {
                notifyError(
                    'Arquivo não encontrado',
                    `O arquivo ${fileName} não foi encontrado na pasta ${category}`
                );
                return false;
            }

            // Registrar o arquivo no sistema
            await fileSystemStore.addFileToCategory(category, fileName);
            
            notifySuccess(
                'Arquivo adicionado',
                `${fileName} foi adicionado à categoria ${category}`
            );
            
            return true;
        } catch (error) {
            notifyError(
                'Erro ao adicionar arquivo',
                `Erro: ${error.message}`
            );
            return false;
        }
    }

    /**
     * Remove um arquivo do sistema (apenas do registro, não deleta o arquivo real)
     */
    function removeFile(category, fileName) {
        try {
            fileSystemStore.unregisterFile(category, fileName);
            
            notifyInfo(
                'Arquivo removido',
                `${fileName} foi removido da categoria ${category}`
            );
            
            return true;
        } catch (error) {
            notifyError(
                'Erro ao remover arquivo',
                `Erro: ${error.message}`
            );
            return false;
        }
    }

    /**
     * Recarrega todos os arquivos
     */
    async function refreshFiles() {
        try {
            await fileSystemStore.loadRealFiles();
            
            notifySuccess(
                'Arquivos atualizados',
                'A lista de arquivos foi atualizada com sucesso'
            );
            
            return true;
        } catch (error) {
            notifyError(
                'Erro ao atualizar arquivos',
                `Erro: ${error.message}`
            );
            return false;
        }
    }

    /**
     * Lista todos os arquivos registrados
     */
    function listRegisteredFiles() {
        const registeredFiles = JSON.parse(localStorage.getItem('registeredFiles') || '{}');
        return registeredFiles;
    }

    /**
     * Verifica se um arquivo existe fisicamente
     */
    async function checkFileExists(category, fileName) {
        try {
            const url = `/user-files/${category}/${fileName}`;
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    /**
     * Adiciona múltiplos arquivos de uma vez
     */
    async function addMultipleFiles(category, fileNames) {
        const results = [];
        
        for (const fileName of fileNames) {
            const success = await addFile(category, fileName);
            results.push({ fileName, success });
        }
        
        const successCount = results.filter(r => r.success).length;
        const failCount = results.length - successCount;
        
        if (successCount > 0) {
            notifySuccess(
                'Arquivos processados',
                `${successCount} arquivo(s) adicionado(s) com sucesso` + 
                (failCount > 0 ? `, ${failCount} falharam` : '')
            );
        }
        
        return results;
    }

    return {
        addFile,
        removeFile,
        refreshFiles,
        listRegisteredFiles,
        checkFileExists,
        addMultipleFiles
    };
}
