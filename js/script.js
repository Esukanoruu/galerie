$(function () { // Attente chargement complet du DOM


    ///////////////////////////////////////////////////////////////////////////////////////////

    // Fonction d'initialisation du slider (création des boutons, mise en place des images, lancement de la boucle de défilement automatique, etc ...)
    function initSlider() {

        // Si le nombre d'images dans la div du slider est inférieur à 1, on affiche un message d'erreur et on arrête la création du slider
        let numberOfImg = $slider.find('img').length
        if (numberOfImg < 1) {
            $slider.html('<span style="color:red;">Le slider doit contenir au moins une image!</span>');
            return false;
        }

        // Création des boutons du slider
        $slider.append('<div class="next"></div>');
        $slider.append('<div class="previous"></div>');
        $slider.append('<div class="pause-play-button">Pause</div>');

        // Création d'un bouton pour chacune des images en dessous du slider
        $slider.after('<div class="slider-pannel"></div>');
        for (let i = 1; i <= numberOfImg; i++) {
            $slider.next().append('<div class="goto-button" data-goto="' + i + '">O</div>');
        }

        // Affichage de la première image dans le slider (0 = sans animation vu que c'est le placement initial)
        setImg(1, 0);

        // démarrage de la boucle de défilement automatique
        startLoop();

        // Écouteurs d'évènement sur les fleches image suivante (fleche droite) et image précédente (fleche gauche)
        $slider.find('.next').click(function () {
            nextImg();
        });
        $slider.find('.previous').click(function () {
            previousImg();
        });

        // Écouteurs d'évènements sur les boutons en dessous du slider, permettant de changer d'image en cliquant dessus
        $slider.next().find('.goto-button').click(function () {
            setImg($(this).data('goto'));
            stopLoop();
        });

        // Écouteur d'évènement sur le bouton "pause/lecture"
        $('.pause-play-button').click(function () {
            // Si le texte actuel du bouton est pause, alors on stop la boucle, sinon on la lance
            if ($(this).text() == 'Pause') { stopLoop(); }
            else { startLoop(); }
        });

        // Écouteur d'évènement sur le redimensionnement de la fenêtre, pour redimensionner en tant réel le slider (Responsive)
        $(window).resize(function () {
            resizeSlider();
        });

        // Écouteur d'évènement sur la pression de touche du clavier
        $(document).keydown(function (e) {
            // Si la touche pressée est la 37 (flèche gauche du clavier), on appel l'image précédente
            if (e.which == 37) { previousImg(); }
            // Si la touche est la 39 (flèche droite du clavier), on appel l'image suivante
            else if (e.which == 39) { nextImg(); }

        });

    }

    ///////////////////////////////////////////////////////////////////////////////////////////

    // Fonction qui affiche l'image demandée par son data-order en 1er paramètre, avec le temps d'animation en 2nd paramètre
    function setImg(imgToSet, animationDuration) {

        // Variable-raccourcie vers les images du slider
        let $images = $slider.find('img');

        // Si l'image demandée est plus petite que 1, on demande la dernière image. Sinon si l'image demandé est plus grande que le nombre total d'image, on demande la première image
        if (imgToSet < 1) {
            imgToSet = $images.length;
        } else if (imgToSet > $images.length) {
            imgToSet = 1;
        }

        // Retrait de la class active de toutes les images, puis application de cette dernière sur l'image demandée (la classe sert de repère pour savoir quelle image est actuellement affichée)
        $slider.find('img').removeClass("active");
        $slider.find('img[data-order="' + imgToSet + '"]').addClass("active");

        // On déclenche un redimensionnement du slider pour s'adapter à la nouvelle image
        resizeSlider();

        // Décalage de toutes les images pour les mettre en "fresque" et on les déplace pour que l'image demandée (imgToSet) soit à left 0 et donc visible dans le slider
        for (let i = 1; i <= $images.length; i++) {
            $images.parent().find('[data-order='+ i +']').animate({
                'left': ((i - imgToSet) * 100) + '%'
            }, animationDuration);
        }

        // On enlève la classe active des boutons en dessous du slider pour la remettre sur le bouton associé à la nouvelle image affichée
        $slider.next().find('.goto-button').removeClass('active');
        $slider.next().find('.goto-button[data-goto="' + imgToSet + '"]').addClass('active');
    }

    ///////////////////////////////////////////////////////////////////////////////////////////


    // Fonction qui appelle l'affichage de l'image suivante (si le paramètre est sur false, la fonction ne stoppera pas le défilement automatique)
    function nextImg(stop = true) {
        let newImg = parseInt($("#slider img.active").data('order'), 10) + 1;
        setImg(newImg);
        if (stop) { stopLoop(); }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////


    // Fonction qui appelle l'affichage de l'image précédente (si le paramètre est sur false, la fonction ne stoppera pas le défilement automatique)
    function previousImg(stop = false) {
        let newImg = parseInt($("#slider img.active").data('order'), 10) - 1;
        setImg(newImg);
        if (stop) { stopLoop(); }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////


    // Fonction qui redimensionne la hauteur du slider à la hauteur de l'image affichée
    function resizeSlider() {
        $slider.css('height', $slider.find('img.active').height() + 'px');
    }

    ///////////////////////////////////////////////////////////////////////////////////////////


    // Fonction qui démarre la boucle de défilement des images
    function startLoop() {
        $('#slider .pause-play-button').text('Pause');
        loop = setInterval(function () {
            nextImg(false);
        }, loopTimeOut);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////


    // Fonction qui stop la boucle de défilement des images
    function stopLoop() {
        $('#slider .pause-play-button').text('Lecture');
        clearInterval(loop);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////


    // Déclaration des variables globales
    // Perspectives d'amélioration : Si on voulait améliorer encore le slider et le rendre plus ré-utilisable, il serait que le slider fonctionne sans devoir utiliser de variables globales, en utilisant la programmation orientée objet par exemple
    let $slider = $('#slider'); // Variable-raccourcie vers le slider
    let loop; // Variable qui contiendra la boucle de défilement automatique
    let loopTimeOut = 4000; // Temps en ms du défilement automatique

    initSlider(); // Initialisation du slider
});
