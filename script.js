'use strict';
var attackedCell = "";
// Генерация поля
var cellX, cellY, setCell;
var quantityCellsSet; //Кол-во ячеек необоходимых для проверки(в зависимости от размера корабля). Используется для итераций.
var shipId = 0;
var directionAxis;
var countEngagedYes; //счетчик на кол-во true занятости проверяемых ячеек
var accessDirectionArr = []; //Массив доступных направлений для выбора в рандоме
////////////////////////////////////////////
var turnCountPl = 0; //кол-во ходов игрока
var turnCountAl = 0; //кол-во ходов компа
var hitPlCount = 0; //кол-во очково попаданий игкрока
var hitAlCount = 0; //кол-во очково попаданий компа
var destrPlCount = 0; // кол-во затопленных кораблей игроком
var destrAlCount = 0; // кол-во затопленных кораблей компом
var alTurnStatus = "default"; //(default - генерит, атакует. search - попал, ищет рядом. ) сюда сохранять string статус предыдущего шага Al чтобы при следующем шаге через IF значения данной переменной определять поведение
var attackedCell;
var attackedSearchCell;
var cellXSearch;
var cellYSearch;
var setCell3; //искомая ячейка на 3 шаге
var setCell4;
var cellXNext;
var cellYNext;
var cellXNext1; // переменная для выбоа 1из2 значений рандома на 3 шаге
var cellYNext1; // переменная для выбоа 1из2 значений рандома на 3 шаге
var cellXNext2; // переменная для выбоа 1из2 значений рандома на 3 шаге
var cellYNext2; // переменная для выбоа 1из2 значений рандома на 3 шаге
var cellXStep4;
var cellYStep4;
var currentAttackedShip; //раненый корабль

var musicTrack = document.querySelector(".song");
//musicTrack.volume = 1;
var musicOnIcon = 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDYwIDYwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2MCA2MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIzMnB4IiBoZWlnaHQ9IjMycHgiPgo8cGF0aCBkPSJNMzAsMEMxMy40NTgsMCwwLDEzLjQ1OCwwLDMwczEzLjQ1OCwzMCwzMCwzMHMzMC0xMy40NTgsMzAtMzBTNDYuNTQyLDAsMzAsMHogTTM2LDQ4Ljg5NEMzNiw1MC42MDYsMzQuNjA2LDUyLDMyLjg5Myw1MiAgYy0wLjU0NywwLTEuMDktMC4xNDktMS41NzEtMC40MzJjLTAuMDYzLTAuMDM3LTAuMTIxLTAuMDgxLTAuMTc0LTAuMTMxTDE3LjkwNiwzOS4xMDlDMTcuNzU2LDM5LjAzNywxNy41OTMsMzksMTcuNDI3LDM5SDkuMTA0ICBDNy4zOTIsMzksNiwzNy42MDcsNiwzNS44OTZWMjMuMTA0QzYsMjEuMzkzLDcuMzkyLDIwLDkuMTA0LDIwaDguMzI0YzAuMTY2LDAsMC4zMjktMC4wMzcsMC40NzktMC4xMDlMMzEuMTQ4LDcuNTYzICBjMC4wNTMtMC4wNSwwLjExMi0wLjA5NCwwLjE3NC0wLjEzMUMzMS44MDMsNy4xNDksMzIuMzQ2LDcsMzIuODkzLDdDMzQuNjA2LDcsMzYsOC4zOTQsMzYsMTAuMTA2VjQ4Ljg5NHogTTM5LDM5ICBjLTAuMjU2LDAtMC41MTItMC4wOTgtMC43MDctMC4yOTNjLTAuMzkxLTAuMzkxLTAuMzkxLTEuMDIzLDAtMS40MTRjNC4yOTctNC4yOTcsNC4yOTctMTEuMjg5LDAtMTUuNTg2ICBjLTAuMzkxLTAuMzkxLTAuMzkxLTEuMDIzLDAtMS40MTRzMS4wMjMtMC4zOTEsMS40MTQsMGM1LjA3Nyw1LjA3Nyw1LjA3NywxMy4zMzcsMCwxOC40MTRDMzkuNTEyLDM4LjkwMiwzOS4yNTYsMzksMzksMzl6ICAgTTQzLjI0OCw0Mi43NDljLTAuMTk1LDAuMTk1LTAuNDUxLDAuMjkzLTAuNzA3LDAuMjkzcy0wLjUxMi0wLjA5OC0wLjcwNy0wLjI5M2MtMC4zOTEtMC4zOTEtMC4zOTEtMS4wMjMsMC0xLjQxNCAgYzYuMjM4LTYuMjM4LDYuMjM4LTE2LjM5LDAtMjIuNjI4Yy0wLjM5MS0wLjM5MS0wLjM5MS0xLjAyMywwLTEuNDE0czEuMDIzLTAuMzkxLDEuNDE0LDBDNTAuMjY2LDI0LjMxMiw1MC4yNjYsMzUuNzMsNDMuMjQ4LDQyLjc0OSAgeiIgZmlsbD0iI2UwZDE5MiIvPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K';
var musicOffIcon = 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDYwIDYwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2MCA2MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIzMnB4IiBoZWlnaHQ9IjMycHgiPgo8Zz4KCTxwYXRoIGQ9Ik01MS43MDcsOC4yOTNjLTAuMzkxLTAuMzkxLTEuMDIzLTAuMzkxLTEuNDE0LDBsLTQyLDQyYy0wLjM5MSwwLjM5MS0wLjM5MSwxLjAyMywwLDEuNDE0QzguNDg4LDUxLjkwMiw4Ljc0NCw1Miw5LDUyICAgczAuNTEyLTAuMDk4LDAuNzA3LTAuMjkzbDQyLTQyQzUyLjA5OCw5LjMxNiw1Mi4wOTgsOC42ODQsNTEuNzA3LDguMjkzeiIgZmlsbD0iI2UwZDE5MiIvPgoJPHBhdGggZD0iTTUyLjg0MSwxMC41NjFMNDIsMjEuNDAydjI3LjQ5MUM0Miw1MC42MDYsNDAuNjA2LDUyLDM4Ljg5Myw1MmMtMC41NDcsMC0xLjA5LTAuMTQ5LTEuNTcxLTAuNDMyICAgYy0wLjA2My0wLjAzNy0wLjEyMS0wLjA4MS0wLjE3NC0wLjEzMUwyNC4xMDYsMzkuMjk2TDEwLjU2MSw1Mi44NDFDMTUuOTgyLDU3LjQ2OSwyMi43OTUsNjAsMzAsNjAgICBjOC4wMTMsMCwxNS41NDctMy4xMjEsMjEuMjEzLTguNzg3UzYwLDM4LjAxMyw2MCwzMEM2MCwyMi43OTUsNTcuNDY5LDE1Ljk4Miw1Mi44NDEsMTAuNTYxeiIgZmlsbD0iI2UwZDE5MiIvPgoJPHBhdGggZD0iTTE1LjEwNCwzOUMxMy4zOTIsMzksMTIsMzcuNjA3LDEyLDM1Ljg5NlYyMy4xMDRDMTIsMjEuMzkzLDEzLjM5MiwyMCwxNS4xMDQsMjBoOC4zMjRjMC4xNjYsMCwwLjMyOS0wLjAzNywwLjQ3OS0wLjEwOSAgIEwzNy4xNDgsNy41NjNjMC4wNTMtMC4wNSwwLjExMi0wLjA5NCwwLjE3NC0wLjEzMUMzNy44MDMsNy4xNDksMzguMzQ2LDcsMzguODkzLDdDNDAuNjA2LDcsNDIsOC4zOTQsNDIsMTAuMTA2djQuNDc5bDcuNDMzLTcuNDMyICAgQzQ0LjAxMywyLjUyOSwzNy4yMDMsMCwzMCwwQzIxLjk4NywwLDE0LjQ1MywzLjEyMSw4Ljc4Nyw4Ljc4N0MzLjEyMSwxNC40NTMsMCwyMS45ODcsMCwzMGMwLDcuMjAyLDIuNTI4LDE0LjAxMyw3LjE1MywxOS40MzIgICBMMTcuNTg2LDM5SDE1LjEwNHoiIGZpbGw9IiNlMGQxOTIiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K';
function clearAllCounts() {
    attackedCell = "";
    cellX = undefined;
    cellY = undefined;
    setCell = undefined;
    quantityCellsSet = undefined; //Кол-во ячеек необоходимых для проверки(в зависимости от размера корабля). Используется для итераций.
    shipId = 0;
    directionAxis = undefined;
    countEngagedYes = undefined; //счетчик на кол-во true занятости проверяемых ячеек
    accessDirectionArr = []; //Массив доступных направлений для выбора в рандоме
    ////////////////////////////////////////////
    turnCountPl = 0; //кол-во ходов игрока
    turnCountAl = 0; //кол-во ходов компа
    hitPlCount = 0; //кол-во очково попаданий игкрока
    hitAlCount = 0; //кол-во очково попаданий компа
    destrPlCount = 0; // кол-во затопленных кораблей игроком
    destrAlCount = 0; // кол-во затопленных кораблей компом
    alTurnStatus = "default"; //(default - генерит, атакует. search - попал, ищет рядом. ) сюда сохранять string статус предыдущего шага Al чтобы при следующем шаге через IF значения данной переменной определять поведение
    attackedCell = undefined;
    attackedSearchCell = undefined;
    cellXSearch = undefined;
    cellYSearch = undefined;
    setCell3 = undefined; //искомая ячейка на 3 шаге
    setCell4 = undefined;
    cellXNext = undefined;
    cellYNext = undefined;
    cellXNext1 = undefined; // переменная для выбоа 1из2 значений рандома на 3 шаге
    cellYNext1 = undefined; // переменная для выбоа 1из2 значений рандома на 3 шаге
    cellXNext2 = undefined; // переменная для выбоа 1из2 значений рандома на 3 шаге
    cellYNext2 = undefined; // переменная для выбоа 1из2 значений рандома на 3 шаге
    cellXStep4 = undefined;
    cellYStep4 = undefined;
    currentAttackedShip = undefined; //раненый корабль

    document.querySelector('.turnCountPl').textContent = 0;
    document.querySelector('.turnCountAl').textContent = 0;
    document.querySelector('.hitPlCount').textContent = 0;
    document.querySelector('.hitAlCount').textContent = 0;
    document.querySelector('.destrPlCount').textContent = 0;
    document.querySelector('.destrAlCount').textContent = 0;
}
function fadeOut(el){
    el.style.opacity = 1;
  
    (function fade() {
      if ((el.style.opacity -= .1) < 0) {
        el.style.display = "none";
      } else {
        requestAnimationFrame(fade);
      }
    })();
  };
  
function fadeIn(el, display){
    el.style.opacity = 0;
    el.style.display = display || "block";

    (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += .1) > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
        }
    })();
};
function hitSoundPlay() {
    var hitSound = document.querySelector(".hit_sound");
    hitSound.volume = 0.3;
    hitSound.stop();
    hitSound.play();
}
document.querySelector('.title-menu__music-option').addEventListener('click', function(){
    musicTurn();
});
document.querySelector('.music-volume-control').addEventListener('click', function(){
    musicTurn();
});
function musicTurn(){
	if (musicTrack.volume === 1) {
        musicTrack.volume = 0;
        document.querySelector('.title-menu__music-option-turn').innerText = 'ВЫКЛ.';
        document.querySelector('.music-volume-control img').src = musicOffIcon;
        
	} else {
        document.querySelector('.title-menu__music-option-turn').innerText ='ВКЛ.';
        document.querySelector('.music-volume-control img').src = musicOnIcon;
		musicTrack.volume = 1
	}
}
function musicPlay() {
    
    musicTrack.play();
    musicTrack.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
}
//document.querySelector('.volume_0').add
HTMLAudioElement.prototype.stop = function() {
    this.pause();
    this.currentTime = 0.0;
}

function startGame() {
    //блокировать кнопку старт
    fadeIn(document.querySelector('.overlay_screen'));
    setTimeout(function() { introStart() }, 1000);
    //морская пехота

}

function typeText(l, d, g, h, m) { //эффект печатающгося текста
var b, a = d.shift(),
    f, e = g,
    k = performance.now();
d.push(a);
a = a.split("");
b = document.createTextNode(a.shift());
l.appendChild(b);
    requestAnimationFrame(function n(c) {
        if(d.length === 0) {//если массив закончился то завершаем набор. (и вызываем ф-ию)
            setTimeout(gameplayStart, 3000);
            return;
        }
        a.length || (a = d.shift(), a = a.split(""), e = h);
        c = (c - k) / e;
        1 < c && (c = 1);
        1 == c && (e == h && (b.data = ""), k = performance.now(), b.data += f = a.shift(), e = +f != +f ? g : m);
        requestAnimationFrame(n)
    })
};
function introStart() {
    musicPlay();
    fadeOut(document.querySelector('.overlay_screen'));
    document.querySelector('.title-container').style.display = 'none';
    document.body.classList.remove('bg-title-screen');
    document.body.classList.add('bg-black-screen');
    
    document.body.insertAdjacentHTML('beforeend',
        '<div class="cut-scene-container"><div class="cut-scene-container__avatar-block"><div class="cut-scene-container__avatar-block__avatar"><img src="enemy_avatar.png"></div><div class="cut-scene-container__avatar-block__avatar"><img src="enemy_avatar.png"></div></div><div class="cut-scene-container__textblock"></div></div>'
    );
    
    var textContainer = document.querySelector(".cut-scene-container__textblock");
    typeText(textContainer, ["Враг атакует!!"], 70, 2000, 70);
}
function gameplayStart() {
    
    fadeOut(document.querySelector('.cut-scene-container'));
    fadeIn(document.querySelector('.overlay_screen'));
    document.querySelector('.wrapper-gameplay').style.display = 'flex';
    setAllShipRandom();
    setTimeout(function(){
        
        fadeOut(document.querySelector('.overlay_screen'));
    }, 1000);
    
}
function notificationSet(notificationText) {
    document.querySelector('.notifications-block').innerText = notificationText;
}
function setDemarkDestroyedShip(currentX, currentY, parent) {
    var variationDirections = [
        '[data-x="' + (currentX + 1) + '"][data-y="' + currentY + '"]',
        '[data-x="' + (currentX - 1) + '"][data-y="' + currentY + '"]',
        '[data-x="' + currentX + '"][data-y="' + (currentY + 1) + '"]',
        '[data-x="' + currentX + '"][data-y="' + (currentY - 1) + '"]',
        '[data-x="' + (currentX + 1) + '"][data-y="' + (currentY + 1) + '"]',
        '[data-x="' + (currentX + 1) + '"][data-y="' + (currentY - 1) + '"]',
        '[data-x="' + (currentX - 1) + '"][data-y="' + (currentY + 1) + '"]',
        '[data-x="' + (currentX - 1) + '"][data-y="' + (currentY - 1) + '"]'
    ];
    for (var i = 0; i < variationDirections.length; i++) {
        var currentVariation = document.querySelector(parent + ' .cell' + variationDirections[i] + ' ');
        if (currentVariation !== null) {
            currentVariation.setAttribute('data-attacked', 'yes');
        }
    }
}
function setDestroyStatusForAl(targetShip) {
    var dataIdShip = targetShip.getAttribute('data-id-ship');
    setTimeout(function() { 
        [].forEach.call(document.querySelectorAll('.areaPl .cell[data-id-ship="' + dataIdShip + '"]'), function(el) {
            el.classList.add('destroyed');
        })
    }, 1000);
}
function attackAl(parent) { // поведение Al при атаке
    document.querySelector('.overlay').style.display = 'block';
    if (hitAlCount === 20) {
        gameLose();
        return
    }
    if (alTurnStatus === "default") {
        cellGenerator(); // гнерим координату куда бить
        attackedCell = document.querySelector(parent + ' .cell[data-x="' + cellX + '"][data-y="' + cellY + '"]'); //определяем клетку
        if (attackedCell.getAttribute('data-attacked') === 'yes') { //если уже сюда была атака, то генерим заново
            attackAl(parent);
        } else {
            document.querySelector('.turnCountAl').textContent = ++turnCountAl; //прибавляем счет ходов компа
            attackedCell.setAttribute('data-attacked', 'yes'); //закрашиваем клетку, отмечаем как атакованную
            attackedCell.classList.add('tried');
            if (attackedCell.getAttribute('data-ship-availability') === 'yes') { //если AL попал в корабль
                attackedCell.classList.add('damaged'); //закрашиваем в красный
                document.querySelector('.hitAlCount').innerHTML = ++hitAlCount; //прибавляем счет очков попаданий
                if (attackedCell.getAttribute('data-ship-type') === '1') { //если попал в однопалубник
                    setDemarkDestroyedShip(cellX, cellY, '.areaPl');
                    setDestroyStatusForAl(attackedCell);
                    document.querySelector('.destrAlCount').textContent = ++destrAlCount; //прибавляем счет подбитых кораблей компом
                    alTurnStatus = "default"; // на следующем шаге ищем по новой
                    setTimeout(function() { attackAl('.areaPl') }, 1000);
                } else {
                    currentAttackedShip = attackedCell.getAttribute('data-ship-type'); // определяет тип корабля в который попал AL для определния оставшихся клеток которые надо найти
                    //alert('Попадание в ' + currentAttackedShip + 'палублный корабль');
                    notificationSet('Враг попал в наш ' + currentAttackedShip + '-ёх палублный корабль');
                    currentAttackedShip--;
                    alTurnStatus = "search"; // на следующем шаге ищем рядом
                    setTimeout(function() { attackAl('.areaPl') }, 1000);
                }
            } else {
                document.querySelector('.overlay').style.display = 'none';
            }
        }
        return;
    }
    if (alTurnStatus === "search") {
        //alert(attackedCell.attr('data-x')+ ' ' + attackedCell.attr('data-y'));
        //alert(cellX + ' ' + cellY);
        document.querySelector('.turnCountAl').textContent = ++turnCountAl; //прибавляем счет ходов компа
        quantityCellsSet = 1;
        accessCellScaning('data-attacked', '.areaPl');
        //alert('значение массива ' + accessDirectionArr + 'длина ' + accessDirectionArr.length);
        var randomDirectionAxis = Math.floor(Math.random() * accessDirectionArr.length); // рандом числа из доступных в массиве направлений
        directionAxis = accessDirectionArr[randomDirectionAxis]; //задаем случайное число из доступных направлений
        //directionAxis = 1;
        //alert(directionAxis);
        if (directionAxis === 1) {
            cellXSearch = +(cellX + 1);
            cellYSearch = cellY;
        }
        if (directionAxis === 2) {
            cellXSearch = cellX;
            cellYSearch = +(cellY + 1);
        }
        if (directionAxis === 3) {
            cellXSearch = +(cellX - 1);
            cellYSearch = cellY;
        }
        if (directionAxis === 4) {
            cellXSearch = cellX;
            cellYSearch = +(cellY - 1);
        }
        //alTurnStatus === "next";
        //alert(cellXSearch + ' ' + cellYSearch);
        attackedSearchCell = document.querySelector(parent + ' .cell[data-x="' + cellXSearch + '"][data-y="' + cellYSearch + '"]'); //определяем клетку
        attackedSearchCell.setAttribute('data-attacked', 'yes'); //закрашиваем клетку, отмечаем как атакованную
        attackedSearchCell.classList.add('tried');
        if (attackedSearchCell.getAttribute('data-ship-availability') === 'yes') { //если AL попал в корабль
            attackedSearchCell.classList.add('damaged'); //закрашиваем в красный
            document.querySelector('.hitAlCount').innerHTML = ++hitAlCount; //прибавляем счет очков попаданий
            currentAttackedShip--;
            if (currentAttackedShip === 0) {
                //alert('Ваш корабль полностью уничтожен');
                notificationSet('Ваш корабль полностью уничтожен');
                setDemarkDestroyedShip(cellX, cellY, '.areaPl');
                setDemarkDestroyedShip(cellXSearch, cellYSearch, '.areaPl');
                setDestroyStatusForAl(attackedSearchCell);
                document.querySelector('.destrAlCount').textContent = ++destrAlCount; //прибавляем счет подбитых кораблей компом
                alTurnStatus = "default";
            }
            if (currentAttackedShip > 0) {
                alTurnStatus = "next";
            }
            setTimeout(function() { attackAl('.areaPl') }, 1000);
            return;
        } else { //если AL не попал в корабль
            alTurnStatus === "search";
            document.querySelector('.overlay').style.display = 'none';
        }
        return;
    }
    if (alTurnStatus === "next") {
        document.querySelector('.turnCountAl').textContent = ++turnCountAl; //прибавляем счет ходов компа
        if (cellX === cellXSearch) {
            cellXNext = cellX;
            (function() {
                var y = [cellY, cellYSearch].sort(function(a, b) {
                    return a - b;
                });
                cellYNext1 = y.pop() + 1; //вытаскиваем из массива наибольшее число и прибавляем 1
                cellYNext2 = y[0] - 1; // оставшееся в массиве меньшее число отнимаем 1 
            })();

            (function random3Attack() {
                cellYNext = [cellYNext1, cellYNext2][Math.floor(Math.random() * [cellYNext1, cellYNext2].length)];
                setCell3 = document.querySelector(parent + ' .cell[data-x="' + cellXNext + '"][data-y="' + cellYNext + '"]');
                if (setCell3 === null || setCell3.getAttribute('data-attacked') === 'yes' || cellYNext > 10 || cellYNext < 1) {
                    random3Attack();
                }
            })();

            setCell3.setAttribute('data-attacked', 'yes'); //закрашиваем клетку, отмечаем как атакованную
            setCell3.classList.add('tried');
            if (setCell3.getAttribute('data-ship-availability') === 'yes') { //если AL попал в корабль
                setCell3.classList.add('damaged'); //закрашиваем в красный
                document.querySelector('.hitAlCount').innerHTML = ++hitAlCount; //прибавляем счет очков попаданий
                currentAttackedShip--;
                if (currentAttackedShip === 0) {
                    //alert('Ваш корабль полностью уничтожен');
                    notificationSet('Ваш корабль полностью уничтожен');
                    setDemarkDestroyedShip(cellX, cellY, '.areaPl');
                    setDemarkDestroyedShip(cellXSearch, cellYSearch, '.areaPl');
                    setDemarkDestroyedShip(cellXNext, cellYNext, '.areaPl');
                    setDestroyStatusForAl(setCell3);
                    document.querySelector('.destrAlCount').textContent = ++destrAlCount; //прибавляем счет подбитых кораблей компом
                    alTurnStatus = "default";
                }
                if (currentAttackedShip > 0) {
                    alTurnStatus = "attackStep4";
                }
                setTimeout(function() { attackAl('.areaPl') }, 1000);
                return;
            } else {
                alTurnStatus === "next";
                document.querySelector('.overlay').style.display = 'none';
            }
            return;
        }
        if (cellY === cellYSearch) {
            cellYNext = cellY;

            (function() {
                var x = [cellX, cellXSearch].sort(function(a, b) {
                    return a - b;
                }); //вытаскиваем из массива наибольшее число
                cellXNext1 = x.pop() + 1;
                cellXNext2 = x[0] - 1;
            })();
            (function random3Attack() {
                cellXNext = [cellXNext1, cellXNext2][Math.floor(Math.random() * [cellXNext1, cellXNext2].length)];
                setCell3 = document.querySelector(parent + ' .cell[data-x="' + cellXNext + '"][data-y="' + cellYNext + '"]');
                if (setCell3 === null || setCell3.getAttribute('data-attacked') === 'yes' || cellXNext > 10 || cellXNext < 1) {
                    random3Attack();
                }
            })();
            setCell3.setAttribute('data-attacked', 'yes'); //закрашиваем клетку, отмечаем как атакованную
            setCell3.classList.add('tried');
            if (setCell3.getAttribute('data-ship-availability') === 'yes') { //если AL попал в корабль
                setCell3.classList.add('damaged'); //закрашиваем в красный
                document.querySelector('.hitAlCount').innerHTML = ++hitAlCount; //прибавляем счет очков попаданий
                currentAttackedShip--;
                if (currentAttackedShip === 0) {
                    //alert('Ваш корабль полностью уничтожен');
                    notificationSet('Ваш корабль полностью уничтожен');
                    setDemarkDestroyedShip(cellX, cellY, '.areaPl');
                    setDemarkDestroyedShip(cellXSearch, cellYSearch, '.areaPl');
                    setDemarkDestroyedShip(cellXNext, cellYNext, '.areaPl');
                    setDestroyStatusForAl(setCell3);
                    document.querySelector('.destrAlCount').textContent = ++destrAlCount; //прибавляем счет подбитых кораблей компом
                    alTurnStatus = "default";
                }
                if (currentAttackedShip > 0) {
                    alTurnStatus = "attackStep4";
                }
                setTimeout(function() { attackAl('.areaPl') }, 1000);
                return;
            } else {
                alTurnStatus === "next";
                document.querySelector('.overlay').style.display = 'none';
            }
            return;
        }
    }
    if (alTurnStatus === "attackStep4") {
        document.querySelector('.turnCountAl').textContent = ++turnCountAl; //прибавляем счет ходов компа
        //alert('первая клетка ' + cellX + cellY + 'вторая клетка ' + cellXSearch + cellYSearch + 'третяя клетка' + cellXNext + cellYNext);
        if (cellX === cellXSearch) {
            cellXStep4 = cellXNext;
            (function() {
                var y = [cellY, cellYSearch, cellYNext].sort(function(a, b) {
                    return a - b;
                });
                cellYNext1 = y.pop() + 1; //вытаскиваем из массива наибольшее число и прибавляем 1
                cellYNext2 = y[0] - 1; // оставшееся в массиве меньшее число отнимаем 1 
                //alert('cellYNext1 ' + cellYNext1 + ' cellYNext2 ' + cellYNext2);
            })();
            (function random3Attack() {
                cellYStep4 = [cellYNext1, cellYNext2][Math.floor(Math.random() * [cellYNext1, cellYNext2].length)];
                setCell4 = document.querySelector(parent + ' .cell[data-x="' + cellXStep4 + '"][data-y="' + cellYStep4 + '"]');
                if (setCell4 === null || setCell4.getAttribute('data-attacked') === 'yes' || cellYStep4 > 10 || cellYStep4 < 1) {
                    random3Attack();
                }
            })();
            setCell4.setAttribute('data-attacked', 'yes'); //закрашиваем клетку, отмечаем как атакованную
            setCell4.classList.add('tried');
            if (setCell4.getAttribute('data-ship-availability') === 'yes') { //если AL попал в корабль
                setCell4.classList.add('damaged'); //закрашиваем в красный
                document.querySelector('.hitAlCount').innerHTML = ++hitAlCount; //прибавляем счет очков попаданий
                currentAttackedShip--;
                if (currentAttackedShip === 0) {
                    //alert('Ваш корабль полностью уничтожен');
                    notificationSet('Ваш корабль полностью уничтожен');
                    setDemarkDestroyedShip(cellX, cellY, '.areaPl');
                    setDemarkDestroyedShip(cellXSearch, cellYSearch, '.areaPl');
                    setDemarkDestroyedShip(cellXNext, cellYNext, '.areaPl');
                    setDemarkDestroyedShip(cellXStep4, cellYStep4, '.areaPl');
                    setDestroyStatusForAl(setCell4);
                    document.querySelector('.destrAlCount').textContent = ++destrAlCount; //прибавляем счет подбитых кораблей компом
                    alTurnStatus = "default";
                }
                
                setTimeout(function() { attackAl('.areaPl') }, 1000);
                return;
            } else {
                alTurnStatus === "attackStep4";
                document.querySelector('.overlay').style.display = 'none';
            }
            return;
        }
        if (cellY === cellYSearch) {
            cellYStep4 = cellYNext;
            (function() {
                var x = [cellX, cellXSearch, cellXNext].sort(function(a, b) {
                    return a - b;
                }); //вытаскиваем из массива наибольшее число
                cellXNext1 = x.pop() + 1;
                cellXNext2 = x[0] - 1;
                //alert('cellXNext1 ' + cellXNext1 + ' cellXNext2 ' + cellXNext2);
            })();
            (function random3Attack() {
                cellXStep4 = [cellXNext1, cellXNext2][Math.floor(Math.random() * [cellXNext1, cellXNext2].length)];
                setCell4 = document.querySelector(parent + ' .cell[data-x="' + cellXStep4 + '"][data-y="' + cellYStep4 + '"]');
                if (setCell4 === null || setCell4.getAttribute('data-attacked') === 'yes' || cellXStep4 > 10 || cellXStep4 < 1) {
                    random3Attack();
                }
            })();
            setCell4.setAttribute('data-attacked', 'yes'); //закрашиваем клетку, отмечаем как атакованную
            setCell4.classList.add('tried');
            if (setCell4.getAttribute('data-ship-availability') === 'yes') { //если AL попал в корабль
                setCell4.classList.add('damaged'); //закрашиваем в красный
                document.querySelector('.hitAlCount').innerHTML = ++hitAlCount; //прибавляем счет очков попаданий
                currentAttackedShip--;
                if (currentAttackedShip === 0) {
                    //alert('Ваш корабль полностью уничтожен');
                    notificationSet('Ваш корабль полностью уничтожен');
                    setDemarkDestroyedShip(cellX, cellY, '.areaPl');
                    setDemarkDestroyedShip(cellXSearch, cellYSearch, '.areaPl');
                    setDemarkDestroyedShip(cellXNext, cellYNext, '.areaPl');
                    setDemarkDestroyedShip(cellXStep4, cellYStep4, '.areaPl');
                    setDestroyStatusForAl(setCell4);
                    document.querySelector('.destrAlCount').textContent = ++destrAlCount; //прибавляем счет подбитых кораблей компом
                    alTurnStatus = "default";
                }
                
                setTimeout(function() { attackAl('.areaPl') }, 1000);
                return;
            } else {
                alTurnStatus === "attackStep4";
                document.querySelector('.overlay').style.display = 'none';
            }
            return;
        }
    }
}

function setAllShipRandom() {
    clearAllCounts();
    areaGenerator('.areaPl');
    areaGenerator('.areaAl');
    for (var i = 3; i => 0; i--) {
        for (var s = i; s <= 3; ++s) {
            quantityCellsSet = i;
            ++shipId;
            setShip('.areaPl');
            setShip('.areaAl');
        }
        if (i === 0) {
            break;
        }
    }
    [].forEach.call(document.querySelectorAll('.areaAl .cell'), function(el) {
        el.addEventListener('click', attackPl);
    });
    document.querySelector('.areaAl').insertAdjacentHTML('beforeend',
        '<div class="overlay"></div>'
    );
}

function attackPl() {

    document.querySelector('.turnCountPl').textContent = ++turnCountPl; //прибавляем счет ходов игрока
    this.setAttribute('data-attacked', 'yes');
    this.classList.add('tried');
    if (this.getAttribute('data-ship-availability') === 'yes') {
        notificationSet('Вы ранили вражеский корабль');
        hitSoundPlay();
        this.classList.remove('tried');
        this.classList.add('damaged');
        document.querySelector('.hitPlCount').textContent = ++hitPlCount; //прибавляем счет очков попаданий игрока
        //Если у других клеток с тем же ID данного подбитого корабля больше нет атрибута data-attacked="no" (клетки которые еще не были подбиты), то отметить корабль с данным ID как убил
        var dataIdShip = this.getAttribute('data-id-ship');
        if ((document.querySelectorAll('.areaAl .cell[data-id-ship="' + dataIdShip + '"][data-attacked="no"]').length) == 0) {
            document.querySelector('.destrPlCount').textContent = ++destrPlCount; //прибавляем счет подбитых кораблей игркоком
            //alert('Вы размудохали вражеский корабль');
            notificationSet('Вы размудохали вражеский корабль');
            [].forEach.call(document.querySelectorAll('.areaAl .cell[data-id-ship="' + dataIdShip + '"]'), function(el) {
                el.classList.add('destroyed');
            });
            if (hitPlCount === 20) {
                gameVictory();
                return
            }
        }
        //
    } else {
        document.querySelector('.overlay').style.display = 'block';
        setTimeout(function() { attackAl('.areaPl') }, 1000);
    }
    this.removeEventListener('click', attackPl);
}

function areaGenerator(parent) {
    document.querySelector(parent).innerHTML = '';
    for (var i = 1; i <= 10; i++) {
        for (var s = 1; s <= 10; s++) {
            document.querySelector(parent).insertAdjacentHTML('beforeend', '<div class="cell" data-engaged="no" data-x="' + s + '" data-y="' + i + '"></div>');
        }
        document.querySelector(parent).insertAdjacentHTML('beforeend', '<br/>');
    }

}

function cellGenerator() {
    cellX = Math.floor(Math.random() * (11 - 1)) + 1; //генерим цифру от 1 до 10 для оси X
    cellY = Math.floor(Math.random() * (11 - 1)) + 1; //генерим цифру от 1 до 10 для оси Y
}

function setEngagedCells(parent) { //функция добавляющая атрибуты занятости вокруг установленных кораблей, чтобы не было соприкосновений
    var arrVariations = [
        ' .cell[data-x="' + (cellX + 1) + '"][data-y="' + cellY + '"]',
        ' .cell[data-x="' + (cellX - 1) + '"][data-y="' + cellY + '"]',
        ' .cell[data-x="' + cellX + '"][data-y="' + (cellY + 1) + '"]',
        ' .cell[data-x="' + cellX + '"][data-y="' + (cellY - 1) + '"]',
        ' .cell[data-x="' + (cellX + 1) + '"][data-y="' + (cellY + 1) + '"]',
        ' .cell[data-x="' + (cellX + 1) + '"][data-y="' + (cellY - 1) + '"]',
        ' .cell[data-x="' + (cellX - 1) + '"][data-y="' + (cellY + 1) + '"]',
        ' .cell[data-x="' + (cellX - 1) + '"][data-y="' + (cellY - 1) + '"]'
    ];
    for (var i = 0; i < arrVariations.length; i++) {
        var currentVariation = document.querySelector(parent + arrVariations[i]);
        if (currentVariation !== null) {
            currentVariation.setAttribute('data-engaged', 'yes');
        }
    }
}

function accessCellScaning(param1, parent) { //проверка на свободные ячейки от ключевой при формировании area и при атаке AL исключая уже атакованные
    accessDirectionArr = [];
    (function() { //проверяем правую сторону
        countEngagedYes = 0;
        for (var i = 1; i <= quantityCellsSet; i++) {
            var resultCells = cellX + i;
            var some = document.querySelector(parent + ' .cell[data-x="' + resultCells + '"][data-y="' + cellY + '"]');
            if (some === null || some.getAttribute(param1) === 'yes' || resultCells > 10 || resultCells < 1) {
                countEngagedYes++;
            }
        }
        if (countEngagedYes === 0) {
            accessDirectionArr.push(1);
        }
    })();
    (function() { //проверяем нижнюю сторону
        countEngagedYes = 0;
        for (var i = 1; i <= quantityCellsSet; i++) {
            var resultCells = cellY + i;
            var some = document.querySelector(parent + ' .cell[data-x="' + cellX + '"][data-y="' + resultCells + '"]');
            if (some === null || some.getAttribute(param1) === 'yes' || resultCells > 10 || resultCells < 1) {
                countEngagedYes++;
            }
        }
        if (countEngagedYes === 0) {
            accessDirectionArr.push(2);
        }
    })();
    (function() { //проверяем левую сторону
        countEngagedYes = 0;
        for (var i = 1; i <= quantityCellsSet; i++) {
            var resultCells = cellX - i;
            var some = document.querySelector(parent + ' .cell[data-x="' + resultCells + '"][data-y="' + cellY + '"]');
            if (some === null || some.getAttribute(param1) === 'yes' || resultCells > 10 || resultCells < 1) {
                countEngagedYes++;
            }
        }
        if (countEngagedYes === 0) {
            accessDirectionArr.push(3);
        }
    })();
    (function() { //проверяем верхнюю сторону
        countEngagedYes = 0;
        for (var i = 1; i <= quantityCellsSet; i++) {
            var resultCells = cellY - i;
            var some = document.querySelector(parent + ' .cell[data-x="' + cellX + '"][data-y="' + resultCells + '"]');
            if (some === null || some.getAttribute(param1) === 'yes' || resultCells > 10 || resultCells < 1) {
                countEngagedYes++;
            }
        }
        if (countEngagedYes === 0) {
            accessDirectionArr.push(4);
        }
    })();

}

function setShip(parent) {
    var shipType = quantityCellsSet + 1;

    function setMarkEngagedCells(elem) { //для выбранной ячейки задаем атрибут метки корабля и атрибут то что ячейка занята и закрашиваем

        elem.setAttribute('data-ship-type', shipType);
        elem.setAttribute('data-ship-availability', 'yes');
        elem.setAttribute('data-engaged', 'yes');
        elem.setAttribute('data-id-ship', shipId);
        elem.setAttribute('data-attacked', 'no');
        elem.classList.add('cell-engaged'); // разукрашиваем занятую ячейку на поле игрока
    }
    cellGenerator();
    setCell = document.querySelector(parent + ' .cell[data-x="' + cellX + '"][data-y="' + cellY + '"]'); //определяем ячейку от сгенерированных значений
    if (setCell.getAttribute('data-engaged') === 'yes') { //проверка на занятость ячейки
        setShip(parent);
    } else {
        //var axisXY = cellY + ' ' + cellX;
        //alert(axisXY);
        accessCellScaning('data-engaged', parent);
        //alert(accessDirectionArr);
        if (accessDirectionArr.length === 0) {
            setShip(parent);
        } else {
            var randomDirectionAxis = Math.floor(Math.random() * accessDirectionArr.length); // рандом числа из доступных в массиве направлений
            directionAxis = accessDirectionArr[randomDirectionAxis]; //задаем случайное число из доступных направлений
            setMarkEngagedCells(setCell);

            //Здесь ставим атрибуты занятости для соседних ячеек вокруг выбранной
            setEngagedCells(parent);

            //тут по сути выбор направления в какую сторону устанавливать корабль от выбранной ячейки
            if (directionAxis === 1) {
                ////
                (function() {
                    for (var i = 1; i <= quantityCellsSet; i++) {
                        setMarkEngagedCells(document.querySelector(parent + ' .cell[data-x="' + (++cellX) + '"][data-y="' + cellY + '"]'));
                        setEngagedCells(parent);
                    }
                })();

                ////
            }
            if (directionAxis === 2) {
                ////
                (function() {
                    for (var i = 1; i <= quantityCellsSet; i++) {
                        setMarkEngagedCells(document.querySelector(parent + ' .cell[data-x="' + cellX + '"][data-y="' + (++cellY) + '"]'));
                        setEngagedCells(parent);
                    }
                })();
                ////
            }
            if (directionAxis === 3) {
                ////
                (function() {
                    for (var i = 1; i <= quantityCellsSet; i++) {
                        setMarkEngagedCells(document.querySelector(parent + ' .cell[data-x="' + (--cellX) + '"][data-y="' + cellY + '"]'));
                        setEngagedCells(parent);
                    }
                })();
                ////
            }
            if (directionAxis === 4) {
                ////
                (function() {
                    for (var i = 1; i <= quantityCellsSet; i++) {
                        setMarkEngagedCells(document.querySelector(parent + ' .cell[data-x="' + cellX + '"][data-y="' + (--cellY) + '"]'));
                        setEngagedCells(parent);
                    }
                })();
                ////
            }
        }
    }
}

function gameVictory() {
    alert('ты пабидитель!');
    document.querySelector('.wrapper-gameplay').style.display = 'none';
};

function gameLose() {
    alert('ты прогираль!');
    document.querySelector('.wrapper-gameplay').style.display = 'none';
};