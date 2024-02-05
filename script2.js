var selectedDays = []; // Almacena las selecciones de días globales
        var currentDate = new Date();
        var currentMonth = currentDate.getMonth()+1;
        var currentYear = currentDate.getFullYear();
        var availableDaysInput = document.getElementById('available-days');
        var vacationCounter = document.getElementById('vacation-counter');
        var calendarBody = document.getElementById('calendar-body');
        var currentMonthYear = document.getElementById('current-month-year');

        // Inicializar el calendario
        updateCalendar();

        // Función para actualizar el calendario
        function updateCalendar() {
            // Limpiar el contenido actual del calendario
            calendarBody.innerHTML = '';

            // Establecer el año y mes actual
            currentMonthYear.textContent = `${getMonthName(currentMonth)} ${currentYear}`;

            // Obtener el primer día del mes y el último día del mes
            var firstDayOfMonth = new Date(currentYear, currentMonth, 1);
            var lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

            // Calcular el número de días en el mes
            var daysInMonth = lastDayOfMonth.getDate();

            // Calcular el día de la semana del primer día del mes
            var firstDayOfWeek = firstDayOfMonth.getDay();

            // Crear las celdas para los días del mes
            var dayCount = 1;
            for (var i = 0; i < 6; i++) {
                var row = document.createElement('tr');
                for (var j = 0; j < 7; j++) {
                    var cell = document.createElement('td');
                    if ((i === 0 && j < firstDayOfWeek) || dayCount > daysInMonth) {
                        // Celda vacía antes del primer día o después del último día
                        cell.textContent = '';
                    } else {
                        // Celda con número de día y festividades
                        var dayNumber = dayCount;
                        var uniqueDayId = `${currentYear}-${currentMonth + 1}-${dayNumber}`;
                        cell.innerHTML = `
                            <div class="day-number">${dayNumber}</div>
                            <div class="holidays">${getHolidayInfo(dayNumber,currentMonth,currentYear)}</div>
                        `;
                        cell.classList.add('selectable');
                        cell.dataset.dayId = uniqueDayId;
                        cell.addEventListener('click', toggleDaySelection.bind(null, uniqueDayId));
                        dayCount++;
                    }
                    row.appendChild(cell);
                }
                calendarBody.appendChild(row);
            }

            // Restablecer selecciones para el mes actual
            restoreMonthSelections();
        }

        // Función para obtener el nombre del mes
        function getMonthName(monthIndex) {
            var months = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];
            return months[monthIndex];
        }

        
        
        // Función para obtener información de festividades desde el archivo JSON
        function getHolidayInfo(dia, mes, año) {
            // Utilizamos la Fetch API para cargar el archivo JSON
            return fetch('festividades.json')
                .then(response => response.json())
                .then(data => {
                    const festividades = data;
                    console.log(dia,mes+1,año)
                    // Buscar la festividad correspondiente
                    const festividadEncontrada = festividades.find(festividad =>
                        festividad.numDia === dia && festividad.numMes === mes+1 && festividad.numAño === año
                    );
                    console.log(festividadEncontrada.festividad)
                    // Devolver el nombre de la festividad o un mensaje si no se encuentra
                    return festividadEncontrada.festividad
                    // festividadEncontrada ? festividadEncontrada.festividad : "No hay festividad para esta fecha.";
                })
                .catch(error => {
                    console.error('Error:', error);
                    return "Error al cargar las festividades.";
                });
        }
     


         

        

       




        

        // Función para alternar la selección de días
        function toggleDaySelection(uniqueDayId) {
            var index = selectedDays.indexOf(uniqueDayId);

            if (index !== -1) {
                // Si el día ya está seleccionado, quitarlo de la lista
                selectedDays.splice(index, 1);
            } else {
                // Si el día no está seleccionado, agregarlo a la lista
                selectedDays.push(uniqueDayId);
            }

            updateVacationCounter();
            updateCalendar(); // Actualizar la visualización después de cada selección
        }

        // Función para actualizar el contador de días canjeables
        function updateVacationCounter() {
            var availableDays = parseInt(availableDaysInput.value) || 0;
            var canjeables = availableDays - selectedDays.length;
            vacationCounter.textContent = 'Días Canjeables: ' + canjeables;
        }

        // Función para restaurar selecciones para el mes actual
        function restoreMonthSelections() {
            var selectableDays = document.querySelectorAll('.selectable');

            selectableDays.forEach(function (dayCell) {
                var uniqueDayId = dayCell.dataset.dayId;
                if (selectedDays.indexOf(uniqueDayId) !== -1) {
                    dayCell.classList.add('selected');
                } else {
                    dayCell.classList.remove('selected');
                }
            });

            updateVacationCounter();
        }

        // Función para cambiar al mes anterior
        function previousMonth() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            updateCalendar();
        }

        // Función para cambiar al mes siguiente
        function nextMonth() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            updateCalendar();
        }