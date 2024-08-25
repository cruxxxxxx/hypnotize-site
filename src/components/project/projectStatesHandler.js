export const ProjectStates = {
  LOADING: 'LOADING',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  HOVER_IN: 'HOVER_IN'
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
      [ProjectStates.HOVER_IN, this.onHoverIn.bind(this)]
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

    this.innerProjectElem.classList.remove('margin-hover');
    this.innerProjectElem.classList.remove('margin-revert');
    this.innerProjectElem.classList.add('margin-change');
  }

  onHoverIn(callback) {
    this.innerProjectElem.classList.remove('margin-revert');
    this.innerProjectElem.classList.add('margin-hover');
  }

  onClosed() {
    this.projectInfoElem.classList.remove('fade-in');
    this.projectInfoElem.classList.remove('visible');
    this.projectInfoElem.classList.add('hidden');
    this.projectInfoElem.classList.add('fade-out');

    this.projectDescriptionElem.classList.remove('flex');
    this.projectDescriptionElem.classList.add('hidden');

    const currentMarginTop = window.getComputedStyle(this.innerProjectElem).marginTop;
    const currentMarginBottom = window.getComputedStyle(this.innerProjectElem).marginBottom;

    if(currentMarginTop != this.project.marginTopClose || currentMarginBottom != this.project.marginBottomClose) {
      this.innerProjectElem.style.marginTop = currentMarginTop;
      this.innerProjectElem.style.marginBottom = currentMarginBottom;

      this.innerProjectElem.classList.remove('margin-hover');
      this.innerProjectElem.classList.remove('margin-change');
      this.innerProjectElem.classList.add('margin-revert');

      const onMarginRevertEnd = () => {
        this.innerProjectElem.style.marginTop = this.project.marginTopClose;
        this.innerProjectElem.style.marginBottom = this.project.marginBottomClose;
        this.innerProjectElem.classList.remove('margin-revert');
        this.innerProjectElem.removeEventListener('animationend', onMarginRevertEnd);
      };

      this.innerProjectElem.addEventListener('animationend', onMarginRevertEnd);
    }

  }

  onStateChange(state, callback) {
    const action = this.stateActions.get(state);
    if (action) {
      action(callback);
    }
  }
}