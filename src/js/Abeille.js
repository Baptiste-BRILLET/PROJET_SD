export default class Abeille extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "Abeille" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
    this.load.image("Phaser_TileSetV2", "src/assets/TileSet_VF2.png");
    this.load.tilemapTiledJSON("carteAbeille", "src/assets/Abeille.json");
  }

  create() {
    
    scene = this;
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
  }

  update() {
    if (this.clavier.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("anim_tourne_gauche", true);
    } else if (this.clavier.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("anim_tourne_droite", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("anim_face");
    }
    if (this.clavier.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }

    if (Phaser.Input.Keyboard.JustDown(this.clavier.space) == true) {
      if (this.physics.overlap(this.player, this.porte_retour)) {
        console.log("niveau 3 : retour vers selection");
        this.scene.switch("selection");
      }
    }
  }
}
