# 🌊 Site PSA Hídrico - Bacia do Rio Ipojuca

## 📋 Sobre o Projeto
[cite_start]Este é um produto acadêmico desenvolvido para o Mestrado Profissional em Gestão Ambiental (MPGA) do IFPE. [cite_start]A plataforma apresenta a modelagem geoespacial para o Pagamento por Serviços Ambientais (PSA) Hídricos, integrando critérios biofísicos para suporte à decisão governamental e ambiental[cite: 15].

---

## ✨ Funcionalidades Principais

### 🏠 Site Principal (index.html)
1. [cite_start]**Seção Hero**: Apresentação com estatísticas dinâmicas sobre a área da bacia (3.435 km²), nascentes mapeadas (347) e população atendida[cite: 19].
2. [cite_start]**Metodologia**: Explicação detalhada dos 5 critérios biofísicos utilizados na priorização:
   - [cite_start]**C1: Proximidade a Nascentes** (Peso: 40,7%)[cite: 19].
   - [cite_start]**C2: Cobertura Vegetal** (Peso: 25,1%)[cite: 19].
   - [cite_start]**C3: Erodibilidade** (Peso: 14,6%)[cite: 19].
   - [cite_start]**C4: Declividade** (Peso: 6,5%)[cite: 19].
   - [cite_start]**C5: Proximidade à Floresta** (Peso: 13,2%)[cite: 19].
3. [cite_start]**Análise Multicritério (AHP)**: Visualização da Matriz de Saaty (1980), pesos resultantes e análise de consistência (Razão de Consistência < 10%)[cite: 19].
4. [cite_start]**Mapas Interativos**: Integração com Leaflet.js para visualização espacial dos critérios e do mapa final de prioridade[cite: 17, 19].
5. [cite_start]**Dashboard**: Gráficos dinâmicos (Chart.js) representando a distribuição de pesos e áreas por classe de prioridade[cite: 17, 19].

### 🔐 Painel Administrativo
* [cite_start]**Acesso**: `admin/login.html`.
* [cite_start]**Segurança**: Edição de campos protegida por login e senha[cite: 15, 16].
* [cite_start]**Gerenciamento**: Permite atualizar estatísticas, textos do projeto e documentos para download em tempo real[cite: 14, 16].

---

## 🚀 Tecnologias Utilizadas
* [cite_start]**Frontend**: HTML5, CSS3, Bootstrap 5.3.2 e JavaScript ES6+[cite: 14, 19].
* [cite_start]**Mapas**: Leaflet.js 1.9.4[cite: 19].
* [cite_start]**Gráficos**: Chart.js 4.4.0[cite: 19].
* [cite_start]**Persistência**: LocalStorage para salvamento de edições administrativas[cite: 16, 17].

---

## 📂 Estrutura de Pastas
- [cite_start]`index.html`: Página principal e interface de edição[cite: 15].
- [cite_start]`admin.js`: Lógica de segurança e salvamento das edições[cite: 15, 16].
- [cite_start]`assets/css/style.css`: Estilos visuais acadêmicos[cite: 15, 18].
- [cite_start]`assets/js/main.js`: Lógica para mapas, gráficos e carregamento de conteúdo[cite: 15, 17].

---

## 🌐 Como Publicar (Gratuito e Permanente)
[cite_start]O projeto é 100% frontend e pode ser hospedado via **GitHub Pages**[cite: 1, 15]:
1. [cite_start]Crie um repositório público no GitHub[cite: 1].
2. [cite_start]Faça o upload de todos os arquivos respeitando a estrutura de pastas[cite: 1].
3. [cite_start]Em **Settings > Pages**, selecione a branch `main` e a pasta `/(root)`[cite: 1].
4. [cite_start]Acesse a URL gerada: `https://seu-usuario.github.io/nome-do-repositorio/`[cite: 1].

---

**Desenvolvido para conservação dos recursos hídricos e excelência acadêmica** 🎓  
**© 2025 PSA Hídrico Ipojuca | [cite_start]IFPE MPGA**
