export const ProjectStates = {
  LOADING: 'LOADING',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
};

export class ProjectStateHandler {
  constructor(projectInfoElem, innerProjectElem, projectDescriptionElem, project) {
    this.projectInfoElem = projectInfoElem;
    this.innerProjectElem = innerProjectElem;
    this.projectDescriptionElem = projectDescriptionElem;
    this.project = project;
    this.stateActions = new Map([
      [ProjectStates.LOADING, this.onLoading.bind(this)],
      [ProjectStates.OPEN, this.onOpen.bind(this)],
      [ProjectStates.CLOSED, this.onClosed.bind(this)],
    ]);
  }

  onLoading() {
    this.projectInfoElem.style.opacity = '0%';
    this.projectInfoElem.classList.add('hidden');

    this.projectDescriptionElem.classList.add('hidden');

    this.innerProjectElem.display = 'hidden';
    this.innerProjectElem.style.marginTop = this.project.marginTopClose;
    this.innerProjectElem.style.marginBottom = this.project.marginBottomClose;
  }

  onOpen(callback) {
    if (callback) {
      this.innerProjectElem.addEventListener('animationend', callback);
    }
    this.projectInfoElem.classList.remove('fade-out');
    this.projectInfoElem.classList.add('fade-in');
    this.projectInfoElem.classList.add('visible');

    this.projectDescriptionElem.classList.remove('hidden');
    this.projectDescriptionElem.classList.add('flex');

    this.innerProjectElem.classList.remove('margin-revert');
    this.innerProjectElem.classList.add('margin-change');
  }

  onClosed() {
    this.projectInfoElem.classList.remove('fade-in');
    this.projectInfoElem.classList.remove('visible');
    this.projectInfoElem.classList.add('hidden');
    this.projectInfoElem.classList.add('fade-out');

    this.projectDescriptionElem.classList.remove('flex');
    this.projectDescriptionElem.classList.add('hidden');

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