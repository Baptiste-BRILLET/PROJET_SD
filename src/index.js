// chargement des librairies
import Mairie from "/src/js/Mairie.js";
import Peche from "/src/js/Peche.js";
import niveau2 from "/src/js/niveau2.js";
import niveau3 from "/src/js/niveau3.js";
import menu from "/src/js/menu.js";
import General from "/src/js/General.js";

// configuration générale du jeu
var config = {
  type: Phaser.AUTO,
  width: 800, // largeur en pixels
  height: 600, // hauteur en pixels
   scale: {
        // Or set parent divId here
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
   },
  physics: {
    // définition des parametres physiques
    default: "arcade", // mode arcade : le plus simple : des rectangles pour gérer les collisions. Pas de pentes
    arcade: {
      // parametres du mode arcade
      gravity: {
        y: 0 // gravité verticale : acceleration ddes corps en pixels par seconde
      },
      debug: false // permet de voir les hitbox et les vecteurs d'acceleration quand mis à true
    }
  },
  scene: [General, menu, Mairie, Peche, niveau2, niveau3]
};

// création et lancement du jeu
var game = new Phaser.Game(config);
game.scene.start("menu");
