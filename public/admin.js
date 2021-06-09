$(document).ready(function() {
    $('select').formSelect();
});

(function() {
    var mfpBlocks = document.querySelectorAll('.multiple-file-preview');

    mfpBlocks.forEach(function(mfpBlock) {
        var targetId = mfpBlock.dataset['for'];
        var targetInput = document.getElementById(targetId);
        var targetInputName = targetInput.name;
        var targetOrderInput = appendHiddenInput(targetInputName, targetInput);
        var mfpBlockContent = mfpBlock.querySelector('.multiple-file-preview__content');

        if (mfpBlockContent.children.length === 0) {
            mfpBlock.classList.add('multiple-file-preview_empty');
        }

        $(mfpBlockContent).sortable();
        $(mfpBlockContent).disableSelection();
        $(mfpBlockContent).on('sortbeforestop', function() { reorderImages(mfpBlockContent, targetOrderInput) });

        reorderImages(mfpBlockContent, targetOrderInput);

        targetInput.addEventListener('change', function(event) {
            var files = Array.prototype.slice.call(event.target.files);

            mfpBlock.classList.toggle('multiple-file-preview_empty', !files.length);

            files.reduce(function(acc, file, index) {
                function loadNext() {
                    return new Promise(function(resolve) {
                        var reader = new FileReader();

                        reader.onload = (function(file) {
                            return function(event) {
                                mfpBlockContent.insertAdjacentHTML('beforeend',
                                    '<li class="multiple-file-preview__item ui-state-default" data-order=0 data-id="' + index + '">' +
                                    '<img src="' + event.target.result + '" style="width:100%;" />' +
                                    '</li>'
                                );
                                resolve();
                            };
                        })(file);

                        reader.readAsDataURL(file);
                    });
                }

                return acc.then(function() { return loadNext() });
            }, Promise.resolve()).then(function() {
                reorderImages(mfpBlockContent, targetOrderInput);
            });
        });
    });

    function reorderImages(mfpBlockContent, targetOrderInput) {
        var images = mfpBlockContent.querySelectorAll('.multiple-file-preview__item');
        var order = [];

        images.forEach(function(image, index) {
            if (image.classList.contains('ui-state-default') && !image.classList.contains('ui-sortable-placeholder')) {
                image.setAttribute('data-order', index);
            }
            if (image.dataset.id) {
                order.push(image.dataset.id);
            }
        });

        targetOrderInput.value = JSON.stringify(order);
    }

    function appendHiddenInput(targetInputName, targetInput) {
        var hiddenInput = document.createElement('input');

        hiddenInput.hidden = true;
        hiddenInput.name = targetInputName + 'Order';
        targetInput.insertAdjacentElement('afterend', hiddenInput);

        return hiddenInput;
    }
})();