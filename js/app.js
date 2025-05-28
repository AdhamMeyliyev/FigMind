const startBtn = document.getElementById('startBtn');
const gameArea = document.getElementById('gameArea');
const shapesContainer = document.getElementById('shapesContainer');
const dropZone = document.getElementById('dropZone');
const feedback = document.getElementById('feedback');

const retryBtn = document.createElement('button');
retryBtn.textContent = "🔁 Qayta boshlash";
retryBtn.className = 'retry-btn d-none';
retryBtn.addEventListener('click', () => {
  retryBtn.classList.add('d-none');
  dropZone.innerHTML = '';
  startGame();
});
document.body.appendChild(retryBtn);

const shapeTemplates = [
  { color: 'red', form: 'circle' },
  { color: 'blue', form: 'square' },
  { color: 'green', form: 'diamond' },
  { color: 'yellow', form: 'circle' },
  { color: 'purple', form: 'square' },
  { color: 'orange', form: 'diamond' }
];

let currentShapes = [];
let currentQuestion = null;

startBtn.addEventListener('click', () => {
  startBtn.classList.add('d-none');
  gameArea.classList.remove('d-none');
  startGame();
});

function startGame() {
  currentShapes = generateRandomShapes();
  generateShapes(currentShapes);
  generateQuestion(currentShapes);
  feedback.innerText = '';
}

function generateRandomShapes() {
  return shapeTemplates.map((template, index) => ({
    id: index + 1,
    ...template
  })).sort(() => Math.random() - 0.5);
}

function generateShapes(shapesList) {
  shapesContainer.innerHTML = '';
  shapesList.forEach(shape => {
    const div = document.createElement('div');
    div.classList.add('shape', shape.color, shape.form);
    div.setAttribute('draggable', 'true');
    div.setAttribute('data-id', shape.id);
    div.addEventListener('dragstart', handleDragStart);
    shapesContainer.appendChild(div);
  });
}

function handleDragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.dataset.id);
}

function generateQuestion(shapesList) {
  const randomIndex = Math.floor(Math.random() * shapesList.length);
  currentQuestion = shapesList[randomIndex];

  const questionText = `🧠 Iltimos, ${translateColor(currentQuestion.color)} ${translateForm(currentQuestion.form)} ni topib joylashtiring!`;
  feedback.innerText = questionText;
  feedback.style.color = '#333';
}

dropZone.addEventListener('dragover', e => e.preventDefault());

dropZone.addEventListener('drop', e => {
  e.preventDefault();
  const shapeId = e.dataTransfer.getData('text/plain');
  const shape = currentShapes.find(s => s.id == shapeId);

  if (shape) {
    const droppedShape = document.querySelector(`[data-id='${shapeId}']`);
    dropZone.innerHTML = '';
    dropZone.appendChild(droppedShape);

    if (shape.color === currentQuestion.color && shape.form === currentQuestion.form) {
      feedback.innerText = '🎉 Ajoyib! To‘g‘ri joylashtirdingiz!';
      feedback.style.color = '#00B074';

      setTimeout(() => {
        dropZone.innerHTML = '';
        startGame();
      }, 1500);
    } else {
      feedback.innerText = '❌ Bu noto‘g‘ri shakl. Qayta urinib ko‘ring!';
      feedback.style.color = '#ff4d4d';
      retryBtn.classList.remove('d-none');
    }
  }
});

function translateColor(color) {
  const colors = {
    red: 'qizil',
    blue: 'ko\'k',
    green: 'yashil',
    yellow: 'sariq',
    purple: 'siyohrang',
    orange: 'to‘q sariq'
  };
  return colors[color] || color;
}

function translateForm(form) {
  const forms = {
    circle: 'aylana',
    square: 'kvadrat',
    diamond: 'romb'
  };
  return forms[form] || form;
}
