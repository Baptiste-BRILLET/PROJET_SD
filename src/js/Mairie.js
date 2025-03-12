export default class Mairie extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "Mairie" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
    this.load.image("Phaser_TileSet", "src/assets/TileSet_VF.png");
    this.load.tilemapTiledJSON("carteMairie", "src/assets/mairie.json");
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
    //this.game.config.type.width = 600;
    //this.game.config.type.height = 600;
    /*************************************
     *  CREATION DU MONDE  *
     *************************************/
    const CarteMairie = this.add.tilemap("carteMairie");
 
    // chargement du jeu de tuiles
    const tileset = CarteMairie.addTilesetImage(
      "TileSet_VF",
      "Phaser_TileSet"
    );
    // chargement de chaque calque
    const plancher = CarteMairie.createLayer(
      "plancher",
      tileset
    );
    const mur = CarteMairie.createLayer(
      "mur",
      tileset
    );
    const mur2 = CarteMairie.createLayer(
      "mur2",
      tileset
    );
    const escalier = CarteMairie.createLayer(
      "escalier",
      tileset
    );
    const Calque_de_Tuiles_7 = CarteMairie.createLayer(
      "solsup",
      tileset
    );
    const escalier2 = CarteMairie.createLayer(
      "escalier2",
      tileset
    );
    const fenetre2 = CarteMairie.createLayer(
      "fenetre2",
      tileset
    );
    const tapis = CarteMairie.createLayer(
      "tapisbis",
      tileset
    );
    const meuble = CarteMairie.createLayer(
      "meuble",
      tileset
    );
    const tapis2 = CarteMairie.createLayer(
      "tapis",
      tileset
    );
    const objet = CarteMairie.createLayer(
      "objet",
      tileset
    );
 
    // définition des tuiles de plateformes qui sont solides
 
    const objects = [plancher, mur, mur2, escalier, Calque_de_Tuiles_7, escalier2, fenetre2, tapis, meuble, tapis2, objet];
    objects.forEach(obj => obj.setCollisionByProperty({ estSolide: true }));



    /****************************
     *  RECUPERATION DU PERSONNAGE  *
     ****************************/
 
    // On créée un nouveeau personnage : player
    this.player = this.physics.add.sprite(300, 400, "img_perso");
 
    //  propriétées physiqyes de l'objet player :
    this.player.setBounce(0.2); // on donne un petit coefficient de rebond
    this.player.setCollideWorldBounds(true); // le player se cognera contre les bords du monde
 
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
    this.clavier = this.input.keyboard.createCursorKeys();
 
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
