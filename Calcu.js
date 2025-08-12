<script>
        let display = document.getElementById('display');
        let currentInput = '0';
        let shouldResetDisplay = false;

        function updateDisplay() {
            display.textContent = currentInput;
        }

        function appendToDisplay(value) {
            // Si es un operador y el último carácter también es un operador, reemplazarlo
            if (['+', '-', '*', '/', '×'].includes(value)) {
                if (['+', '-', '*', '/', '×'].includes(currentInput.slice(-1))) {
                    currentInput = currentInput.slice(0, -1) + value;
                    updateDisplay();
                    return;
                }
            }
            
            if (shouldResetDisplay && !['+', '-', '*', '/', '×', '.'].includes(value)) {
                currentInput = '';
                shouldResetDisplay = false;
            }
            
            if (currentInput === '0' && value !== '.' && !['+', '-', '*', '/', '×'].includes(value)) {
                currentInput = value;
            } else {
                currentInput += value;
            }
            
            updateDisplay();
        }

        function clearDisplay() {
            currentInput = '0';
            shouldResetDisplay = false;
            updateDisplay();
        }

        function deleteLast() {
            if (shouldResetDisplay) {
                clearDisplay();
                return;
            }
            
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            updateDisplay();
        }

        function calculate() {
            try {
                // Si ya hay un resultado previo, continuar desde ahí
                if (shouldResetDisplay && !currentInput.includes('+') && !currentInput.includes('-') && !currentInput.includes('*') && !currentInput.includes('/')) {
                    return; // Ya es un resultado, no hacer nada
                }
                
                // Reemplazar × por * para la evaluación
                let expression = currentInput.replace(/×/g, '*');
                
                // Evaluar la expresión de forma segura
                let result = eval(expression);
                
                // Verificar si el resultado es válido
                if (isNaN(result) || !isFinite(result)) {
                    throw new Error('Operación inválida');
                }
                
                // Redondear el resultado para evitar problemas de punto flotante
                result = Math.round(result * 100000000) / 100000000;
                
                currentInput = result.toString();
                shouldResetDisplay = false; // Cambiar a false para permitir operaciones acumulativas
                updateDisplay();
            } catch (error) {
                currentInput = 'Error';
                shouldResetDisplay = true;
                updateDisplay();
            }
        }

        // Soporte para teclado
        document.addEventListener('keydown', function(event) {
            const key = event.key;
            
            if (key >= '0' && key <= '9') {
                appendToDisplay(key);
            } else if (key === '.') {
                appendToDisplay('.');
            } else if (key === '+') {
                appendToDisplay('+');
            } else if (key === '-') {
                appendToDisplay('-');
            } else if (key === '*') {
                appendToDisplay('*');
            } else if (key === '/') {
                event.preventDefault(); // Prevenir búsqueda rápida en navegador
                appendToDisplay('/');
            } else if (key === 'Enter' || key === '=') {
                event.preventDefault();
                calculate();
            } else if (key === 'Escape' || key === 'c' || key === 'C') {
                clearDisplay();
            } else if (key === 'Backspace') {
                event.preventDefault();
                deleteLast();
            }
        });
    </script>
</body>
</html>