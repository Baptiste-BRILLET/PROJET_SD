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
    fct.doNothing();
    fct.doAlsoNothing();
    /*************************************
     *  CREATION DU MONDE  *
     *************************************/
    scene = this;
    const CarteGeneral = this.add.tilemap("carteMairie");

    // chargement du jeu de tuiles
    const tileset = CarteGeneral.addTilesetImage(
      "TileSet_VF",
      "Phaser_TileSet"
    );
    // chargement de chaque calque
    const plancher = CarteGeneral.createLayer(
      "plancher",
      tileset
    );
    const mur = CarteGeneral.createLayer(
      "mur",
      tileset
    );
    const mur2 = CarteGeneral.createLayer(
      "mur2",
      tileset
    );
    const escalier = CarteGeneral.createLayer(
      "escalier",
      tileset
    );
    const Calque_de_Tuiles_7 = CarteGeneral.createLayer(
      "solsup",
      tileset
    );
    const escalier2 = CarteGeneral.createLayer(
      "escalier2",
      tileset
    );
    const fenetre2 = CarteGeneral.createLayer(
      "fenetre2",
      tileset
    );
    const tapis = CarteGeneral.createLayer(
      "tapisbis",
      tileset
    );
    const meuble = CarteGeneral.createLayer(
      "meuble",
      tileset
    );
    const tapis2 = CarteGeneral.createLayer(
      "tapis",
      tileset
    );
    const objet = CarteGeneral.createLayer(
      "objet",
      tileset
    );

    // définition des tuiles de plateformes qui sont solides

    const objects = [plancher, mur, mur2, escalier, Calque_de_Tuiles_7, escalier2, fenetre2, tapis, meuble, tapis2, objet];

    objects.forEach(obj => obj.setCollisionByProperty({ estSolide: true }));



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
