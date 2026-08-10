document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search)
    const vitrineId = parseInt(urlParams.get('vitrine')) || 1
    const video = document.getElementById('video-feed');
    const canvas = document.getElementById('canvas-process');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    const hexValueEl = document.getElementById('hex-value');
    const rgbValueEl = document.getElementById('rgb-value');
    const colorSwatch = document.getElementById('color-swatch');
    const copyBtn = document.getElementById('copy-btn');
    const errorMessage = document.getElementById('error-message');
    
    let isVideoPlaying = false;
    let currentHex = '#000000';

    async function initCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment' 
                },
                audio: false
            });
            
            video.srcObject = stream;
            
            video.addEventListener('loadedmetadata', () => {
                video.play();
            });

            video.addEventListener('playing', () => {
                isVideoPlaying = true;
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                requestAnimationFrame(processFrame);
            });

        } catch (err) {
            console.error('Error accessing the camera:', err);
            showError('Não foi possível acessar a câmera. Verifique as permissões de vídeo do seu navegador.');
        }
    }

    function processFrame() {
        if (!isVideoPlaying) return;

        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const centerX = Math.floor(canvas.width / 2);
        const centerY = Math.floor(canvas.height / 2);

        const pixelData = ctx.getImageData(centerX, centerY, 1, 1).data;
        
        const r = pixelData[0];
        const g = pixelData[1];
        const b = pixelData[2];

        updateColorUI(r, g, b);

        requestAnimationFrame(processFrame);
    }

    function updateColorUI(r, g, b) {
        currentHex = rgbToHex(r, g, b);
        const rgbString = `rgb(${r}, ${g}, ${b})`;

        hexValueEl.textContent = currentHex.toUpperCase();
        rgbValueEl.textContent = rgbString;
        colorSwatch.style.backgroundColor = currentHex;
    }

    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.classList.remove('hidden');
        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 5000);
    }

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(currentHex.toUpperCase()).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copiado!';
            copyBtn.style.backgroundColor = '#10b981';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.backgroundColor = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy!', err);
            showError('Erro ao copiar para a área de transferência.');
        });
    });

    setInterval(() => {
        if (isVideoPlaying && currentHex) {
            fetch('/sensor/color/camera', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ hex: currentHex, idVitrine: vitrineId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.ignorado) {
                    console.log("Cor atual recebida no NFC");
                } else {
                    console.log("Cor enviada com sucesso.", data.cor);
                }
            })
            .catch(error => console.error('Erro ao comunicar com a vitrine:', error));
        }
    }, 2000);

   
    initCamera();
});