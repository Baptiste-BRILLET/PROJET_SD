// chargement des librairies
import Mairie from "/src/js/Mairie.js";
import Peche from "/src/js/Peche.js";
import Abeille from "/src/js/Abeille.js";
import menu from "/src/js/menu.js";
import General from "/src/js/General.js";


// configuration générale du jeu
var config = {
  type: Phaser.AUTO,
  width: 640, // Taille de base
    height: 480, // Taille de base
    scale: {
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
  pixelArt: true, // Important pour éviter l’antialiasing

  scene: [General, menu, Mairie, Peche, Abeille]
};

// création et lancement du jeu
var game = new Phaser.Game(config);
game.scene.start("menu");
