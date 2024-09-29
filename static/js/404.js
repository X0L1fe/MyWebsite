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

var chars = $copyContainer.find('.char');

// Анимация текста и курсора
function animateCopy() {
  // Очищаем все символы и прячем их
  chars.css('opacity', 0);

  chars.each(function(index, char) {
    var $char = $(char);

    // Получаем координаты символа относительно страницы
    var charOffset = $char.offset();

    // Анимация появления символа и перемещение курсора
    setTimeout(function() {
      // Плавное появление символа
      $char.css('transition', 'opacity 0.2s ease'); // Добавляем переход
      $char.css('opacity', 1); // Показываем символ

      // Плавное перемещение курсора
      $handle.css({
        top: charOffset.top + 'px',
        left: (charOffset.left + $char.width()) + 'px'
      });
    }, 100 * index); // Задержка для каждого символа
  });
}


// Инициализация анимации при загрузке
$(document).ready(function() {
  animateCopy();
  blinkHandle();
});

// Повторная анимация по клику
$replayIcon.on('click', function() {
  animateCopy();
});
