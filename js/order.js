document.addEventListener('DOMContentLoaded', function () {
    const orderForm = document.getElementById('orderForm');

    orderForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Ambil nilai dari form
        const serviceType = document.getElementById('serviceType').value;
        const username = document.getElementById('username').value;
        const quantity = document.getElementById('quantity').value;
        const notes = document.getElementById('notes').value;
        const paymentProof = document.getElementById('paymentProof').files[0];

        // Validasi form
        if (!serviceType || !username || !quantity || !paymentProof) {
            alert('Harap lengkapi semua field yang wajib diisi!');
            return;
        }

        // Format pesan untuk WhatsApp
        let message = `Halo BoostMedia, saya ingin memesan layanan berikut:\n\n`;
        message += `*Jenis Layanan:* ${serviceType}\n`;
        message += `*Username/Link:* ${username}\n`;
        message += `*Jumlah Pesanan:* ${quantity}\n`;

        if (notes) {
            message += `*Catatan Tambahan:* ${notes}\n`;
        }

        message += `\nSaya sudah mengupload bukti transfer. Terima kasih.`;

        // Encode message untuk URL WhatsApp
        const encodedMessage = encodeURIComponent(message);

        // Nomor WhatsApp tujuan
        const phoneNumber = '6281573236181';

        // Buat link WhatsApp
        let whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        // Untuk file upload, kita hanya bisa mengingatkan user untuk mengirim manual
        if (paymentProof) {
            alert('Silakan kirim bukti transfer secara manual setelah chat WhatsApp terbuka. File tidak bisa dikirim otomatis melalui link WhatsApp.');
        }

        // Buka WhatsApp
        window.open(whatsappUrl, '_blank');

        // Reset form
        orderForm.reset();
    });

    // Menangani perubahan metode pembayaran
    document.getElementById('paymentMethod').addEventListener('change', function () {
        const paymentInfo = document.getElementById('paymentInfo');
        const qrisSection = document.getElementById('qrisSection');
        const proofUpload = document.getElementById('proofUploadSection');
        const paymentDetail = document.getElementById('paymentDetail');

        const selectedMethod = this.value;

        if (selectedMethod === 'QRIS') {
            paymentInfo.classList.add('d-none');
            qrisSection.classList.remove('d-none');
            proofUpload.classList.add('d-none');
            document.getElementById('paymentProof').required = false;
        }
        else if (selectedMethod && selectedMethod !== '') {
            paymentDetail.textContent = `Silakan transfer ke: ${selectedMethod}`;
            paymentInfo.classList.remove('d-none');
            qrisSection.classList.add('d-none');
            proofUpload.classList.remove('d-none');
            document.getElementById('paymentProof').required = true;
        }
        else {
            paymentInfo.classList.add('d-none');
            qrisSection.classList.add('d-none');
            proofUpload.classList.add('d-none');
        }
    });

    // Validasi form submit
    orderForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const paymentMethod = document.getElementById('paymentMethod').value;
        const isQris = paymentMethod === 'QRIS';

        // Validasi upload bukti transfer untuk non-QRIS
        if (!isQris && !document.getElementById('paymentProof').files[0]) {
            alert('Harap upload bukti transfer!');
            return;
        }
    });

    // Validasi file upload
    document.getElementById('paymentProof').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            // Validasi ukuran file (maks 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Ukuran file terlalu besar. Maksimal 5MB.');
                e.target.value = '';
                return;
            }

            // Validasi tipe file
            const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            if (!validTypes.includes(file.type)) {
                alert('Format file tidak didukung. Harap upload JPG, PNG, atau PDF.');
                e.target.value = '';
            }
        }
    });
});

// Alert khusus untuk Instagram followers
document.getElementById('serviceType').addEventListener('change', function() {
    const instagramWarning = document.getElementById('instagramWarning');
    const isInstagramFollowers = this.value === 'Instagram Followers';
    
    if (isInstagramFollowers) {
        // Buat alert jika belum ada
        if (!instagramWarning) {
            const alertDiv = document.createElement('div');
            alertDiv.id = 'instagramWarning';
            alertDiv.className = 'alert alert-warning mt-3';
            alertDiv.innerHTML = `
                <p><strong>Perhatian:</strong> Pastikan Anda telah:</p>
                <ol>
                    <li>Menonaktifkan flag reviews</li>
                    <li>Mengubah akun ke mode public</li>
                </ol>
                <p>Pesanan tidak dapat diproses jika syarat di atas tidak terpenuhi.</p>
            `;
            
            // Sisipkan setelah select serviceType
            this.closest('.mb-3').insertAdjacentElement('afterend', alertDiv);
        } else {
            instagramWarning.classList.remove('d-none');
        }
    } else if (instagramWarning) {
        instagramWarning.classList.add('d-none');
    }
});