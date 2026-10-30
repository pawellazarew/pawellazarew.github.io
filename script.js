'use strict';
(() => {
  const descriptions = {
    en: ['Give the agent the right knowledge, constraints and task.', 'Use coding agents and tools to turn the idea into a working build.', 'Run checks. Play the game. Look at the screenshots. Read the evidence.', 'Use what failed to improve the next iteration. Keep the human in the loop.'],
    ru: ['Передать агенту нужные знания, ограничения и задачу.', 'С помощью агентов и инструментов превратить идею в рабочий билд.', 'Запустить проверки. Поиграть. Посмотреть скриншоты. Разобрать результаты.', 'Учесть ошибки в следующей итерации. Оставить решения за человеком.']
  };
  let language = 'en';
  let step = 0;
  const nodes = [...document.querySelectorAll('[data-step]')];
  const toggle = document.getElementById('language');
  function renderStep() {
    nodes.forEach((node, index) => {
      node.classList.toggle('active', index === step);
      node.setAttribute('aria-pressed', String(index === step));
    });
    document.getElementById('step-number').textContent = `0${step + 1} / 04`;
    document.getElementById('step-description').textContent = descriptions[language][step];
  }
  function setLanguage(next) {
    language = next;
    document.documentElement.lang = language;
    document.querySelectorAll('[data-en][data-ru]').forEach(element => {
      // These translations are authored locally; no external input is inserted.
      element.innerHTML = element.dataset[language];
    });
    toggle.innerHTML = `${language === 'en' ? 'RU' : 'EN'} <span aria-hidden="true">↗</span>`;
    toggle.setAttribute('aria-label', language === 'en' ? 'Switch to Russian' : 'Switch to English');
    document.title = language === 'en' ? 'Pavel Lazarev — Engineering workshop' : 'Павел Лазарев — Инженерная мастерская';
    renderStep();
  }
  nodes.forEach(node => node.addEventListener('click', () => { step = Number(node.dataset.step); renderStep(); }));
  toggle.addEventListener('click', () => {
    setLanguage(language === 'en' ? 'ru' : 'en');
    try { localStorage.setItem('pavel-language', language); } catch { /* Storage can be disabled. */ }
  });
  try { if (localStorage.getItem('pavel-language') === 'ru') setLanguage('ru'); } catch { /* English remains usable. */ }
})();
