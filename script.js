/* ==========================
   WENDK MULTISERVICES
   JAVASCRIPT
========================== */


// Animation simple au chargement

document.addEventListener("DOMContentLoaded", function(){

    console.log("WENDK MULTISERVICES - Site chargé avec succès");


    // Défilement fluide des liens du menu

    const liens = document.querySelectorAll("nav a");

    liens.forEach(function(lien){

        lien.addEventListener("click", function(e){

            const destination = document.querySelector(
                this.getAttribute("href")
            );

            if(destination){

                e.preventDefault();

                destination.scrollIntoView({
                    behavior:"smooth"
                });

            }

        });

    });


});
