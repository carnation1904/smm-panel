// Basic collapsible FAQ logic & simulated QR modal
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', function() {
    this.nextElementSibling.style.display =
      this.nextElementSibling.style.display === 'block' ? 'none' : 'block';
  });
});

// Simulated QR modal open/close and video
const qrModal = document.getElementById('qrModal');
const openQR = document.getElementById('openQR');
const closeQR = document.getElementById('closeQR');
const qrVideo = document.getElementById('qrVideo');
const qrMsg = document.getElementById('qrMessage');

if (openQR && qrModal && closeQR) {
  openQR.onclick = () => {
    qrModal.style.display = 'flex';
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then(stream => {
        qrVideo.srcObject = stream;
        qrMsg.textContent = "Point your camera at the QR code...";
      })
      .catch(() => {
        qrMsg.textContent = "Camera access denied.";
      });
    }
  };
  closeQR.onclick = () => {
    qrModal.style.display = 'none';
    if (qrVideo.srcObject) {
      qrVideo.srcObject.getTracks().forEach(track => track.stop());
      qrVideo.srcObject = null;
    }
  };
  window.onclick = e => {
    if (e.target === qrModal) closeQR.onclick();
  };
}
