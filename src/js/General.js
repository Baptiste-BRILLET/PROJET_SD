import * as fct from "/src/js/fonctions.js";

/***********************************************************************/
/** VARIABLES GLOBALES 
/***********************************************************************/

var player; // désigne le sprite du joueur
var clavier; // pour la gestion du clavier
var scene;
var Pecheur;
var PNJ1;
var PNJCarrote;
var PNJ2;
var PNJ3;
var PNJ_Requin;
var PNJ_Nageur;
var PNJ_Miel;
var PNJ_Bucheron;
var PNJ_4;
var PNJ_5;
var PNJ_6;
var PNJMairie;
var PNJ_Maire;
var porte_retour;
// définition de la classe "selection"
export default class General extends Phaser.Scene {
  constructor() {
    super({ key: "General" }); // mettre le meme nom que le nom de la classe
  }

  /***********************************************************************/
  /** FONCTION PRELOAD 
/***********************************************************************/

  /** La fonction preload est appelée une et une seule fois,
   * lors du chargement de la scene dans le jeu.
   * On y trouve surtout le chargement des assets (images, son ..)
   */
  preload() {
    this.load.image("Phaser_TileSet", "src/assets/TileSet_VF.png");
    this.load.tilemapTiledJSON("carte", "src/assets/MapGeneral.json");

    this.load.spritesheet("img_perso", "src/assets/Perso.png", {
      frameWidth: 48,
      frameHeight: 48
    });

    //Création PNJ
    this.load.image("img_Pecheur", "src/assets/PNG/Pecheur.png");
    this.load.image("img_PNJ1", "src/assets/PNG/PNJ1.png");
    this.load.image("img_PNJCarrote", "src/assets/PNG/PNJCarrote.png");
    this.load.image("img_PNJ2", "src/assets/PNG/PNJ2.png");
    this.load.image("img_PNJ3", "src/assets/PNG/PNJ3.png");
    this.load.image("img_PNJ_Requin", "src/assets/PNG/PNJ_Requin.png");
    this.load.image("img_PNJ_Nageur", "src/assets/PNG/PNJ_Nageur.png");
    this.load.image("img_PNJ_Miel", "src/assets/PNG/PNJ_Miel.png");
    this.load.image("img_PNJ_Bucheron", "src/assets/PNG/PNJ_Bucheron.png");
    this.load.image("img_PNJ_4", "src/assets/PNG/PNJ_4.png");
    this.load.image("img_PNJ_5", "src/assets/PNG/PNJ_5.png");
    this.load.image("img_PNJ_6", "src/assets/PNG/PNJ_6.png");


    //Image Quetes
    this.load.image("questImage1", "src/assets/Quete/Quete1.png"); // Image de la quête 1
    this.load.image("questImage2", "src/assets/Quete/Quete2.png"); // Image de la quête 2
    this.load.image("questImage3", "src/assets/Quete/Quete3.png"); // Image de la quête 3
    this.load.image("questImage4", "src/assets/Quete/Quete4.png"); // Image de la quête 4
    this.load.image("playButton1", "src/assets/Quete/Play1.png"); // Bouton Play 1
    this.load.image("playButton2", "src/assets/Quete/Play2.png"); // Bouton Play 2
    this.load.image("playButton3", "src/assets/Quete/Play3.png"); // Bouton Play 3
    this.load.image("playButton4", "src/assets/Quete/Play4.png"); // Bouton Play 4
    this.load.image("quitButton1", "src/assets/Quete/Exit1.png"); // Bouton Quit 1
    this.load.image("quitButton2", "src/assets/Quete/Exit2.png"); // Bouton Quit 2
    this.load.image("quitButton3", "src/assets/Quete/Exit3.png"); // Bouton Quit 3
    this.load.image("quitButton4", "src/assets/Quete/Exit4.png"); // Bouton Quit 4



  }

  /***********************************************************************/
  /** FONCTION CREATE 
/***********************************************************************/

  /* La fonction create est appelée lors du lancement de la scene
   * si on relance la scene, elle sera appelée a nouveau
   * on y trouve toutes les instructions permettant de créer la scene
   * placement des peronnages, des sprites, des platesformes, création des animations
   * ainsi que toutes les instructions permettant de planifier des evenements
   */
  create() {
    fct.doNothing();
    fct.doAlsoNothing();

    /*************************************
     *  CREATION DU MONDE  *
     *************************************/
    scene = this;
    const CarteGeneralWord = this.add.tilemap("carte");

    // chargement du jeu de tuiles
    const tileset = CarteGeneralWord.addTilesetImage(
      "TileSet_VF",
      "Phaser_TileSet", 16, 16, 0, 0
    );

    this.textures.get('TileSet_VF').setFilter(Phaser.Textures.FilterMode.NEAREST);

    // chargement de chaque calque
    const Eau = CarteGeneralWord.createLayer(
      "Eau",
      tileset
    );

    const Sable = CarteGeneralWord.createLayer(
      "Sable",
      tileset
    );

    const BordSable = CarteGeneralWord.createLayer(
      "BordSable",
      tileset
    );

    const Terre = CarteGeneralWord.createLayer(
      "Terre",
      tileset
    );
    const Chemin = CarteGeneralWord.createLayer(
      "Chemin",
      tileset
    );
    const Arbres = CarteGeneralWord.createLayer(
      "Arbres",
      tileset
    );
    const Foret = CarteGeneralWord.createLayer(
      "Foret",
      tileset
    );
    const Riviere = CarteGeneralWord.createLayer(
      "Riviere",
      tileset
    );
    const BordRiviere = CarteGeneralWord.createLayer(
      "BordRiviere",
      tileset
    );
    const Batiment = CarteGeneralWord.createLayer(
      "Batiment",
      tileset
    );
    const Ponton = CarteGeneralWord.createLayer(
      "Ponton",
      tileset
    );
    const Potager = CarteGeneralWord.createLayer(
      "Potager",
      tileset
    );
    const Legume = CarteGeneralWord.createLayer(
      "Legume",
      tileset
    );

    // définition des tuiles de plateformes qui sont solides
    const objects = [Eau, Sable, BordSable, Terre, Chemin, Arbres, Foret, Riviere, BordRiviere, Ponton, Batiment, Potager, Legume];
    objects.forEach(obj => obj.setCollisionByProperty({ estSolide: true }));


    /****************************
     *  CREATION DU PERSONNAGE  *
     ****************************/

    // On créée un nouveeau personnage : player
    player = this.physics.add.sprite(1250, 800, "img_perso");

    //  propriétées physiqyes de l'objet player :
    player.setBounce(0.2); // on donne un petit coefficient de rebond
    player.setCollideWorldBounds(true); // le player se cognera contre les bords du monde
    player.setSize(16, 16);
    player.setOffset(16, 16);
    //player.setScale(1.5)

    /****************************
    *  CREATION DU PERSONNAGE  *
    ****************************/
    /**
    * Met à jour la position du joueur si celui-ci provient de la scène "Pêche" ou "Mairie" ou "Abeille".
    * 
    * Vérifie si `fromPeche` ou `fromMairie` ou `fromAbeille` est défini et vrai dans `this.game.config`.
    * Si c'est le cas, la position du joueur (`player.x` et `player.y`) est mise à jour 
    * avec les coordonnées stockées dans `this.game.config.x` et `this.game.config.y`.
    */

    if (this.game.config.fromPeche != undefined && this.game.config.fromPeche == true) {
      player.x = this.game.config.x;
      player.y = this.game.config.y;
    }

    if (this.game.config.fromMairie != undefined && this.game.config.fromMairie == true) {
      player.x = this.game.config.x;
      player.y = this.game.config.y;
    }

    if (this.game.config.fromAbeille != undefined && this.game.config.fromAbeille == true) {
      player.x = this.game.config.x;
      player.y = this.game.config.y;
    }

    /***************************
     *  CREATION DES ANIMATIONS *
     ****************************/
    // dans cette partie, on crée les animations, à partir des spritesheet
    // chaque animation est une succession de frame à vitesse de défilement défini
    // une animation doit avoir un nom. Quand on voudra la jouer sur un sprite, on utilisera la méthode play()
    // creation de l'animation "anim_tourne_gauche" qui sera jouée sur le player lorsque ce dernier tourne à gauche
    this.anims.create({
      key: "anim_droite",
      frames: this.anims.generateFrameNumbers("img_perso", {
        start: 20, // Début de la ligne 6
        end: 23   // Fin de la ligne 6
      }),
      frameRate: 10, //Affiche 10 images par seconde
      repeat: -1 // Boucle infini
    });

    this.anims.create({
      key: "anim_gauche",
      frames: this.anims.generateFrameNumbers("img_perso", {
        start: 24, // Début de la ligne 7
        end: 27   // Fin de la ligne 7
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "anim_face",
      frames: this.anims.generateFrameNumbers("img_perso", {
        start: 16, // Début de la ligne 5
        end: 19   // Fin de la ligne 5
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "anim_dos",
      frames: this.anims.generateFrameNumbers("img_perso", {
        start: 28, // Début de la ligne 8
        end: 31   // Fin de la ligne 8
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "anim_repos",
      frames: [{ key: "img_perso", frame: 1 }],
      frameRate: 10
    });

    /***********************
     *  CREATION DES PNJ *
    ************************/

    //Création des PNJ
    Pecheur = this.physics.add.sprite(2150, 1400, "img_Pecheur");
    PNJ_Bucheron = this.physics.add.sprite(900, 1150, "img_PNJ_Bucheron");
    PNJ_Miel = this.physics.add.sprite(1300, 2100, "img_PNJ_Miel");
    PNJCarrote = this.physics.add.sprite(800, 1900, "img_PNJCarrote");
    PNJCarrote = this.physics.add.sprite(2300, 1600, "img_PNJCarrote");
    PNJ1 = this.physics.add.sprite(1480, 1600, "img_PNJ1");
    PNJ1 = this.physics.add.sprite(1700, 2000, "img_PNJ1");
    PNJ2 = this.physics.add.sprite(1640, 1450, "img_PNJ2");
    PNJ2 = this.physics.add.sprite(1300, 1000, "img_PNJ2");
    PNJ3 = this.physics.add.sprite(1600, 1550, "img_PNJ3");
    PNJ_Requin = this.physics.add.sprite(1200, 700, "img_PNJ_Requin");
    PNJ_Requin = this.physics.add.sprite(2000, 500, "img_PNJ_Requin");
    PNJ_Requin = this.physics.add.sprite(1700, 800, "img_PNJ_Requin");
    PNJ_Nageur = this.physics.add.sprite(1400, 1200, "img_PNJ_Nageur");
    PNJ_Nageur = this.physics.add.sprite(950, 1900, "img_PNJ_Nageur");
    PNJ_Nageur = this.physics.add.sprite(2150, 1650, "img_PNJ_Nageur");
    PNJ_4 = this.physics.add.sprite(2000, 2400, "img_PNJ_4");
    PNJ_4 = this.physics.add.sprite(950, 2300, "img_PNJ_4");
    PNJ_5 = this.physics.add.sprite(1300, 1700, "img_PNJ_5");
    PNJ_5 = this.physics.add.sprite(2500, 1300, "img_PNJ_5");
    PNJ_6 = this.physics.add.sprite(1650, 1750, "img_PNJ_6");
    PNJ_4 = this.physics.add.sprite(1750, 1150, "img_PNJ_4");
    PNJ_6 = this.physics.add.sprite(2250, 2000, "img_PNJ_6");
    PNJ_5 = this.physics.add.sprite(700, 1700, "img_PNJ_5");
    PNJ_6 = this.physics.add.sprite(1320, 1400, "img_PNJ_6");
    PNJMairie = this.physics.add.sprite(1460, 1780, "img_PNJ3");


    /***********************
     *  CREATION DU CLAVIER *
     ************************/
    // ceci permet de creer un clavier et de mapper des touches, connaitre l'état des touches
    clavier = this.input.keyboard.createCursorKeys();

    /*****************************************************
     *  GESTION DES INTERATIONS ENTRE  GROUPES ET ELEMENTS *
     ******************************************************/

    //  Collide the player objects
    this.physics.add.collider(player, objects);
    this.cameras.main.roundPixels = true;

    /*****************************************************
     *  GESTION DES INTERATIONS ENTRE  PERSO ET PNJ (Maire) *
     ******************************************************/

    // Création de l'image de quête, invisible par défaut
    this.questImage1 = this.add.image(1460, 1780, "questImage1").setVisible(false);
    this.playButton1 = this.add.image(1400, 1800, "playButton1").setVisible(false).setInteractive();
    this.quitButton1 = this.add.image(1480, 1780, "quitButton1").setVisible(false).setInteractive();

    this.playButton1.on("pointerdown", () => {
      this.scene.start("Mairie"); // Change de scène
    });
    this.quitButton1.on("pointerdown", () => {
      this.hideQuestUI(this.questImage1, this.playButton1, this.quitButton1); // Cache l'interface
    });

    /*****************************************************
     *  GESTION DES INTERATIONS ENTRE  PERSO ET PNJ (Pacheur) *
     ******************************************************/

    // Création de l'image de quête, invisible par défaut
    this.questImage2 = this.add.image(2150, 1400, "questImage2").setVisible(false);
    this.playButton2 = this.add.image(2100, 1500, "playButton2").setVisible(false).setInteractive();
    this.quitButton2 = this.add.image(2200, 1500, "quitButton2").setVisible(false).setInteractive();

    this.playButton2.on("pointerdown", () => {
      this.scene.start("Peche"); // Change de scène
    });
    this.quitButton2.on("pointerdown", () => {
      this.hideQuestUI(this.questImage2, this.playButton2, this.quitButton2); // Cache l'interface
    });

    /*****************************************************
     *  GESTION DES INTERATIONS ENTRE  PERSO ET PNJ (Bucheron)*
     ******************************************************/

    // Création de l'image de quête, invisible par défaut
    this.questImage3 = this.add.image(900, 1500, "questImage3").setVisible(false);
    this.playButton3 = this.add.image(850, 1400, "playButton3").setVisible(false).setInteractive();
    this.quitButton3 = this.add.image(950, 1600, "quitButton3").setVisible(false).setInteractive();

    //On ne veux pas changer de scène mais juste afficher en plus un élément sur la map
    this.playButton3.on("pointerdown", () => {
      this.physics.add.sprite(1600, 1600, "img_crabe");
      this.hideQuestUI(this.questImage3, this.playButton3, this.quitButton3); // Cache l'interface
    });
    this.quitButton3.on("pointerdown", () => {
      this.hideQuestUI(this.questImage3, this.playButton3, this.quitButton3); // Cache l'interface
    });

    /*****************************************************
     *  GESTION DES INTERATIONS ENTRE  PERSO ET PNJ (Miel) *
     ******************************************************/

    // Création de l'image de quête, invisible par défaut
    this.questImage4 = this.add.image(1300, 2100, "questImage4").setVisible(false);
    this.playButton4 = this.add.image(1250, 2200, "playButton4").setVisible(false).setInteractive();
    this.quitButton4 = this.add.image(1150, 2000, "quitButton4").setVisible(false).setInteractive();

    this.playButton4.on("pointerdown", () => {
      this.scene.start("Abeille"); // Change de scène
    });
    this.quitButton4.on("pointerdown", () => {
      this.hideQuestUI(this.questImage4, this.playButton4, this.quitButton4); // Cache l'interface
    });
  }
  /***********************************************************************/
  /** FONCTION ShowQuestUI
/***********************************************************************/
  showQuestUI(image, play, quit) {
    image.setVisible(true);
    play.setVisible(true);
    quit.setVisible(true);
  }
  /***********************************************************************/
  /** FONCTION HideQuestUI 
/***********************************************************************/
  hideQuestUI(image, play, quit) {
    image.setVisible(false);
    play.setVisible(false);
    quit.setVisible(false);
  }
  /***********************************************************************/
  /** FONCTION UPDATE 
/***********************************************************************/

  update() {

    // Gestion du clavier
    let clavier = this.input.keyboard.createCursorKeys();
    let keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.Z, //Touche Z pour avancer
      down: Phaser.Input.Keyboard.KeyCodes.S, //Touche S pour reculer
      left: Phaser.Input.Keyboard.KeyCodes.Q, //Touche Q pour aller à gauche
      right: Phaser.Input.Keyboard.KeyCodes.D //Touche D pour aller à droite
    });

    // Déplacement horizontal
    if (keys.left.isDown) {
      player.setVelocityX(-160);
      player.anims.play("anim_gauche", true);
    } else if (keys.right.isDown) {
      player.setVelocityX(160);
      player.anims.play("anim_droite", true);
    } else {
      player.setVelocityX(0);
    }

    // Déplacement vertical
    if (keys.up.isDown) {
      player.setVelocityY(-160);
      player.anims.play("anim_dos", true);
    } else if (keys.down.isDown) {
      player.setVelocityY(160);
      player.anims.play("anim_face", true);
    } else {
      player.setVelocityY(0);
    }

    // Si aucune touche n'est pressée, jouer l'animation de repos
    if (player.body.velocity.x === 0 && player.body.velocity.y === 0) {
      player.anims.play("anim_repos");
    }

    // redimentionnement du monde avec les dimensions calculées via tiled
    this.physics.world.setBounds(0, 0, 3200, 3200);
    //  ajout du champs de la caméra de taille identique à celle du monde
    this.cameras.main.setBounds(0, 0, 3200, 3200);
    // ancrage de la caméra sur le joueur
    this.cameras.main.startFollow(player);

    // Interaction pour la quetes
    if (this.physics.overlap(player, PNJMairie)) {
      this.showQuestUI(this.questImage1, this.playButton1, this.quitButton1);
    }
    // Interaction pour la quetes
    if (this.physics.overlap(player, Pecheur)) {
      this.showQuestUI(this.questImage2, this.playButton2, this.quitButton2);
    }
    // Interaction pour la quetes
    if (this.physics.overlap(player, PNJ_Bucheron)) {
      this.showQuestUI(this.questImage3, this.playButton3, this.quitButton3);
    }
    // Interaction pour la quetes
    if (this.physics.overlap(player, PNJ_Miel)) {
      this.showQuestUI(this.questImage4, this.playButton4, this.quitButton4);
    }

    if (Phaser.Input.Keyboard.JustDown(clavier.space) == true) {
      if (this.physics.overlap(player, this.porte1))
        this.scene.switch("niveau1");
      if (this.physics.overlap(player, this.porte2))
        this.scene.switch("niveau2");
      if (this.physics.overlap(player, this.porte3))
        this.scene.switch("niveau3");
    }
  }
}

/***********************************************************************/
/** CONFIGURATION GLOBALE DU JEU ET LANCEMENT 
/***********************************************************************/
