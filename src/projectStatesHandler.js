export const ProjectStates = {
  LOADING: 'LOADING',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};

export class ProjectStateHandler {
  constructor(projectInfoElem, innerProjectElem, project) {
    this.projectInfoElem = projectInfoElem;
    this.innerProjectElem = innerProjectElem;
    this.project = project;
    this.stateActions = new Map([
      [ProjectStates.LOADING, this.onLoading.bind(this)],
      [ProjectStates.OPEN, this.onOpen.bind(this)],
      [ProjectStates.CLOSED, this.onClosed.bind(this)],
    ]);
  }

  onLoading() {
    this.projectInfoElem.style.opacity = '0%';
    this.innerProjectElem.style.marginTop = this.project.marginTopClose;
    this.innerProjectElem.style.marginBottom = this.project.marginBottomClose;
  }

  onOpen(callback) {
    if (callback) {
      this.innerProjectElem.addEventListener('animationend', callback);
    }
    this.projectInfoElem.classList.remove('fade-out');
    this.projectInfoElem.classList.add('fade-in');
    this.innerProjectElem.classList.remove('margin-revert');
    this.innerProjectElem.classList.add('margin-change');
  }

  onClosed() {
    this.projectInfoElem.classList.remove('fade-in');
    this.projectInfoElem.classList.add('fade-out');
    this.innerProjectElem.classList.remove('margin-change');
    this.innerProjectElem.classList.add('margin-revert');
  }

  onStateChange(state, callback) {
    const action = this.stateActions.get(state);
    if (action) {
      action(callback);
    }
  }
}