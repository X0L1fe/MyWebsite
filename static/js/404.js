var $copyContainer = $(".copy-container"),
    $replayIcon = $('#cb-replay'),
    $textElement = $copyContainer.find('p'),
    $handle = $('.handle');

// Разбиваем текст на символы и оборачиваем их в <span>
function splitTextIntoChars(container) {
  container.contents().each(function() {
    if (this.nodeType === 3) { // если это текстовый узел
      var text = $(this).text();
      $(this).replaceWith(text.split('').map(function(char) {
        return '<span class="char">' + (char === ' ' ? '&nbsp;' : char) + '</span>';
      }).join(''));
    } else if (this.nodeType === 1) { // если это HTML элемент (например, <a>)
      splitTextIntoChars($(this)); // рекурсивно разбиваем текст в элементах
    }
  });
}

// Вызываем функцию для разбиения текста
splitTextIntoChars($textElement);

var chars = $copyContainer.find('.char'),
    splitTextTimeline = new TimelineMax();

// Анимация текста и курсора одновременно
function animateCopy() {
  splitTextTimeline.clear(); // Очищаем временную шкалу

  chars.each(function(index, char) {
    var $char = $(char);

    // Получаем точное положение символа
    var charPosition = $char[0].getBoundingClientRect();
    var containerPosition = $copyContainer[0].getBoundingClientRect();
    var relativeX = charPosition.left - containerPosition.left;
    var relativeY = charPosition.top - containerPosition.top;

    splitTextTimeline.add([
      // Анимация появления символа (замедлена до 0.2 сек)
      TweenMax.fromTo($char, 0.2, {autoAlpha: 0}, {autoAlpha: 1, ease: Back.easeInOut.config(1.7)}),
      // Анимация перемещения курсора (замедлена до 0.2 сек)
      TweenMax.to($handle, 0.2, {x: relativeX, y: relativeY})
    ]);
  });
}

// Анимация мигания курсора
function blinkHandle() {
  TweenMax.fromTo($handle, 0.4, {autoAlpha: 0}, {autoAlpha: 1, repeat: -1, yoyo: true});
}

// Инициализация анимации при загрузке
$(document).ready(function() {
  animateCopy();
  blinkHandle();
});

// Повторная анимация по клику
$replayIcon.on('click', function() {
  splitTextTimeline.restart();
});
