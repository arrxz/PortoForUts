import { Modal } from 'bootstrap';
import { PROJECTS, Project } from './content';

export function initProjectModal() {
  const modalEl = document.getElementById('projectDetailModal');
  if (!modalEl) return;

  const bsModal = new Modal(modalEl);

  const titleEl = document.getElementById('modalProjectTitle');
  const roleEl = document.getElementById('modalProjectRole');
  const indexEl = document.getElementById('modalProjectIndex');
  const problemEl = document.getElementById('modalProjectProblem');
  const solutionEl = document.getElementById('modalProjectSolution');
  const resultEl = document.getElementById('modalProjectResult');
  const stackContainer = document.getElementById('modalProjectStack');
  const linksContainer = document.getElementById('modalProjectLinks');

  function openProject(project: Project) {
    if (titleEl) titleEl.textContent = project.title;
    if (roleEl) roleEl.textContent = project.role;
    if (indexEl) indexEl.textContent = project.index;
    if (problemEl) problemEl.textContent = project.problem;
    if (solutionEl) solutionEl.textContent = project.solution;
    if (resultEl) resultEl.textContent = project.result;

    if (stackContainer) {
      stackContainer.innerHTML = '';
      project.stack.forEach((tech) => {
        const badge = document.createElement('span');
        badge.className = 'px-2.5 py-1 text-xs font-mono font-medium border border-ink/20 bg-sand/40 text-ink';
        badge.textContent = tech;
        stackContainer.appendChild(badge);
      });
    }

    if (linksContainer) {
      linksContainer.innerHTML = '';
      project.links.forEach((link) => {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'inline-flex items-center gap-1.5 px-4 py-2 bg-orange text-ink font-bold text-xs hover:bg-ink hover:text-on-ink transition';
        a.innerHTML = `<span>${link.label}</span> <span>&rarr;</span>`;
        linksContainer.appendChild(a);
      });
    }

    bsModal.show();
  }

  // Bind click handlers to project trigger buttons
  document.querySelectorAll<HTMLElement>('[data-project-slug]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const slug = btn.getAttribute('data-project-slug');
      const project = PROJECTS.find((p) => p.slug === slug);
      if (project) {
        openProject(project);
      }
    });
  });
}
