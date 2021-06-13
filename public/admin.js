$(document).ready(function() {
    $('select').formSelect();
});

[
    ['.input-images', 'images', 'imagesPreloaded', 8, false],
    ['.input-main-image', 'mainImage', 'mainImagePreloaded', 1, false],
    ['.input-image', 'image', 'imagePreloaded', 1, true],
    ['.input-news-image', 'newsImage', 'newsImagePreloaded', 1, true],
].forEach(function(data) {
    var node = document.querySelector(data[0]);

    if (!node) return;

    $(node).imageUploader({
        maxFiles: data[3],
        imagesInputName: data[1],
        preloadedInputName: data[2],
        required: data[4],
        preloaded: Array.from(node.parentElement.querySelectorAll('.preloaded-image')).map(image => ({ id: image.dataset.id, src: image.dataset.src }))
    });
});
