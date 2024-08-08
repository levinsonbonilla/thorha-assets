document.addEventListener('DOMContentLoaded', function() {
    var imageInput = document.getElementById(`${prefix}_image`);
    var previewContainer = document.querySelector('.image-preview-container');
    var previewImage = document.getElementById('image-preview');
    var removeButton = document.getElementById('remove-image');
    var uploadLabel = document.querySelector('.upload-label');

    imageInput.addEventListener('change', function() {
        var file = this.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewContainer.style.display = 'flex';
                uploadLabel.style.display = 'none';
                removeButton.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });

    removeButton.addEventListener('click', function(e) {
        e.stopPropagation();
        imageInput.value = '';
        previewImage.src = '#';
        previewContainer.style.display = 'none';
        uploadLabel.style.display = 'flex';
        removeButton.style.display = 'none';
    });
});