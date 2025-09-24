# Minha Jornada com Homelab 🧪

> Documentando passo a passo a construção do meu homelab com mini PCs, rede estruturada e rack 3D impresso.

---

## 🧠 Visão Geral

Este homelab é um projeto pessoal focado em aprendizado, testes e automações. A ideia é montar um ambiente funcional e escalável utilizando componentes acessíveis e soluções open-source.

---

## 🖥️ Hardware

### Mini PCs
- **2x Daten DC2B-U**  
  - Intel Core i5-7500T  
  - 8GB RAM  
- **1x HP EliteDesk 800 G3 Mini**  
  - Intel Core i5-7500T  
  - 8GB RAM  

### Rede
- **Switch TP-Link TL-SG108E** — 8 portas Gigabit, gerenciável
- **Patch Panel** — 8 portas

---

## 🧱 Rack & Montagem

### Impressora 3D
- **Anycubic Kobra 2 Pro**  
  Utilizada para imprimir todas as peças do rack.

### Projeto do Rack
- **Baseado no projeto [Lab Rax Project](https://makerworld.com/en/models/1294480-lab-rax-10-server-rack-5u?from=search#profileId-1325352)**  
- Modular, 10", 5U  
- Totalmente impresso em 3D

### Peças Impressas
- 2x **Rack Mount 10"** para HP Elite/ProDesk Mini  
  - [Link](https://makerworld.com/en/models/1184110-10-rack-mount-for-hp-elite-prodesk-mini#profileId-1345273)
- 1x **Rack Mount 10"** para TL-SG108E  
  - [Link](https://makerworld.com/pt/models/664449-10in-server-rack-tp-link-omada#profileId-591794)

### Fixadores
- **50x Parafusos Allen Inox M6x10mm**  
  - [Link](https://vbparafusos.mercadoshops.com.br/MLB-4484581718-parafuso-allen-inox-m6-x-10-cabeca-cilindrica-m6x10-50un-_JM)
- **50x Porcas de Inserção Quente (Brass Hot Melt Insert Nut) M6 (OD 8mm)**  
  - [AliExpress](https://pt.aliexpress.com/item/1005002970096954.html)

---

## 🔗 Links e Referências

- [Vídeo de montagem do Lab Rax](https://youtu.be/ZTmmEv9irbM)
- [Lab Rax - MakerWorld](https://makerworld.com/en/models/1294480-lab-rax-10-server-rack-5u?from=search#profileId-1325352)
- [Artigo: Introdução ao Lab Rax - The DIY Life](https://www.the-diy-life.com/introducing-lab-rax-a-3d-printable-modular-10-rack-system/)
- [Parafusos Allen M6x10mm - MercadoShops](https://vbparafusos.mercadoshops.com.br/MLB-4484581718-parafuso-allen-inox-m6-x-10-cabeca-cilindrica-m6x10-50un-_JM)
- [Brass Insert Nut M6 - AliExpress](https://pt.aliexpress.com/item/1005002970096954.html)
- [Rack Mount HP EliteDesk - MakerWorld](https://makerworld.com/en/models/1184110-10-rack-mount-for-hp-elite-prodesk-mini#profileId-1345273)
- [Rack Mount TL-SG108E - MakerWorld](https://makerworld.com/pt/models/664449-10in-server-rack-tp-link-omada#profileId-591794)

---

## 📅 Status Atual

- [x] Impressora 3D calibrada
- [x] Peças do rack impressas
- [x] Mini PCs posicionados
- [x] Switch montado no rack
- [ ] Instalação dos sistemas operacionais
- [ ] Provisionamento com Ansible/Kubernetes

---

## 🔜 Próximos Passos

- Instalar Debian ou Fedora nos mini PCs
- Automatizar setup com Ansible
- Testar cluster Kubernetes (provavelmente K3s)
- Documentar rede, DNS e backup

---

*Gabriel Amorim — Atualizado em 21/06/2025*
