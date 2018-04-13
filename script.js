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
var cellXNext;
var cellYNext;
var cellXNext1; // переменная для выбоа 1из2 значений рандома на 3 шаге
var cellYNext1; // переменная для выбоа 1из2 значений рандома на 3 шаге
var cellXNext2; // переменная для выбоа 1из2 значений рандома на 3 шаге
var cellYNext2; // переменная для выбоа 1из2 значений рандома на 3 шаге
var currentAttackedShip; //раненый корабль

var personSailor = "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA0OTYuMiA0OTYuMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDk2LjIgNDk2LjI7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiPgo8cGF0aCBzdHlsZT0iZmlsbDojNDhBMUFGOyIgZD0iTTI0OC4xLDBDMTExLjEsMCwwLDExMS4xLDAsMjQ4LjFzMTExLjEsMjQ4LjEsMjQ4LjEsMjQ4LjFzMjQ4LjEtMTExLjEsMjQ4LjEtMjQ4LjFTMzg1LjEsMCwyNDguMSwweiAgIi8+CjxwYXRoIGQ9Ik0yNDguMSwxMTUuNmMtOTIuNiwwLTEwOC43LDU2LjEtMTA4LjcsNTYuMXMzMS41LDMyLDEwOC43LDMyczEwOC42LTMxLjgsMTA4LjYtMzEuOFMzNDAuNywxMTUuNiwyNDguMSwxMTUuNnoiLz4KPHJlY3QgeD0iMTY4LjMiIHk9IjE1My4xIiBzdHlsZT0iZmlsbDojMkIxNDA3OyIgd2lkdGg9IjE2MC41IiBoZWlnaHQ9IjI1NSIvPgo8cGF0aCBzdHlsZT0iZmlsbDojNDcyMDBEOyIgZD0iTTE2OS4zLDQyNS43YzAsMCwwLjgtMC4zLDIuMS0xYy0wLjEsMC0wLjEsMC0wLjEsMEwxNjkuMyw0MjUuN3ogTTI5Ny45LDk0LjhsLTEwNy41LTUuNyAgYy0zMS41LDMxLjctNDUuNCw2OS4yLTQ5LjMsMTA1LjhjLTEuOSwxNy41LDE4LjIsNDEuOCwyMCw1OC4yYzEuOSwxNy4yLTE3LjUsMjItMTksNDljLTEuNSwyNi42LDE1LjksNDcuMSwyMS41LDU2ICBjMjkuOSw0OC4xLDEzLjksNjMsNy44LDY2LjZjMy4xLTAuNiw2OS4xLTE0LjksNDMuNi03Ni4xYy0yLjYtNi4yLTkuMi0yNi41LTE1LjgtMzcuN2MtNy4yLTEyLjItMjguNC0zNy0yNi01OC44ICBDMTc5LjIsMTk3LDIzOC4yLDEzOC4xLDI5Ny45LDk0Ljh6Ii8+CjxyZWN0IHg9IjIwNS4xIiB5PSIzMjQuOSIgc3R5bGU9ImZpbGw6I0QyRDVEODsiIHdpZHRoPSI4NS44IiBoZWlnaHQ9IjMxLjUiLz4KPGc+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRTJBMzc5OyIgZD0iTTI4NywyODIuMWgtNzcuOGMxMi4xLDM2LjYsMSw1My4zLDEsNTMuM2wyNi45LDYuMWgyMmwyNi45LTYuMUMyODYsMzM1LjQsMjc0LjksMzE4LjcsMjg3LDI4Mi4xeiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0UyQTM3OTsiIGQ9Ik0yNDcuOSwzMTdsLTM3LjcsMTguNGMwLDAsMTYuOCwyOC4xLDM3LjYsMjguMXMzOC4yLTI4LjEsMzguMi0yOC4xTDI0Ny45LDMxN3oiLz4KPC9nPgo8cGF0aCBzdHlsZT0iZmlsbDojRjRCMzgyOyIgZD0iTTI0OC4xLDkyLjZjLTQxLjUsMC03NS4xLDUuNy03NS4xLDk4LjFjMCwzMS4zLDUuMyw0Ni40LDEzLjIsNjUuM2MxNy40LDQxLjYsNDcuNCw1Ni4xLDYxLjksNTYuMSAgczQ0LjYtMTQuNSw2MS45LTU2LjFjNy45LTE4LjksMTMuMi0zNCwxMy4yLTY1LjNDMzIzLjIsOTguMywyODkuNiw5Mi42LDI0OC4xLDkyLjZ6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiM0NzIwMEQ7IiBkPSJNMjQ4LjEsNzcuMUwyNDguMSw3Ny4xYy00OC43LDAtODguMyw1LjctODguMyw5OC4xYzAsMCw4OC4yLTIyLjYsODguMi01Ni4yICBDMjQ4LDExOC4xLDI0OC4xLDc3LjEsMjQ4LjEsNzcuMUwyNDguMSw3Ny4xeiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojQ0U5MTYzOyIgZD0iTTIzNi4yLDI0NC43Yy0wLjQtMS41LTAuNS0zLTAuOC00LjdjLTAuNywwLjgtMSwxLjctMS4yLDIuNmMtMC4yLDAuOS0wLjIsMS44LDAsMi42czAuNywxLjcsMS40LDIuMyAgYzAuNywwLjcsMS43LDEuMSwyLjgsMS4zQzIzNy4yLDI0Ny40LDIzNi42LDI0Ni4yLDIzNi4yLDI0NC43eiIvPgo8Zz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNBRDc1NTA7IiBkPSJNMjQ0LjcsMjQ0LjhjLTAuMy0wLjYtMC44LTEuMS0xLjQtMS40Yy0wLjYtMC4zLTEuMy0wLjQtMi4yLTAuMmMtMC44LDAuMS0xLjgsMC42LTIuNiwxLjMgICBjMS41LTAuMSwyLjcsMC4xLDMuNywwLjZzMS45LDEuMiwzLDEuOUMyNDUuMiwyNDYuMSwyNDUsMjQ1LjQsMjQ0LjcsMjQ0Ljh6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojQUQ3NTUwOyIgZD0iTTI1NS40LDI0My4yYy0wLjgtMC4yLTEuNiwwLTIuMiwwLjJjLTAuNiwwLjMtMS4xLDAuOC0xLjQsMS40Yy0wLjMsMC42LTAuNSwxLjMtMC40LDIuMiAgIGMxLjEtMC43LDEuOS0xLjQsMy0xLjljMS0wLjUsMi4xLTAuNywzLjctMC42QzI1Ny4yLDI0My44LDI1Ni4zLDI0My40LDI1NS40LDI0My4yeiIvPgo8L2c+CjxnPgoJPHBhdGggc3R5bGU9ImZpbGw6I0NFOTE2MzsiIGQ9Ik0yNjIsMjQyLjZjLTAuMi0wLjktMC42LTEuOC0xLjItMi42Yy0wLjMsMS43LTAuNCwzLjItMC44LDQuN3MtMSwyLjctMi4yLDQuMSAgIGMxLjEtMC4yLDIuMS0wLjcsMi44LTEuM2MwLjctMC43LDEuMS0xLjUsMS40LTIuM0MyNjIuMiwyNDQuMywyNjIuMiwyNDMuNCwyNjIsMjQyLjZ6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojQ0U5MTYzOyIgZD0iTTI1Ni4xLDIxMy43YzAuMS0yLjcsMC4zLTUuMywwLjctNy45YzAuNC0yLjYsMS4xLTUuMiwyLjEtNy44Yy0xLjcsMi4yLTIuOSw0LjctMy43LDcuNCAgIGMtMC44LDIuNy0xLjEsNS41LTEuMiw4LjJjLTAuMSwyLjgsMC4yLDUuNSwwLjcsOC4zYzAuNSwyLjcsMS4yLDUuNCwyLjQsNy45QzI1Ni41LDIyNC40LDI1NiwyMTksMjU2LjEsMjEzLjd6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojQ0U5MTYzOyIgZD0iTTI0MC4xLDIxMS40Yy0wLjEtMC45LTAuMi0xLjktMC41LTIuOGMtMC4yLTAuOS0wLjYtMS44LTEuMS0yLjZjLTAuMSwxLTAuMSwxLjktMC4xLDIuOCAgIGMwLDAuOSwwLjEsMS44LDAuMSwyLjdjMC4xLDAuOSwwLjEsMS44LDAuMywyLjdjMC4xLDAuOSwwLjMsMS44LDAuNSwyLjhjMC40LTAuOSwwLjUtMS44LDAuNi0yLjggICBDMjQwLjIsMjEzLjMsMjQwLjIsMjEyLjQsMjQwLjEsMjExLjR6Ii8+CjwvZz4KPHBhdGggc3R5bGU9ImZpbGw6IzQ3MkIxNDsiIGQ9Ik0yNjQuNywyMDQuOGMwLDAuNSwyLjMsNy42LDE5LjQsNS4zYzExLjEtMS41LDExLjgtMTIuMiwxMS44LTEyLjIgIEMyNzUuNiwxODYuNiwyNjQuNywyMDQuOCwyNjQuNywyMDQuOHoiLz4KPHBhdGggc3R5bGU9ImZpbGw6I0Y3RjBFQjsiIGQ9Ik0yNjQuNywyMDQuOGMwLjEsMS4xLDEuMSwxLjUsMiwxLjhjMjQuNSw4LjUsMjguMi03LjQsMjguMi03LjRDMjc1LjEsMTkxLjcsMjY0LjcsMjA0LjgsMjY0LjcsMjA0LjggIHoiLz4KPGVsbGlwc2Ugc3R5bGU9ImZpbGw6IzIzMTEwQjsiIGN4PSIyODEuNyIgY3k9IjIwMS41IiByeD0iNi4xIiByeT0iNiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojMkIxNDA3OyIgZD0iTTI5NS4zLDE5Ni4xYy0yMy41LTExLjctMzAuNiw4LjctMzAuNiw4LjdzMTAtMTIuNSwyOC45LTYuMWMwLjQsMCwwLjksMC4yLDEuMywwLjQgIGM0LjgsMi42LDUuMy0xLjQsNS4zLTEuNEMyOTguMiwxOTcuNywyOTUuMywxOTYuMSwyOTUuMywxOTYuMXoiLz4KPHBhdGggc3R5bGU9ImZpbGw6IzQ3MkIxNDsiIGQ9Ik0yMDAuMSwxOTcuOWMwLDAsMC43LDEwLjcsMTEuOCwxMi4yYzE3LjEsMi4zLDE5LjQtNC44LDE5LjQtNS4zICBDMjMxLjMsMjA0LjgsMjIwLjQsMTg2LjYsMjAwLjEsMTk3Ljl6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNGN0YwRUI7IiBkPSJNMjAxLjEsMTk5LjJjMCwwLDMuNywxNS45LDI4LjIsNy40YzAuOS0wLjMsMS45LTAuOCwyLTEuOEMyMzEuMywyMDQuOCwyMjAuOCwxOTEuNywyMDEuMSwxOTkuMnoiLz4KPGVsbGlwc2Ugc3R5bGU9ImZpbGw6IzIzMTEwQjsiIGN4PSIyMTQuMyIgY3k9IjIwMS41IiByeD0iNi4xIiByeT0iNiIvPgo8Zz4KCTxwYXRoIHN0eWxlPSJmaWxsOiMyQjE0MDc7IiBkPSJNMjAwLjcsMTk2LjFjMCwwLTMsMS42LTQuOCwxLjZjMCwwLDAuNCw0LDUuMywxLjRjMC40LTAuMiwwLjgtMC4zLDEuMy0wLjQgICBjMTguOS02LjQsMjguOSw2LjEsMjguOSw2LjFTMjI0LjIsMTg0LjMsMjAwLjcsMTk2LjF6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojMkIxNDA3OyIgZD0iTTIyNi44LDE4MC41Yy03LjktMi45LTIxLjMtNS43LTMzLjYsNS44Yy0xLDAuOS0yLjcsMi40LTIuOSwzczEuNy0wLjMsNi40LTIuMiAgIGM0LjQtMS44LDkuNC03LDI3LjEtMC42YzEuMiwwLjQsMi43LDEuMiwzLjcsMS40YzAuOSwwLjIsMywwLjUsMy45LTIuNEMyMzIuMywxODIuNCwyMzAuMiwxODEuOCwyMjYuOCwxODAuNXoiLz4KPC9nPgo8cGF0aCBzdHlsZT0iZmlsbDojRTI0NDQ0OyIgZD0iTTI1OC41LDI1Ny44Yy0zLTAuNC0xMC40LDIuNS0xMC40LDIuNXMtNy42LTIuOS0xMC42LTIuNWMtNC44LDAuNy0xMS45LDktMTEuOSwxMC4zICBjMCwwLDEwLjEsNS4yLDIyLjUsNS4yczIyLjUtNS4yLDIyLjUtNS4yUzI2My40LDI1OC41LDI1OC41LDI1Ny44eiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojRDMzRDNEOyIgZD0iTTI1NC4yLDI2NC40Yy0yLTAuMS00LjUsMS43LTYuMSwxLjdjLTEuOSwwLTQuOC0xLjgtNy0xLjZjLTEzLjEsMC44LTE1LjUsMy42LTE1LjUsMy42ICBzMTAuMSw5LjEsMjIuNSw5LjFzMjIuNS05LjEsMjIuNS05LjFTMjY3LjksMjY1LjIsMjU0LjIsMjY0LjR6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNFMkEzNzk7IiBkPSJNMjg1LjksMzM1LjRjMCwwLTguOSwxNy4zLTM4LjEsMTcuM3MtMzcuNS0xNy4zLTM3LjUtMTcuM3MtNyw1NC43LDM3LjksNTQuNyAgUzI4NS45LDMzNS40LDI4NS45LDMzNS40eiIvPgo8Zz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNGNEIzODI7IiBkPSJNMTcxLjUsMTc4Yy03LjYsMS4zLTEzLjQsNC42LTkuMSwyOS43YzQuMywyNS4yLDkuNiwyNi4zLDE3LjMsMjVMMTcxLjUsMTc4eiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0Y0QjM4MjsiIGQ9Ik0zMjIuOCwxNzhsLTguMSw1NC44YzcuNiwxLjMsMTMsMC4xLDE3LjMtMjVDMzM2LjIsMTgyLjYsMzMwLjQsMTc5LjMsMzIyLjgsMTc4eiIvPgo8L2c+CjxwYXRoIHN0eWxlPSJmaWxsOiM0NzIwMEQ7IiBkPSJNMTc0LjgsMTgxLjRjLTEtNi42LDAuMS0xMS44LDAuMS0xMS44bC0xNSw1LjZjMCwwLDkuMywxLjIsMTIuNiwxMS45ICBDMTcyLjQsMTg3LjEsMTc2LjEsMTg5LjgsMTc0LjgsMTgxLjR6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNFMkEzNzk7IiBkPSJNMzk0LjgsMzgyLjhjLTcuMy0yNy4zLTY5LjktNDkuMy0xNDcuMS00OS4zcy0xMzkuMSwyMi4xLTE0Ni40LDQ5LjNjLTMuMywxMi4yLTcsMzUuMi0xMC4xLDU3LjUgIGM0Mi43LDM0LjksOTcuNCw1NS45LDE1Ni45LDU1LjlzMTE0LjEtMjEsMTU2LjktNTUuOUM0MDEuOCw0MTcuOSwzOTguMSwzOTQuOSwzOTQuOCwzODIuOHoiLz4KPHBhdGggc3R5bGU9ImZpbGw6IzlCNkQzMTsiIGQ9Ik0zOTQuOCwzODIuOGMtNy4zLTI3LjMtNjkuOS00OS4zLTE0Ny4xLTQ5LjNzLTEzOS4xLDIyLjEtMTQ2LjQsNDkuM2MtMy4zLDEyLjItNywzNS4yLTEwLjEsNTcuNSAgYzQyLjcsMzQuOSw5Ny40LDU1LjksMTU2LjksNTUuOXMxMTQuMS0yMSwxNTYuOS01NS45QzQwMS44LDQxNy45LDM5OC4xLDM5NC45LDM5NC44LDM4Mi44eiIvPgo8Zz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNGM0ZBRkY7IiBkPSJNMzk0LjgsMzgyLjhjLTQuMi0xNS42LTI2LjQtMjkuNS01OS4xLTM4LjVMMzU1LDQ3Mi4xYzE4LTguNiwzNC43LTE5LjMsNTAtMzEuNyAgIEM0MDEuOCw0MTcuOSwzOTguMSwzOTQuOSwzOTQuOCwzODIuOHoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNGM0ZBRkY7IiBkPSJNMTAxLjQsMzgyLjhjLTMuMywxMi4yLTcsMzUuMi0xMC4xLDU3LjVjMTUsMTIuMywzMS41LDIyLjgsNDkuMSwzMS4zbDE5LjItMTI3LjIgICBDMTI3LjMsMzUzLjQsMTA1LjUsMzY3LjIsMTAxLjQsMzgyLjh6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRjNGQUZGOyIgZD0iTTI0Ny44LDMzMy40Yy0xNS45LDAtMzEuMiwwLjktNDUuNSwyLjdsNDUuOCw5MWw0NS44LTkwLjlDMjc5LjQsMzM0LjQsMjYzLjksMzMzLjQsMjQ3LjgsMzMzLjR6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRjNGQUZGOyIgZD0iTTIwNS4xLDMyNC45bC0zNywzMi4zbDQzLjQsMzguNWMwLjMsMC4zLDI1LjUtNi44LDI1LjUtNi44TDIwNS4xLDMyNC45eiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0YzRkFGRjsiIGQ9Ik0yOTEsMzI0LjlsLTMyLDYzLjljMCwwLDI1LjIsNy4xLDI1LjUsNi44bDQzLjQtMzguNUwyOTEsMzI0Ljl6Ii8+CjwvZz4KPHBhdGggc3R5bGU9ImZpbGw6IzQ3MjAwRDsiIGQ9Ik0zMzUuNSwyNTMuMWMxLjgtMTYuNCwyMS45LTQwLjcsMjAtNTguMmMtMy45LTM2LjYtMTIuOC03NS4xLTQ0LjItMTAyLjhjLTguMi03LjItMTgtMTUtNjMuMy0xNSAgYzAsMC0zMy4xLDE4LjgtMjYsNDRjNC4zLDE1LjMsMjAuNywxNS4zLDM0LjUsMjYuNmMzNy42LDMwLjYsNjMuMiw3MC41LDY3LDEwNC40YzIuNCwyMS44LTE4LjgsNDYuNS0yNiw1OC44ICBjLTYuNywxMS4yLTEzLjIsMzEuNS0xNS44LDM3LjdjLTI2LjIsNjIuNyw0My41LDc2LjcsNDMuNSw3Ni43bDIuMSwwLjRjMCwwLTMwLjEtOS45LDUuNy02Ny42YzUuNi04LjksMjMtMjkuNCwyMS41LTU2ICBDMzUzLDI3NS4xLDMzMy42LDI3MC4zLDMzNS41LDI1My4xeiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojMzUzMjMwOyIgZD0iTTI3My45LDQ4LjZjLTkuNS0yLjYtMTcuNy0zLjgtMjYuNy0zLjhjLTguMiwwLTE5LDEuNS0yNy4zLDRjLTIxLjksMC01OC42LDU2LTU4LjYsNTZoMTczLjYgIEMzMzQuOSwxMDQuOSwyOTEuNSw0OC42LDI3My45LDQ4LjZ6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiMyODIyMjA7IiBkPSJNMjczLjksNDUuOWMtOS4zLDAtMTcuNyw2LjMtMjYuNyw2LjNjLTguMiwwLTE2LjktNi4xLTI3LjMtNi4xYy0yMS45LDAtNTguNiw1Ni01OC42LDU2aDE3My42ICBDMzM0LjksMTAyLjEsMjkxLjUsNDUuOSwyNzMuOSw0NS45eiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojMTQxMjExOyIgZD0iTTI0OC4xLDc3LjFjLTkyLjYsMC0xNjguMywyOS44LTE2OC4zLDI5LjhjMCw0LjUsNTkuNiw2NS4zLDU5LjYsNjQuOWMwLTEuMSwzNS4yLTM4LjEsMTA4LjctMzguMSAgczEwOC42LDM4LjQsMTA4LjYsMzguNGMwLjItMC41LDU5LjctNjAuNyw1OS43LTY1LjFDNDE2LjQsMTA2LjksMzQwLjcsNzcuMSwyNDguMSw3Ny4xeiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojRTJBMzc5OyIgZD0iTTI0Ny44LDMyMi45Yy0yOC4yLDAtMzcuNCwxMi40LTM3LjQsMTIuNGwzNy43LDc2LjhsMzcuOC03Ni44QzI4NS45LDMzNS4zLDI3NS45LDMyMi45LDI0Ny44LDMyMi45eiAgIi8+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=";
var personSailor2 = "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA0OTYuMiA0OTYuMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDk2LjIgNDk2LjI7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiPgo8cGF0aCBzdHlsZT0iZmlsbDojNDhBMUFGOyIgZD0iTTI0OC4xLDBDMTExLjEsMCwwLDExMS4xLDAsMjQ4LjFzMTExLjEsMjQ4LjEsMjQ4LjEsMjQ4LjFzMjQ4LjEtMTExLjEsMjQ4LjEtMjQ4LjFTMzg1LjEsMCwyNDguMSwweiAgIi8+CjxwYXRoIHN0eWxlPSJmaWxsOiMzNTIxMTY7IiBkPSJNMzU1LjEsMTk0LjljLTMuOS0zNi42LTE3LjgtNzQuMS00OS4zLTEwNS44bC00MC43LDUuN2MyNC41LDE3LjcsMzguNiwyOC4xLDQ2LjIsMzguM0gxODQuOSAgYzcuNi0xMC4yLDIxLjctMjAuNiw0Ni4yLTM4LjNsLTQwLjctNS43Yy0zMS41LDMxLjctNDUuNCw2OS4yLTQ5LjMsMTA1LjhjLTEuOSwxNy41LTE2LDUwLjItMTAsOTkuMmMzLjIsMjYuNCwyNi45LDU1LjEsMzIuNSw2NCAgYzM1LjgsNTcuNywxMzMuMiw1Ny43LDE2OSwwYzUuNi04LjksMjkuMy0zNy42LDMyLjUtNjRDMzcxLjEsMjQ1LjEsMzU3LDIxMi40LDM1NS4xLDE5NC45eiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojOUI2RDMxOyIgZD0iTTQxOC41LDM4Mi44Yy04LjUtMjcuMy04MS4yLTQ5LjMtMTcwLjgtNDkuM3MtMTYxLjUsMjItMTcwLDQ5LjNjLTIuNiw4LjUtNS41LDIyLjItOC4zLDM3LjQgIGM0NS4xLDQ2LjksMTA4LjUsNzYsMTc4LjcsNzZzMTMzLjYtMjkuMiwxNzguNy03NkM0MjQuMSw0MDUsNDIxLjIsMzkxLjIsNDE4LjUsMzgyLjh6Ii8+CjxnPgoJPHBhdGggc3R5bGU9ImZpbGw6I0YzRkFGRjsiIGQ9Ik00MTguNSwzODIuOGMtNS44LTE4LjgtNDIuMS0zNS4xLTkzLjMtNDMuNGwzNy43LDEyOC43YzIzLjgtMTIuNSw0NS40LTI4LjcsNjMuOS00Ny45ICAgQzQyNC4xLDQwNSw0MjEuMiwzOTEuMiw0MTguNSwzODIuOHoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNGM0ZBRkY7IiBkPSJNNzcuNywzODIuOGMtMi42LDguNS01LjUsMjIuMi04LjMsMzcuNGMxOC40LDE5LjEsMzkuOCwzNS4yLDYzLjQsNDcuN2wzNy42LTEyOC40ICAgQzExOS40LDM0Ny43LDgzLjUsMzY0LDc3LjcsMzgyLjh6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRjNGQUZGOyIgZD0iTTI0Ny43LDMzMy40Yy0xNS4yLDAtMjkuOSwwLjYtNDMuOSwxLjhsNDQuMywxMTEuNGw0NC40LTExMS4zQzI3OC4yLDMzNC4xLDI2My4yLDMzMy40LDI0Ny43LDMzMy40ICAgeiIvPgo8L2c+CjxwYXRoIHN0eWxlPSJmaWxsOiNDRTkzNkI7IiBkPSJNMjQ3LjcsMzMzLjRjLTEzLjIsMC0yNi4xLDAuNS0zOC40LDEuNGwzOC44LDEwNS4zbDM4LjgtMTA1LjJDMjc0LjQsMzMzLjksMjYxLjIsMzMzLjQsMjQ3LjcsMzMzLjR6ICAiLz4KPHJlY3QgeD0iMjA0LjkiIHk9IjMyNC4zIiBzdHlsZT0iZmlsbDojQkRDNEM5OyIgd2lkdGg9Ijg2LjIiIGhlaWdodD0iMjIuNSIvPgo8cGF0aCBzdHlsZT0iZmlsbDojQ0U5MzZCOyIgZD0iTTIwMi4xLDI4Mi4xYzAsMCw3LjcsMjksNy43LDY2LjljNS43LDI3LjUsNzEuMSwyNy4yLDc2LjgtMC41YzAtMzgsNy41LTY2LjUsNy41LTY2LjVoLTkyVjI4Mi4xeiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojNDkyQzFEOyIgZD0iTTI0OC4xLDcyLjZjLTQ4LjcsMC04OC4zLDEwLjItODguMywxMDIuNmMwLDMxLjMsOCw3Mi4yLDE2LjUsOTEuNGMxNC42LDMyLjgsNTMuOCw1OS4zLDcxLjgsNTkuMyAgczU3LjItMjcuMyw3MS44LTU5LjNjOC43LTE5LjEsMTYuNS02MC4xLDE2LjUtOTEuNEMzMzYuNCw4Mi44LDI5Ni44LDcyLjYsMjQ4LjEsNzIuNnoiLz4KPHBhdGggc3R5bGU9ImZpbGw6I0RCOUE2RTsiIGQ9Ik0yNDguMSw3Mi42Yy00OC43LDAtODguMywxMC4yLTg4LjMsMTAyLjZjMCwzMS4zLDgsNzIuMiwxNi41LDkxLjRjMTQuNiwzMi43LDUzLjgsMzEuNSw3MS44LDMxLjUgIHM1Ny4yLDAuNSw3MS44LTMxLjVjOC43LTE5LjEsMTYuNS02MC4xLDE2LjUtOTEuNEMzMzYuNCw4Mi44LDI5Ni44LDcyLjYsMjQ4LjEsNzIuNnoiLz4KPHBhdGggc3R5bGU9ImZpbGw6IzMzMjAxNjsiIGQ9Ik0yODEuOSwxNzguNGMtOS45LTAuMi0xNy4xLDExLTE3LjEsMTFzMy40LDMuNSwxNy42LDMuNWMxNC40LDAsMTkuNC01LjUsMTkuNC01LjUgIFMyOTMuMywxNzguNiwyODEuOSwxNzguNHoiLz4KPHBhdGggc3R5bGU9ImZpbGw6I0VBREFEMDsiIGQ9Ik0yODEuOSwxNzguNGMtOS45LTAuMi0xNy4xLDExLTE3LjEsMTFzNy43LDIuMiwxNy42LDEuN2MxMS4yLTAuNiwxOS40LTMuNywxOS40LTMuNyAgUzI5My4zLDE3OC42LDI4MS45LDE3OC40eiIvPgo8Y2lyY2xlIHN0eWxlPSJmaWxsOiMyMzExMEI7IiBjeD0iMjgzIiBjeT0iMTg0LjkiIHI9IjcuNCIvPgo8cGF0aCBzdHlsZT0iZmlsbDojOUU2RTREOyIgZD0iTTI5MCwxNzcuNWMtMS45LTAuNC01LjktMC41LTguMy0wLjVjLTkuOSwwLjMtMTYuOSwxMi4zLTE2LjksMTIuM2wwLjksMC4yYzMuOC0zLDEyLjctMTAuMywxOS0xMC4yICBjMTEuNSwwLjMsMTcuMiw4LDE3LjIsOFMzMDAuNywxNzkuNSwyOTAsMTc3LjV6Ii8+CjxnPgoJPHBhdGggc3R5bGU9ImZpbGw6IzE5MTkxOTsiIGQ9Ik0yODguNCwxNzcuNmMtOS45LTAuMi0yMy43LDExLjctMjMuNywxMS43bDAuOSwwLjJjMy44LTMsMTIuNy0xMC4zLDE5LTEwLjJjOS40LDAuMywxNy4yLDgsMTcuMiw4ICAgUzI5OS45LDE3Ny45LDI4OC40LDE3Ny42eiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6IzE5MTkxOTsiIGQ9Ik0yODIuNCwxOTFjLTEwLDAuNS0xNy42LTEuNy0xNy42LTEuN3MzLjQsMy41LDE3LjYsMy41YzE0LjQsMCwxOS40LTUuNSwxOS40LTUuNSAgIFMyOTMuNiwxOTAuNCwyODIuNCwxOTF6Ii8+CjwvZz4KPGc+Cgk8cGF0aCBzdHlsZT0iZmlsbDojNDkyQzFEOyIgZD0iTTI4Ni41LDI2OS43Yy0wLjEtMy0wLjUtNi4xLTEuNS05LjJjLTAuNS0xLjYtMS4yLTMuMi0yLjItNC44Yy0wLjMtMC40LTAuNS0wLjgtMC44LTEuMiAgIGMtMC4yLTAuMi0wLjMtMC40LTAuNS0wLjZsLTAuNS0wLjVsLTAuMS0wLjFsLTAuMi0wLjJjLTAuMS0wLjEtMC4yLTAuMi0wLjQtMC40Yy0wLjItMC4yLTAuNS0wLjUtMC44LTAuN2MtMC41LTAuNC0xLTAuNy0xLjUtMSAgIGMtMi4xLTEuMS0zLjktMS41LTUuNy0xLjhjLTEuOC0wLjItMy40LTAuMy01LTAuMmMtMy4yLDAuMi02LjIsMC44LTksMS42Yy0yLjksMC45LTUuNiwyLTguMiwzLjVzLTUuMSwzLjItNy4zLDUuNSAgIGMzLjEsMC42LDYuMSwwLjcsOC45LDAuOGMyLjksMC4xLDUuNiwwLDguMy0wLjFsNy43LTAuNGMxLjIsMCwyLjQsMCwzLjQsMHMyLDAuMSwyLjUsMC4yYzAuMSwwLDAuMiwwLDAuMywwaDAuMWwwLDBsMCwwbDAsMCAgIGMwLjEsMC4xLTAuMS0wLjEtMC4xLTAuMWwwLDBsMC4zLDAuM2wwLjEsMC4xYzAsMCwwLjEsMC4xLDAuMiwwLjJjMC4yLDAuMSwwLjMsMC4zLDAuNSwwLjVjMC42LDAuNywxLjMsMS42LDEuOSwyLjYgICBjMS4yLDIsMi4xLDQuNSwyLjksN2MwLjksMi42LDEuNiw1LjIsMi4zLDhjMC44LDIuNywxLjUsNS41LDIuNSw4LjNDMjg1LjksMjgxLjQsMjg2LjcsMjc1LjcsMjg2LjUsMjY5Ljd6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojNDkyQzFEOyIgZD0iTTI0Ni4xLDI1NC4zYy0yLjYtMS41LTUuMy0yLjYtOC4yLTMuNXMtNS44LTEuNS05LTEuNmMtMS42LTAuMS0zLjIsMC01LDAuMiAgIGMtMS44LDAuMy0zLjYsMC43LTUuNywxLjhjLTAuNSwwLjMtMSwwLjYtMS41LDFjLTAuMywwLjItMC41LDAuNC0wLjgsMC43Yy0wLjEsMC4xLTAuMiwwLjItMC40LDAuNGwtMC4yLDAuMmwtMC4xLDAuMWwtMC41LDAuNSAgIGMtMC4yLDAuMi0wLjMsMC40LTAuNSwwLjZjLTAuMywwLjQtMC42LDAuOC0wLjgsMS4yYy0xLDEuNi0xLjcsMy4yLTIuMiw0LjhjLTEsMy4yLTEuNCw2LjItMS41LDkuMmMtMC4yLDYsMC42LDExLjcsMS43LDE3LjQgICBjMS0yLjgsMS44LTUuNSwyLjUtOC4zYzAuOC0yLjcsMS41LTUuNCwyLjMtOGMwLjgtMi41LDEuOC01LDIuOS03YzAuNi0xLDEuMi0xLjksMS45LTIuNmMwLjItMC4yLDAuMy0wLjMsMC41LTAuNSAgIGMwLjEtMC4xLDAuMi0wLjIsMC4yLTAuMmwwLjEtMC4xbDAuMy0wLjNsMCwwbC0wLjEsMC4xbDAsMGwwLDBsMCwwaDAuMWMwLjEsMCwwLjIsMCwwLjMsMGMwLjUtMC4xLDEuNC0wLjIsMi41LTAuMiAgIGMxLDAsMi4yLDAsMy40LDBsNy43LDAuNGMyLjcsMC4xLDUuNSwwLjIsOC4zLDAuMWMyLjktMC4xLDUuOC0wLjIsOC45LTAuOEMyNTEuMiwyNTcuNCwyNDguNywyNTUuOCwyNDYuMSwyNTQuM3oiLz4KPC9nPgo8cGF0aCBzdHlsZT0iZmlsbDojOUU2RTREOyIgZD0iTTI2MC45LDI2My42Yy0zLjctMC43LTEyLjgsMS43LTEyLjgsMS43cy05LjMtMi40LTEzLTEuN2MtNS45LDEuMS0xNC43LDkuNC0xNC43LDExLjQgIGMwLDMuMywxMi40LDcuOCwyNy43LDcuOHMyNy43LTQuNSwyNy43LTcuOEMyNzUuOCwyNzUsMjY2LjksMjY0LjcsMjYwLjksMjYzLjZ6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiM4OTYwNDU7IiBkPSJNMjQ4LjEsMjY5LjNjLTE2LjQsMC0yNy43LDUuNy0yNy43LDUuN2MwLDMuMywxMi40LDcuOCwyNy43LDcuOHMyNy43LTQuNSwyNy43LTcuOCAgQzI3NS44LDI3NSwyNjQuNSwyNjkuMywyNDguMSwyNjkuM3oiLz4KPGc+Cgk8cGF0aCBzdHlsZT0iZmlsbDojQUY3RjVGOyIgZD0iTTI1NiwyMDQuMmMwLTExLjQtMy44LTE0LjQtMy44LTE0LjRjMi4yLDguMywyLDE1LjIsMi4zLDIxLjdjMC40LDkuMyw0LjIsMTQuNiw0LjIsMTQuNiAgIEMyNTcsMjIyLjIsMjU2LDIxNS42LDI1NiwyMDQuMnoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNBRjdGNUY7IiBkPSJNMjM0LjEsMjM1LjNjMCwwLTYuNSwxMi43LDUuMSwxMS41QzIzOS4yLDI0Ni45LDIzMS42LDI0NC41LDIzNC4xLDIzNS4zeiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0FGN0Y1RjsiIGQ9Ik0yNjIuMSwyMzUuM2MyLjUsOS4xLTUuMSwxMS41LTUuMSwxMS41QzI2OC42LDI0OC43LDI2Mi4xLDIzNS4zLDI2Mi4xLDIzNS4zeiIvPgo8L2c+CjxnPgoJPHBhdGggc3R5bGU9ImZpbGw6IzM1MjExNjsiIGQ9Ik0xODAuMSwxNDEuOGwtMTktMWMtNC4yLDEwLjktMy45LDI0LjQtMy45LDM3LjVjMCwwLDExLjQtMS45LDExLjQsMi42bDIuOCwyNy42bDEwLjgtMTAgICBDMTgxLjksMTUwLjQsMTgwLjEsMTQxLjgsMTgwLjEsMTQxLjh6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojMzUyMTE2OyIgZD0iTTMzMy4yLDE0MC44bC0xNy4xLTAuNGMwLDAtMS44LDEwLTIsNThsMTAuOCwxMGwyLjctMjcuNmMwLTQuNSw5LjctMi42LDkuNy0yLjYgICBDMzM3LjMsMTY1LjEsMzM3LjUsMTUxLjcsMzMzLjIsMTQwLjh6Ii8+CjwvZz4KPGc+Cgk8cGF0aCBzdHlsZT0iZmlsbDojREI5QTZFOyIgZD0iTTE2MS40LDE3OGMtOC40LDEuNC0xNC45LDUuMS0xMC4xLDMyLjlzMTAuNywyOS4xLDE5LjEsMjcuN0wxNjEuNCwxNzh6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojREI5QTZFOyIgZD0iTTMzNC45LDE3OGwtOSw2MC42YzguNCwxLjQsMTQuMywwLjEsMTkuMS0yNy43QzM0OS43LDE4My4xLDM0My4zLDE3OS41LDMzNC45LDE3OHoiLz4KPC9nPgo8cGF0aCBzdHlsZT0iZmlsbDojMzUyMTE2OyIgZD0iTTMxMC45LDE2OS41Yy04LjItNy0yMS4xLTYuNi0yOC01LjdjLTEuMiwwLjItMi40LDAuMy0zLjUsMC41Yy0wLjQsMC4xLTEsMS4yLTEsMS4yICBzLTAuNi0wLjktMC44LTAuOWMtNS41LDEuMi05LjksMi44LTEyLjEsNC4xbC0wLjMsMC4yYy0yLjUsMS41LTUuNiwzLjMtMy43LDguMWMxLDIuNSwyLjcsMy43LDQuNywzLjVjMC40LTAuMSwwLjktMC4yLDEuMy0wLjQgIGMwLjYtMC4zLDEuMy0wLjcsMi0xLjJjMC40LTAuMywwLjgtMC41LDEuMi0wLjdjMC41LTAuMywxLTAuNiwxLjUtMC44YzAuNi0wLjMsMS42LTMuMSwxLjYtMy4xczEuNywxLjYsMi41LDEuMyAgYzMuMS0xLjIsNi41LTIsMTAuMi0yLjVjOS44LTEuMywxOC4xLDAuNCwyMC4yLDEuMWMxLjUsMC41LDIuNywwLjcsMy41LDAuNmMxLjYtMC4yLDIuMS0xLjUsMi4yLTIgIEMzMTIuNSwxNzEuNywzMTIsMTcwLjQsMzEwLjksMTY5LjV6Ii8+CjxnPgoJPHBhdGggc3R5bGU9ImZpbGw6IzE0MTIxMTsiIGQ9Ik0yMTQuNCwxNjAuOWMtMTcuMSwwLTMxLDQuNi0zMSwxOS43YzAsMTUuMSwxMy45LDMxLjIsMzEsMzEuMnMzMS0xNi4xLDMxLTMxLjIgICBDMjQ1LjQsMTY1LjUsMjMxLjYsMTYwLjksMjE0LjQsMTYwLjl6Ii8+Cgk8cG9seWdvbiBzdHlsZT0iZmlsbDojMTQxMjExOyIgcG9pbnRzPSIzMzkuOCwxNDMuOSAxNjguOSwxODQuMyAxNzAsMTk0LjMgMzQyLjEsMTUzLjYgICIvPgo8L2c+CjxwYXRoIHN0eWxlPSJmaWxsOiMzNTMyMzA7IiBkPSJNMjczLjksNDguNmMtOS41LTIuNi0xNy43LTMuOC0yNi43LTMuOGMtOC4yLDAtMTksMS41LTI3LjMsNGMtMjEuOSwwLTU4LjYsNTYtNTguNiw1NmgxNzMuNiAgQzMzNC45LDEwNC45LDI5MS41LDQ4LjYsMjczLjksNDguNnoiLz4KPHBhdGggc3R5bGU9ImZpbGw6IzI4MjIyMDsiIGQ9Ik0yNzMuOSw0NS45Yy05LjMsMC0xNy43LDYuMy0yNi43LDYuM2MtOC4yLDAtMTYuOS02LjEtMjcuMy02LjFjLTIxLjksMC01OC42LDU2LTU4LjYsNTZoMTczLjYgIEMzMzQuOSwxMDIuMSwyOTEuNSw0NS45LDI3My45LDQ1Ljl6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiMxNDEyMTE7IiBkPSJNMjQ4LjEsNzcuMWMtOTIuNiwwLTE2OC4zLDI5LjgtMTY4LjMsMjkuOGMwLDQuNSw1OS42LDY1LjMsNTkuNiw2NC45YzAtMS4xLDM1LjItMzguMSwxMDguNy0zOC4xICBzMTA4LjYsMzguNCwxMDguNiwzOC40YzAuMi0wLjUsNTkuNy02MC43LDU5LjctNjUuMUM0MTYuNCwxMDYuOSwzNDAuNyw3Ny4xLDI0OC4xLDc3LjF6Ii8+CjxnPgoJPHBhdGggc3R5bGU9ImZpbGw6I0YzRkFGRjsiIGQ9Ik0yMDUuMSwzMjQuOWwtMzcsMzIuM2w0My40LDM4LjVjMC4zLDAuMywxNy42LTYuOCwxNy42LTYuOEwyMDUuMSwzMjQuOXoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNGM0ZBRkY7IiBkPSJNMjkxLDMyNC45bC0yMy45LDYzLjljMCwwLDE3LjIsNy4xLDE3LjUsNi44bDQzLjQtMzguNUwyOTEsMzI0Ljl6Ii8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==";

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
    cellXNext = undefined;
    cellYNext = undefined;
    cellXNext1 = undefined; // переменная для выбоа 1из2 значений рандома на 3 шаге
    cellYNext1 = undefined; // переменная для выбоа 1из2 значений рандома на 3 шаге
    cellXNext2 = undefined; // переменная для выбоа 1из2 значений рандома на 3 шаге
    cellYNext2 = undefined; // переменная для выбоа 1из2 значений рандома на 3 шаге
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
    document.querySelector(".hit_sound").volume = 0.3;
    document.querySelector(".hit_sound").stop();
    document.querySelector(".hit_sound").play();
}
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
    
    fadeOut(document.querySelector('.overlay_screen'));
    document.querySelector('.title-container').style.display = 'none';
    document.body.classList.remove('bg-title-screen');
    document.body.classList.add('bg-black-screen');
    
    document.body.insertAdjacentHTML('beforeend',
        '<div class="cut-scene-container"><div class="cut-scene-container__avatar-block"><div class="cut-scene-container__avatar-block__avatar"><img src="gameplay/enemy_avatar.png"></div><div class="cut-scene-container__avatar-block__avatar"><img src="gameplay/enemy_avatar.png"></div></div><div class="cut-scene-container__textblock"></div></div>'
    );
    
    var textContainer = document.querySelector(".cut-scene-container__textblock");
    typeText(textContainer, ["12 2","22 4","4 4"], 70, 2000, 70);
}
function gameplayStart() {
    
    fadeOut(document.querySelector('.cut-scene-container'));
    fadeIn(document.querySelector('.overlay_screen'));
    setTimeout(function(){
        document.querySelector('.wrapper-gameplay').style.display = 'block';
        fadeOut(document.querySelector('.overlay_screen'));
    }, 2000);
    
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
                    document.querySelector('.destrAlCount').textContent = ++destrAlCount; //прибавляем счет подбитых кораблей компом
                    alTurnStatus = "default"; // на следующем шаге ищем по новой
                    setTimeout(function() { attackAl('.areaPl') }, 1000);
                } else {
                    currentAttackedShip = attackedCell.getAttribute('data-ship-type'); // определяет тип корабля в который попал AL для определния оставшихся клеток которые надо найти
                    alert('Попадание в ' + currentAttackedShip + 'палублный корабль');
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
                alert('Ваш корабль полностью уничтожен');
                setDemarkDestroyedShip(cellX, cellY, '.areaPl');
                setDemarkDestroyedShip(cellXSearch, cellYSearch, '.areaPl');
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
                    alert('Ваш корабль полностью уничтожен');
                    setDemarkDestroyedShip(cellX, cellY, '.areaPl');
                    setDemarkDestroyedShip(cellXSearch, cellYSearch, '.areaPl');
                    setDemarkDestroyedShip(cellXNext, cellYNext, '.areaPl');
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
                    alert('Ваш корабль полностью уничтожен');
                    setDemarkDestroyedShip(cellX, cellY, '.areaPl');
                    setDemarkDestroyedShip(cellXSearch, cellYSearch, '.areaPl');
                    setDemarkDestroyedShip(cellXNext, cellYNext, '.areaPl');
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
            (function() {
                var y = [cellY, cellYSearch, cellYNext].sort(function(a, b) {
                    return a - b;
                });
                cellYNext1 = y.pop() + 1; //вытаскиваем из массива наибольшее число и прибавляем 1
                cellYNext2 = y[0] - 1; // оставшееся в массиве меньшее число отнимаем 1 
                //alert('cellYNext1 ' + cellYNext1 + ' cellYNext2 ' + cellYNext2);
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
                    alert('Ваш корабль полностью уничтожен');
                    setDemarkDestroyedShip(cellX, cellY, '.areaPl');
                    setDemarkDestroyedShip(cellXSearch, cellYSearch, '.areaPl');
                    setDemarkDestroyedShip(cellXNext, cellYNext, '.areaPl');
                    document.querySelector('.destrAlCount').textContent = ++destrAlCount; //прибавляем счет подбитых кораблей компом
                    alTurnStatus = "default";
                }
                if (currentAttackedShip > 0) {
                    alTurnStatus = "attackStep4";
                }
                setTimeout(function() { attackAl('.areaPl') }, 1000);
                return;
            } else {
                alTurnStatus === "default";
                document.querySelector('.overlay').style.display = 'none';
            }
            return;
        }
        if (cellY === cellYSearch) {
            (function() {
                var x = [cellX, cellXSearch, cellXNext].sort(function(a, b) {
                    return a - b;
                }); //вытаскиваем из массива наибольшее число
                cellXNext1 = x.pop() + 1;
                cellXNext2 = x[0] - 1;
                //alert('cellXNext1 ' + cellXNext1 + ' cellXNext2 ' + cellXNext2);
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
                    alert('Ваш корабль полностью уничтожен');
                    setDemarkDestroyedShip(cellX, cellY, '.areaPl');
                    setDemarkDestroyedShip(cellXSearch, cellYSearch, '.areaPl');
                    setDemarkDestroyedShip(cellXNext, cellYNext, '.areaPl');
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
        hitSoundPlay();
        this.classList.add('damaged');
        document.querySelector('.hitPlCount').textContent = ++hitPlCount; //прибавляем счет очков попаданий игрока
        //Если у других клеток с тем же ID данного подбитого корабля больше нет атрибута data-attacked="no" (клетки которые еще не были подбиты), то отметить корабль с данным ID как убил
        var dataIdShip = this.getAttribute('data-id-ship');
        if ((document.querySelectorAll('.areaAl .cell[data-id-ship="' + dataIdShip + '"][data-attacked="no"]').length) == 0) {
            document.querySelector('.destrPlCount').textContent = ++destrPlCount; //прибавляем счет подбитых кораблей игркоком
            alert('Вы размудохали вражеский корабль');
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