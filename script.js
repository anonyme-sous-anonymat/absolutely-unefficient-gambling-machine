document.addEventListener('DOMContentLoaded', () => {
    const xSlider = document.getElementById('x-value');
    const xInput = document.getElementById('x-input');
    const xDisplay = document.getElementById('x-display');
    const drawButton = document.getElementById('draw-button');
    const suite1El = document.getElementById('suite1');
    const suite2El = document.getElementById('suite2');
    const resultMessageEl = document.getElementById('result-message');
    const theoreticalProbEl = document.getElementById('theoretical-prob');
    const dynamicProbEl = document.getElementById('dynamic-prob');
    const totalDrawsEl = document.getElementById('total-draws');
    const currentBalanceEl = document.getElementById('current-balance');
    const historyListEl = document.getElementById('history-list');

    let balance = 100;
    let totalDraws = 0;

    // Sync slider and input
    xSlider.addEventListener('input', () => {
        xInput.value = xSlider.value;
        xDisplay.textContent = xSlider.value;
        updateTheoreticalProb();
    });

    xInput.addEventListener('input', () => {
        let val = parseInt(xInput.value);
        if (val < 1) val = 1;
        if (val > 12) val = 12;
        xInput.value = val;
        xSlider.value = val;
        xDisplay.textContent = val;
        updateTheoreticalProb();
    });

    // Initial update
    updateTheoreticalProb();

    drawButton.addEventListener('click', () => {
        if (balance < 1) {
            alert('Solde insuffisant !');
            return;
        }

        const x = parseInt(xSlider.value);
        balance -= 1;
        totalDraws += 1;

        const suite1 = generateRandomSuite(x);
        const suite2 = generateRandomSuite(x);

        suite1El.textContent = `Suite 1: ${suite1.join('')}`;
        suite2El.textContent = `Suite 2: ${suite2.join('')}`;

        let isWin = arraysEqual(suite1, suite2);
        let gain = 0;
        if (isWin) {
            gain = 1 - ((x - 1) * 0.01);
            balance += gain;
            resultMessageEl.textContent = `Victoire ! Gain: ${gain.toFixed(2)} jetons`;
            resultMessageEl.style.color = 'green';
        } else {
            resultMessageEl.textContent = 'Perte. Essayez encore !';
            resultMessageEl.style.color = 'red';
        }

        currentBalanceEl.textContent = balance.toFixed(2);
        totalDrawsEl.textContent = totalDraws;
        updateDynamicProb(x);

        // Add to history
        const li = document.createElement('li');
        li.textContent = `Tirage #${totalDraws} (X=${x}): ${isWin ? 'Victoire (+' + gain.toFixed(2) + ')' : 'Perte (-1)'}`;
        historyListEl.appendChild(li);
    });

    function generateRandomSuite(x) {
        const array = new Uint8Array(x);
        window.crypto.getRandomValues(array);
        return array.map(val => val % 10);
    }

    function arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    function updateTheoreticalProb() {
        const x = parseInt(xSlider.value);
        const prob = 1 / Math.pow(10, x);
        theoreticalProbEl.textContent = prob.toExponential(2);
    }

    function updateDynamicProb(x) {
        const p = 1 / Math.pow(10, x);
        const dynamicProb = 1 - Math.pow(1 - p, totalDraws);
        dynamicProbEl.textContent = dynamicProb.toExponential(2);
    }
});
