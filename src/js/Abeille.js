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
    //this.game.config.physics.arcade.gravity.y = 300;
    //console.log(this.game.config.physics.arcade.gravity);
    const CarteAbeille = this.add.tilemap("carteAbeille");
    // chargement du jeu de tuiles
    const tileset = CarteAbeille.addTilesetImage(
      "TileSet_VF",
      "Phaser_TileSet"
    );
    // chargement de chaque calque
    const Fond = CarteAbeille.createLayer(
      "Fond",
      tileset
    );
    const FondTerre = CarteAbeille.createLayer(
      "FondTerre",
      tileset
    );
    const FondArbre = CarteAbeille.createLayer(
      "FondArbre",
      tileset
    );
    const Foret = CarteAbeille.createLayer(
      "Foret",
      tileset
    );
    const Trou = CarteAbeille.createLayer(
      "Trou",
      tileset
    );
    const Plateforme = CarteAbeille.createLayer(
      "Plateforme",
      tileset
    );
    const Arbre = CarteAbeille.createLayer(
      "Arbre",
      tileset
    );
  
    // définition des tuiles de plateformes qui sont solides
    const objects = [Fond, FondTerre, FondArbre, Foret, Trou, Plateforme, Arbre];
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
