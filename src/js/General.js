import * as fct from "/src/js/fonctions.js";

/***********************************************************************/
/** VARIABLES GLOBALES 
/***********************************************************************/

var player; // désigne le sprite du joueur
var clavier; // pour la gestion du clavier
var scene;
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
      "Phaser_TileSet"
    );
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
    const objects = [Eau, Sable, BordSable, Chemin, Arbres, Foret, Riviere, BordRiviere, Ponton, Batiment, Potager, Legume];
    objects.forEach(obj => obj.setCollisionByProperty({ estSolide: true }));

  
    /****************************
     *  CREATION DU PERSONNAGE  *
     ****************************/

    // On créée un nouveeau personnage : player
    player = this.physics.add.sprite(1500, 1500, "img_perso");

    //  propriétées physiqyes de l'objet player :
    player.setBounce(0.2); // on donne un petit coefficient de rebond
    player.setCollideWorldBounds(true); // le player se cognera contre les bords du monde
    player.setSize(16,16);
    player.setOffset(16,16);
    //player.setScale(1.5)
    
    /***************************
     *  CREATION DES ANIMATIONS *
     ****************************/
    // dans cette partie, on crée les animations, à partir des spritesheet
    // chaque animation est une succession de frame à vitesse de défilement défini
    // une animation doit avoir un nom. Quand on voudra la jouer sur un sprite, on utilisera la méthode play()
    // creation de l'animation "anim_tourne_gauche" qui sera jouée sur le player lorsque ce dernier tourne à gauche
    this.anims.create({
      key: "anim_tourne_gauche", // key est le nom de l'animation : doit etre unique poru la scene.
      frames: this.anims.generateFrameNumbers("img_perso", {
        start: 0,
        end: 3
      }), // on prend toutes les frames de img perso numerotées de 0 à 3
      frameRate: 10, // vitesse de défilement des frames
      repeat: -1 // nombre de répétitions de l'animation. -1 = infini
    });

    // creation de l'animation "anim_tourne_face" qui sera jouée sur le player lorsque ce dernier n'avance pas.
    this.anims.create({
      key: "anim_face",
      frames: [{ key: "img_perso", frame: 4 }],
      frameRate: 20
    });

    // creation de l'animation "anim_tourne_droite" qui sera jouée sur le player lorsque ce dernier tourne à droite
    this.anims.create({
      key: "anim_tourne_droite",
      frames: this.anims.generateFrameNumbers("img_perso", {
        start: 5,
        end: 8
      }),
      frameRate: 10,
      repeat: -1
    });

    /***********************
     *  CREATION DU CLAVIER *
     ************************/
    // ceci permet de creer un clavier et de mapper des touches, connaitre l'état des touches
    clavier = this.input.keyboard.createCursorKeys();

    /*****************************************************
     *  GESTION DES INTERATIONS ENTRE  GROUPES ET ELEMENTS *
     ******************************************************/

    //  Collide the player and the groupe_etoiles with the groupe_plateformes
    this.physics.add.collider(player, objects);

    
  }

  /***********************************************************************/
  /** FONCTION UPDATE 
/***********************************************************************/

  update() {

    if (clavier.left.isDown) {
      player.setVelocityX(-160);
      player.anims.play("anim_tourne_gauche", true);

    } else if (clavier.right.isDown) {
      player.setVelocityX(160);
      player.anims.play("anim_tourne_droite", true);
    } else {
      player.setVelocityX(0);
      if (player.body.velocity.y == 0)
        player.anims.play("anim_face");
    }

    if (clavier.up.isDown) {
      player.setVelocityY(-160);
      player.anims.play("anim_face", true);
    }
    else if (clavier.down.isDown) {
      player.setVelocityY(160);
      player.anims.play("anim_face", true);
    }
    else {
      player.setVelocityY(0);
      if (player.body.velocity.x == 0)
        player.anims.play("anim_face");
    }

 // redimentionnement du monde avec les dimensions calculées via tiled
 this.physics.world.setBounds(0, 0, 3200, 3200);
 //  ajout du champs de la caméra de taille identique à celle du monde
 this.cameras.main.setBounds(0, 0, 3200, 3200);
 // ancrage de la caméra sur le joueur
 this.cameras.main.startFollow(player);

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
