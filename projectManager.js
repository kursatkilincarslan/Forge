const ProjectManager = {
  INDEX_KEY: 'forge_project_index',
  ACTIVE_KEY: 'forge_active_project',

  getProjectList() {
    const list = localStorage.getItem(this.INDEX_KEY);
    return list ? JSON.parse(list) : [];
  },

  saveProject(projectName, projectData) {
    let list = this.getProjectList();

    if (!list.includes(projectName)) {
      list.push(projectName);
      localStorage.setItem(this.INDEX_KEY, JSON.stringify(list));
    }

    const storageKey = `forge_proj_${projectName}`;
    localStorage.setItem(storageKey, JSON.stringify(projectData));

    this.setActiveProject(projectName);
    console.log(`"${projectName}" is saved.`);
  },

  loadProject(projectName) {
    const storageKey = `forge_proj_${projectName}`;
    const data = localStorage.getItem(storageKey);

    if (data) {
      this.setActiveProject(projectName);
      return JSON.parse(data);
    }
    console.error(`"${projectName}" couldn't find in localStorage.`);
    return null;
  },

  deleteProject(projectName) {
    let list = this.getProjectList();
    list = list.filter(name => name !== projectName);
    localStorage.setItem(this.INDEX_KEY, JSON.stringify(list));

    localStorage.removeItem(`forge_proj_${projectName}`);

    if (this.getActiveProjectName() === projectName) {
      localStorage.removeItem(this.ACTIVE_KEY);
    }
    console.log(`"${projectName}" is deleted.`);
  },

  getActiveProjectName() {
    return localStorage.getItem(this.ACTIVE_KEY);
  },

  setActiveProject(projectName) {
    localStorage.setItem(this.ACTIVE_KEY, projectName);
  },

  loadActiveProject() {
    const activeName = this.getActiveProjectName();
    if (activeName) {
      return this.loadProject(activeName);
    }
    const list = this.getProjectList();
    if (list.length > 0) {
      return this.loadProject(list[0]);
    }
    return null;
  }
};