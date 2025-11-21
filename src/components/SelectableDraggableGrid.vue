<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";

// 1. DEFINIR PROPS E EMITS (A "API" DO NOSSO COMPONENTE)
const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  itemKey: {
    type: String,
    required: true,
  },
  selectableClass: {
    type: String,
    default: "selectable-item",
  },
  gridCols: {
    type: String,
    default: "repeat(auto-fill, 100px)"
  },
  gridRows: {
    type: String,
    default: "repeat(auto-fill, 100px)"
  },
  gap: {
    type: String,
    default: "10px"
  },
  disabled: {
    type: Boolean,
    default: false
  },
  multiSelect: {
    type: Boolean,
    default: true
  },
  dragEnabled: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits([
  "update:modelValue", 
  "contextmenu", 
  "selection-change", 
  "item-click",
  "item-double-click",
  "drag-start",
  "drag-end"
]);

// 2. ESTADO INTERNO DO COMPONENTE
const gridContainer = ref(null);
const selected = ref(new Set());
const internalList = ref([...props.modelValue]);
const isMobile = ref(false);

// Estados de seleção
const isSelecting = ref(false);
const selectionRect = ref(null);
const selectionStart = ref({ x: 0, y: 0 });

// Estados de arrastar
const isDragging = ref(false);
const draggedItems = ref(new Set());
const dragStartIndex = ref(-1);
const dragOverIndex = ref(-1);
const draggedItem = ref(null);
const dragOffset = ref({ x: 0, y: 0 });
const mousePos = ref({ x: 0, y: 0 });
const showDragGhost = ref(false);
const dragGhostPos = ref({ x: 0, y: 0 });

// Estados para controlar quando iniciar o drag
const dragTimeout = ref(null);
const dragStartPos = ref({ x: 0, y: 0 });
const isDragReady = ref(false);
const DRAG_THRESHOLD = 5; // pixels para considerar como drag
const DRAG_DELAY = 150; // delay em ms para iniciar drag

// Estados para controlar duplo clique
const lastClickTime = ref(0);
const lastClickedItem = ref(null);
const DOUBLE_CLICK_DELAY = 300; // delay máximo entre cliques para considerar duplo clique

// Sincroniza a lista interna se a prop externa mudar
watch(
  () => props.modelValue,
  (newValue) => {
    internalList.value = [...newValue];
    // Limpa seleções que não existem mais na nova lista
    const currentIds = new Set(newValue.filter(item => item && item[props.itemKey] !== null).map(item => item[props.itemKey]));
    const selectedIds = Array.from(selected.value);
    selectedIds.forEach(id => {
      if (!currentIds.has(id)) {
        selected.value.delete(id);
      }
    });
  },
  { deep: true }
);

// 3. COMPUTED PROPERTIES
const gridStyles = computed(() => {
  // Em modo mobile, os estilos são controlados principalmente pelo CSS.
  if (isMobile.value) {
    return {
      display: 'grid',
      width: '100%',
    };
  }
  // Em modo desktop, usamos as props.
  return {
    display: 'grid',
    gridTemplateColumns: props.gridCols,
    gridTemplateRows: props.gridRows,
    gap: props.gap,
    width: 'fit-content', // Manter o comportamento do desktop
  };
});

// Função para verificar se um slot está vazio (consistente com useAppsStore.isEmptySlot)
// Esta função garante que usamos a mesma lógica da store para determinar slots vazios
function isEmptySlot(item) {
  return !item || item[props.itemKey] === null;
}

const selectionRectStyle = computed(() => {
  if (!selectionRect.value) return { display: 'none' };
  
  return {
    left: `${Math.min(selectionStart.value.x, selectionRect.value.x)}px`,
    top: `${Math.min(selectionStart.value.y, selectionRect.value.y)}px`,
    width: `${Math.abs(selectionRect.value.x - selectionStart.value.x)}px`,
    height: `${Math.abs(selectionRect.value.y - selectionStart.value.y)}px`,
    display: 'block'
  };
});

// 4. FUNÇÕES DE SELEÇÃO
function clearSelection() {
  selected.value.clear();
  emitSelectionChange();
}

function setSelection(itemIds) {
  selected.value = new Set(itemIds);
  emitSelectionChange();
}

function toggleSelection(itemId) {
  if (selected.value.has(itemId)) {
    selected.value.delete(itemId);
  } else {
    selected.value.add(itemId);
  }
  emitSelectionChange();
}

function selectRange(endIndex) {
  const startIndex = findIndexOfLastSelected();
  if (startIndex === -1) return;
  
  const start = Math.min(startIndex, endIndex);
  const end = Math.max(startIndex, endIndex);
  
  for (let i = start; i <= end; i++) {
    const item = internalList.value[i];
    if (item && item[props.itemKey] !== null) {
      selected.value.add(item[props.itemKey]);
    }
  }
  
  emitSelectionChange();
}

function findIndexOfLastSelected() {
  for (let i = internalList.value.length - 1; i >= 0; i--) {
    const item = internalList.value[i];
    if (item && selected.value.has(item[props.itemKey])) {
      return i;
    }
  }
  return -1;
}

function updateSelectionFromRect() {
  if (!selectionRect.value || !gridContainer.value) return;
  
  const containerRect = gridContainer.value.getBoundingClientRect();
  const items = gridContainer.value.querySelectorAll('.grid-item');
  
  const selectionBounds = {
    left: Math.min(selectionStart.value.x, selectionRect.value.x),
    top: Math.min(selectionStart.value.y, selectionRect.value.y),
    right: Math.max(selectionStart.value.x, selectionRect.value.x),
    bottom: Math.max(selectionStart.value.y, selectionRect.value.y)
  };
  
  items.forEach((itemEl, index) => {
    const item = internalList.value[index];
    if (isEmptySlot(item)) return;
    
    const itemRect = itemEl.getBoundingClientRect();
    const itemBounds = {
      left: itemRect.left - containerRect.left,
      top: itemRect.top - containerRect.top,
      right: itemRect.right - containerRect.left,
      bottom: itemRect.bottom - containerRect.top
    };
    
    const intersects = !(
      itemBounds.right < selectionBounds.left ||
      itemBounds.left > selectionBounds.right ||
      itemBounds.bottom < selectionBounds.top ||
      itemBounds.top > selectionBounds.bottom
    );
    
    if (intersects) {
      selected.value.add(item[props.itemKey]);
    }
  });
  
  emitSelectionChange();
}

// 5. FUNÇÕES DE ARRASTAR
function startDrag() {
  if (!props.dragEnabled || isDragging.value) return;
  
  console.log('Starting drag...', {
    dragEnabled: props.dragEnabled,
    dragStartIndex: dragStartIndex.value,
    draggedItem: draggedItem.value
  });
  
  isDragging.value = true;
  showDragGhost.value = isMobile.value; // Mostra ghost apenas no mobile
  draggedItems.value = new Set(selected.value);
  
  if (draggedItem.value && !draggedItems.value.has(draggedItem.value[props.itemKey])) {
    draggedItems.value.add(draggedItem.value[props.itemKey]);
  }
  
  console.log('Drag started with items:', Array.from(draggedItems.value));
  
  emit('drag-start', {
    items: Array.from(draggedItems.value).map(id => 
      internalList.value.find(item => item?.[props.itemKey] === id)
    ).filter(Boolean),
    startIndex: dragStartIndex.value
  });
}

function completeDrag() {
  if (!isDragging.value) return;
  
  const targetIndex = dragOverIndex.value;
  const startIndex = dragStartIndex.value;
  
  console.log('Completing drag - Target:', targetIndex, 'Start:', startIndex);
  
  // Permite drop em qualquer posição válida, senão restaura os itens
  if (targetIndex >= 0) {
    moveItems(targetIndex);
  } else {
    console.log('Invalid drop target, restoring items to original positions');
    // Se o drop foi inválido, não faz nada (os itens permanecem nas posições originais)
    // A lista interna já tem os dados corretos, então não precisa restaurar
  }
  
  // Reset drag state
  isDragging.value = false;
  showDragGhost.value = false;
  draggedItems.value.clear();
  dragOverIndex.value = -1;
  dragStartIndex.value = -1;
  draggedItem.value = null;
  
  emit('drag-end');
}

function moveItems(targetIndex) {
  console.log('Moving items to index:', targetIndex);
  
  const newItems = [...internalList.value];
  const selectedIndices = Array.from(draggedItems.value)
    .map(id => newItems.findIndex(item => item?.[props.itemKey] === id))
    .filter(index => index >= 0)
    .sort((a, b) => a - b);
  
  if (selectedIndices.length === 0) {
    return;
  }
  
  const itemsToMove = selectedIndices.map(index => newItems[index]);
  
  // Verifica se estamos tentando mover para a mesma posição
  if (selectedIndices.length === 1 && selectedIndices[0] === targetIndex) {
    return;
  }
  
  // Guarda informação sobre o target antes da modificação
  const targetItem = targetIndex < newItems.length ? newItems[targetIndex] : null;
  const isTargetEmpty = isEmptySlot(targetItem);
  
  // LÓGICA CORRIGIDA PARA EVITAR PERDA DE APPS:
  const EMPTY_SLOT = { id: null }; // Consistente com useAppsStore
  
  if (isTargetEmpty) {
    // CASO 1: DROP EM SLOT VAZIO
    // Substitui itens selecionados por slots vazios nas posições originais
    for (let i = selectedIndices.length - 1; i >= 0; i--) {
      newItems[selectedIndices[i]] = EMPTY_SLOT;
    }
    
    // Coloca os itens sequencialmente a partir do target
    for (let i = 0; i < itemsToMove.length; i++) {
      const targetIndexForItem = targetIndex + i;
      if (targetIndexForItem < newItems.length) {
        newItems[targetIndexForItem] = itemsToMove[i];
      }
    }
  } else {
    // CASO 2: DROP EM SLOT OCUPADO
    if (itemsToMove.length === 1) {
      // Swap simples com um item
      const targetItemToSwap = newItems[targetIndex];
      newItems[targetIndex] = itemsToMove[0];
      newItems[selectedIndices[0]] = targetItemToSwap;
    } else {
      // Para múltiplos itens em slot ocupado: encontra slots vazios próximos
      
      // Coleta todos os slots vazios disponíveis (excluindo target e slots selecionados)
      const emptySlots = [];
      for (let i = 0; i < newItems.length; i++) {
        if (isEmptySlot(newItems[i]) && !selectedIndices.includes(i) && i !== targetIndex) {
          emptySlots.push(i);
        }
      }
      
      // Se não há slots vazios suficientes, cancela a movimentação
      if (emptySlots.length < itemsToMove.length - 1) {
        return;
      }
      
      // Substitui os itens selecionados por slots vazios
      for (let i = selectedIndices.length - 1; i >= 0; i--) {
        newItems[selectedIndices[i]] = EMPTY_SLOT;
      }
      
      // Coloca o primeiro item no target (empurrando o item que estava lá)
      const displacedItem = newItems[targetIndex];
      newItems[targetIndex] = itemsToMove[0];
      
      // Coloca os outros itens nos primeiros slots vazios disponíveis
      for (let i = 1; i < itemsToMove.length; i++) {
        const emptySlotIndex = emptySlots[i - 1];
        newItems[emptySlotIndex] = itemsToMove[i];
      }
      
      // Coloca o item deslocado no primeiro slot vazio restante ou em um dos slots originais vazados
      const remainingEmptySlots = emptySlots.slice(itemsToMove.length - 1);
      let displacedItemPlaced = false;
      
      if (remainingEmptySlots.length > 0) {
        // Usa um dos slots vazios restantes
        newItems[remainingEmptySlots[0]] = displacedItem;
        displacedItemPlaced = true;
      } else {
        // Procura um slot original que agora está vazio
        for (const originalIndex of selectedIndices) {
          if (newItems[originalIndex] && newItems[originalIndex][props.itemKey] === null) {
            newItems[originalIndex] = displacedItem;
            displacedItemPlaced = true;
            break;
          }
        }
      }
      
      if (!displacedItemPlaced) {
        console.error('Could not place displaced item - canceling move');
        // Em caso de erro, cancela a movimentação
        for (let i = 0; i < selectedIndices.length; i++) {
          newItems[selectedIndices[i]] = itemsToMove[i];
        }
        return;
      }
    }
  }
  
  // Validação para garantir que nenhum app foi perdido
  const originalNonEmptyCount = internalList.value.filter(item => !isEmptySlot(item)).length;
  const newNonEmptyCount = newItems.filter(item => !isEmptySlot(item)).length;
  
  // Validação adicional: verifica se não há duplicatas
  const newItemIds = newItems.filter(item => !isEmptySlot(item)).map(item => item[props.itemKey]);
  const uniqueIds = new Set(newItemIds);
  
  if (originalNonEmptyCount !== newNonEmptyCount || newItemIds.length !== uniqueIds.size) {
    console.error('BUG DETECTED: Data integrity violation!', {
      originalCount: originalNonEmptyCount,
      newCount: newNonEmptyCount,
      totalItems: newItemIds.length,
      uniqueItems: uniqueIds.size,
      hasDuplicates: newItemIds.length !== uniqueIds.size
    });
    console.error('Original items:', internalList.value.map((item, i) => `${i}: ${item && item[props.itemKey] !== null ? item[props.itemKey] : 'EMPTY'}`));
    console.error('New items:', newItems.map((item, i) => `${i}: ${item && item[props.itemKey] !== null ? item[props.itemKey] : 'EMPTY'}`));
    console.error('Selected indices:', selectedIndices);
    console.error('Target index:', targetIndex);
    console.error('Items to move:', itemsToMove.map(item => item[props.itemKey]));
    // Em caso de bug, não aplica a mudança
    return;
  }
  
  console.log('Move completed successfully');
  
  internalList.value = newItems;
  emit("update:modelValue", newItems);
}

// 6. EVENT HANDLERS
function handleMouseDown(event) {
  if (props.disabled || event.button !== 0) return;
  
  // No mobile, desabilita a seleção por área
  if (isMobile.value) return;
  
  const rect = gridContainer.value.getBoundingClientRect();
  selectionStart.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
  
  // Só limpa seleção se não estiver usando modificadores e se não clicou em item já selecionado
  const clickedElement = event.target.closest('.grid-item');
  const clickedIndex = clickedElement ? parseInt(clickedElement.dataset.index) : -1;
  const clickedItem = clickedIndex >= 0 ? internalList.value[clickedIndex] : null;
  const clickedOnSelectedItem = clickedItem && !isEmptySlot(clickedItem) && selected.value.has(clickedItem[props.itemKey]);
  
  if (!event.ctrlKey && !event.metaKey && !clickedOnSelectedItem) {
    clearSelection();
  }
  
  isSelecting.value = true;
  event.preventDefault();
}

function handleDragStart(event) {
  // Previne o drag padrão do navegador (especialmente para imagens)
  event.preventDefault();
  return false;
}

function handleMouseMove(event) {
  const isTouchEvent = event.type === 'touchmove';
  const clientX = event.clientX || (event.touches && event.touches[0]?.clientX);
  const clientY = event.clientY || (event.touches && event.touches[0]?.clientY);
  
  if (!clientX || !clientY) return;
  
  // Previne scroll no mobile durante drag
  if (isTouchEvent && (isDragging.value || isDragReady.value)) {
    event.preventDefault();
  }
  
  mousePos.value = { x: clientX, y: clientY };
  
  // Atualiza posição do ghost no mobile
  if (isMobile.value && isDragging.value) {
    dragGhostPos.value = { x: clientX, y: clientY };
  }
  
  // Se está preparado para drag, verifica se o usuário moveu o mouse o suficiente
  if (isDragReady.value && !isDragging.value && dragStartIndex.value >= 0) {
    const deltaX = Math.abs(clientX - dragStartPos.value.x);
    const deltaY = Math.abs(clientY - dragStartPos.value.y);
    
    console.log('Movement detected:', { deltaX, deltaY, threshold: DRAG_THRESHOLD });
    
    if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
      startDrag();
    }
  }
  
  // No mobile, não faz seleção por área
  if (isSelecting.value && !isDragging.value && !isMobile.value) {
    const rect = gridContainer.value.getBoundingClientRect();
    selectionRect.value = {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
    
    updateSelectionFromRect();
  }
  
  if (isDragging.value) {
    updateDragOverIndex(event);
  }
}

function handleMouseUp() {
  // Limpa timeout de drag se ainda estiver ativo
  if (dragTimeout.value) {
    clearTimeout(dragTimeout.value);
    dragTimeout.value = null;
  }
  
  // Reset drag ready state
  isDragReady.value = false;
  
  if (isSelecting.value) {
    isSelecting.value = false;
    selectionRect.value = null;
  }
  
  if (isDragging.value) {
    completeDrag();
  } else if (dragStartIndex.value >= 0) {
    // Se não estava realmente arrastando, apenas limpa o estado
    dragStartIndex.value = -1;
    draggedItem.value = null;
  }
}

function handleItemMouseDown(event, item, index) {
  // Para slots vazios, permite que a seleção por área funcione (apenas desktop)
  if (props.disabled || isEmptySlot(item)) {
    // No mobile, impede propagação mesmo para slots vazios
    if (isMobile.value) {
      event.stopPropagation();
    }
    return;
  }
  
  // Só previne comportamento padrão se for uma imagem sendo arrastada
  if (event.target.tagName === 'IMG') {
    event.preventDefault();
  }
  
  const isTouchEvent = event.type === 'touchstart';
  const clientX = isTouchEvent ? event.touches[0].clientX : event.clientX;
  const clientY = isTouchEvent ? event.touches[0].clientY : event.clientY;
  
  console.log('Item mouse/touch down:', { 
    isTouchEvent, 
    item: item[props.itemKey], 
    index,
    isMobile: isMobile.value,
    dragEnabled: props.dragEnabled
  });
  
  if (props.dragEnabled && (event.button === 0 || isTouchEvent)) {
    const rect = event.currentTarget.getBoundingClientRect();
    dragOffset.value = {
      x: clientX - (rect.left + rect.width / 2),
      y: clientY - (rect.top + rect.height / 2)
    };
    
    dragStartIndex.value = index;
    draggedItem.value = item;
    isDragReady.value = false;
    
    // Guarda posição inicial para detectar movimento
    dragStartPos.value = { x: clientX, y: clientY };
    
    // Limpa timeout anterior se existir
    if (dragTimeout.value) {
      clearTimeout(dragTimeout.value);
    }
    
    if (!selected.value.has(item[props.itemKey])) {
      if (event.ctrlKey || event.metaKey) {
        toggleSelection(item[props.itemKey]);
        // Para modificadores, impede seleção por área
        event.stopPropagation();
      } else {
        setSelection([item[props.itemKey]]);
        // Para seleção simples, também impede seleção por área
        event.stopPropagation();
      }
    } else {
      // Se o item já está selecionado, impede seleção por área
      event.stopPropagation();
    }
    
    // No mobile, reduz o delay para melhor responsividade
    const delay = isMobile.value ? 100 : DRAG_DELAY;
    
    // Prepara para possível drag, mas não inicia imediatamente
    dragTimeout.value = setTimeout(() => {
      isDragReady.value = true;
    }, delay);
  }
}

function handleItemClick(event, item, index) {
  // Só processa cliques em itens válidos (não slots vazios)
  if (props.disabled || isEmptySlot(item)) {
    // NÃO impede propagação para slots vazios
    return;
  }
  
  event.stopPropagation();
  
  const currentTime = Date.now();
  const timeSinceLastClick = currentTime - lastClickTime.value;
  const isDoubleClick = timeSinceLastClick < DOUBLE_CLICK_DELAY && 
                       lastClickedItem.value && 
                       lastClickedItem.value[props.itemKey] === item[props.itemKey];
  
  // Atualiza informações do último clique
  lastClickTime.value = currentTime;
  lastClickedItem.value = item;
  
  if (isDoubleClick) {
    // Duplo clique - emite evento para abrir o item
    emit('item-double-click', { event, item, index });
  } else {
    // Clique simples - lógica de seleção
    if (props.multiSelect && (event.ctrlKey || event.metaKey)) {
      toggleSelection(item[props.itemKey]);
    } else if (props.multiSelect && event.shiftKey && selected.value.size > 0) {
      selectRange(index);
    } else {
      setSelection([item[props.itemKey]]);
    }
    
    emit('item-click', { event, item, index });
  }
}

function handleContextMenu(event, item) {
  event.preventDefault();
  // Só emite context menu se não for um slot vazio
  if (item && item[props.itemKey] !== null) {
    emit("contextmenu", event, item);
  }
}

function updateDragOverIndex(event) {
  const isTouchEvent = event.type === 'touchmove';
  const clientX = isTouchEvent ? event.touches[0].clientX : event.clientX;
  const clientY = isTouchEvent ? event.touches[0].clientY : event.clientY;
  
  if (!gridContainer.value) return;
  
  // Para touch events, precisamos usar elementFromPoint pois o target não muda durante o movimento
  let itemEl;
  if (isTouchEvent) {
    // Esconde temporariamente o elemento sendo arrastado para pegar o elemento abaixo
    const draggedElements = gridContainer.value.querySelectorAll('.grid-item.dragging');
    const originalPointerEvents = [];
    draggedElements.forEach((el, idx) => {
      originalPointerEvents[idx] = el.style.pointerEvents;
      el.style.pointerEvents = 'none';
    });
    
    const elementBelow = document.elementFromPoint(clientX, clientY);
    itemEl = elementBelow?.closest('.grid-item');
    
    // Restaura pointer events
    draggedElements.forEach((el, idx) => {
      el.style.pointerEvents = originalPointerEvents[idx] || '';
    });
  } else {
    itemEl = event.target.closest('.grid-item');
  }
  
  if (itemEl && itemEl.dataset.index) {
    const index = parseInt(itemEl.dataset.index);
    // Sempre permite drop em qualquer item (incluindo slots vazios)
    dragOverIndex.value = index;
    console.log('Drag over index:', index);
  } else {
    // Se não está sobre um item específico, tenta encontrar o slot mais próximo
    const rect = gridContainer.value.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // Se está dentro da área do grid
    if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
      // Tenta encontrar o slot mais próximo baseado na posição do mouse/touch
      const gridItems = gridContainer.value.querySelectorAll('.grid-item');
      let closestIndex = -1;
      let closestDistance = Infinity;
      
      gridItems.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenterX = itemRect.left + itemRect.width / 2;
        const itemCenterY = itemRect.top + itemRect.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(clientX - itemCenterX, 2) + Math.pow(clientY - itemCenterY, 2)
        );
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      
      // Se encontrou um slot próximo (dentro de uma distância razoável), usa ele
      if (closestIndex >= 0 && closestDistance < 150) {
        dragOverIndex.value = closestIndex;
        console.log('Closest index:', closestIndex, 'distance:', closestDistance);
      } else {
        // Se não encontrou nenhum slot próximo, permite drop no final
        dragOverIndex.value = Math.min(internalList.value.length - 1, Math.max(0, internalList.value.length));
      }
    } else {
      // Fora da área do grid - drop inválido
      dragOverIndex.value = -1;
    }
  }
}

// 7. UTILITY FUNCTIONS
function emitSelectionChange() {
  nextTick(() => {
    const selectedItemsArray = Array.from(selected.value)
      .map(id => internalList.value.find(item => item?.[props.itemKey] === id))
      .filter(Boolean);
    
    emit('selection-change', {
      selectedIds: Array.from(selected.value),
      selectedItems: selectedItemsArray
    });
  });
}

// 8. MÉTODOS PÚBLICOS
function refreshList() {
  internalList.value = [...props.modelValue];
  emitSelectionChange();
}

// DEBUG METHOD
function debugGridState() {
  console.log('=== GRID DEBUG STATE ===');
  console.log('Total items:', internalList.value.length);
  console.log('Non-empty items:', internalList.value.filter(item => !isEmptySlot(item)).length);
  console.log('Selected items:', Array.from(selected.value));
  console.log('Grid contents:', internalList.value.map((item, i) => 
    `${i}: ${item && item[props.itemKey] !== null ? item[props.itemKey] : 'EMPTY'}`
  ));
  console.log('========================');
}



// Expõe métodos públicos
defineExpose({
  refreshList,
  clearSelection,
  setSelection,
  getSelection: () => Array.from(selected.value),
  debugGridState
});

const updateMobileStatus = () => {
  isMobile.value = window.innerWidth <= 991;
};

// 9. LIFECYCLE
onMounted(() => {
  window.addEventListener('resize', updateMobileStatus);
  updateMobileStatus();

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  
  // Adiciona suporte a touch events para mobile
  document.addEventListener('touchmove', handleMouseMove, { passive: false });
  document.addEventListener('touchend', handleMouseUp);
  
  // Adiciona listener para prevenir dragstart em todo o container
  if (gridContainer.value) {
    gridContainer.value.addEventListener('dragstart', handleDragStart, { capture: true });
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateMobileStatus);
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  
  // Remove listeners de touch
  document.removeEventListener('touchmove', handleMouseMove);
  document.removeEventListener('touchend', handleMouseUp);
  
  // Limpa timeout se ainda estiver ativo
  if (dragTimeout.value) {
    clearTimeout(dragTimeout.value);
  }
  
  // Remove listener do dragstart
  if (gridContainer.value) {
    gridContainer.value.removeEventListener('dragstart', handleDragStart, { capture: true });
  }
});
</script>

<template>
  <div 
    ref="gridContainer"
    class="selectable-draggable-grid"
    @mousedown="handleMouseDown"
    @dragstart="handleDragStart"
  >
    <div 
      class="grid-content"
      :class="{ 'mobile-grid': isMobile }"
      :style="gridStyles"
    >
      <div
        v-for="(item, index) in internalList"
        :key="item?.[itemKey] || `empty-${index}`"
        :data-index="index"
        :data-id="item?.[itemKey]"
        class="grid-item"
        :class="{
          'selected': item?.[itemKey] && selected.has(item[itemKey]),
          'dragging': isDragging && draggedItems.has(item?.[itemKey]),
          'empty-slot': isEmptySlot(item),
          'drag-over': dragOverIndex === index,
          'will-be-displaced': isDragging && dragOverIndex >= 0 && index >= dragOverIndex && index < dragOverIndex + draggedItems.size && !draggedItems.has(item?.[itemKey]),
          [selectableClass]: !isEmptySlot(item)
        }"
        @mousedown="handleItemMouseDown($event, item, index)"
        @touchstart="handleItemMouseDown($event, item, index)"
        @click="handleItemClick($event, item, index)"
        @contextmenu="!isEmptySlot(item) ? handleContextMenu($event, item) : null"
        @dragover.prevent
        @drop.prevent
      >
        <slot 
          name="item" 
          :element="item" 
          :index="index"
          :selected="item?.[itemKey] && selected.has(item[itemKey])"
          :dragging="isDragging && draggedItems.has(item?.[itemKey])"
        >
          <div v-if="item && item[itemKey] !== null" class="default-item">
            {{ item.title || item.name || `Item ${item[itemKey]}` }}
          </div>
          <div v-else class="empty-slot-placeholder"></div>
        </slot>
      </div>
    </div>

    <!-- Selection Rectangle -->
    <div
      v-if="isSelecting && selectionRect"
      class="selection-rectangle"
      :style="selectionRectStyle"
    ></div>

    <!-- Drag Ghost for Mobile -->
    <div
      v-if="showDragGhost && draggedItem && isMobile"
      class="drag-ghost"
      :style="{
        left: `${dragGhostPos.x}px`,
        top: `${dragGhostPos.y}px`,
      }"
    >
      <slot 
        name="item" 
        :element="draggedItem" 
        :index="dragStartIndex"
        :selected="true"
        :dragging="true"
      >
        <div class="default-item">
          {{ draggedItem.title || draggedItem.name || `Item ${draggedItem[itemKey]}` }}
        </div>
      </slot>
      <div v-if="draggedItems.size > 1" class="drag-count-badge">
        {{ draggedItems.size }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.selectable-draggable-grid {
  position: relative;
  width: 100%;
  height: 100%;
  user-select: none;
  overflow: hidden;
  /* Permite pan mas previne zoom no mobile */
  touch-action: pan-x pan-y;
}

.selectable-draggable-grid * {
  /* Previne drag nativo de qualquer elemento */
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
}

/* Garante que imagens especificamente não sejam arrastáveis */
.selectable-draggable-grid img {
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
}

.grid-content {
  /* Mantém os estilos originais do .draggableApps */
  margin-top: 20px;
  margin-bottom: 22vh;
  display: grid;
  grid-gap: 10px;
  grid-template-rows: repeat(auto-fill, 100px);
  grid-auto-columns: 100px;
  grid-auto-flow: column;
  width: fit-content;
  max-width: 80vw;
  height: 78vh;
  margin-left: 0.5rem;
  max-width: 80%;
}

.grid-item {
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 6px;
  width: 100px;
  height: 100px;
  background-color: transparent;
  will-change: transform, opacity, box-shadow;
}

.grid-item:hover:not(.empty-slot) {
  outline: 1px solid #007ad9;
  outline-offset: -2px;
  background-color: rgba(0, 0, 0, 0.2);
}

.grid-item.selected {
  background-color: rgba(79, 144, 242, 0.3);
  outline: 2px solid #4f90f2;
  outline-offset: -2px;
  box-shadow: 0 4px 12px rgba(79, 144, 242, 0.4);
  transform: translateY(-2px);
}

.grid-item.dragging {
  opacity: 0.3;
  transform: scale(0.9) rotate(3deg);
  z-index: 1000;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border: 2px solid #4f90f2;
  background-color: rgba(79, 144, 242, 0.1);
}

.grid-item.drag-over {
  background-color: rgba(76, 175, 80, 0.2);
  outline: 3px dashed #4caf50;
  outline-offset: -3px;
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
  animation: dragOverPulse 1s infinite alternate;
}

.grid-item.drag-over.empty-slot {
  background-color: rgba(76, 175, 80, 0.15);
  outline: 3px dashed #4caf50;
  outline-offset: -3px;
  border-radius: 8px;
  animation: dragOverPulse 1s infinite alternate;
}

@keyframes dragOverPulse {
  0% {
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
    transform: scale(1.05);
  }
  100% {
    box-shadow: 0 8px 25px rgba(76, 175, 80, 0.5);
    transform: scale(1.08);
  }
}

.grid-item.empty-slot {
  cursor: default;
  user-select: none;
  /* Garante que slots vazios aceitem eventos de drop */
  pointer-events: auto;
}

.grid-item.empty-slot:hover {
  outline: none !important;
  background-color: transparent !important;
}

/* Estilo para itens que vão ser deslocados */
.grid-item.will-be-displaced {
  background-color: rgba(255, 193, 7, 0.2);
  outline: 2px dashed #ffc107;
  outline-offset: -2px;
  animation: willDisplacePulse 0.8s infinite alternate;
}

@keyframes willDisplacePulse {
  0% {
    background-color: rgba(255, 193, 7, 0.2);
    transform: translateX(0);
  }
  100% {
    background-color: rgba(255, 193, 7, 0.3);
    transform: translateX(2px);
  }
}

/* Melhor visualização dos slots vazios durante drag */
.grid-item.empty-slot.drag-over::before {
  content: '⬇️';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  opacity: 0.7;
  animation: dropHereAnimation 1s infinite;
  z-index: 10;
}

/* Indicador para drop em item não vazio */
.grid-item:not(.empty-slot).drag-over::before {
  content: '🔄';
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 1.2rem;
  opacity: 0.8;
  animation: swapIndicator 1s infinite;
  z-index: 10;
}

@keyframes swapIndicator {
  0%, 100% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.1);
  }
}

@keyframes dropHereAnimation {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.8;
  }
}

/* Feedback visual melhorado para seleção múltipla */
.grid-item.selected:not(.dragging) {
  position: relative;
}

.grid-item.selected:not(.dragging)::after {
  content: '✓';
  position: absolute;
  top: -5px;
  right: -5px;
  background: #4caf50;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.empty-slot-placeholder {
  width: 100%;
  height: 100%;
  /* Opcional: mostrar visualmente que é um slot vazio */
  /* 
  border: 1px dashed rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.02);
  border-radius: 0.5rem; 
  */
}

.default-item {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: white;
  font-size: 12px;
  text-align: center;
  padding: 8px;
}

.selection-rectangle {
  position: absolute;
  background: #4f90f22d;
  border: 1px solid #4f90f2;
  pointer-events: none;
  border-radius: 2px;
  z-index: 1000;
}

.drag-ghost {
  position: fixed;
  width: 100px;
  height: 100px;
  pointer-events: none;
  z-index: 10000;
  transform: translate(-50%, -50%) scale(1.2) rotate(5deg);
  opacity: 0.8;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5));
  transition: transform 0.1s ease-out;
}

.drag-count-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff5722;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 2px solid white;
}

/* Media queries para responsividade */
@media (max-width: 991px) {
  .grid-content.mobile-grid {
    max-width: 100%;
    grid-template-rows: repeat(auto-fill, minmax(100px, 1fr));
    grid-template-columns: repeat(4, 1fr);
    grid-auto-flow: row;
    grid-gap: 1px;
    width: 100%;
  }
  
  .grid-item {
    /* Aumenta área de toque no mobile */
    touch-action: manipulation;
  }
  
  .grid-item.dragging {
    /* Feedback visual mais forte no mobile */
    opacity: 0.5;
    transform: scale(1.1) rotate(5deg);
    z-index: 9999;
  }
  
  .grid-item.drag-over {
    /* Feedback visual mais visível no mobile */
    transform: scale(1.1);
    outline-width: 4px;
  }
  
  /* Desabilita seleção de texto no mobile */
  .selectable-draggable-grid {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}
</style>
